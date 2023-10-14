from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied
from django.contrib.gis.geos import Point
from django.shortcuts import get_object_or_404
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

		#print(data, "data")
		#print(request.COOKIES)

		if not token:
			raise AuthenticationFailed("Unauthenticated! Token not provided")
		
		try:
			payload = jwt.decode(token, os.environ.get("SECRET_KEY"), algorithms=["HS256"])
		except jwt.ExpiredSignatureError:
			raise AuthenticationFailed("Unauthenticated!")
		
		user = AppUser.objects.get(id=payload["id"])

		if user.is_staff or user.is_superuser or user.pk == data.get("owner").get("id"):
			data["point"] = Point(list(data["point"]))
			# if location user is null, then the admin will own location
			
			data["owner"] = AppUser.objects.get(pk=data.get("owner").get("id")) or user 
			location = get_object_or_404(Location, pk=data.get("id"))

			for key, value in data.items():
				setattr(location, key, value)
			print("NOW", location)
			location.save()

			serializer = LocationSerializer(location)

			return Response(serializer.data)
		else:
			raise PermissionDenied("Only point owner or admins can update")

	def delete(self, request: Request, id: int) -> Response:
		data = request.data
		token = request.COOKIES.get("access") or request.COOKIES.get("jwt")
	
		if not token:
			raise AuthenticationFailed("Unauthenticated! Token not provided")
		
		try:
			payload = jwt.decode(token, os.environ.get("SECRET_KEY"), algorithms=["HS256"])
		except jwt.ExpiredSignatureError:
			raise AuthenticationFailed("Unauthenticated!")
		
		user = AppUser.objects.get(id=payload["id"])
		
		if user.is_staff or user.is_superuser or user.pk == data.get("owner").get("id"):
			location = get_object_or_404(Location, pk=id)
			location.delete()

			return Response({ "success": f"Location with id {id} was deleted." })
		else:
			raise PermissionDenied("Only point owner or admins can delete")
