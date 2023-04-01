from rest_framework.permissions import BasePermission
from ..models import Listing


class ListingPermissions(BasePermission):
    def is_apt_owner(self, apt_id, request):
        return apt_id in list(map(lambda a: str(a.id), request.user.apartments.all()))

    def is_listing_owner(self, listing_id, request):
        listing = Listing.objects.get(pk=listing_id)
        return request.user.id == listing.apt.user.id

    def has_permission(self, request, view):
        if view.action == "create":
            if not request.user.is_staff:
                return self.is_apt_owner(request.data.get("apt"), request)
        return True

    def has_object_permission(self, request, view, obj):
        if view.action in ("update", "partial_update", "destroy"):
            return request.user.is_staff or self.is_listing_owner(obj.id, request)
        return True
