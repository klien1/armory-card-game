
let current_player_deck = [];
let current_player_discard = [];
let current_player_number;
let current_player;
let current_hero;
let turn_player;
let current_tile;

let socket = new WebSocket("ws://" + window.location.host + window.location.pathname);


socket.onmessage = (msg) => {
  let action = JSON.parse(msg.data);

  if (action.redirect !== undefined) {
    window.location.href = "http://" + window.location.host + action.redirect;
  }

  if (action.player_number !== undefined) {
    current_player_number = parseInt(action.player_number);
  }

  if (action.player_name !== undefined) {
    current_player = action.player_name;
  }

  // NEED TO ADD INITIALIZATION TO BOARD FROM DATABASE FOR PLAYERS THAT JOIN THE GAME LATE
  if (action.initialize_deck !== undefined) {
    let cards = JSON.parse(action.initialize_deck);
    cards.forEach((card) => {
      for (let i = 0; i < card.fields.copies; i++) {
        if (card.fields.card_type === "Hero") { // needs to start on board change later
          current_hero = card.fields.name;
          let start_position;
          if (current_player_number === 1) {
            start_position = $('#tile-60').offset();
            current_tile = "#tile-60";
            update_board('#tile-60');
          }
          else if (current_player_number === 2) {
            start_position = $('#tile-00').offset();
            current_tile = "#tile-00";
            update_board('#tile-00');
          }
          else if (current_player_number === 3) {
            start_position = $('#tile-04').offset();
          }
          else {
            start_position = $('#tile-64').offset();
          }
          $('#current-hero').css({
            top: start_position.top, 
            left: start_position.left,
            border: '2px solid green'
          });
          $('#current-hero').attr('src', '/media_files/' + card.fields.image);
          $('#current-hero').attr('alt', card.fields.name);
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

    //add draw function to replace this later
    let hand_size = 8;
    for (let card_slot = 4; card_slot <= hand_size; card_slot++) {
      $('#hand-slot-' + card_slot).attr('src', '/media_files/' + random_card(current_player_deck).image);
    }

    $('#turn_player_1').addClass('success'); // have to intialize player one here
  } // end if action.initialize_deck


  if (action.player_stats !== undefined) {
    let players_info = JSON.parse(action.player_stats)
    $('#player-stats-body').empty();
    players_info.forEach((player) => {
      $('#player-stats-body').append(
        "<tr id='turn_player_" + player.fields.player_number + "'>" +
          "<th scope='row'>" + player.fields.username + " </th>" +
          "<td>" + player.fields.hero_class + "</td>" +
          "<td>" + player.fields.health + "</td>" +
          "<td>" + player.fields.armor + "</td>" +
          "<td>" + player.fields.attack_damage + "</td>" +
          "<td>" + player.fields.attack_range + "</td>" +
        "</tr>"
      )
    });
    $('#turn_player_1').addClass('success');
  } // end if action.player_stats

  if (action.boss_stats !== undefined) {
    //index 0 is boss object
    boss = JSON.parse(action.boss_stats)[0];
    $('#boss-stats-title').empty();
    $('#boss-stats-title').append(
      "<strong>" + boss.fields.hero_class + "</strong>"
    );

    $('#boss-stats-body').empty();
    $('#boss-stats-body').append(
      "<tr>" +
        "<td>" + boss.fields.hp + "</td>" +
        "<td>" + boss.fields.defense + "</td>" +
        "<td>" + boss.fields.attack_damage + "</td>" +
        "<td>" + boss.fields.attack_range + "</td>" +
      "</tr>"
    );
  }

  if (action.boss_position !== undefined) {
    $(action.boss_position.tile).attr('src', action.boss_position.boss_image_url);
  }


  if (action.update_board !== undefined) {
    if (current_player !== action.update_board.user) {
      // clear previous image
      $(action.update_board.prev_position).attr('src', '');
      $(action.update_board.new_position).attr('src', action.update_board.image_path)
    }
  }

  if (action.turn_player !== undefined) {
    turn_player = action.turn_player.username;
    $('#turn_player_' + action.turn_player.prev_player_number).removeClass('success');
    $('#turn_player_' + action.turn_player.player_number).addClass('success');

    if (turn_player == current_player) {
      $('#end-turn-button').addClass('btn-success');
      $('#end-turn-button').removeClass('btn-info');
      $("#end-turn-button").attr('disabled', false);
    }

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

function update_board(tile_id) {
  let data = {
    "update_board": {  
      "tile": tile_id,
      "hero_image": current_hero
    }
  }
  current_tile = tile_id;
  socket.send(JSON.stringify(data));
}

function change_player() {
  $('#end-turn-button').attr('disabled', true);
  $('#end-turn-button').removeClass('btn-success');
  $('#end-turn-button').addClass('btn-info');

  let data = {
    "change_player": {
      "turn_player": turn_player,
    }
  }
  socket.send(JSON.stringify(data));
}

// document.ready shorthand
$(() => {
  $('.start-class').on('click', (picked) => {
    let data = {
      'picked-starter-class': picked.target.id
    }
    socket.send(JSON.stringify(data));

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
    // need to check if target tile is the same as current or won't revert
    target_tile = "#" + $(this).attr('id');
    if (current_player == turn_player || target_tile == current_tile) {
      return true;
    }
    return false;
  }

  function onTarget(event, ui) {
    // console.log($(this).attr('id')); // gets id of droppable
    update_board("#"+$(this).attr('id'));
    ui.draggable.position({ 
      of: $(this), // current successful droppable
      my: 'left top', 
      at: 'left top' 
    });
    ui.draggable.draggable('option', 'revert', false);
  }

  function offTarget(event, ui) {
    ui.draggable.draggable('option', 'revert', true);
  }

  
});