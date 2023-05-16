from rest_framework.response import Response
from rest_framework import status, viewsets, permissions
from rest_framework.decorators import api_view
from rest_framework_simplejwt.authentication import JWTAuthentication

from ..serializers.GetListingSerializer import GetListingSerializer

from ..permissions.ListingPermissions import ListingPermissions

from ..serializers.ListingSerializer import (
    CreateListingSerializer,
    UpdateListingSerializer,
)
from ..models import Listing


# Listing viewset: CRUD
class ListingViewSet(viewsets.ModelViewSet):
    serializer_class = CreateListingSerializer
    authentication_classes = [JWTAuthentication]
    queryset = Listing.objects.filter(is_active=True)

    def get_permissions(self):
        if self.request.method != "GET":
            return [permissions.IsAuthenticated(), ListingPermissions()]
        return super().get_permissions()

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return UpdateListingSerializer
        elif self.request.method == "GET":
            return GetListingSerializer
        return super().get_serializer_class()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        # page = self.paginate_queryset(queryset)
        # if page is not None:
        #     serializer = self.get_serializer(page, many=True)
        #     return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        if self.request.method == "GET":
            return (
                Listing.objects.all()
                if self.request.user.is_staff
                else Listing.objects.filter(is_active=True)
            )

        return Listing.objects.filter(
            apt__user__id=self.request.user.id, is_active=True
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Activate/deactivate a Listing
@api_view(["PUT", "DELETE"])
def change_listing_status(request, listing_id):
    try:
        listing = Listing.objects.get(id=listing_id)
    except Listing.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    user = request.user
    if user.is_authenticated:
        if not user.is_staff:
            if listing.apt.user.id != user.id:
                return Response(status=status.HTTP_403_FORBIDDEN)
        if request.method == "PUT":
            if listing.is_active:
                return Response(
                    data={"message": "Listing is already active"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            listing.set_active(status=True)
            return Response(status=status.HTTP_200_OK)
        if request.method == "DELETE":
            if not listing.is_active:
                return Response(
                    data={"message": "Listing is already deactivated"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            listing.set_active(status=False)
            return Response(status=status.HTTP_200_OK)
