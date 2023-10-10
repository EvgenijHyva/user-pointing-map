from django.apps import AppConfig


class MapAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'map_app'

    def ready(self) -> None:
        import map_app.signals
        
        return super().ready()