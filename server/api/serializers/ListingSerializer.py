from ..models import Listing
from ..serializers.ApartmentSerializer import ApartmentSerializer
from rest_framework import serializers


class CreateListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        exclude = ("duration", "is_active")
        read_only_fields = ("is_active",)

    # from_date = serializers.DateField(
    #     format="%d/%m/%Y",
    #     error_messages={"format": "Date format must be in DD/MM/YYYY format."},
    # )
    # to_date = serializers.DateField(
    #     format="%d/%m/%Y",
    #     error_messages={"format": "Date format must be in DD/MM/YYYY format."},
    # )

    def validate(self, data):
        if "from_date" not in data or "to_date" not in data:
            raise serializers.ValidationError(
                "Both from_date and to_date are required."
            )

        from_date = data["from_date"]
        to_date = data["to_date"]
        apt = data["apt"]

        if Listing.objects.filter(
            apt=apt, from_date=from_date, to_date=to_date
        ).exists():
            raise serializers.ValidationError(
                "A listing with the given from_date and to_date already exists."
            )

        duration = to_date - from_date

        if duration.days < 7:
            raise serializers.ValidationError("The minimum duration is 7 days.")

        return data

    def create(self, validated_data):
        from_date = validated_data.pop("from_date")
        to_date = validated_data.pop("to_date")
        validated_data["duration"] = (to_date - from_date).days
        listing = Listing.objects.create(from_date=from_date, to_date=to_date, **validated_data)
        return listing
