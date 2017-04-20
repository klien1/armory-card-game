# from channels import include
from channels.routing import route
from home_page.consumers import ws_connect, ws_disconnect, ws_message, ws_connect_game, ws_disconnect_game
# from home_page.test_consumers import ws_connect_game, ws_disconnect_game


channel_routing = [
  route("websocket.connect", ws_connect, path=r"^/chat/"),
  route("websocket.receive", ws_message, path=r"^/chat/"),
  route("websocket.disconnect", ws_disconnect, path=r"^/chat/"),

  route("websocket.connect", ws_connect_game, path=r"^/game/"),
  # route("websocket.receive", ws_message, path=r"^/game/"),
  route("websocket.disconnect", ws_disconnect_game, path=r"^/game/"),
]