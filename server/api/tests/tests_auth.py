from django.test import TestCase
from ..models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

# Create your tests here.


class AuthTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_superuser(
            username="testUser", password="testPass"
        )
        cls.client = APIClient()

    def test_login(self):
        url = reverse("token_obtain_pair")
        user_creds = {
            "username": "testUser",
            "password": "testPass",
        }

        response = self.client.post(url, user_creds, format="json")

        self.assertContains(response, "refresh", 1, status_code=status.HTTP_200_OK)
        self.assertContains(response, "access", 1, status_code=status.HTTP_200_OK)
