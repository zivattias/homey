from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication

from ..permissions.ReviewPermissions import ReviewPermissions
from ..serializers.ReviewSerializer import ReviewSerializer
from ..models import Review


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated, ReviewPermissions]
    authentication_classes = [JWTAuthentication]
    queryset = Review.objects.all()

    def get_queryset(self):
        if self.request.user.is_staff:
            return Review.objects.all()
        return Review.objects.filter(sender_user__id=self.request.user.id)

    def create(self, request, *args, **kwargs):
        data_copy = request.data.copy()
        data_copy["sender_user"] = request.user.id
        serializer = self.get_serializer(data=data_copy)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
