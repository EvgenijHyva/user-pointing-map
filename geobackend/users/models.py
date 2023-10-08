from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator

class AppUser(AbstractUser):
    """Extend user model for future"""
    age = models.PositiveSmallIntegerField(blank=True, null=True, validators=[MinValueValidator(1), MaxValueValidator(100)])
    
    def __str__(self):
        return f"{self.username} {self.last_name}"