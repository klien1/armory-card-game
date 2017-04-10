from channels import Group
import json

def ws_connect(message):
  message.reply_channel.send({"accept": True})
  Group("chat").add(message.reply_channel)


# def ws_message(message):
  # print(message.content)
  # Group("chat").send({
    # "text": message.content['text'],
  # })

def ws_message(message):
# def ws_message(message, instance, **kwargs):
  # print(message.Objects.all())



  # converts json to dict
  print(json.loads(message.content['text']))
  my_dict = json.loads(message.content['text'])
  print("My user is called %s" % my_dict['username'])

  myobject = {
    "username": my_dict['username'],
    "message": my_dict['message']
  }

  #converts dict to json string
  print(json.dumps(myobject))

  print(message.content['text'])
  print(message.content)
  # print(message.user)
  print(myobject)

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


def ws_disconnect(message):
  Group("chat").discard(message.reply_channel)