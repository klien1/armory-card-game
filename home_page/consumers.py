from channels import Group
from channels.auth import channel_session_user, channel_session_user_from_http
from .models import Game_instance, Users_in_lobby
import json


@channel_session_user_from_http
def ws_connect(message):
  message.reply_channel.send({"accept": True})
  Group("lobby").add(message.reply_channel)
  Group("%s" % message.user.username).add(message.reply_channel)
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

  if my_dict.get("to") is not None:
    Group(my_dict["to"]).send({
      "text": json.dumps({
        "invite": {
          "to": my_dict["to"],
          "from": message.user.username,
        }
      })
    })

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
    if game_room is not None and game_room.number_of_players < game_room.max_number_of_players:
      path = "/game-" + str(game_room.id)
      Group("%s" % message.user.username).send({
        "text": json.dumps({
            "room_path": path
          })
      })
    else:
      Group("%s" % message.user.username).send({
        "text": json.dumps({
            "alert": "Game is over or too many users in the room"
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
  Group("%s" % message.user.username).discard(message.reply_channel)



@channel_session_user_from_http
def ws_connect_game(message, room_id):
  message.reply_channel.send({"accept": True})

  '''
  GET PLAYER COUNT AS PLAYERS ENTER
  FIRST ONE IS PLAYER ONE
  SECOND ONE IS PLAYER TWO
  GET NUMBER BY READING NUMBER OF PLAYERS IN DATABASE
  '''

  Group("game-%s" % room_id).add(message.reply_channel)
  Group("%s" % message.user.username).add(message.reply_channel)

  if Game_instance.objects.filter(id=room_id).exists():
    game_room = Game_instance.objects.get(id=room_id)
    if game_room.number_of_players < game_room.max_number_of_players:
      num_players = game_room.number_of_players + 1
      Game_instance.objects.filter(id=room_id).update(number_of_players=num_players)
    else:
      Group("%s" % message.user.username).send({
        "text": json.dumps({
            "redirect": "/lobby/",
          })
      })
  else:
    Group("%s" % message.user.username).send({
      "text": json.dumps({
          "redirect": "/lobby/",
        })
    })



@channel_session_user
def ws_message_game(message, room_id):

  action = json.loads(message.content['text'])

  if action.get('picked-starter-class') is not None:
    hero = action.get('picked-starter-class')
    Group("game-%s" % room_id).send({
      "text": json.dumps({
        "initialize_deck": hero,
      })
    })

  # game_room = Game_instance.objects.get(id=room_id)
  # message = "No Message"
  # if game_room is not None:
  #   num_players_in_current_room = game_room.number_of_players
  #   max_num_players_in_current_room = game_room.max_number_of_players
  #   if num_players_in_current_room < max_num_players_in_current_room:
  #     message = "Number of Players less than max"
  #   else:
  #     message = "Number of Players equal to or greater than max" #send redirect because full room
  # else:
  #   message = "game room doesn't exists" #send redirect to lobby


  # data = json.loads(message.content['text'])
  Group("game-%s" % room_id).send({
    "text": json.dumps({
      # "test": data['sending'],
      # "test": message,
      # "num_users_online": num_users_online,
    })
  })


@channel_session_user
def ws_disconnect_game(message, room_id):
  game_room = Game_instance.objects.filter(id=room_id)
  num_players = Game_instance.objects.get(id=room_id).number_of_players - 1
  game_room.update(number_of_players=num_players)
  if num_players <= 0:
    game_room.delete()

  Group("game-%s" % room_id).discard(message.reply_channel)
  Group("%s" % message.user.username).discard(message.reply_channel)
  room_list = list(Game_instance.objects.values_list('room_name', flat=True))
  Group("lobby").send({
    "text": json.dumps({
      "user_logging_out": message.user.username,
      "game_rooms": room_list,
    })
  })