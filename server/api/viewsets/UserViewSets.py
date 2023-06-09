import os

from django.contrib.auth.models import User
from dotenv import load_dotenv
from google.auth.transport import requests
from google.oauth2 import id_token
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

from ..models import UserProfile
from ..permissions.UserUpdatePermissions import UserUpdatePermissions
from ..serializers.UserSerializer import UserSerializer

load_dotenv()


# Get self user data, available for authenticated User
@api_view(["GET"])
def UserProfileView(request):
    if request.method == "GET":
        if request.user.is_authenticated:
            user = User.objects.get(pk=request.user.id)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(
                {"message": "You must be logged in to view this page."},
                status=status.HTTP_401_UNAUTHORIZED,
            )


# Returns True if username exists, else False
@api_view(["GET"])
def user_exists(request):
    username = request.query_params.get("username")
    if username:
        user = User.objects.filter(username=username)
        if user:
            return Response(True, status=status.HTTP_200_OK)
        else:
            return Response(False, status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


# Returns True if email exists, else False
@api_view(["GET"])
def email_exists(request):
    email = request.query_params.get("email")
    if email:
        user = User.objects.filter(email=email)
        if user:
            return Response(True, status=status.HTTP_200_OK)
        else:
            return Response(False, status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


# Update UserProfile.profile_pic
@api_view(["PATCH"])
def update_profile_pic(request, user_id):
    if not request.data["profile_pic"]:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    if not request.user.is_staff and request.user.id != user_id:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    user_profile = UserProfile.objects.get(user__id=user_id)
    user_profile.profile_pic = request.data["profile_pic"]
    user_profile.save()
    return Response(status=status.HTTP_200_OK)


# Update user details, e.g. first_name (partial)
class UpdateUserViewSet(mixins.UpdateModelMixin, viewsets.GenericViewSet):
    serializer_class = UserSerializer
    permission_classes = [UserUpdatePermissions]
    authentication_classes = [JWTAuthentication]
    queryset = User.objects.filter(is_active=True)

    def get_queryset(self, user_id):
        if self.request.user.is_staff:
            return User.objects.get(id=user_id)
        return self.queryset.get(id=user_id)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_queryset(kwargs["user_id"])
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid(raise_exception=True):
            serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)


@api_view(["POST"])
def google_oauth(request):
    CLIENT_ID = os.getenv("GOOGLE_OAUTH_CLIENT_ID")
    token = request.headers["Authorization"]
    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)
        user = User.objects.filter(email=idinfo["email"])
        if not user:
            user = User.objects.create(
                username=idinfo["email"],
                email=idinfo["email"],
                first_name=idinfo["given_name"],
                last_name=idinfo["family_name"],
            )
            user.set_password(idinfo["jti"])

            user_profile = UserProfile(
                user=user,
                profile_pic=idinfo["picture"] if "picture" in idinfo else None,
                google_oauth=True,
            )

            user.save()
            user_profile.save()

        elif user[0].user_profile.google_oauth == False:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"message": "Log in with email and password"},
            )

        refresh = RefreshToken.for_user(user if isinstance(user, User) else user[0])
        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
            status=status.HTTP_201_CREATED
            if isinstance(user, User)
            else status.HTTP_200_OK,
        )
    except ValueError:
        return Response(
            status=status.HTTP_401_UNAUTHORIZED,
            data={"message": "Bad Google authentication"},
        )
