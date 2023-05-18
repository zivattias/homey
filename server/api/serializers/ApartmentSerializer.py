from rest_framework import serializers

from .ListingSerializer import CreateListingSerializer

from .ReviewSerializer import ReviewSerializer

from ..models import Apartment, ApartmentPhoto


class ApartmentSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)
    listings = serializers.SerializerMethodField()

    def get_listings(self, obj):
        active_listings = obj.listings.filter(is_active=True)
        serializer = CreateListingSerializer(active_listings, many=True)
        return serializer.data

    def get_reviews(self, obj):
        return obj.reviews

    class Meta:
        model = Apartment
        fields = "__all__"
        extra_kwargs = {
            "user": {"required": False},
            "uuid": {"required": False},
        }


class ApartmentPhotosSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApartmentPhoto
        fields = "__all__"
        extra_kwargs = {
            "apt": {"required": False},
        }
