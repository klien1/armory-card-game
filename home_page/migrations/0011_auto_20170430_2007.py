# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-04-30 20:07
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home_page', '0010_auto_20170430_2006'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hero',
            name='hero_class',
            field=models.CharField(max_length=50, unique=True),
        ),
    ]