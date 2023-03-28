from rest_framework import serializers
from django.contrib.auth.models import User

from ..models import UserProfile
from .apartment import LikedApartmentsSerializer


class UserSerializer(serializers.ModelSerializer):
    liked_apartments = LikedApartmentsSerializer

    def get_liked_apartments(self, obj):
        user_profile = UserProfile.objects.get(user__id=obj.id)
        return user_profile.liked_apartments

    class Meta:
        model = User
        fields = (
            "id",
            "first_name",
            "last_name",
            "email",
            "username",
            "is_staff",
            "liked_apartments",
        )
