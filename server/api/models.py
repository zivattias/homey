from django.db import models
from django.db.models import Q
from django.contrib.auth.models import User
from django.core.validators import (
    RegexValidator,
    MinLengthValidator,
    MinValueValidator,
    MaxValueValidator,
)
from django.core.exceptions import ValidationError
from django_extensions.db.models import TimeStampedModel

from .utils.consts import IL_ZIPCODE_REGEX

# Create your models here.

# Backend models:
# Apartment, Listing, Proposal, LikedApartments, Review

__all__ = [
    "Apartment",
    "Listing",
    "Proposal",
    "LikedApartments",
    "Review",
    "UserProfile",
]


class UserProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="user_profile"
    )

    class Meta:
        db_table = "user_profiles"


class Apartment(TimeStampedModel, models.Model):
    user = models.ForeignKey(
        db_column="user_id",
        to=User,
        on_delete=models.RESTRICT,
        verbose_name="User ID",
        related_name="apartments",
    )
    street = models.CharField(
        db_column="street",
        max_length=128,
        validators=[MinLengthValidator(5)],
        verbose_name="Street Name",
    )
    street_num = models.IntegerField(
        db_column="street_num", verbose_name="Street Number"
    )
    apt_num = models.IntegerField(db_column="apt_num", verbose_name="Apartment Number")
    zip_code = models.CharField(
        db_column="zip_code",
        max_length=7,
        validators=[
            RegexValidator(
                regex=IL_ZIPCODE_REGEX,
                message="Zip code must be 7 digits and match the pattern of an Israeli zip code.",
            )
        ],
        verbose_name="Zip Code",
    )
    square_meter = models.IntegerField(
        db_column="square_meter", verbose_name="Square Meter"
    )

    pet_friendly = models.BooleanField(db_column="pet_friendly", default=False)
    smoke_friendly = models.BooleanField(db_column="smoke_friendly", default=False)
    is_wifi = models.BooleanField(db_column="is_wifi", default=False)
    is_balcony = models.BooleanField(db_column="is_balcony", default=False)
    is_parking = models.BooleanField(db_column="is_parking", default=False)

    # Many-to-Many relationship w/ User thru LikedApartments:
    liked_by_users = models.ManyToManyField(
        User, through="LikedApartments", related_name="liked_apartments"
    )

    is_deleted = models.BooleanField(default=False)

    def has_active_listing(self):
        return self.listings.filter(is_active=True).exists()

    class Meta:
        db_table = "apartments"


class Listing(TimeStampedModel, models.Model):
    apt = models.ForeignKey(
        db_column="apt_id",
        to=Apartment,
        on_delete=models.CASCADE,
        related_name="listings",
    )
    title = models.CharField(db_column="title", max_length=128)
    description = models.TextField(db_column="description")
    price = models.DecimalField(db_column="price", max_digits=5, decimal_places=0)
    from_date = models.DateTimeField(db_column="from_date")
    to_date = models.DateTimeField(db_column="to_date")
    duration = models.PositiveIntegerField(
        db_column="duration", null=True, blank=True, default=0
    )
    is_active = models.BooleanField(db_column="is_active", default=True)

    class Meta:
        db_table = "listings"

    def set_active(self, status: bool):
        if self.is_active == status:
            return
        Listing.objects.filter(pk=self.pk).update(is_active=status)
        self.is_active = status

    def save(self, *args, **kwargs):
        # Check if there are any existing listings with overlapping dates
        overlapping_listings = Listing.objects.filter(
            Q(from_date__lte=self.to_date)
            & Q(to_date__gte=self.from_date)
            & ~Q(id=self.id),
            apt=self.apt,
        )
        if overlapping_listings.exists():
            raise ValidationError("The listing dates overlap with an existing listing.")
        super().save(*args, **kwargs)


class Proposal(TimeStampedModel, models.Model):
    sender_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="sent_proposals"
    )
    owner_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="received_proposals"
    )
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, db_column="apt")
    is_active = models.BooleanField(db_column="is_active", default=True)

    def set_active(self, status: bool):
        if self.is_active == status:
            return
        Proposal.objects.filter(pk=self.pk).update(is_active=status)
        self.is_active = status

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=[
                    "sender_user",
                    "apartment",
                ],
                name="unique_user_proposals",
            )
        ]
        db_table = "proposals"


class Review(TimeStampedModel, models.Model):
    apartment = models.ForeignKey(
        Apartment, on_delete=models.CASCADE, related_name="reviews"
    )
    sender_user = models.ForeignKey(User, on_delete=models.CASCADE)
    stars = models.DecimalField(
        db_column="stars",
        validators=[MinValueValidator(0), MaxValueValidator(5.0)],
        decimal_places=1,
        max_digits=2,
    )
    text = models.TextField(max_length=400, validators=[MinLengthValidator(32)])

    class Meta:
        db_table = "reviews"
        constraints = [
            models.UniqueConstraint(
                fields=[
                    "sender_user",
                    "apartment",
                ],
                name="unique_user_review",
            )
        ]


class LikedApartments(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE)

    class Meta:
        db_table = "liked_apartments"
        constraints = [
            models.UniqueConstraint(
                fields=[
                    "user",
                    "apartment",
                ],
                name="unique_user_liked_apartments",
            )
        ]
