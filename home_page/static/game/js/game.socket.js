
current_player_deck = [];
current_player_discard = [];

let socket = new WebSocket("ws://" + window.location.host + window.location.pathname);
// socket.onopen = () => {
// }


socket.onmessage = (msg) => {
  // console.log(JSON.parse(msg.data));
  action = JSON.parse(msg.data);

  if (action.redirect !== undefined) {
    window.location.href = "http://" + window.location.host + action.redirect;
  }

  if (action.initialize_deck !== undefined) {
    cards = JSON.parse(action.initialize_deck);
    cards.forEach((card) => {
      // console.log(card.fields);
      for (let i = 0; i < card.fields.copies; i++) {
        if (card.fields.card_type === "Hero") { // needs to start on board change later
          $('#p1-start').attr('src', '/media_files/' + card.fields.image);
          $('#p1-start').attr('alt', card.fields.name);
          $('#p1-start').addClass('card');
        }
        else if (card.fields.card_type === "Ability") {
          $('#ability-slot').attr('src', '/media_files/' + card.fields.image);
          $('#ability-slot').attr('alt', card.fields.name);
        }
        else if (card.fields.card_type === "Ultimate") {
          $('#ultimate-slot').attr('src', '/media_files/' + card.fields.image);
          $('#ultimate-slot').attr('alt', card.fields.name);
        }
        else { 
          current_player_deck.push(card.fields.image);
        }
      }
    });
    hand_size = 8;
    for (let card_slot = 4; card_slot <= hand_size; card_slot++) {
      // $('#hand-slot-' + card_slot).attr('src', '/media_files/' + current_player_deck[card_slot]);
      $('#hand-slot-' + card_slot).attr('src', '/media_files/' + random_card(current_player_deck));
    }
    // console.log(current_player_deck);
  } // end if action.initialize_deck
}

// if (socket.readyState == WebSocket.OPEN) {
//   socket.onopen();
// }

// gets random index from deck array and moves it to discard array
// return the remove element
function random_card(array) {
  // if deck is empty reshuffle discard into deck and empty discard
  if (array.length === 0) {
    current_player_deck = current_player_discard;
    current_player_discard = [];
  }

  let index = Math.floor(Math.random() * array.length);
  // console.log(index);
  let card = array.splice(index, 1);
  // console.log(card);
  current_player_discard.push(card);
  return card;

}

// document.ready shorthand
$(() => {
  $('.start-class').on('click', (picked) => {
    data = {
      'picked-starter-class': picked.target.id
    }
    socket.send(JSON.stringify(data));

    // console.log(picked.target.id);
    $("#board").show();
    $("#stats").show();
    $('#pick-class').hide();
  });
});