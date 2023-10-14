from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied
from rest_framework import status
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
			
			return Response(serializer.data, status=status.HTTP_201_CREATED)

	def put(self, request: Request) -> Response:
		data=request.data
		token = request.COOKIES.get("access") or request.COOKIES.get("jwt")

		#print(request.COOKIES)

		if not token:
			raise AuthenticationFailed("Unauthenticated! Token not provided")
		
		try:
			payload = jwt.decode(token, os.environ.get("SECRET_KEY"), algorithms=["HS256"])
		except jwt.ExpiredSignatureError:
			raise AuthenticationFailed("Unauthenticated!")
		
		user = AppUser.objects.get(id=payload["id"])

		locations = []
		skiped_locations = []
		for item in data:
			item["point"] = Point(list(item["point"]))
			try:
				location_id = item.get("id")
				location = Location.objects.get(pk=location_id)

				if not location.owner:
					location.owner = user
				if user.is_staff or user.is_superuser or user.pk == location.owner.pk:
					for key, value in item.items():
						setattr(location, key, value)
					location.save()
					locations.append(location)
			except Exception as e:
				print("skiped", e)
				skiped_locations.append(location)


		if not len(locations):
			raise PermissionDenied("Only point owner or admins can update")
		
		serializer = LocationSerializer(locations, many=True)
		return Response({ 
			"updated": serializer.data,
			"skiped": len(skiped_locations)
		}, status=status.HTTP_200_OK)


	def delete(self, request: Request, id: int) -> Response:
		token = request.COOKIES.get("access") or request.COOKIES.get("jwt")
	
		if not token:
			raise AuthenticationFailed("Unauthenticated! Token not provided")
		
		try:
			payload = jwt.decode(token, os.environ.get("SECRET_KEY"), algorithms=["HS256"])
		except jwt.ExpiredSignatureError:
			raise AuthenticationFailed("Unauthenticated!")
		
		location = get_object_or_404(Location, pk=id)
		user = AppUser.objects.get(id=payload["id"])

		if user.is_staff or user.is_superuser or user.pk == location.owner.pk:
			location.delete()

			return Response({ "success": f"Location with id {id} was deleted." })
		else:
			raise PermissionDenied("Only point owner or admins can delete")
