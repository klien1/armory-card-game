# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-04-24 02:23
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home_page', '0003_auto_20170424_0139'),
    ]

    operations = [
        migrations.AddField(
            model_name='game_instance',
            name='max_number_of_players',
            field=models.IntegerField(default=2),
        ),
        migrations.AddField(
            model_name='game_instance',
            name='number_of_players',
            field=models.IntegerField(default=1),
        ),
    ]