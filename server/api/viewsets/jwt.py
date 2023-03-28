from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework_simplejwt.authentication import JWTAuthentication
from ..serializers.user_registration import RegistrationSerializer


# Registration serializer
class RegistrationView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegistrationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()

            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(status=status.HTTP_400_BAD_REQUEST)


# Logout/blacklist serializer
class BlacklistView(generics.CreateAPIView):
    authentication_classes = [JWTAuthentication]

    def post(self, request, *args, **kwargs):
        if request.data.get("refresh"):
            try:
                refresh_token = RefreshToken(request.data.get("refresh"))
                refresh_token.blacklist()
                return Response(
                    {"authentication": "Successfully blacklisted token"},
                    status=status.HTTP_200_OK,
                )
            except TokenError:
                return Response(
                    {"authentication": "Invalid token/already blacklisted"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        return Response(
            {"authentication": "Token is missing"},
            status=status.HTTP_400_BAD_REQUEST,
        )
