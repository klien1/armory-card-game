
let current_player_deck = [];
let current_player_discard = [];
let current_player_number;

let socket = new WebSocket("ws://" + window.location.host + window.location.pathname);


socket.onmessage = (msg) => {
  // console.log(JSON.parse(msg.data));
  let action = JSON.parse(msg.data);

  if (action.redirect !== undefined) {
    window.location.href = "http://" + window.location.host + action.redirect;
  }

  if (action.player_number !== undefined) {
    console.log(action.player_number);
    current_player_number = parseInt(action.player_number);
  }

  if (action.initialize_deck !== undefined) {
    let cards = JSON.parse(action.initialize_deck);
    cards.forEach((card) => {
      // console.log(card.fields);
      for (let i = 0; i < card.fields.copies; i++) {
        if (card.fields.card_type === "Hero") { // needs to start on board change later
          let start_position;
          // console.log('initialize ', current_player_number);
          if (current_player_number === 1) {
            start_position = $('#tile-60').offset();
          }
          else if (current_player_number === 2) {
            start_position = $('#tile-00').offset();
          }
          else if (current_player_number === 3) {
            start_position = $('#tile-04').offset();
          }
          else {
            start_position = $('#tile-64').offset();
          }
          $('#current-hero').css({top: start_position.top, left: start_position.left});
          $('#current-hero').attr('src', '/media_files/' + card.fields.image);
          $('#current-hero').attr('alt', card.fields.name);
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
          current_player_deck.push(card.fields);
        }
      }
    });
    let hand_size = 8;
    for (let card_slot = 4; card_slot <= hand_size; card_slot++) {
      $('#hand-slot-' + card_slot).attr('src', '/media_files/' + random_card(current_player_deck).image);
    }
  } // end if action.initialize_deck


  if (action.player_stats !== undefined) {
    let players_info = JSON.parse(action.player_stats)
    $('#player-stats-body').empty();
    players_info.forEach((player) => {
      // console.log(player.fields);
      $('#player-stats-body').append(
        "<tr>" +
          "<th scope='row'>" + player.fields.username + " </th>" +
          "<td>" + player.fields.hero_class + "</td>" +
          "<td>" + player.fields.health + "</td>" +
          "<td>" + player.fields.armor + "</td>" +
          "<td>" + player.fields.attack_damage + "</td>" +
          "<td>" + player.fields.attack_range + "</td>" +
        "</tr>"
      )
    });
  } // end if action.player_stats


  if (action.update_board !== undefined) {
    // update board needs current player number
    // if current_player_number == js current player number, ignore move
    // else update img src to player and that player image.src and remove previous position src
    // add/rm p#-occupied class
    // which player number moved
    // where that player number moved
  }

}


// gets random index from deck array and moves it to discard array
// return the removed element (card object)
function random_card(array) {
  // if deck is empty reshuffle discard into deck and empty discard
  if (array.length === 0) {
    current_player_deck = current_player_discard;
    current_player_discard = [];
  }

  let index = Math.floor(Math.random() * array.length);
  // this creates an array of size 1, so need to get index 0
  let card = array.splice(index, 1)[0];
  current_player_discard.push(card);
  return card;

}

// document.ready shorthand
$(() => {
  $('.start-class').on('click', (picked) => {
    let data = {
      'picked-starter-class': picked.target.id
    }
    socket.send(JSON.stringify(data));

    // console.log(picked.target.id);
    $("#board").show();
    $("#stats").show();
    $("#current-hero").show();
    $("#pick-class").hide();
  });

$('.movable-card').draggable({
    containment: 'window',
    revert: true
  });

  $('.board-tile').droppable({
    accept: allowedTarget,
    drop: onTarget,
    out: offTarget,
    tolerance: 'pointer'
  });

  function allowedTarget(target) {

    // console.log(target)
    // console.log($(this).attr('id'));
    // if (ui.draggable)
    return true;
  }

  function onTarget(event, ui) {
    // console.log("UI ", ui);
    // console.log($(this));
    console.log($(this).attr('id')); // gets id of droppable
    ui.draggable.position({ 
      of: $(this), // current successful droppable
      my: 'left top', 
      at: 'left top' 
    });
    ui.draggable.draggable('option', 'revert', false);
  }

  function offTarget(event, ui) {
    // console.log('offTarget ',$(this).attr('id'));
    // remove class player#-occupied or username
    ui.draggable.draggable('option', 'revert', true);
  }
});