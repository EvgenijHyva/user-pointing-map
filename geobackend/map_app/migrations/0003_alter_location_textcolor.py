# Generated by Django 4.0.2 on 2023-10-10 09:23

import colorfield.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('map_app', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='location',
            name='textColor',
            field=colorfield.fields.ColorField(blank=True, default='#000000', image_field=None, max_length=25, null=True, samples=None),
        ),
    ]