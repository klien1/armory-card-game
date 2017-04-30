
current_player_deck = [];

let socket = new WebSocket("ws://" + window.location.host + window.location.pathname); //need to add id here
socket.onopen = () => {
}


socket.onmessage = (msg) => {
  console.log(JSON.parse(msg.data));
  action = JSON.parse(msg.data);

  if (action.redirect !== undefined) {
    window.location.href = "http://" + window.location.host + action.redirect;
  }

  if (action.initialize_deck !== undefined) {
    console.log(action.initialize_deck);
    // add path to all cards that belong to certain deck
  }
}

if (socket.readyState == WebSocket.OPEN) {
  socket.onopen();
}

// document.ready shorthand
$(() => {
  $('.start-class').on('click', (picked) => {

    data = {
      'picked-starter-class': picked.target.id
    }

    socket.send(JSON.stringify(data));


    console.log(picked.target.id);
    $("#board").show();
    $("#stats").show();
    $('#pick-class').hide();
  });
});