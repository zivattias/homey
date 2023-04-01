from rest_framework import serializers
from ..models import Review


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"
        extra_kwargs = {
            "apartment": {"write_only": True},
        }

    def create(self, validated_data):
        review = Review.objects.create(
            apartment=validated_data["apartment"],
            sender_user=validated_data["sender_user"],
            stars=validated_data["stars"],
            text=validated_data["text"],
        )
        review.save()
        return review
