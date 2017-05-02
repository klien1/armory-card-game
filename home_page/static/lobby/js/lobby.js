

let game_room_list = [];
let inviteCount = 0;

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
  console.log(recv);

  if (recv.invite !== undefined) {
    $("#invite-game-room").empty();
    $("#create-game-room").hide();
    $("#invite-game-room").append(
      "<h3>Hi " + recv.invite.to + "! You have been invited to play with " + recv.invite.from + "</h3>" +
      "<button class='btn btn-primary' onclick='accept(\"" + 
        recv.invite.from + "\",\"" + recv.invite.room_name + "\")'>Accept</button>" +
      "<button class='btn btn-danger' onclick='reject(\"" + recv.invite.from + "\")'>Reject</button>");
    $("#invite-game-room").show();
    // console.log("Hi! " + recv.invite.to + ". You have been invited to play with " + recv.invite.from);
  }

  if (recv.redirect !== undefined) {
    window.location.href = "http://" + window.location.host + recv.redirect;
  }

  if (recv.alert !== undefined) {
    alert(recv.alert);
  }

  if (recv.rejected_invite !== undefined) {
    inviteCount = 0;
    $('#invite-modal-content').empty();
    $('#invite-modal-content').append('<h1>' + recv.rejected_invite + '</h1');
  }

  if (recv.game_rooms !== undefined) {
    $("#game_list").empty();
    game_room_list = [];
    recv.game_rooms.forEach((room_name) => {
        game_room_list.push(room_name);
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
          // "<a class='badge badge-default badge-pill' onclick='print(\"" + 
          // users + "\", this)' data-toggle='modal' data-target='#myModal'>Invite</a>" + 
          "<a class='badge badge-default badge-pill' onclick='modal_form(\"" + 
          users + "\")' data-toggle='modal' data-target='#myModal'>Invite</a>" + 
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
// socket.onopen = () => {
//   console.log('CONNECTED');
// }

// if (socket.readyState == WebSocket.OPEN) {
//   socket.onopen();
// }

// send message to server
function send_message() {
  let message = document.getElementById('message');
  if (message.value != "") {   
    let data = {
      "message": message.value,
    }
    socket.send(JSON.stringify(data));

    // clear message
    message.value = "";
  }
}

function modal_form(target_user) {
  $('#invite-modal-content').empty();
  $('#invite-modal-content').append(
    "<div class='modal-header'>Inviting " + target_user + " to a game." +
      "<button type='button' class='close' data-dismiss='modal' aria-label='Close'>" +
        "<span aria-hidden='true'>&times;</span>" +
      "</button>" +
    "</div>" +
    "<div class='modal-body'>" +
      "<input type='text' placeholder='Enter game room name' id='invite-gameroom-name'>" +
      "<p id='invite-gameroom-errormsg'></p>" +
    "</div>" +
    "<div class='modal-footer'>" +
      "<button type='button' class='btn btn-secondary' data-dismiss='modal'>Cancel</button>" +
      "<button class='btn btn-primary' onclick='check_invite_gameroom(\"" + target_user + "\")'>" +
        "Send Invite" + 
      "</button>" +
    "</div>"
  );

  $('#invite-gameroom-name').on('keydown', (event) => {
    if (event.keyCode == 13) { 
      check_invite_gameroom(target_user); 
    }
  });
}

function check_invite_gameroom(user) {
  game_room_name = document.getElementById('invite-gameroom-name').value;
  if (game_room_list.indexOf(game_room_name) >= 0) {
    // console.log('game room exists');
    $('#invite-gameroom-errormsg').html('Room name already exists.');
  }
  else if (game_room_name.length <= 0) {
    $('#invite-gameroom-errormsg').html('Please enter a unique room name.');
  }
  else {
    $('#invite-modal-content').empty();
    $('#invite-modal-content').append("<h1>Invite sent to " + user + ".</h1>");
    invite(user, game_room_name);
  }
}

function invite(target_user, game_room_name) {
  if (inviteCount < 1) {
    let data = {
      "invite_user": {
        "to": target_user,
        "room_name": game_room_name
      }
    }
    socket.send(JSON.stringify(data));
    inviteCount++;
  }
  else {
    alert('already invited someone');
    // console.log("Already invited someone");
  }
}

function check_room(room_name) {
  // console.log(room_name);
  let data = {
    "join_game": room_name,
  }
  socket.send(JSON.stringify(data));
}

//from_sender is a string of user that sent invite
function accept(from_sender, room_name) {
  let data = {
    "invitation_response": {
      "response": "accept",
      "sender": from_sender,
      "room_name": room_name
    }
  }
  $("#create-game-room").show();
  $("#invite-game-room").hide();

  socket.send(JSON.stringify(data));
}

function reject(from_sender) {
  let data = {
    "invitation_response": {
      "response": "reject",
      "sender": from_sender
    }
  }
  $("#create-game-room").show();
  $("#invite-game-room").hide();
  socket.send(JSON.stringify(data));
}