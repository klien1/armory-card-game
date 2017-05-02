from django.core import serializers
from channels import Group
from channels.auth import channel_session_user, channel_session_user_from_http
from .models import Game_instance, Users_in_lobby, Card, Game_player, Hero
import json


'''
Lobby Web Socket
'''
@channel_session_user_from_http
def ws_connect(message):
  message.reply_channel.send({"accept": True})
  Group("lobby").add(message.reply_channel)
  Group("lobby-%s" % message.user.username).add(message.reply_channel)
  Users_in_lobby.objects.get_or_create(user=message.user.username)
  logged_in_users = list(Users_in_lobby.objects.values_list('user', flat=True))

  room_list = list(Game_instance.objects.values_list('room_name', flat=True))
  Group("lobby").send({
    "text": json.dumps({
        "user_logging": logged_in_users,
        "game_rooms": room_list,
      })
  })


@channel_session_user
def ws_message(message):
  my_dict = json.loads(message.content['text'])

  if my_dict.get("refresh_game_list") is not None:
    room_list = list(Game_instance.objects.values_list('room_name', flat=True))
    Group("lobby").send({
      "text": json.dumps({
        "game_rooms": room_list,
      })
    })

  # need to prevent adding yourself (probably in js to prevent send)
  if my_dict.get("invite_user") is not None:
    Group("lobby-%s" % my_dict["invite_user"]["to"]).send({
      "text": json.dumps({
        "invite": {
          "to": my_dict["invite_user"]["to"],
          "from": message.user.username,
          "room_name": my_dict["invite_user"]["room_name"],
        }
      })
    })

  if my_dict.get("invitation_response") is not None:
    # print(my_dict.get("invitation_response"))
    response = my_dict.get("invitation_response");
    # print(response['response'])
    if response['response'] == 'accept':
      # print(response['response'])
      print(response)
      Game_instance.objects.create(room_name=response['room_name'])
      room_id = Game_instance.objects.get(room_name=response['room_name']).id
      # print(room_id)
      Group("lobby-%s" % response['sender']).send({
        "text": json.dumps({
            "redirect": "/game-%s" % str(room_id) 
          })
      })
      Group("lobby-%s" % message.user.username).send({
        "text": json.dumps({
          "redirect": "/game-%s" % str(room_id) 
          })
      })      
      #create game istance here and redirect sender and player to new game
      print('success!')
    elif response['response'] == 'reject':
      Group("lobby-%s" % response['sender']).send({
        "text": json.dumps({
            "rejected_invite": "%s rejected your invitation" % message.user.username
          })
      })
    else:
      print('cancel')

  if my_dict.get("message") is not None:
    Group("lobby").send({
      "text": json.dumps({
        "chat": {
          "username": message.user.username,
          "message": my_dict['message'],
        }
      })
    })

  if my_dict.get("join_game") is not None:
    room_name = my_dict.get("join_game")
    game_room = Game_instance.objects.get(room_name=room_name)

    if game_room is not None:
      if game_room.number_of_players < game_room.max_number_of_players:
        Group("lobby-%s" % message.user.username).send({
          "text": json.dumps({
              "alert": "Too many users in the room"
            })
        })
      elif Game_player.objects.filter(game_instance_id=game_room).exists():
        Group("lobby-%s" % message.user.username).send({
          "text": json.dumps({
              "alert": "You can only be in this game room with one window"
            })
        })        
      else:
        path = "/game-" + str(game_room.id)
        Group("lobby-%s" % message.user.username).send({
          "text": json.dumps({
              "room_path": path
            })
        })
    else:
      Group("lobby-%s" % message.user.username).send({
        "text": json.dumps({
            "alert": "Game room does not exist"
          })
      })


@channel_session_user
def ws_disconnect(message):
  Users_in_lobby.objects.filter(user=message.user.username).delete()
  logged_in_users = list(Users_in_lobby.objects.values_list('user', flat=True))
  room_list = list(Game_instance.objects.values_list('room_name', flat=True))
  Group("lobby").send({
    "text": json.dumps({
      "user_logging": logged_in_users,
      "game_rooms": room_list,
    })
  })
  Group("lobby").discard(message.reply_channel)
  Group("lobby-%s" % message.user.username).discard(message.reply_channel)







'''
Game Room Websocket
'''
@channel_session_user_from_http
def ws_connect_game(message, room_id):
  message.reply_channel.send({"accept": True})

  Group("game-%s" % room_id).add(message.reply_channel)
  # need to specifig user and game room or will send to same user in multiple rooms
  Group("game-{0}-{1}".format(room_id, message.user.username)).add(message.reply_channel)

  if Game_instance.objects.filter(id=room_id).exists():
    game_room = Game_instance.objects.get(id=room_id)
    if game_room.number_of_players < game_room.max_number_of_players:
      num_players = game_room.number_of_players + 1 # reminder use this for player number later
      Game_instance.objects.filter(id=room_id).update(number_of_players=num_players)
      Game_player.objects.get_or_create(
        username=message.user.username, 
        player_number=num_players,
        game_instance_id=game_room
      )
    else:
      Group("game-{0}-{1}".format(room_id, message.user.username)).send({
        "text": json.dumps({
            "redirect": "/lobby/",
          })
      })
  else:
    Group("game-{0}-{1}".format(room_id, message.user.username)).send({
      "text": json.dumps({
          "redirect": "/lobby/",
        })
    })



@channel_session_user
def ws_message_game(message, room_id):

  action = json.loads(message.content['text'])

  if action.get('picked-starter-class') is not None:
    hero = action.get('picked-starter-class')
    cards = serializers.serialize("json", Card.objects.filter(hero__hero_class=hero))
    
    #adding rest of field to game_player
    game_room = Game_instance.objects.get(id=room_id)
    game_player = Game_player.objects.filter(username=message.user.username, game_instance_id=game_room)
    hero_object = Hero.objects.get(hero_class=hero)
    game_player.update(
      hero_class=hero_object.hero_class,
      health=hero_object.hp,
      armor=hero_object.defense,
      attack_damage=hero_object.attack_damage,
      attack_range=hero_object.attack_range
    )

    player_stats = serializers.serialize("json", Game_player.objects.filter(game_instance_id=game_room).order_by('player_number'))
    current_player = Game_player.objects.get(username=message.user.username, game_instance_id=game_room)

    Group("game-{0}-{1}".format(room_id, message.user.username)).send({
      "text": json.dumps({
        "player_number": str(current_player.player_number),
        "initialize_deck": cards,
      })
    })

    Group("game-%s" % room_id).send({
      "text": json.dumps({
        "player_stats": player_stats,
      })
    })



@channel_session_user
def ws_disconnect_game(message, room_id):
  game_room = Game_instance.objects.filter(id=room_id)
  num_players = Game_instance.objects.get(id=room_id).number_of_players - 1
  game_room.update(number_of_players=num_players)
  if num_players <= 0:
    game_room.delete()

  Game_player.objects.filter(username=message.user.username, game_instance_id=game_room).delete()
  Group("game-%s" % room_id).discard(message.reply_channel)
  Group("game-{0}-{1}".format(room_id, message.user.username)).discard(message.reply_channel)
  room_list = list(Game_instance.objects.values_list('room_name', flat=True))
  Group("lobby").send({
    "text": json.dumps({
      "game_rooms": room_list,
    })
  })