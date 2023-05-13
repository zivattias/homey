from rest_framework import serializers

from .ReviewSerializer import ReviewSerializer

from ..models import LikedApartments, Apartment, ApartmentPhoto


class ApartmentSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)

    def get_reviews(self, obj):
        return obj.reviews

    class Meta:
        model = Apartment
        fields = "__all__"
        extra_kwargs = {
            "user": {"required": False},
            "uuid": {"required": False},
        }


class LikedApartmentsSerializer(serializers.ModelSerializer):
    apartment = ApartmentSerializer(many=True)

    class Meta:
        model = LikedApartments
        fields = ("apartment",)


class ApartmentPhotosSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApartmentPhoto
        fields = "__all__"
        extra_kwargs = {
            "apt": {"required": False},
        }
