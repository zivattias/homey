from rest_framework import serializers
from django.contrib.auth.models import User

from ..models import UserProfile, LikedApartments, Apartment


class ApartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Apartment
        fields = "__all__"
        extra_kwargs = {"user": {"required": False}}


class LikedApartmentsSerializer(serializers.ModelSerializer):
    apartment = ApartmentSerializer(many=True)

    class Meta:
        model = LikedApartments
        fields = ("apartment",)