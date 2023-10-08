from django.contrib import admin
from .models import Location

@admin.register(Location)
class AdminLocation(admin.ModelAdmin):
	readonly_fields = ("id", "created_at")
	list_display = ("title", "owner", "point", "created_at")
	search_fields = ("owner",)
	ordering = ("id", "-created_at")