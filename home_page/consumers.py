from channels import Group
import json

# user
from channels.auth import channel_session_user, channel_session_user_from_http

logged_in_users = []
# num_users_online = 0;

@channel_session_user_from_http
def ws_connect(message):
  message.reply_channel.send({"accept": True})
  Group("lobby").add(message.reply_channel)
  Group("%s" % message.user.username).add(message.reply_channel)
  logged_in_users.append(message.user.username)
  # num_users_online += 1
  Group("lobby").send({
    "text": json.dumps({
        "user_logging": logged_in_users,
        # "num_users_online": num_users_online,
      })
  })
  # Group("login").add(message.reply_channel)
  # Group("chat").send({
      # "text": json.dumps({
        # "login": {
          # "user_just_logged_in": message.user.username,
        # }
  #       "login": message.user.username,
  #       "user_online": True,
  #       "username": None,
  #       "message": None,
    #   }),
    # })

  # print(message.user.username)


# def ws_message(message):
  # print(message.content)
  # Group("chat").send({
    # "text": message.content['text'],
  # })

@channel_session_user
def ws_message(message):
# def ws_message(message, instance, **kwargs):
  # print(message.Objects.all())


  # print(message.user.username)
  # converts json to dict
  # print(json.loads(message.content['text']))
  my_dict = json.loads(message.content['text'])
  # print("My user is called %s" % my_dict['username'])

  # myobject = {
    # "username": message.user.username,
    # "message": my_dict['message'],
    # "login": None,
    # "user_online": None,
  # }
  #converts dict to json string
  # print(json.dumps(myobject))

  # print(message.content['text'])
  # print(message.content)
  # print(message.user)
  # print(myobject)

  # print(myobject)
  # print(JSONEncoder().encode(myobject))

  # print("DUMPING@@@")
  # print(json.dumps({"msg": myobject}))

  if my_dict.get("to") is not None:
    Group(my_dict["to"]).send({
      "text": json.dumps({
        "to": my_dict["to"],
        "from": message.user.username,
      })
    })

  Group("lobby").send({
    # "text": json.dumps({
    #   "username": message,
    #   "message": message.content,
    # })
    # "text": {
    #   "username": "user2",
    #   "message": "my message",
    # }
    # "text": json.dump({
    #     "message": message.
    #   })
    # "text": message.content['text'],
    # "text": "{ \"username\": \"user2\", \"message\": \"my message\"}"
    # "text": json.dumps(message.content['text'])
    "text": json.dumps({
      "chat": {
        "username": message.user.username,
        "message": my_dict['message'],
      }
    })
  })

@channel_session_user
# @channel_session_user_from_http
def ws_disconnect(message):
  logged_in_users.remove(message.user.username)
  print(logged_in_users)
  # num_users_online -= 1
  Group("lobby").send({
    "text": json.dumps({
      "user_logging": logged_in_users,
      # "num_users_online": num_users_online,
    })
  })

  # Group("chat").send({
    # "text": json.dumps({
      # "logout": {
        # "user_just_logged_out": message.user.username
      # },
  #     "user_online": False,
  #     "username": None,
  #     "message": None,
    # }),
  # })
  Group("lobby").discard(message.reply_channel)
  Group("%s" % message.user.username).discard(message.reply_channel)
  # Group("login").discard(message.reply_channel)



# @channel_session_user_from_http
# def ws_connect_login(message):
#   message.reply_channel.send({"accept": True})
#   Group("login").add(message.reply_channel)


# @channel_session_user
# def ws_disconnect_login(message):
#   Group("login").discard(message.reply_channel)

#"key:value, key:value, key:value, key:value"
#{key : value,
# }




@channel_session_user_from_http
def ws_connect_game(message):
  message.reply_channel.send({"accept": True})
  Group("game").add(message.reply_channel)


@channel_session_user
# @channel_session_user_from_http
def ws_disconnect_game(message):
  # message.reply_channel.send({"accept": True})
  Group("game").discard(message.reply_channel)