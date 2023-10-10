from django.db.models.signals import pre_save
from django.dispatch import receiver

from utils.helpers import generate_user_color
from .models import Location

@receiver(pre_save, sender=Location)
def location_pre_save_signal(sender, instance, **kwargs):

	existing_objects = Location.objects.filter(owner=instance.owner)
	print(existing_objects.exists())
	if instance.pk:
		if Location.objects.filter(textColor=instance.textColor).exclude(pk=instance.pk).exists():
			instance.textColor = generate_user_color(instance.pk)
		existing_objects.update(textColor=instance.textColor)
	else:
		if existing_objects.exists():
			instance.textColor = existing_objects.first().textColor
		else:
			instance.textColor = instance.owner.color
	
