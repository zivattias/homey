from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import mixins, status, viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import User

from ..serializers.ApartmentSerializer import (
    ApartmentPhotosSerializer,
    ApartmentSerializer,
)
from ..models import Apartment, ApartmentPhoto, LikedApartments
from ..permissions.ApartmentPermissions import (
    ApartmentPermissions,
    ApartmentPhotoPermissions,
)


# Apartment viewset: CRUD
class ApartmentViewSet(viewsets.ModelViewSet):
    serializer_class = ApartmentSerializer
    permission_classes = [permissions.IsAuthenticated, ApartmentPermissions]
    authentication_classes = [JWTAuthentication]
    queryset = Apartment.objects.filter(is_deleted=False)

    def get_queryset(self):
        if self.request.user.is_staff:
            return Apartment.objects.all()
        return self.queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.validated_data["user"] = request.user
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_deleted = True
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Apartment photo viewset: List, Create & Destroy
class ApartmentPhotoViewSet(
    viewsets.GenericViewSet,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
):
    serializer_class = ApartmentPhotosSerializer
    permission_classes = [ApartmentPhotoPermissions]
    authentication_classes = [JWTAuthentication]
    queryset = ApartmentPhoto.objects.all()

    def get_queryset(self, apt_id):
        if self.request.user.is_staff:
            return self.queryset
        return ApartmentPhoto.objects.filter(apt__id=apt_id)

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data["apt"] = kwargs.get("apt_id")
        serializer = self.get_serializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        apt_id = kwargs.get("apt_id")
        photo_id = kwargs.get("photo_id")
        instance = get_object_or_404(ApartmentPhoto, apt__id=apt_id, id=photo_id)
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def list(self, request, *args, **kwargs):
        apt_id = kwargs.get("apt_id")
        queryset = self.get_queryset(apt_id=apt_id)

        # page = self.paginate_queryset(queryset)

        if len(queryset) != 0:
            serializer = self.get_serializer(queryset, many=True)
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


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
