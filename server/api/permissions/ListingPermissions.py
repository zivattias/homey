from rest_framework.permissions import BasePermission


class ListingPermissions(BasePermission):
    def has_permission(self, request, view):
        if view.action == "create":
            apt_ids = list(map(lambda a: str(a.id), request.user.apartments.all()))
            return request.data.get("apt") in apt_ids
        return True

    def has_object_permission(self, request, view, obj):
        if view.action in ("update", "partial_update", "destroy"):
            return request.user.id == obj.user.id or request.user.is_staff
        return True
