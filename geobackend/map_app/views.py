from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.exceptions import AuthenticationFailed
import os
import jwt
from .serializer import LocationSerializer, OwnedLocationsSerializer
from .models import Location
from users.models import AppUser


class LocationView(APIView):
	def get(self, request: Request):
		locations = Location.objects.all()
		serializer = OwnedLocationsSerializer(locations, many=True)
		#print(serializer.data)
		return Response(serializer.data)
	
	def post(self, request: Request):
		data=request.data
		token = request.COOKIES.get("jwt")
		print(request.COOKIES)
		
		if not token:
			raise AuthenticationFailed("Unauthenticated! Token not provided")
		
		try:
			payload = jwt.decode(token, os.environ.get("SECRET_KEY"), algorithms=["HS256"])
		except jwt.ExpiredSignatureError:
			raise AuthenticationFailed("Unauthenticated!")
		
		user = AppUser.objects.get(id=payload["id"])
		data["owner"] = user.id
		serializer = LocationSerializer(data=data)
		if serializer.is_valid(raise_exception=True):
			serializer.save()
			return Response(serializer.data)
