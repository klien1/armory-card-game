from django.db import models
# from django.contrib.auth.models import User
# from django.contrib.auth.signals import user_logged_in, user_logged_out
# from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
# from django.core.validators import MaxValueValidator

# class Game_state(models.Model):
#   turn_player = models.CharField(max_length=150)
#   player_one = models.CharField(max_length=150)
#   player_two = models.CharField(max_length=150)

# class Hero(models.Model):
#   hero_class = models.CharField(max_length=50)
#   hero_hp = models.IntegerField()
#   hero_attack = models.IntegerField()
  # hero_armor = models.IntegerField()
  # hero_cards = models.IntegerField()

# class Boss_deck(models.Model):
#   card_name = models.CharField(max_length=150, unique=True)
#   number_of_card = PositiveIntegerField()
#   image = models.ImageField(null=True, blank=True)
# class Game_state(models.Model):
#   player_one = models.CharField(max_length=150)
#   player_two = models.CharField(max_length=150)
#   player_three = models.CharField(max_length=150)
#   player_four = models.CharField(max_length=150)


class Hero(models.Model):
  hero_class = models.CharField(max_length=50, unique=True)
  hp = models.PositiveSmallIntegerField(default=10)
  defense = models.PositiveSmallIntegerField(default=0)
  attack_damage = models.PositiveSmallIntegerField(default=1)
  attack_range = models.PositiveSmallIntegerField(default=1)

  def __str__(self):
    return self.hero_class


# from django documentation
# https://docs.djangoproject.com/en/1.11/ref/models/fields/
def upload_path(instance, filename):
    return 'cards/{0}/{1}'.format(instance.hero.hero_class, filename)


class Card(models.Model):
  name = models.CharField(max_length=50, unique=True)
  image = models.ImageField(upload_to=upload_path)
  copies = models.PositiveSmallIntegerField(default=1)
  CARD_TYPES = (
      ('Hero', 'Hero'),
      ('Ability', 'Ability'),
      ('Augment', 'Augment'),
      ('Skill', 'Skill'),
      ('Equipment', 'Equipment'),
      ('Reaction', 'Reaction'),
      ('Ultimate', 'Ultimate'),
  )
  card_type = models.CharField(max_length=20, choices=CARD_TYPES, default='Hero')
  hero = models.ForeignKey(Hero, on_delete=models.SET_NULL, blank=True, null=True)

  def __str__(self):
    return self.name


class Game_instance(models.Model):
  room_name = models.CharField(max_length=50, unique=True)
  number_of_players = models.PositiveIntegerField(default=0)
  max_number_of_players = models.PositiveIntegerField(
    default=2,  
    validators=[MaxValueValidator(4), MinValueValidator(2)],
  )

  def __str__(self):
    return self.room_name


class Users_in_lobby(models.Model):
  user = models.CharField(max_length=150);

  def __str__(self):
    return self.user

