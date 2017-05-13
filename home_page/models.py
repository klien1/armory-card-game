from django.db import models

# static table
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
      ('Boss', 'Boss'),
      ('Minion', 'Minion'),
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
  room_name = models.CharField(
    max_length=50, 
    unique=True, 
    error_messages={
      'unique': 'Room name already exists.'
    })
  number_of_players = models.PositiveIntegerField(default=0)
  max_number_of_players = models.PositiveIntegerField(default=2)
  GAME_STATES = (
      ('In Progress', 'In Progress'),
      ('Waiting', 'Waiting'),
      ('Completed', 'Completed'),
  )
  game_state = models.CharField(max_length=20, choices=GAME_STATES, default='Waiting')

  def __str__(self):
    return self.room_name


class Game_player(models.Model):
  username = models.CharField(max_length=150)
  player_number = models.PositiveSmallIntegerField()
  game_instance_id = models.ForeignKey(Game_instance, on_delete=models.CASCADE)
  hero_class = models.CharField(max_length=50, null=True)
  health = models.PositiveSmallIntegerField(null=True)
  armor = models.PositiveSmallIntegerField(null=True)
  attack_damage = models.PositiveSmallIntegerField(null=True)
  attack_range = models.PositiveSmallIntegerField(null=True)

  turn_player = models.BooleanField(default=False)
  board_position = models.CharField(max_length=10, default='none')


  def __str__(self):
    return 'Game:{1} Player:{0}'.format(self.username, self.game_instance_id)


class Users_in_lobby(models.Model):
  user = models.CharField(max_length=150);

  def __str__(self):
    return self.user