# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-04-30 20:37
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('home_page', '0016_auto_20170430_2036'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hero',
            name='deck',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='home_page.Card'),
        ),
    ]