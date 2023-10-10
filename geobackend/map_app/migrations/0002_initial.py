# Generated by Django 4.0.2 on 2023-10-10 09:18

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('map_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='location',
            name='owner',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterUniqueTogether(
            name='location',
            unique_together={('owner', 'point')},
        ),
    ]
