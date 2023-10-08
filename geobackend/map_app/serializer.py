from rest_framework import serializers

from .models import Location
from users.serializer import BasicUserSerializer

class LocationSerializer(serializers.ModelSerializer):
	user = BasicUserSerializer()

	class Meta:
		model = Location
		fields = "__all__"
