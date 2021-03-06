# from channels import include
from channels.routing import route
# from home_page.consumers import ws_connect, ws_disconnect, ws_message, ws_connect_game, ws_disconnect_game, ws_message_game
from home_page.consumers import *
# from home_page.test_consumers import ws_connect_game, ws_disconnect_game


channel_routing = [
  route("websocket.connect", ws_connect, path=r"^/lobby/"),
  route("websocket.receive", ws_message, path=r"^/lobby/"),
  route("websocket.disconnect", ws_disconnect, path=r"^/lobby/"),

  route("websocket.connect", ws_connect_game, path=r"^/game-(?P<room_id>[0-9]+)/"),
  route("websocket.receive", ws_message_game, path=r"^/game-(?P<room_id>[0-9]+)/"),
  route("websocket.disconnect", ws_disconnect_game, path=r"^/game-(?P<room_id>[0-9]+)/"),
]
