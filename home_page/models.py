from django.db import models


# Create your models here.
class Players(models.Model):
  username = models.CharField(max_length=50),
  games_played = models.IntegerField()
  games_won = models.IntegerField()


class Decks(models.Model):
  deckname = models.CharField(max_length=30)


class Character(models.Model):
  character_type = models.CharField(max_length=20)