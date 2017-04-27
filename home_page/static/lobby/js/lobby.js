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
  // if (recv.current_user !== undefined) {
  //   current_user = recv.current_user;
  // }

  if (recv.invite !== undefined) {
    alert("hi! " + recv.invite.to + " from " + recv.invite.from);
  }

  if (recv.game_rooms !== undefined) {
    $("#game_list").empty();
    recv.game_rooms.forEach((room_name) => {
        $("#game_list").append("<li class='list-group-item'>" + room_name + 
          // "<form>" + 
          "<a class='badge badge-default badge-pill'>Join Game</a>" + 
          // "</form>" + 
          "</li>"
        );
    });
  }

  // add append id and set id to username
  if (recv.chat !== undefined && recv.chat.message.length !== 0) {
    $("#chatbox").append(
      "<p><strong>" + recv.chat.username + "</strong>: "  + recv.chat.message + "</p>"
    );
    $("#chatbox").animate({ 
      scrollTop: $("#chatbox").prop("scrollHeight")
    }, 1000);
  }
  else if (recv.user_logging !== undefined) {
    // clear user list
    $("#user_list").empty(); 
    recv.user_logging.forEach((users) => {
        $("#user_list").append("<li class='list-group-item'>" + 
          users + 
          "<a class='badge badge-default badge-pill' onclick='print(\"" + users + "\", this)'>Poke</a>" + 
          "</li>");
    });
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
  if (inviteMsg.innerHTML === "Poking...") {
    console.log("Canceled invite to " + target_user);
    // inviteMsg.innerHTML = "Invite";
    inviteMsg.innerHTML = "Poke";
    inviteCount--;
  }
  else if (inviteCount < 1) {
    console.log("Inviting " + target_user + " to a game.");
    // inviteMsg.innerHTML = "Inviting...";
    inviteMsg.innerHTML = "Poking...";
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
