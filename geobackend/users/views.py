from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from django.shortcuts import get_object_or_404
from django.db.models import Q
import jwt, datetime
import os

from .serializer import UserSerializer, UserResponseSerializer
from users.models import AppUser

class UserRegister(APIView):
	def post(self, request: Request) -> Response:
		data = request.data
		serializer = UserSerializer(data=data)
		serializer.is_valid(raise_exception=True)
		serializer.save()
		return Response(serializer.data)
	
class UserLogin(APIView):
	def post(self, request: Request) -> Response:
		email = request.data.get("email")
		username = request.data.get("username")
		password = request.data.get("password")

		user = get_object_or_404(AppUser, Q(email=email) | Q(username=username))

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
	def get(self, request: Request) -> Response:
		token = request.COOKIES.get("jwt")
		
		if not token:
			raise AuthenticationFailed("Unauthenticated! Token not provided")
		
		try:
			payload = jwt.decode(token, os.environ.get("SECRET_KEY"), algorithms=["HS256"])
		except jwt.ExpiredSignatureError:
			raise AuthenticationFailed("Unauthenticated!")
		
		#print(payload)
		user = AppUser.objects.get(id=payload["id"])

		serializer = UserResponseSerializer(user)

		return Response(serializer.data)
	

class LogoutView(APIView):
	def post(self, request) -> Response:
		response = Response()
		response.delete_cookie("jwt")
		response.data = {
			"message": "Success. Logged out"	
		}
		return response