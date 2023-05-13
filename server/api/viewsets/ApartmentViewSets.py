from uuid import uuid4

from django.contrib.auth.models import User
from django.db import IntegrityError
from django.forms import ValidationError
from django.shortcuts import get_object_or_404
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from ..models import Apartment, ApartmentPhoto, LikedApartments
from ..permissions.ApartmentPermissions import (
    ApartmentPermissions,
    ApartmentPhotoPermissions,
)
from ..serializers.ApartmentSerializer import (
    ApartmentPhotosSerializer,
    ApartmentSerializer,
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
        data = request.data.copy()
        data["uuid"] = str(uuid4())
        serializer = self.get_serializer(data=data)
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

    def get_queryset(self, apt_uuid):
        if self.request.user.is_staff:
            return self.queryset
        return ApartmentPhoto.objects.filter(apt__uuid=apt_uuid)

    def create(self, request, *args, **kwargs):
        try:
            data = request.data.copy()
            data["apt"] = Apartment.objects.get(uuid=kwargs.get("apt_uuid")).pk
            serializer = self.get_serializer(data=data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            if isinstance(e, ValidationError):
                return Response(
                    status=status.HTTP_400_BAD_REQUEST, data={"uuid": "Invalid UUID"}
                )
            if isinstance(e, IntegrityError):
                return Response(
                    status=status.HTTP_400_BAD_REQUEST,
                    data={"photo_url": f'{data["photo_url"]} already exists'},
                )

    def destroy(self, request, *args, **kwargs):
        try:
            apt_uuid = kwargs.get("apt_uuid")
            photo_id = kwargs.get("photo_id")
            instance = get_object_or_404(
                ApartmentPhoto, apt__uuid=apt_uuid, id=photo_id
            )
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ValidationError:
            return Response(
                status=status.HTTP_400_BAD_REQUEST, data={"uuid": "Invalid UUID"}
            )

    def list(self, request, *args, **kwargs):
        try:
            apt_uuid = kwargs.get("apt_uuid")
            queryset = self.get_queryset(apt_uuid=apt_uuid)

            # page = self.paginate_queryset(queryset)

            if len(queryset) != 0:
                serializer = self.get_serializer(queryset, many=True)
                return Response(data=serializer.data, status=status.HTTP_200_OK)
            return Response(status=status.HTTP_404_NOT_FOUND)
        except ValidationError:
            return Response(
                status=status.HTTP_400_BAD_REQUEST, data={"uuid": "Invalid UUID"}
            )


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
                user=user, apartment=apartment
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
                like = LikedApartments.objects.get(user=user, apartment=apartment)
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
