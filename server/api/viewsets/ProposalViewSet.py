from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication

from ..permissions.ProposalPermissions import ProposalPermissions

from ..models import Apartment, Proposal
from ..serializers.ProposalSerializer import (
    ProposalSerializer,
    UpdateProposalSerializer,
)


class ProposalViewSet(viewsets.ModelViewSet):
    serializer_class = ProposalSerializer
    permission_classes = [permissions.IsAuthenticated, ProposalPermissions]
    authentication_classes = [JWTAuthentication]
    queryset = Proposal.objects.all()

    def get_serializer_class(self):
        if self.request.method in ("PATCH", "DELETE"):
            return UpdateProposalSerializer
        return super().get_serializer_class()

    def get_queryset(self):
        if self.request.user.is_staff:
            return Proposal.objects.all()
        return Proposal.objects.filter(sender_user__id=self.request.user.id)

    def create(self, request, *args, **kwargs):
        data_copy = request.data.copy()
        data_copy["sender_user"] = request.user.id
        data_copy["owner_user"] = Apartment.objects.get(
            pk=request.data.get("apartment")
        ).user.id

        serializer = self.get_serializer(data=data_copy)
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
