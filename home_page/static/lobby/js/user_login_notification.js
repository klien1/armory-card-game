// create connection
let socket = new WebSocket("ws://localhost:8000/login/");

// receive message from server
socket.onmessage = (msg) => {
  console.log(msg)
  // console.log(JSON.parse(msg.data));
  // recv = JSON.parse(msg.data);
  // let chat = document.getElementById('user_list');
  // let para = document.createElement('li');
  // let text = document.createTextNode(recv.username + ": "  + recv.message);
  // let text = document.createTextNode(recvInner.username + ": "  + recvInner.message);

  // add the child nodes to chatbox
  // para.appendChild(text); 
  // chat.appendChild(para);

  // scroll to bottom of chatbox when new msg appears
  // let chatboxscroll = $('#chatbox');
  // chatboxscroll.animate({ scrollTop: chatboxscroll.prop('scrollHeight')}, 1000);
}

// socket is open
socket.onopen = () => {
  console.log('CONNECTED LOGIN');
}

if (socket.readyState == WebSocket.OPEN) {
  socket.onopen();
}