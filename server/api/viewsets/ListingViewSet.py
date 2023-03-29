
from rest_framework.response import Response
from rest_framework import status, generics, viewsets, permissions
from rest_framework.decorators import api_view
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import User

from ..serializers.ListingSerializer import CreateListingSerializer
from ..models import Apartment, Listing


# Listing viewset: CRUD
class ListingViewSet(viewsets.ModelViewSet):
    serializer_class = CreateListingSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Listing.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            # serializer.validated_data["user"] = request.user
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)