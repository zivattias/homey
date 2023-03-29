from rest_framework.response import Response
from rest_framework import status, generics, viewsets, permissions
from rest_framework.decorators import api_view
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import User

from ..serializers.ApartmentSerializer import ApartmentSerializer
from ..models import Apartment, LikedApartments


# Apartment viewset: CRUD
class ApartmentViewSet(viewsets.ModelViewSet):
    serializer_class = ApartmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Apartment.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.validated_data["user"] = request.user
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Like & unlike an apartment
@api_view(["PUT", "DELETE"])
def like_apartment(request, apt_id):
    try:
        apartment = Apartment.objects.get(id=apt_id)
    except Apartment.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    user = request.user
    if user.is_authenticated:
        if request.method == "PUT":
            _, created = LikedApartments.objects.get_or_create(
                user=user, user_profile=user.user_profile, apartment=apartment
            )
            if not created:
                return Response(
                    {
                        "message": f"Apartment {apartment.id} already liked by {user.first_name} {user.last_name}"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            return Response(
                {
                    "message": f"Apartment {apartment.id} liked by {user.first_name} {user.last_name}"
                },
                status=status.HTTP_200_OK,
            )

        if request.method == "DELETE":
            try:
                like = LikedApartments.objects.get(
                    user=user, user_profile=user.user_profile, apartment=apartment
                )
            except LikedApartments.DoesNotExist:
                return Response(
                    {"message": "Can't unlike a non-liked apartment"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            like.delete()
            return Response(
                status=status.HTTP_201_CREATED,
            )
    return Response(
        {"authentication": "Must be authenticated to perform this action"},
        status=status.HTTP_401_UNAUTHORIZED,
    )
