
let current_player_deck = [];
let current_player_discard = [];
let current_player_number;
let current_start_class;
let current_player;
let current_hero;
let turn_player;
let current_tile;
let current_tile_number;
let top_tile;
let bottom_tile;
let left_tile;
let right_tile;
let hand_size = 0;
let card_count = 0;
let take_aim_augments = 0;
let max_movement = 1;

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

  // reminder update game room status
  if (action.all_players_ready !== undefined) {
    $("#board").show();
    $("#stats").show();
    $("#current-hero").show();
    $("#game-title-outside-container").show();
    $("#pick-class").hide();
    $("#pick-class-header").hide();
    $("#user-waiting-div").hide();
    $("#game-room-user-ready").hide();

    let start_position;
    if (current_player_number === 1) {
      // bottom left
      start_position = $('#tile-60').offset();
      current_tile = "#tile-60";
      current_tile_number = "60";
    }
    else if (current_player_number === 2) {
      // bottom right
      start_position = $('#tile-00').offset();
      current_tile = "#tile-00";
      current_tile_number = "00";
    }
    else if (current_player_number === 3) {
      // top left
      start_position = $('#tile-04').offset();
      current_tile = "#tile-04";
      current_tile_number = "04";
    }
    else {
      // top right
      start_position = $('#tile-64').offset();
      current_tile = "#tile-64";
      current_tile_number = "64";
    }
    $('#current-hero').css({
      top: start_position.top, 
      left: start_position.left,
      border: '2px solid green'
    });
    calculate_adjacent_tiles(current_tile_number);
    update_board(current_tile);
  }


  if (action.initialize_deck !== undefined) {
    current_player_deck = [];
    let cards = JSON.parse(action.initialize_deck);
    cards.forEach((card) => {
      for (let i = 0; i < card.fields.copies; i++) {
        if (card.fields.card_type === "Hero") { // needs to start on board change later
          current_hero = card.fields.name;

          $('#current-hero').attr('src', '/media_files/' + card.fields.image);
          $('#current-hero').attr('alt', card.fields.name);
          $('#current-hero').attr('alt', card.fields.name);
        }
        else if (card.fields.card_type === "Ability") {
          $('#ability-slot').attr('src', '/media_files/' + card.fields.image);
          $('#ability-slot').attr('alt', card.fields.name);
          $('#ability-slot').data('card-info', card.fields);
        }
        else if (card.fields.card_type === "Ultimate") {
          $('#ultimate-slot').attr('src', '/media_files/' + card.fields.image);
          $('#ultimate-slot').attr('alt', card.fields.name);
          $('#ultimate-slot').data('card-info', card.fields);
        }
        else { 
          current_player_deck.push(card.fields);
        }
      }
    });

    // draw_card passes in max_hand_size
    hand_size = 0;
    $("#random-cards-drawn").empty();
    draw_card(5);

  } // end if action.initialize_deck


  if (action.player_stats !== undefined) {
    let players_info = JSON.parse(action.player_stats)
    $('#player-stats-body').empty();
    players_info.forEach((player) => {
      $('#player-stats-body').append(
        "<tr id='turn_player_" + player.fields.player_number + "'>" +
          "<th scope='row'>" + player.fields.username + " </th>" +
          "<td>" + player.fields.hero_class + "</td>" +
          "<td id='" + player.fields.username + "-health'>" + player.fields.health + "</td>" +
          "<td id='" + player.fields.username + "-armor'>" + player.fields.armor + "</td>" +
          "<td id='" + player.fields.username + "-attack_damage'>" + player.fields.attack_damage + "</td>" +
          "<td id='" + player.fields.username + "-attack_range'>" + player.fields.attack_range + "</td>" +
        "</tr>"
      );
      if (player.fields.turn_player) {
        $('#turn_player_' + player.fields.player_number).addClass('success');
      }
    });
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
      $(action.update_board.new_position).attr('src', action.update_board.image_path);
    }
  }

  // need separate block for changing turn player because players can end turn
  // without modifying stats
  if (action.turn_player !== undefined) {
    turn_player = action.turn_player.username;

    // if prev player not passed then prev player left game
    if (action.turn_player.prev_player_number !== undefined) {
      $('#turn_player_' + action.turn_player.prev_player_number).removeClass('success');
    }
    $('#turn_player_' + action.turn_player.player_number).addClass('success');

    if (turn_player == current_player) {
      $('#end-turn-button').addClass('btn-success');
      $('#end-turn-button').removeClass('btn-info');
      $('#end-turn-button').attr('disabled', false);
    }
  }

  if (action.alter_player_stats !== undefined) {
    stat = $('#' + action.alter_player_stats.target + '-' + action.alter_player_stats.stat_to_modify);
    stat.html(parseInt(stat.html()) + action.alter_player_stats.stat_to_modify_amount);
  }

  if (action.player_waiting_room_status !== undefined) {
    let waiting_players = JSON.parse(action.player_waiting_room_status);
    $("#user-waiting-body").empty();
    waiting_players.forEach((player) => {
      if (player.fields.hero_class === undefined || player.fields.hero_class === null) {
        $("#user-waiting-body").append(
          "<tr>" +
            "<td>" + player.fields.username + "</td>" +
            "<td></td>" +
            "<td>" + player.fields.player_ready + "</td>" +
          "</tr>"
        );
      }
      else {        
        $("#user-waiting-body").append(
          "<tr>" +
            "<td>" + player.fields.username + "</td>" +
            "<td>" + player.fields.hero_class + "</td>" +
            "<td>" + player.fields.player_ready + "</td>" +
          "</tr>"
        );
      }
    });
  }

}


