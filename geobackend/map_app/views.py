from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.gis.geos import Point
import os
import jwt
from .serializer import LocationSerializer, OwnedLocationsSerializer
from .models import Location
from users.models import AppUser


class LocationView(APIView):
	def get(self, request: Request) -> Response:
		locations = Location.objects.all()
		serializer = OwnedLocationsSerializer(locations, many=True)
		#print(serializer.data)
		return Response(serializer.data)
	
	def post(self, request: Request) -> Response:
		data=request.data
		token = request.COOKIES.get("access") or request.COOKIES.get("jwt")
		if not token:
			raise AuthenticationFailed("Unauthenticated! Token not provided")
		try:
			payload = jwt.decode(token, os.environ.get("SECRET_KEY"), algorithms=["HS256"])
		except jwt.ExpiredSignatureError:
			raise AuthenticationFailed("Unauthenticated!")
		
		user = AppUser.objects.get(id=payload["id"])
		data["owner"] = user.id
		data["point"] = Point(list(data["point"]))
		serializer = LocationSerializer(data=data)
		if serializer.is_valid(raise_exception=True):
			serializer.save()
			
			return Response(serializer.data)

	def put(self, request: Request) -> Response:
		data=request.data
		token = request.COOKIES.get("access") or request.COOKIES.get("jwt")

		print(data, "data")
		print(request.COOKIES)

		if not token:
			raise AuthenticationFailed("Unauthenticated! Token not provided")
		
		try:
			payload = jwt.decode(token, os.environ.get("SECRET_KEY"), algorithms=["HS256"])
		except jwt.ExpiredSignatureError:
			raise AuthenticationFailed("Unauthenticated!")
		
		user = AppUser.objects.get(id=payload["id"])
		
		data["owner"] = user.id
		data["point"] = Point([float(num) for num in data.get("point").split(",")])
		serializer = LocationSerializer(data=data)
		if serializer.is_valid(raise_exception=True):
			serializer.save()

		