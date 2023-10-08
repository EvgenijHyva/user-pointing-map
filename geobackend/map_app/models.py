from django.db import models
from django.db.models import Q
from django.core.exceptions import ValidationError
from django.contrib.gis.geos import Point
from django.contrib.gis.db import models as gismodels

from utils.models import TimeStampedModel
from users.models import AppUser

class Location(TimeStampedModel):
	class Meta:
		unique_together = (('owner', 'point'),)

	owner = models.ForeignKey(AppUser, on_delete=models.SET_NULL, null=True)
	point = gismodels.PointField(default=Point(0.0, 0.0))
	label = models.CharField(max_length=150, null=True, blank=True)
	title = models.CharField(max_length=50)
	form = models.CharField(max_length=50) 

	def save(self, *args, **kwargs):
		if self.owner and self.point:
			if Location.objects.filter(Q(owner=self.owner) & Q(point=self.point)).exclude(pk=self.pk).exists():
				raise ValidationError(f"This Location is already owned by {self.owner}")
		super(Location, self).save(*args, **kwargs)

	def __str__(self) -> str:
		return f"Point:{self.point}, Owner:({self.point})"