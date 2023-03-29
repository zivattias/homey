from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework.routers import DefaultRouter

from django.urls import path

from ..viewsets.JWTViewSets import RegistrationView, BlacklistView
from ..viewsets.UserViewSets import UserProfileView
from ..viewsets.ApartmentViewSets import ApartmentViewSet, like_apartment

router = DefaultRouter()
router.register(r"apartments", viewset=ApartmentViewSet)

urlpatterns = [
    path("auth/register/", RegistrationView.as_view(), name="register"),
    path("auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/refresh", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/logout/", BlacklistView.as_view(), name="logout"),
    path("me/", UserProfileView, name="profile"),
    path("apartments/like/<int:apt_id>/", like_apartment, name="like_apartment"),
] + router.urls
