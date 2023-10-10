from django.contrib import admin
from users.models import AppUser
from colorfield.fields import ColorField
from colorfield.widgets import ColorWidget

@admin.register(AppUser)
class AdminAppUser(admin.ModelAdmin):
	readonly_fields = ("id", "date_joined",)
	list_display = ("username","color", "is_active", "age", "email", "is_staff", "is_superuser",)
	search_fields = ("id", "username", "email")
	ordering = ("id", "-date_joined")
	formfield_overrides = {
        ColorField: {'widget': ColorWidget},
    }