from django.db import models
# from django.contrib.auth.models import User
# from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.conf import settings
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


class Game_instance(models.Model):
  room_name = models.CharField(max_length=50, unique=True)
  number_of_players = models.PositiveIntegerField(default=0)
  max_number_of_players = models.PositiveIntegerField(
    default=2,  
    validators=[MaxValueValidator(4), MinValueValidator(2)],
  )


class Users_in_lobby(models.Model):
  user = models.CharField(max_length=150);

