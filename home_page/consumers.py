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
  room_list = serializers.serialize("json", Game_instance.objects.all())

  #initialize user in javascript
  #give the current user the room list
  Group("lobby-%s" % message.user.username).send({
    "text": json.dumps({
        "initialize_username": message.user.username,
        "game_rooms": room_list,
      })
  })
  #update entire lobby the users logged in
  Group("lobby").send({
    "text": json.dumps({
        "user_logging": logged_in_users,
      })
  })



@channel_session_user
def ws_message(message):
  my_dict = json.loads(message.content['text'])

  # need to add cancel invite
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

  # handles player invite reponse in lobby
  if my_dict.get("invitation_response") is not None:
    response = my_dict.get("invitation_response");
    if response['response'] == 'accept':
      Game_instance.objects.create(room_name=response['room_name'])
      room_id = Game_instance.objects.get(room_name=response['room_name']).id
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
      if game_room.number_of_players >= game_room.max_number_of_players:
        Group("lobby-%s" % message.user.username).send({
          "text": json.dumps({
              "alert": "Too many users in the room."
            })
        })
      elif Game_player.objects.filter(game_instance_id=game_room, username=message.user.username).exists():
        Group("lobby-%s" % message.user.username).send({
          "text": json.dumps({
              "alert": "You can only be in this game room with one browser window."
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
  Group("lobby").send({
    "text": json.dumps({
      "user_logging": logged_in_users,
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
  # need to specify user and game room or will send to same user in multiple rooms
  Group("game-{0}-{1}".format(room_id, message.user.username)).add(message.reply_channel)

  if Game_instance.objects.filter(id=room_id).exists():
    game_room = Game_instance.objects.get(id=room_id)
    if game_room.number_of_players < game_room.max_number_of_players:
      num_players = game_room.number_of_players + 1
      Game_instance.objects.filter(id=room_id).update(number_of_players=num_players)

      for player_number in range(game_room.max_number_of_players):
        # if player number in current game room does not exist, create it
        if not Game_player.objects.filter(
          game_instance_id=game_room, player_number=player_number+1).exists():
          turn_player = Game_player.objects.filter(
            game_instance_id=game_room).exclude(turn_player=False)

          # checks to see if turn player is number 1 and if a turn player DNE
          # if it both is true then create a player 1 with turn player set to true
          # turn player is starting player
          if player_number+1 == 1 and not turn_player:
             Game_player.objects.create(
              username=message.user.username, 
              player_number=player_number+1,
              game_instance_id=game_room,
              turn_player=True
            )
          else:
            Game_player.objects.create(
              username=message.user.username,
              player_number=player_number+1,
              game_instance_id=game_room
            )

          Group("game-{0}-{1}".format(room_id, message.user.username)).send({
            "text": json.dumps({
                "player_name": message.user.username,
              })
          })
          break # break when added a player number
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

  room_list = serializers.serialize("json", Game_instance.objects.all())
  Group("lobby").send({
    "text": json.dumps({
      "game_rooms": room_list,
    })
  })


@channel_session_user
def ws_message_game(message, room_id):

  action = json.loads(message.content['text'])
  # declare game_room here because action are specific to game room
  game_room = Game_instance.objects.get(id=room_id)


  if action.get('refresh_stats') is not None:
    player_stats = serializers.serialize(
      "json", Game_player.objects.filter(game_instance_id=game_room).order_by('player_number')
    )    
    Group("game-%s" % room_id).send({
      "text": json.dumps({
        "player_stats": player_stats
      })
    })


  # ADD .get to get the players in the room and their board position and send during initialization
  if action.get('picked-starter-class') is not None:
    hero = action.get('picked-starter-class')
    cards = serializers.serialize("json", Card.objects.filter(hero__hero_class=hero))
    
    
    # adding rest of field values to game_player initialized on connect
    game_player = Game_player.objects.filter(username=message.user.username, game_instance_id=game_room)
    hero_object = Hero.objects.get(hero_class=hero)
    game_player.update(
      hero_class=hero_object.hero_class,
      health=hero_object.hp,
      armor=hero_object.defense,
      attack_damage=hero_object.attack_damage,
      attack_range=hero_object.attack_range
    )

    player_stats = serializers.serialize(
      "json", Game_player.objects.filter(game_instance_id=game_room).order_by('player_number')
    )
    # Currently only have 1 boss, so boss never changes
    boss_stats = serializers.serialize("json", Hero.objects.filter(hero_class='Skeleton King'))
    boss_image_url = Card.objects.get(card_type='Boss', name='Skeleton King').image.url
    current_player = Game_player.objects.get(username=message.user.username, game_instance_id=game_room)

    # need to update current position of players in the game when joining in the middle
    # filter game_instance_id=game_room . exclue false, if something exists then there is a turn player
    turn_player = Game_player.objects.get(game_instance_id=game_room, turn_player=True)

    Group("game-{0}-{1}".format(room_id, message.user.username)).send({
      "text": json.dumps({
        "player_number": str(current_player.player_number),
        "initialize_deck": cards,
        "boss_position": {
          "boss_image_url": boss_image_url,
          "tile": "#tile-32", #boss start tile
        },
        "boss_stats": boss_stats, #boss stats here so updates for current_player only
        "turn_player": {
          "username": turn_player.username,
          "player_number": str(turn_player.player_number),
          "prev_player_number": 1
        }
      })
    })

    Group("game-%s" % room_id).send({
      "text": json.dumps({
        "player_stats": player_stats
      })
    })

  if action.get('update_board') is not None:
    update_board = action.get('update_board')
    player = Game_player.objects.get(username=message.user.username, game_instance_id=game_room)
    image = Card.objects.get(name=update_board['hero_image']).image.url

    prev_position = player.board_position
    player.board_position = update_board['tile']
    player.save()

    Group("game-%s" % room_id).send({
      "text": json.dumps({
        "update_board": {
          "prev_position": prev_position,
          "new_position": update_board['tile'],
          "image_path": image,
          "user": message.user.username
        }
      })
    })

  if action.get('change_player') is not None:
    # there exists are other players besides the turn player
    current_turn_player = Game_player.objects.filter(
      game_instance_id=game_room, 
      username=message.user.username, 
      turn_player=True
    ).first()
    if Game_player.objects.filter(game_instance_id=game_room).exclude(turn_player=True).exists():
      current_turn_player.turn_player = False
      current_turn_player.save()

      if current_turn_player.player_number+1 > game_room.number_of_players:
        reset_turn_player = Game_player.objects.get(game_instance_id=game_room, player_number=1)
        reset_turn_player.turn_player = True
        reset_turn_player.save()
        turn_player = reset_turn_player.username
        turn_player_number = reset_turn_player.player_number
      else:
        next_turn_player = Game_player.objects.get(
          game_instance_id=game_room, 
          player_number=current_turn_player.player_number+1
        )
        next_turn_player.turn_player = True
        next_turn_player.save()
        turn_player = next_turn_player.username
        turn_player_number = next_turn_player.player_number

    else:
      turn_player = current_turn_player.username
      turn_player_number = current_turn_player.player_number

    Group("game-%s" % room_id).send({
      "text": json.dumps({
        "turn_player": { 
          "username": turn_player,
          "player_number": str(turn_player_number),
          "prev_player_number": str(current_turn_player.player_number)
        } 
      })
    })

  '''
    card logic begins
  '''
  if action.get('update_player_stats') is not None:
    update_obj = action.get('update_player_stats')
    '''
      update_player_stats parameters
        'target': username
        'health': #
        'armor': #
        'attack_damage': #
        'attack_range': #
        'until_end_of_turn': bool,
        'modification': 'add', 'sub', 'other', 'etc'
    '''
    modify_player = Game_player.objects.get(game_instance_id=game_room, username=update_obj['target'])
    if update_obj.get('modification') == 'add':
      if update_obj.get('health') is not None:
        pass
      if update_obj.get('armor') is not None:
        pass
      if update_obj.get('attack_damage') is not None:
        modify_player.attack_damage += update_obj['attack_damage']
        # modify_player.attack_damage = update_obj['attack_damage']
        # modify_stats.update(attack_damage=update_obj['attack_damage'])
        pass
      if update_obj.get('attack_range') is not None:
        pass
      # modify_player.update(=update_obj['stat_number'])
    # if action.get('until_end_of_turn') is not None:
    # print(modify_player.attack_damage)
    # modify_player.save()
    # print(modify_player.attack_damage)
    player_stats = serializers.serialize(
      "json", Game_player.objects.filter(game_instance_id=game_room).order_by('player_number')
    )

    print(Game_player.objects.filter(game_instance_id=game_room).order_by('player_number').first().attack_damage)
    modify_player.save()
    Group("game-%s" % room_id).send({
      "text": json.dumps({
        "player_stats": player_stats
      })
    })
    # get current user from current game room
    # modify stats
    # send back as broadcast


  # redoing altering stats

  '''
  obj needs
    target(username)
    stat(attack_damge, health, etc)
    stat_num(number to add)
    until end of turn(bool) #determines whether or not to store stat modification
    modification(add, sub, multiply)
      'alter_player_stats': {
        'target': current_player,
        'stat_to_modify': 'attack_damage',
        'stat_to_modify_amount': take_aim_value,
        'modification': 'add'
      }

    in js target with jquery and add value

    alter action only receives number to add by
    send the number that is added to client
    if until end of turn is true, then don't save to database.
  '''
  if action.get('alter_player_stats') is not None:
    alter_obj = action.get('alter_player_stats')
    if alter_obj.get('until_end_of_turn') is None:
      # always require a target
      modify_player = Game_player.objects.get(game_instance_id=game_room, username=alter_obj['target'])
      stat = alter_obj['stat_to_modify']
      new_stat = getattr(modify_player, stat) + alter_obj['stat_to_modify_amount']
      # print(new_stat)
      setattr(modify_player, stat, new_stat)
      modify_player.save()
    Group('game-%s' % room_id).send({
      'text': json.dumps({
        'alter_player_stats': {
          'target': alter_obj['target'],
          'stat_to_modify': alter_obj['stat_to_modify'],
          'stat_to_modify_amount': alter_obj['stat_to_modify_amount'],
          # 'modification': alter_obj['modification']
        }
      })
    })    


@channel_session_user
def ws_disconnect_game(message, room_id):
  game_room = Game_instance.objects.filter(id=room_id)
  num_players = Game_instance.objects.get(id=room_id).number_of_players - 1

  game_room.update(number_of_players=num_players)


  # logic for 2 player game
  # need to change when adding more players
  player_leaving = Game_player.objects.filter(username=message.user.username, game_instance_id=game_room)
  board_position = player_leaving.first().board_position
  # player 1 leaving
  if player_leaving.first().player_number == 1:
    player_in_room = Game_player.objects.filter(game_instance_id=game_room).exclude(player_number=1)
    # there is only 1 player in room that isn't player 1
    if player_in_room.count() == 1:
      player_in_room.update(player_number=1)

  # turn player leaving
  if player_leaving.first().turn_player == True:
    player_in_room = Game_player.objects.filter(game_instance_id=game_room).exclude(turn_player=True)
    # there is only one player in room that isn't turn player
    if player_in_room.count() == 1:
      player_in_room.update(turn_player=True)
      player_leaving.delete() #need to delete here or .first() will not get the correct player
      turn_player = Game_player.objects.filter(game_instance_id=game_room, turn_player=True)
      Group("game-%s" % room_id).send({
        "text": json.dumps({
          "turn_player": { 
            "username": turn_player.first().username,
            "player_number": turn_player.first().player_number,
          } 
        })
      })

  player_leaving.delete()
  if num_players < 1:
    game_room.delete()

  # need to update player stats here if player leaves mid game
  player_stats = serializers.serialize(
    "json", Game_player.objects.filter(game_instance_id=game_room).order_by('player_number')
  )
  Group("game-%s" % room_id).send({
    "text": json.dumps({
      "player_stats": player_stats,
      "update_board": {
        "prev_position": board_position,
        "new_position": board_position,
        "image_path": '',
        "user": message.user.username
      }
    })
  })

  Group("game-%s" % room_id).discard(message.reply_channel)
  Group("game-{0}-{1}".format(room_id, message.user.username)).discard(message.reply_channel)

  # update room_list to lobby 
  room_list = serializers.serialize("json", Game_instance.objects.all())
  Group("lobby").send({
    "text": json.dumps({
      "game_rooms": room_list,
    })
  })