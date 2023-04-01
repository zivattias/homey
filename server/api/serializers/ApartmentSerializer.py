from rest_framework import serializers

from .ReviewSerializer import ReviewSerializer

from ..models import LikedApartments, Apartment, Review


class ApartmentSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)

    def get_reviews(self, obj):
        return obj.reviews

    class Meta:
        model = Apartment
        fields = "__all__"
        extra_kwargs = {
            "user": {"required": False},
        }


class LikedApartmentsSerializer(serializers.ModelSerializer):
    apartment = ApartmentSerializer(many=True)

    class Meta:
        model = LikedApartments
        fields = ("apartment",)
