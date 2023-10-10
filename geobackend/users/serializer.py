from rest_framework import serializers

from .models import AppUser

class BasicUserSerializer(serializers.ModelSerializer):
	class Meta:
		model = AppUser
		fields = ("first_name", "last_name", "age", "username", "is_active", "color")
