from rest_framework import serializers

from .models import AppUser

class UserResponseSerializer(serializers.ModelSerializer):
	class Meta:
		model = AppUser
		fields = ("first_name", "last_name", "age", "username", "is_active", "color", "is_admin")

	is_admin = serializers.SerializerMethodField(read_only=True)

	def get_is_admin(self, instance):
		return instance.is_staff or instance.is_superuser

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = AppUser
		fields = ("id", "username", "email", "password")
		extra_kwargs = {
            "username": {"required": True, "allow_blank": False, "min_length": 3},
            "email": {"required": True, "allow_blank": False},
            "password": {"required": True, "allow_blank": False, "min_length": 6, "write_only": True}
		}
	
	def create(self, validated_data):
		password = validated_data.pop("password", None)
		instance = self.Meta.model(**validated_data)
		if password is not None:
			instance.set_password(password)
		instance.save()
		return instance