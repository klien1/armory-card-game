# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-04-30 20:35
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('home_page', '0014_auto_20170430_2025'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='card',
            name='hero',
        ),
        migrations.AddField(
            model_name='hero',
            name='hero',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='home_page.Card'),
        ),
    ]
