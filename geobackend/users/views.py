from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import jwt, datetime
import os

from .serializer import UserSerializer
from users.models import AppUser

class UserRegister(APIView):
	@swagger_auto_schema(request_body=UserSerializer, responses={201: openapi.Response("Created", UserSerializer)}, 
					  operation_id="userRegister", operation_description="Register a new user.")
	def post(self, request: Request) -> Response:
		"""Register new user and return jwt token"""
		data = request.data
		serializer = UserSerializer(data=data)
		serializer.is_valid(raise_exception=True)
		serializer.save()

		#print(serializer.data)
		payload = {
			"id": serializer.data["id"],
			"exp": datetime.datetime.utcnow() + datetime.timedelta(days=30),
			"iat": datetime.datetime.utcnow()
		}
		
		token = jwt.encode(payload, os.environ.get("SECRET_KEY"), algorithm="HS256")

		response = Response()
		response.set_cookie(key="jwt", value=token, httponly=True)

		response.data = serializer.data
		response.data["jwt"] = token

		return response
	
class UserLogin(APIView):
	@swagger_auto_schema(request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING),
                'password': openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_PASSWORD)
            }
        ),
        responses={200: openapi.Response("Success", UserSerializer)},
        operation_id="userLogin",
        operation_description="Log in an existing user."
    )
	def post(self, request: Request) -> Response:
		"""
		Login user into app, after that users allowed to create/update/delete points.
		"""
		username = request.data.get("username")
		password = request.data.get("password")

		user = get_object_or_404(AppUser,username=username)

		if not user.check_password(password):
			raise AuthenticationFailed("incorrect password")
		
		payload = {
			"id": user.pk,
			"exp": datetime.datetime.utcnow() + datetime.timedelta(days=30),
			"iat": datetime.datetime.utcnow()
		}
		
		token = jwt.encode(payload, os.environ.get("SECRET_KEY"), algorithm="HS256")

		response = Response()
		response.set_cookie(key="jwt", value=token, httponly=True)
		response.data = {"jwt": token}

		return response
	

class UserView(APIView):
	@swagger_auto_schema(
        responses={200: UserSerializer},
        operation_id="getUserProfile",
        operation_description="Get the user's esentian data."
    )
	def get(self, request: Request) -> Response:
		"""Get user essential data. That will be used for points styling and metadata"""
		token = request.COOKIES.get("access")
		if not token:
			raise AuthenticationFailed("Unauthenticated! Token not provided")
		
		try:
			payload = jwt.decode(token, os.environ.get("SECRET_KEY"), algorithms=["HS256"])
		except jwt.ExpiredSignatureError:
			raise AuthenticationFailed("Unauthenticated!")
		
		#print(payload)
		user = AppUser.objects.get(id=payload["id"])

		serializer = UserSerializer(user)

		return Response(serializer.data)
	

class LogoutView(APIView):
	@swagger_auto_schema(
        responses={200: openapi.Response("Success")},
        operation_id="userLogout",
        operation_description="Log out the user."
    )
	def post(self, request: Request) -> Response:
		"""Logout is simple its remove token from the cookies"""
		response = Response()
		response.delete_cookie("jwt")
		response.data = {
			"message": "Success. Logged out"	
		}
		return response