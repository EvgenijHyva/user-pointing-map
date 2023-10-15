from rest_framework import serializers
from django.contrib.gis.geos import Point
from .models import Location
from users.serializer import UserSerializer

class PointSerializer(serializers.BaseSerializer):
    def to_representation(self, obj):
        if isinstance(obj, Point):
            return str(obj)  

    def to_internal_value(self, data):
        return data

class OwnedLocationsSerializer(serializers.ModelSerializer):
	owner = UserSerializer()
	point = PointSerializer()
	
	class Meta:
		model = Location
		fields = "__all__"

class LocationSerializer(serializers.ModelSerializer):
	point = PointSerializer()
      
	class Meta:
		model = Location
		fields = "__all__"