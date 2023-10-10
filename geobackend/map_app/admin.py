from django.contrib import admin
from .models import Location
from colorfield.fields import ColorField
from colorfield.widgets import ColorWidget

@admin.register(Location)
class AdminLocation(admin.ModelAdmin):
	readonly_fields = ("id", "created_at")
	list_display = ("title","textColor" ,"owner", "point", "created_at")
	search_fields = ("owner",)
	ordering = ("id", "-created_at")
	formfield_overrides = {
        ColorField: {'widget': ColorWidget},
    }