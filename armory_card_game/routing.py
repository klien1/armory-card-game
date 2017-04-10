# from channels import include
from channels.routing import route
from home_page.consumers import ws_connect, ws_disconnect, ws_message


channel_routing = [
    # include("app1.routing.post_websocket", path=r"^/app1/post/notification"),
    # include("app1.routing.vote_websocket", path=r"^/app1/vote/notification"),
  route("websocket.connect", ws_connect),
  route("websocket.receive", ws_message),
  route("websocket.disconnect", ws_disconnect),
]