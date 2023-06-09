from ..models import Proposal
from rest_framework import serializers


class ProposalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proposal
        fields = "__all__"
        extra_kwargs = {
            "is_active": {"read_only": True},
        }

    def create(self, validated_data):
        proposal = Proposal.objects.create(
            sender_user=validated_data["sender_user"],
            owner_user=validated_data["owner_user"],
            apartment=validated_data["apartment"],
        )
        proposal.save()
        return proposal


class UpdateProposalSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()

    def get_id(self, obj):
        return obj.id

    class Meta:
        model = Proposal
        fields = (
            "is_active",
            "id",
        )
        read_only_fields = ("id",)
