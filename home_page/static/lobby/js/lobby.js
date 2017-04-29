document.getElementById("message").addEventListener("keydown", (event) => {
  // Enter is pressed
  if (event.keyCode == 13) { 
    send_message(); 
  }
}, false);

// create connection
let socket = new WebSocket("ws://" + window.location.host + "/lobby/");


// receive message from server
socket.onmessage = (msg) => {
  let recv = JSON.parse(msg.data);

  if (recv.invite !== undefined) {
    console.log("Hi! " + recv.invite.to + ". You have been invited to play with " + recv.invite.from);
  }

  if (recv.alert !== undefined) {
    alert(recv.alert);
  }

  if (recv.game_rooms !== undefined) {
    $("#game_list").empty();
    recv.game_rooms.forEach((room_name) => {
        $("#game_list").append("<li class='list-group-item'>" + room_name + 
          "<a class='badge badge-default badge-pill'" + 
          "onclick='check_room(\"" + room_name + "\")'>Join Game</a>" + 
          "</li>"
        );
    });
  }

  if (recv.chat !== undefined && recv.chat.message.length !== 0) {
    $("#chatbox").append(
      "<p><strong>" + recv.chat.username + "</strong>: "  + recv.chat.message + "</p>"
    );
    $("#chatbox").animate({ 
      scrollTop: $("#chatbox").prop("scrollHeight")
    }, 1000);
  }

  if (recv.user_logging !== undefined) {
    // clear user list
    $("#user_list").empty(); 
    recv.user_logging.forEach((users) => {
        $("#user_list").append("<li class='list-group-item'>" + 
          users + 
          "<a class='badge badge-default badge-pill' onclick='print(\"" + users + "\", this)'>Invite</a>" + 
          "</li>");
    });
  }

  // if (recv.user_logging_out !== undefined) {
    // console.log(recv.user_logging_out);
    // let user = "#user::" + recv.user_logging_out;
    // console.log($(user).text());
    // $("#user::" + recv.user_logging_out).remove();
    // child = document.getElementById('#user::'+recv.user_logging_out);
    // parent = document.getElementById('user_list');
    // parent.removeChild(child);
  // }

  if (recv.room_path !== undefined) {
    window.location.href = "http://" + window.location.host + recv.room_path;
  }
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
  if (message.value != "") {   
    data = {
      "message": message.value,
    }
    socket.send(JSON.stringify(data));

    // clear message
    message.value = "";
  }
}

let inviteCount = 0;
function print(target_user, inviteMsg) {
  // if ($("#game_list>li").attr('id') === "join::dfsdf") {
  // if ($("#user_list>li").attr('id') === "user::kevin") {
  //   console.log("match found!");
  // }
  if (inviteMsg.innerHTML === "Inviting...") {
    console.log("Canceled invite to " + target_user);
    inviteMsg.innerHTML = "Invite";
    inviteCount--;
  }
  else if (inviteCount < 1) {
    console.log("Inviting " + target_user + " to a game.");
    inviteMsg.innerHTML = "Inviting...";
    inviteCount++;

    data = {
      "to": target_user,
    }
    socket.send(JSON.stringify(data));
  }
  else {
    console.log("Already invited someone");
  }
}

function check_room(room_name) {
  console.log(room_name);
  data = {
    "join_game": room_name,
  }
  socket.send(JSON.stringify(data));
}