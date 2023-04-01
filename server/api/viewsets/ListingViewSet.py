from rest_framework.response import Response
from rest_framework import status, viewsets, permissions
from rest_framework.decorators import api_view
from rest_framework_simplejwt.authentication import JWTAuthentication

from ..permissions.ListingPermissions import ListingPermissions

from ..serializers.ListingSerializer import (
    CreateListingSerializer,
    UpdateListingSerializer,
)
from ..models import Listing


# Listing viewset: CRUD
class ListingViewSet(viewsets.ModelViewSet):
    serializer_class = CreateListingSerializer
    permission_classes = [permissions.IsAuthenticated, ListingPermissions]
    authentication_classes = [JWTAuthentication]
    queryset = Listing.objects.filter(is_active=True)

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return UpdateListingSerializer
        return super().get_serializer_class()

    def get_queryset(self):
        if self.request.user.is_staff:
            return Listing.objects.all()
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
def activate_listing(request, listing_id):
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
