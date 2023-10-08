from django.urls import path
from .apps import MapAppConfig
from .views import LocationView

app_name = MapAppConfig.name

urlpatterns = (
	path("points/", LocationView.as_view(), name="location-points"),
)
