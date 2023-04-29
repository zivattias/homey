from rest_framework import serializers
from django.contrib.auth.models import User

from ..models import UserProfile
from .ApartmentSerializer import LikedApartmentsSerializer


class UserSerializer(serializers.ModelSerializer):
    liked_apartments = LikedApartmentsSerializer
    profile_pic = serializers.SerializerMethodField()

    def get_profile_pic(self, obj):
        return obj.user_profile.profile_pic

    def get_liked_apartments(self, obj):
        return obj.liked_apartments

    class Meta:
        model = User
        fields = (
            "id",
            "first_name",
            "last_name",
            "email",
            "username",
            "is_staff",
            "profile_pic",
            "liked_apartments",
        )
