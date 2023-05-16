from .ApartmentSerializer import BasicApartmentSerializer
from ..models import ApartmentPhoto, Listing
from rest_framework import serializers


class GetListingSerializer(serializers.ModelSerializer):
    apt = BasicApartmentSerializer()
    photos = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    user_id = serializers.SerializerMethodField()

    def get_user_id(self, obj: Listing):
        user = obj.apt.user
        return user.id

    def get_photos(self, obj: Listing):
        photos = ApartmentPhoto.objects.filter(apt__id=obj.apt.id)
        return [photo.photo_url for photo in photos]

    def get_full_name(self, obj: Listing):
        user = obj.apt.user
        full_name = f"{user.first_name} {user.last_name}"
        return full_name

    class Meta:
        model = Listing
        fields = "__all__"
