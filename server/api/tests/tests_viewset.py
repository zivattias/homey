from datetime import datetime
import json
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APIClient, APIRequestFactory, APITestCase

from ..models import Apartment


class ListingViewSetTest(APITestCase):
    @classmethod
    def setUpTestData(cls) -> None:
        cls.client: APIClient = APIClient()
        cls.factory = APIRequestFactory()
        cls.admin = User.objects.create_superuser(
            username="admin", password="adminPass"
        )

    def setUp(self) -> None:
        self.apt = Apartment.objects.create(
            user=User.objects.get(username="admin"),
            street="HaTekuma St.",
            street_num=34,
            apt_num=15,
            zip_code="6816315",
            square_meter=52,
        )

    def test_apartments(self):
        self.client.force_authenticate(user=self.admin)
        data = json.dumps(
            {
                "apt": self.apt.id,
                "title": "Test",
                "description": "Test desc.",
                "price": 5000,
                "from_date": str(datetime.now().isoformat()),
                "to_date": str(datetime(year=2023, month=4, day=5).isoformat()),
            }
        )
        response = self.client.post("/api/listings/", data=data, content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

