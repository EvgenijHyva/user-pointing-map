from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from colorfield.fields import ColorField 
from utils.helpers import generate_user_color

class AppUser(AbstractUser):
    """Extend user model for future"""
    age = models.PositiveSmallIntegerField(blank=True, null=True, validators=[MinValueValidator(1), MaxValueValidator(100)])
    color = ColorField(null=True, default="#ffffff")

    def __str__(self):
        return f"{self.username} {self.last_name}"
    
    def save(self, *args, **kwargs):
        if AppUser.objects.filter(color=self.color.lower()).exclude(username=self.username).exists():
            self.color = generate_user_color(self.username)
        super().save(*args, **kwargs)