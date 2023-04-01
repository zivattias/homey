from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication

from ..models import Apartment, Proposal
from ..serializers.ProposalSerializer import ProposalSerializer


class ProposalViewSet(viewsets.ModelViewSet):
    serializer_class = ProposalSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = Proposal.objects.all()

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
