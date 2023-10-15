from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.gis.geos import Point
from .models import Location
from users.models import AppUser
import datetime
import jwt, os

class LocationViewTestCase(APITestCase):
    def setUp(self):
        self.user = AppUser.objects.create_user(username="LocationTestUser", password="123456e")
        self.url = reverse("locations:location-points")
        self.token = self.generate_token()
        self.client.cookies["access"] = self.token
        
    def generate_token(self):
        payload = {
            "id": self.user.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=30),
            "iat": datetime.datetime.utcnow()
        }
        return jwt.encode(payload, os.environ.get("SECRET_KEY"), algorithm="HS256")

    def test_get_locations(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        print("Get locations pass")

    def test_create_location(self):
        data = {
            "owner": self.user.id,
            "point": [1.0, 2.0],
            "label": "TestCaseLocation",
            "title": "Hello test",
            "comment": "This is created by testing"
        }
        
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIsNotNone(response.data)
        self.assertEqual(response.data["owner"], data["owner"])
        self.assertEqual(response.data["title"], data["title"])
        print("create location pass")

    def test_update_locations(self):
        """initial location"""
        location = Location.objects.create(
            owner=self.user,
            point=Point(1.0, 2.0),
            title="Original Title",
            label="Original Label",
            comment="Original Comment",
            textColor="#111111",
        )

        data = [
            {
                "id": location.id,
                "point": [8, 10],
                "label": "New Label",
                "title": "Hello test",
                "comment": "new test comment",
            }
        ]

        response = self.client.put(self.url, data, format="json")
        print(response.data, "as data")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, "updated")
        self.assertContains(response, "skiped")
        self.assertIsInstance(response.data["updated"], list)
        print("Update location pass")

    def test_delete_location(self):
        # Create a location to delete
        location = Location.objects.create(
            owner=self.user,
            point=Point(1.0, 2.0),
            title="Delete Me",
            label="Delete Me",
            comment="Delete Me",
            textColor="#333333",
        )

        url = reverse("locations:delete-location", args=[location.id])  

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, "success")
        print("Delete location pass")