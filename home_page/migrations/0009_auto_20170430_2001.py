# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-04-30 20:01
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('home_page', '0008_auto_20170429_0409'),
    ]

    operations = [
        migrations.CreateModel(
            name='Card',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('image', models.ImageField(upload_to='')),
                ('card_type', models.CharField(choices=[('Hero', 'Hero'), ('Ability', 'Ability'), ('Augment', 'Augment'), ('Skill', 'Skill'), ('Equipment', 'Equipment'), ('Reaction', 'Reaction'), ('Ultimate', 'Ultimate')], default='Hero', max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='Hero',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hero_class', models.CharField(max_length=50)),
                ('hp', models.PositiveSmallIntegerField()),
            ],
        ),
        migrations.AddField(
            model_name='card',
            name='hero',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home_page.Hero'),
        ),
    ]
