from rest_framework.permissions import BasePermission


class ApartmentPermissions(BasePermission):
    def has_permission(self, request, view):
        if view.action == "create":
            return request.user.is_authenticated
        return True

    def has_object_permission(self, request, view, obj):
        if view.action in ("update", "partial_update", "destroy"):
            return request.user.id == obj.user.id or request.user.is_staff
        return True
