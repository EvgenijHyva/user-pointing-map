from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request

from .serializer import LocationSerializer
from .models import Location


class LocationView(APIView):
	def get(self, request: Request):
		locations = Location.objects.all()
		return Response(locations)
	
	def post(self, request: Request):
		data=request.data
		print("post data:",data)
		serializer = LocationSerializer(data=data)
		if serializer.is_valid(raise_exception=True):
			serializer.save()
			return Response(serializer.data)
