# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-04-30 20:12
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('home_page', '0012_auto_20170430_2008'),
    ]

    operations = [
        migrations.RenameField(
            model_name='hero',
            old_name='damage',
            new_name='attack_damage',
        ),
    ]