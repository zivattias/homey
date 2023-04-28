from rest_framework.permissions import BasePermission


class UserUpdatePermissions(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_staff:
            return True
        
        user_id = view.kwargs.get("user_id")
        if (
            request.user.id != user_id
            or not request.user.is_authenticated
            or "is_staff" in request.data
        ):
            return False

        return True

    def has_object_permission(self, request, view, obj):
        if view.action in ("update", "partial_update"):
            return request.user.id == obj.id or request.user.is_staff
        return True
