document.getElementById("message").addEventListener("keydown", (event) => {
  // Enter is pressed
  if (event.keyCode == 13) { 
    send_message(); 
  }
}, false);

// create connection
let socket = new WebSocket("ws://localhost:8000/chat/");

// receive message from server
socket.onmessage = (msg) => {
  // console.log(msg.data);
  // console.log(msg.data.message);
  console.log(JSON.parse(msg.data));
  recv = JSON.parse(msg.data);
  // console.log(JSON.parse(recv.message));
  // recvInner = JSON.parse(recv.message);
  let chat = document.getElementById('chatbox');
  let para = document.createElement('P');
  let text = document.createTextNode(recv.username + ": "  + recv.message);
  // let text = document.createTextNode(recvInner.username + ": "  + recvInner.message);

  // add the child nodes to chatbox
  para.appendChild(text); 
  chat.appendChild(para);

  // scroll to bottom of chatbox when new msg appears
  let chatboxscroll = $('#chatbox');
  chatboxscroll.animate({ scrollTop: chatboxscroll.prop('scrollHeight')}, 1000);
}

// socket is open
socket.onopen = () => {
  console.log('CONNECTED');
}

if (socket.readyState == WebSocket.OPEN) {
  socket.onopen();
}

// send message to server
function send_message() {
  let message = document.getElementById('message');
  data = {
    "username": "user1",
    "message": message.value,
  }
  // socket.send(message.value);
  // console.log(JSON.stringify(data));
  socket.send(JSON.stringify(data));

  // socket.send(message.value);
  // clear message
  message.value = "";
}

// Draggable.create("#box", {type:"x,y", edgeResistance:0.65, bounds:"#square", throwProps:true});
function printSomething() {
  console.log("clicked!");
}
Draggable.create("#box");
// Draggable.create("#box", {bounds:"#square"});

// var box = document.getElementById("box"); //or use jQuery's $("#photo")
// TweenLite.to(box, 1.5, {width:100});

// window.onload = addListeners;

// function addListeners(){
//   document.getElementById('box').addEventListener('mousedown', mouseDown, false);
//   window.addEventListener('mouseup', mouseUp, false);

// }

// function mouseUp()
// {
//   window.removeEventListener('mousemove', divMove, true);
// }

// function mouseDown(e){
//   window.addEventListener('mousemove', divMove, true);
// }

// function divMove(e){
//   let div = document.getElementById('box');
//   div.style.position = 'absolute';
//   div.style.top = e.clientY + 'px';
//   div.style.left = e.clientX + 'px';
// }​