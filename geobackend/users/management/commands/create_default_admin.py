from django.core.management import BaseCommand
from users.models import AppUser
import os

class Command(BaseCommand):
    help = "Create a default admin user if it does not exist"

    def handle(self, *args, **options):
        admin_exists = AppUser.objects.filter(is_superuser=True).exists()
        if admin_exists:
            self.stdout.write(self.style.SUCCESS("Default admin user already exists"))
        else:
            username = os.environ.get("DJANGO_ADMIN_USERNAME")
            AppUser.objects.create_superuser(
                username=username, 
                password=os.environ.get("DJANGO_ADMIN_PASSWORD"), 
                email=os.environ.get("DJANGO_ADMIN_EMAIL")
            )
            self.stdout.write(self.style.SUCCESS(f"Default admin user {username} created successfully"))