# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-05-13 23:26
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home_page', '0030_game_instance_number_of_players_ready'),
    ]

    operations = [
        migrations.AddField(
            model_name='game_player',
            name='player_ready',
            field=models.BooleanField(default=False),
        ),
    ]
