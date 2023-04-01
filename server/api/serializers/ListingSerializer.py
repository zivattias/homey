from ..models import Listing
from rest_framework import serializers


class CreateListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = "__all__"
        read_only_fields = (
            "is_active",
            "duration",
        )

    def validate(self, data):
        from_date = data["from_date"]
        to_date = data["to_date"]
        apt = data["apt"]

        if Listing.objects.filter(
            apt=apt, from_date=from_date, to_date=to_date
        ).exists():
            raise serializers.ValidationError(
                "A listing for this apartment with the given from_date and to_date already exists."
            )

        duration = to_date - from_date

        if duration.days <= 0:
            raise serializers.ValidationError(
                "Less than or equals to 0 value for duration is not acceptable."
            )

        return data

    def create(self, validated_data):
        from_date = validated_data.pop("from_date")
        to_date = validated_data.pop("to_date")
        validated_data["duration"] = (to_date - from_date).days
        listing = Listing.objects.create(
            from_date=from_date, to_date=to_date, **validated_data
        )
        return listing


class UpdateListingSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()

    def get_id(self, obj):
        return obj.id

    class Meta:
        model = Listing
        fields = (
            "title",
            "price",
            "description",
            "from_date",
            "to_date",
            "id",
        )
        read_only_fields = ("id",)
