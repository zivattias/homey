from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .ListingSerializer import LikedListingsSerializer


class UserSerializer(serializers.ModelSerializer):
    liked_listings = LikedListingsSerializer
    profile_pic = serializers.SerializerMethodField()
    password = serializers.CharField(
        write_only=True, required=False, validators=[validate_password]
    )
    confirm_password = serializers.CharField(write_only=True, required=False)

    def get_profile_pic(self, obj):
        return obj.user_profile.profile_pic

    def get_liked_listings(self, obj):
        return obj.liked_listings

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
            "liked_listings",
            "password",
            "confirm_password",
        )
        extra_kwargs = {
            "password": {"write_only": True},
            "confirm_password": {"write_only": True},
        }

    def validate(self, attrs):
        if set(attrs.keys()) == set(["password", "confirm_password"]):
            if attrs["password"] != attrs["confirm_password"]:
                raise serializers.ValidationError(
                    {"confirm_password": "Password fields don't match."}
                )

            try:
                validate_password(attrs["password"])
            except ValidationError as e:
                raise serializers.ValidationError({"password": e.messages})

        return attrs

    def update(self, instance: User, validated_data):
        if set(validated_data.keys()) == set(["password", "confirm_password"]):
            instance.set_password(validated_data["password"])
            instance.save()
            return instance

        _, _ = validated_data.pop("password", None), validated_data.pop(
            "confirm_password", None
        )
        return super().update(instance, validated_data)
