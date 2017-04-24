from django.db import models
# from django.contrib.auth.models import User
# from django.contrib.auth.signals import user_logged_in, user_logged_out
# from django.conf import settings

# Create your models here.
# class Players(models.Model):
#   username = models.CharField(max_length=50),
#   games_played = models.IntegerField()
#   games_won = models.IntegerField()


# class Decks(models.Model):
  # class_name = models.CharField(max_length=30, unique=True)
  # health_points = models.IntegerField()
  # img_path = models.CharField(max_length=100, unique=True)


# class Game_instance(models.Model):
  # room_name = models.CharField(max_length=30)
  # max_number_of_players = models.IntegerField()
  # current_number_of_players = models.IntegerField()


# class Game_state(models.Model):
  # player_type -> host, client, ai
  # current_player_type = models.CharField(max_length=50)
  # host_state
  # client_state
  # boss_state


# class Character(models.Model):
#   character_type = models.CharField(max_length=20)
# class Game_list(models.Model):
  # game_name = models.CharField(max_length=10)


# class Player_state(models.Model):
#   player_id = models.CharField(max_length=10)
#   health_points = models.IntegerField()
#   class_name = models.CharField(max_length=10)
#   front_state = models.CharField(max_length=10)
#   back_state = models.CharField(max_length=10)
#   enemy_state = models.CharField(max_length=10)


# class Game_state(models.Model):
#   player_one_state = models.ForeignKey(Player_state, on_delete=models.CASCADE)
#   # player_two_state = models.ForeignKey(Player_state, on_delete=models.CASCADE)


# class Game_room(models.Model):
#   number_of_players = models.IntegerField()
#   max_number_of_players = models.IntegerField()
  # room_name = models.CharField(max_length=10)
  # game_state = models.OneToOneField(Game_state, on_delete=models.CASCADE)
  #player1 = 


# class Boss_state(models.Model):
#   boss_name = models.CharField(max_length=10)
#   boss_health = models.IntegerField()


# class Users_online(models.Model):

  # user_online = models.ForeignKey(
  # above displays all of the models even users not logged in
  # user_online = models.OneToOneField(
  #   settings.AUTH_USER_MODEL,
  #   related_name='user_online',
  #   on_delete=models.CASCADE,
  # )



#kwargs['user'] looks for current user
# def on_user_login(sender, **kwargs):
    #Users_online is the model for database
    # Users_online.objects.create(logged_in=kwargs.get('user')) 
    # above errors when server shutdown and users still logged in
    # Users_online.objects.get_or_create(user_online=kwargs.get('user'))


# def on_user_logout(sender, **kwargs):
    # Users_online.objects.filter(user_online=kwargs.get('user')).delete()


# user_logged_in.connect(on_user_login)
# user_logged_out.connect(on_user_logout)



class Game_instance(models.Model):
  room_name = models.CharField(max_length=50, unique=True)
  number_of_players = 0
  max_number_of_players = 2