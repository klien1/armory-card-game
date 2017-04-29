let socket = new WebSocket("ws://" + window.location.host + window.location.pathname); //need to add id here
socket.onopen = () => {
}


socket.onmessage = (msg) => {
  console.log(JSON.parse(msg.data));
  action = JSON.parse(msg.data);

  if (action.redirect !== undefined) {
    // window.location.replace("http://" + window.location.host + action.redirect);
    window.location.href = "http://" + window.location.host + action.redirect;
  }
}

if (socket.readyState == WebSocket.OPEN) {
  socket.onopen();
}