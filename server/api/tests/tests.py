from django.test import TestCase

# Create your tests here.
from ..models import Apartment, Listing, User
from django.core.exceptions import ValidationError


class ModelsTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create(
            username="ziv",
            first_name="Ziv",
            last_name="Attias",
            email="ziv@test.com",
        )

    def test_user_creation(self):
        self.assertTrue(isinstance(self.user, User))
        self.assertEqual(self.user.first_name, "Ziv")

    def test_apartment_creation(self):
        apt = Apartment.objects.create(
            user=User.objects.get(username="ziv"),
            street="HaTekuma St.",
            street_num=34,
            apt_num=15,
            zip_code="6816315",
            square_meter=52,
        )

        self.assertEqual(apt.user.id, 1)

    def test_listing_creation(self):
        apt = Apartment.objects.create(
            user=User.objects.get(username="ziv"),
            street="HaTekuma St.",
            street_num=34,
            apt_num=15,
            zip_code="6816315",
            square_meter=52,
        )

        listing = Listing.objects.create(
            apt=Apartment.objects.get(zip_code="6816315"),
            title="Amazing apartment in North Jaffa!",
            description="Great location, 2 min walk from the beach!",
            price=5000,
            from_date="10/02/2023",
            to_date="20/02/2023",
        )

        self.assertEqual(listing.duration, 10)
        self.assertFalse(listing.is_active)
        listing.set_active(status=True)
        self.assertTrue(listing.is_active)

        with self.assertRaises(ValidationError):
            Listing.objects.create(
                apt=Apartment.objects.get(zip_code="6816315"),
                title="Amazing apartment in North TLV!",
                description="Great location, 5 min walk from the beach!",
                price=5000,
                from_date="10/02/2023",
                to_date="20/02/2023",
            )

        l3 = Listing.objects.create(
            apt=Apartment.objects.get(zip_code="6816315"),
            title="Amazing apartment in North TLV!",
            description="Great location, 5 min walk from the beach!",
            price=5000,
            from_date="1/02/2023",
            to_date="3/02/2023",
        )

        self.assertEqual(l3.duration, 2)
        self.assertEqual(l3.from_date, "2023-02-01")
