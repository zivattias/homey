from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from ..viewsets.ApartmentViewSets import (
    ApartmentPhotoViewSet,
    ApartmentViewSet,
    like_listing,
)
from ..viewsets.GetS3PresignedURL import get_s3_presigned_URL
from ..viewsets.JWTViewSets import BlacklistView, RegistrationView
from ..viewsets.ListingViewSet import ListingViewSet, change_listing_status
from ..viewsets.ProposalViewSet import ProposalViewSet
from ..viewsets.ReviewViewSet import ReviewViewSet
from ..viewsets.UserViewSets import (
    UpdateUserViewSet,
    UserProfileView,
    email_exists,
    google_oauth,
    update_profile_pic,
    user_exists,
)

router = DefaultRouter()
router.register(r"apartments", viewset=ApartmentViewSet)
router.register(r"listings", viewset=ListingViewSet)
router.register(r"proposals", viewset=ProposalViewSet)
router.register(r"reviews", viewset=ReviewViewSet)

urlpatterns = [
    path("auth/register/", RegistrationView.as_view(), name="register"),
    path("auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/google-oauth/", google_oauth, name="google-oauth"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/logout/", BlacklistView.as_view(), name="logout"),
    path("me/", UserProfileView, name="profile"),
    path("user_exists/", user_exists, name="user_exists"),
    path("email_exists/", email_exists, name="email_exists"),
    path("listings/<int:listing_id>/like/", like_listing, name="like_listing"),
    path(
        "apartments/<str:apt_uuid>/photos/",
        ApartmentPhotoViewSet.as_view({"post": "create", "get": "list"}),
        name="apartment_photos_create",
    ),
    path(
        "apartments/<str:apt_uuid>/photos/<int:photo_id>",
        ApartmentPhotoViewSet.as_view({"delete": "destroy"}),
        name="apartment_photo_delete",
    ),
    path(
        "listings/<int:listing_id>/status/",
        change_listing_status,
        name="change_listing_status",
    ),
    path(
        "users/<int:user_id>/",
        UpdateUserViewSet.as_view({"patch": "partial_update", "put": "update"}),
        name="update_user",
    ),
    path(
        "users/<int:user_id>/profile_pic/",
        update_profile_pic,
        name="update_user_profile_picture",
    ),
    path(
        "upload_pic/<str:destination>/<str:content_type>/",
        get_s3_presigned_URL,
        name="upload_pic",
    ),
] + router.urls
