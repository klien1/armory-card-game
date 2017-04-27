from django.db import models
# from django.contrib.auth.models import User
# from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.conf import settings


class Game_instance(models.Model):
  room_name = models.CharField(max_length=50, unique=True)
  number_of_players = models.IntegerField(default=0)
  max_number_of_players = models.IntegerField(default=2)

class Users_in_lobby(models.Model):
  user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
  user_in_lobby = models.BooleanField()
