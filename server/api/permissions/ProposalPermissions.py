from rest_framework.permissions import BasePermission
from ..models import Apartment


class ProposalPermissions(BasePermission):
    def has_permission(self, request, view):
        if view.action == "create":
            if not request.user.is_staff:
                # A user can't create a proposal for themselves
                return (
                    Apartment.objects.get(pk=request.data.get("apartment")).user.id
                    != request.user.id
                )
        return True

    def has_object_permission(self, request, view, obj):
        if view.action in ("partial_update", "destroy"):
            return request.user.id == obj.sender_user.id or request.user.is_staff
        if view.action == "update":
            return request.user.is_staff
        return True
