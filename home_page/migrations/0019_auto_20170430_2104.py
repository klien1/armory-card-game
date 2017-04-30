# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-04-30 21:04
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('home_page', '0018_auto_20170430_2054'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='hero',
            name='deck',
        ),
        migrations.AlterField(
            model_name='card',
            name='hero',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='home_page.Hero'),
        ),
    ]
