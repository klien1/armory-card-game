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
  // console.log(recv)
  // console.log(JSON.parse(recv.message));
  // recvInner = JSON.parse(recv.message);
  if (recv.chat !== undefined) {
    // console.log('in user and message')

    // chat = JSON.parse(recv.chat);
    // console.log(chat);

    $("#chatbox").append("<p>" + recv.chat.username + ": "  + recv.chat.message + "</p>")

    // let chat = document.getElementById('chatbox');
    // let para = document.createElement('P');
    // let text = document.createTextNode(recv.chat.username + ": "  + recv.chat.message);
    // let text = document.createTextNode(recvInner.username + ": "  + recvInner.message);

    // add the child nodes to chatbox
    // para.appendChild(text); 
    // chat.appendChild(para);

    // scroll to bottom of chatbox when new msg appears
    let chatboxscroll = $('#chatbox');
    chatboxscroll.animate({ scrollTop: chatboxscroll.prop('scrollHeight')}, 1000);
  }
  else if (recv.user_logging !== undefined) {
    $("#user_list").empty();
    recv.user_logging.forEach((users) => {
      // console.log(users)
      $("#user_list").append("<li>" + users + "</li>");
    });
    // $("#num_users_online").text("Number of Users Online: " + recv.num_users_online);
    // console.log(recv.user_logging);
  }
  // else if (recv.login !== undefined) {
  //   $("#user_list").append("<li>" + recv.login.user_just_logged_in + "</li>");
  //   console.log('logged in');
  // }
  // else if (recv.logout !== undefined) {
  //   console.log('logged out');
  // }

  // if (recv.login !== null && recv.user_online === true) {
  //   console.log('logged in')
  //   let user_list = document.getElementById('user_list');
  //   let li = document.createElement('LI');
  //   let text = document.createTextNode(recv.login);
  //   // let text = document.createTextNode(recvInner.username + ": "  + recvInner.message);

  //   // add the child nodes to chatbox
  //   li.appendChild(text); 
  //   user_list.appendChild(li);
  // }
  // else if (recv.login !== null && recv.user_online === false) {
  //   let user_list = document.getElementById('user_list');
  //   user_list.children.forEach((item) => {
  //     console.log(item)
  //   })
  // }
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
    // "username": "user1",
    "message": message.value,
  }
  // socket.send(message.value);
  // console.log(JSON.stringify(data));
  socket.send(JSON.stringify(data));

  // socket.send(message.value);
  // clear message
  message.value = "";
  console.log("message sent", data)
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