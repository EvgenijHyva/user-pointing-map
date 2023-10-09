from rest_framework import serializers

from .models import Location
from users.serializer import BasicUserSerializer

class OwnedLocationsSerializer(serializers.ModelSerializer):
	owner = BasicUserSerializer()

	class Meta:
		model = Location
		fields = "__all__"

class LocationSerializer(serializers.ModelSerializer):
		class Meta:
			model = Location
			fields = "__all__"