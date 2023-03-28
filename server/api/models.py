from datetime import datetime

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

from .utils.consts import IL_ZIPCODE_REGEX

# Create your models here.

# Backend models:
# Apartment, Listing, Proposal, Attribute, LikedApartments, Review

__all__ = [
    "Apartment",
    "Listing",
    "Proposal",
    "Attribute",
    "LikedApartments",
    "Review",
    "UserProfile",
]


class UserProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="user_profile"
    )
    liked_apartments = models.ManyToManyField(
        "Apartment",
        through="LikedApartments",
        through_fields=("user_profile", "apartment"),
        default=None,
    )

    class Meta:
        db_table = "user_profiles"


class Apartment(models.Model):
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

    # Many-to-Many relationship w/ User thru LikedApartments:
    liked_by_users = models.ManyToManyField(
        User, through="LikedApartments", related_name="liked_apartments"
    )

    def has_active_listing(self):
        return self.listings.filter(is_active=True).exists()

    class Meta:
        db_table = "apartments"


class Listing(models.Model):
    apt = models.ForeignKey(
        db_column="apt_id",
        to=Apartment,
        on_delete=models.CASCADE,
        related_name="listings",
    )
    title = models.CharField(db_column="title", max_length=128)
    description = models.TextField(db_column="description")
    price = models.DecimalField(db_column="price", max_digits=5, decimal_places=0)
    from_date = models.DateField(db_column="from_date")
    to_date = models.DateField(db_column="to_date")
    duration = models.PositiveIntegerField(
        db_column="duration", null=True, blank=True, default=0
    )
    is_active = models.BooleanField(db_column="is_active", default=False)

    class Meta:
        db_table = "listings"

    def set_active(self, status: bool):
        if self.is_active == status:
            return
        Listing.objects.filter(pk=self.pk).update(is_active=status)
        self.is_active = status

    def save(self, *args, **kwargs):
        # Convert from_date and to_date to "YYYY-MM-DD" format, which is saveable in DB and Django
        try:
            if "/" in self.from_date:
                self.from_date = datetime.strptime(self.from_date, "%d/%m/%Y").strftime(
                    "%Y-%m-%d"
                )
            if "/" in self.to_date:
                self.to_date = datetime.strptime(self.to_date, "%d/%m/%Y").strftime(
                    "%Y-%m-%d"
                )
            if not self.duration:
                self.duration = (
                    datetime.strptime(self.to_date, "%Y-%m-%d")
                    - datetime.strptime(self.from_date, "%Y-%m-%d")
                ).days
        except ValueError:
            raise ValidationError("Date must be in DD/MM/YYYY format.")

        # Check if there are any existing listings with overlapping dates
        overlapping_listings = Listing.objects.filter(
            Q(from_date__lte=self.to_date) & Q(to_date__gte=self.from_date),
            apt=self.apt,
        )
        if overlapping_listings.exists():
            raise ValidationError("The listing dates overlap with an existing listing.")

        super().save(*args, **kwargs)


class Attribute(models.Model):
    class Meta:
        db_table = "attributes"

    apt = models.ForeignKey(
        Apartment,
        on_delete=models.CASCADE,
        db_column="apt_id",
        related_name="attributes",
    )
    pet_friendly = models.BooleanField(db_column="pet_friendly", default=False)
    smoke_friendly = models.BooleanField(db_column="smoke_friendly", default=False)
    is_wifi = models.BooleanField(db_column="is_wifi", default=False)
    is_balcony = models.BooleanField(db_column="is_balcony", default=False)
    is_parking = models.BooleanField(db_column="is_parking", default=False)


class Proposal(models.Model):
    sender_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="sent_proposals"
    )
    owner_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="received_proposals"
    )
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, db_column="apt")
    is_active = models.BooleanField(db_column="is_active", default=False)

    class Meta:
        unique_together = (
            "sender_user",
            "apartment",
        )
        db_table = "proposals"


class Review(models.Model):
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
        unique_together = (
            "sender_user",
            "apartment",
        )


class LikedApartments(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE)
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)

    class Meta:
        db_table = "liked_apartments"
        unique_together = ("user", "apartment")
