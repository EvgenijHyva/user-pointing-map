from rest_framework import serializers

from .models import Location
from users.serializer import UserResponseSerializer

class OwnedLocationsSerializer(serializers.ModelSerializer):
	owner = UserResponseSerializer()

	class Meta:
		model = Location
		fields = "__all__"

class LocationSerializer(serializers.ModelSerializer):
		class Meta:
			model = Location
			fields = "__all__"