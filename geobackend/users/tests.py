from django.test import TestCase
from .models import AppUser
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model
import jwt
import datetime
import os
User = get_user_model()


class AppUserTestCase(TestCase):
    """Test case for UserModel, creatinon new user should be """
    def test_appuser_creation(self):
        "User creation"
        user = AppUser.objects.create(username="UnitTestUser", age=25, color="#FF0000", password="123456")
        self.assertEqual(user.username, "UnitTestUser")
        self.assertEqual(user.age, 25)
        self.assertEqual(user.color, "#FF0000") 
        print("User creation pass")
            

    def test_appuser_color_generation(self):
        "Color generation if any user have same color, colors should be different"
        user1 = AppUser.objects.create(username="user1", age=30, color="#000000")
        user2 = AppUser.objects.create(username="user2", age=40, color="#000000")
        self.assertNotEqual(user2.color, "#000000")
        print("Color generating pass")


class UserRegisterTestCase(APITestCase):
    def test_user_register(self):
        url = reverse("users:register")
        data = {
            "username": "TestCaseUserWithSimplePassword",
            "password": "123456",
            "age": "18",
            "first_name": "TestFirstName",
            "last_name": "TestLastName",
            "email": "test@case.com"
        }

        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        print("User Register pass")


class UserLoginTestCase(APITestCase):
    def setUp(self):
        self.username = "LoginTest"
        self.password = "123456"
        self.user = User.objects.create_user(username=self.username, password=self.password)
        self.token = self.generate_token()
    
    def generate_token(self):
        payload = {
            "id": self.user.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=30),
            "iat": datetime.datetime.utcnow()
        }
        return jwt.encode(payload, os.environ.get("SECRET_KEY"), algorithm="HS256")

        
    def test_user_login(self):
        url = reverse("users:login")
        data = {
            "username": self.username,
            "password": self.password,
        }

        response = self.client.post(url, data, format="json")
        self.assertContains(response, "jwt")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print("User Login pass")
        
    def test_get_user(self):
        url = reverse("users:user")
        self.client.cookies["access"] = self.token
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, "username")
        self.assertEqual(response.data["id"], self.user.id)
        self.assertEqual(response.data["username"], self.username)
        self.assertContains(response, "color")
        print("Get user instance pass")
        