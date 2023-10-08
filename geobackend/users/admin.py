from django.contrib import admin
from users.models import AppUser

@admin.register(AppUser)
class AdminAppUser(admin.ModelAdmin):
	readonly_fields = ("id", "date_joined",)
	list_display = ("username", "is_active", "age", "email", "is_staff", "is_superuser",)
	search_fields = ("id", "username", "email")
	ordering = ("id", "-date_joined")
