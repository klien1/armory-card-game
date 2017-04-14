from channels import Group
import json

# user
from channels.auth import channel_session_user, channel_session_user_from_http


@channel_session_user_from_http
def ws_connect(message):
  message.reply_channel.send({"accept": True})
  Group("chat").add(message.reply_channel)

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

  myobject = {
    "username": message.user.username,
    "message": my_dict['message']
  }

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

  Group("chat").send({
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
    "text": json.dumps(myobject)


  })

# @channel_session_user
def ws_disconnect(message):
  Group("chat").discard(message.reply_channel)