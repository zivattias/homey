from rest_framework.permissions import BasePermission


class ReviewPermissions(BasePermission):
    def has_permission(self, request, view):
        if view.action == "create":
            if not request.user.is_staff:
                # A user can't leave reviews for their own apartments
                apt_ids = list(map(lambda a: str(a.id), request.user.apartments.all()))
                return request.data.get("apartment") not in apt_ids
        return True

    def has_object_permission(self, request, view, obj):
        if view.action in ("update", "partial_update", "destroy"):
            return request.user.id == obj.sender_user.id or request.user.is_staff
        return True