// gets random index from deck array and moves it to discard array
// return the removed element (card object)
function random_card() {
  // if deck is empty reshuffle discard into deck and empty discard
  if (current_player_deck.length === 0) {
    current_player_deck = current_player_discard;
    current_player_discard = [];
  }

  let index = Math.floor(Math.random() * current_player_deck.length);
  // this creates an array of size 1, so need to get index 0
  let card = current_player_deck.splice(index, 1)[0];
  return card;
}

function draw_card(max_hand_size) {
  while (hand_size < max_hand_size) {
    card_count++;
    hand_size++;
    let random_card_object = random_card();
    $('#random-cards-drawn').append(
      '<img class="card playable-from-hand" id="new-card-' + card_count + '" src="/media_files/' 
      + random_card_object.image + '" alt="">'
    );
    $('#new-card-' + card_count).data('card-info', random_card_object);
  }
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

// function called when ending turn
function change_player() {
  $('#end-turn-button').attr('disabled', true);
  $('#end-turn-button').removeClass('btn-success');
  $('#end-turn-button').addClass('btn-info');
  $('.active-card').removeClass('active-card');

  let data = {
    "change_player": {
      "turn_player": turn_player,
    },
    "refresh_stats": true
  }
  socket.send(JSON.stringify(data));
  draw_card(5);
  max_movement = 1;
}

function ready_character_selection() {
  if (current_start_class !== undefined) {  
    $("#game-room-ready-btn").hide();
    $("#game-room-cancel-btn").show();

    $('.start-class').off('click').off('mouseenter').off('mouseleave');

    let data = {
      'picked-starter-class': current_start_class,
      'ready-signal': current_start_class
    };
    socket.send(JSON.stringify(data));
  }
}

// need to add unready signal
function cancel_character_selection() {
  $("#game-room-cancel-btn").hide();
  $("#game-room-ready-btn").show();

  $('.start-class').on('mouseenter', function () {
    $(this).addClass('border-green');
  });

  $('.start-class').on('mouseleave', function () {
    $(this).removeClass('border-green');
  });
  $('.start-class').on('click', select_class);

  let data = {
    'not-ready-signal': current_start_class
  };
  socket.send(JSON.stringify(data));
}

function select_class() {
  $('.start-class').removeClass('border-blue');
  $('.start-class').on('mouseenter', function () {
    $(this).addClass('border-green');
  });

  $('.start-class').on('mouseleave', function () {
    $(this).removeClass('border-green');
  });

  $(this).off('mouseout').off('mouseenter');
  $(this).addClass('border-blue');
  current_start_class = $(this).attr('id');

  let data = {
    'update-player-selection': current_start_class
  };
  socket.send(JSON.stringify(data));
}

// cur_tile_num paramter is a string of 2 digit numbers
function calculate_adjacent_tiles(cur_tile_num) {

  let top = (parseInt(cur_tile_num) + 1).toString();
  if (top.length < 2) {
    top = "0" + top;
  }
  let bottom = (parseInt(cur_tile_num) - 1).toString();
  if (bottom.length < 2) {
    bottom = "0" + bottom;
  }
  let left = (parseInt(cur_tile_num) - 10).toString();
  if (left.length < 2) {
    left = "0" + left;
  }
  let right = (parseInt(cur_tile_num) + 10).toString();
  if (right.length < 2) {
    right = "0" + right;
  }

  top_tile = "#tile-" + top;
  bottom_tile = "#tile-" + bottom;
  left_tile = "#tile-" + left;
  right_tile = "#tile-" + right;

}

// document.ready shorthand
$(() => {

$('.start-class').on('click', select_class);

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
    target_tile = '#' + $(this).attr('id');
    target_tile_src = $(this).attr('src').length;
 
    // have to separate current tile from other logic or revert won't work
    if (current_player == turn_player && target_tile_src < 1 && max_movement > 0 &&
        (target_tile == top_tile || target_tile == bottom_tile || 
        target_tile == left_tile || target_tile == right_tile
      )) {
      return true;
    }
    else if (target_tile == current_tile) {
      return true;
    }
    return false;
  }

  function onTarget(event, ui) {
    // console.log($(this).attr('id')); // gets id of droppable

    // need to check to prevent unessessary updates if dropped on same zone
    if (current_tile !== "#"+$(this).attr('id')) {
      current_tile = "#"+$(this).attr('id');
      current_tile_number = current_tile.substr(current_tile.lastIndexOf("-") + 1);
      calculate_adjacent_tiles(current_tile_number);
      max_movement--;
      update_board(current_tile);
    }

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



  /*
  **  CARD IMPLEMENTATION AND CARD LOGIC
  **  
  */

  // playable from hand targets: ability, ultimate, and 5 randomly generated cards
  // can't use anon function for 'this'
  $(document.body).on('click', '.playable-from-hand', function () {
    card = $(this).data('card-info'); // card obj attached to html
    if (current_player === turn_player) { // only allow actions for turn player

  /*  
  ** ARCHER CARDS
  */
      // archer ability
      if (card.name === 'Take Aim' && !($(this).hasClass('active-card'))) {
        $(this).addClass('active-card'); // prevents abilities from being played more than once per turn
        let take_aim_value = 1 + take_aim_augments;
        let update_player_stats = {
          'alter_player_stats': {
            'target': current_player,
            'stat_to_modify': 'attack_damage',
            'stat_to_modify_amount': take_aim_value,
            'until_end_of_turn': true
          }
        };
        socket.send(JSON.stringify(update_player_stats));
      }
      // archer ultimate
      else if (card.name === 'Snipe') {
        let current_player_range = $('#' + current_player + '-attack_range').html();
        let snipe_value = 2 * parseInt(current_player_range);
        let update_player_stats = {
          'alter_player_stats': {
            'target': current_player,
            'stat_to_modify': 'attack_damage',
            'stat_to_modify_amount': snipe_value,
            'until_end_of_turn': true
          }
        };
        socket.send(JSON.stringify(update_player_stats));
        $(this).hide();
      }
      else if (card.name === 'Shortbow') {
        let shortbow_value = 2;
        let update_player_stats = {
          'alter_player_stats': {
            'target': current_player,
            'stat_to_modify': 'attack_damage',
            'stat_to_modify_amount': shortbow_value
          }
        };
        socket.send(JSON.stringify(update_player_stats));
        $('#current-player-buffs').append(
          '<img class="card player-buffs" src="/media_files/'+ card.image +'" alt="' + card.name + '">'
        );
      }
      else if (card.name === 'Longbow') {
        let longbow_value = 1;
        let update_player_stats = {
          'alter_player_stats': {
            'target': current_player,
            'stat_to_modify': 'attack_damage',
            'stat_to_modify_amount': longbow_value
          }
        };
        socket.send(JSON.stringify(update_player_stats));
        $('#current-player-buffs').append(
          '<img class="card player-buffs" src="/media_files/'+ card.image +'" alt="' + card.name + '">'
        );
      }
      else if (card.name === 'Load Up') {
        take_aim_augments += 1;
        $('#current-player-buffs').append(
          '<img class="card player-buffs" src="/media_files/'+ card.image +'" alt="' + card.name + '">'
        );
      }

      if (!(card.card_type === "Ability" || card.card_type === "Ultimate" || card.card_type === "Reaction")) {      
        $(this).remove();
        hand_size--;
        current_player_discard.push(card);
      }
    } // end if current_player == turn_player

    // reaction cards can be played when player isn't turn player
    if (card.card_type === "Reaction") {
      $(this).remove();
      hand_size--;
      current_player_discard.push(card);
    }
  });
});