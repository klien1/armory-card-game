
let current_player_deck = [];
let current_player_discard = [];
let current_player_number;
let current_player;
let current_hero;
let turn_player;
let current_tile;
let hand_size = 0;

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
            // bottom left
            start_position = $('#tile-60').offset();
            current_tile = "#tile-60";
            update_board('#tile-60');
          }
          else if (current_player_number === 2) {
            // bottom right
            start_position = $('#tile-00').offset();
            current_tile = "#tile-00";
            update_board('#tile-00');
          }
          // p3 and p4 not fully implemented
          else if (current_player_number === 3) {
            // top left
            start_position = $('#tile-04').offset();
          }
          else {
            // top right
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

    //add draw function to replace this later
    hand_size = 5;
    for (let card_slot = 1; card_slot <= hand_size; card_slot++) {
      random_card_object = random_card(current_player_deck);
      $('#hand-slot-' + card_slot).attr('src', '/media_files/' + random_card_object.image);
      // add json object to card slot for card logic
      $('#hand-slot-' + card_slot).data('card-info', random_card_object);
    }

    // has to be turn_player_1 here becuase not passing in current turn player during initialization
    $('#turn_player_1').addClass('success');
  } // end if action.initialize_deck


  if (action.player_stats !== undefined) {
    let players_info = JSON.parse(action.player_stats)
    $('#player-stats-body').empty();
    players_info.forEach((player) => {
      $('#player-stats-body').append(
        "<tr id='turn_player_" + player.fields.player_number + "'>" +
          "<th scope='row'>" + player.fields.username + " </th>" +
          "<td>" + player.fields.hero_class + "</td>" +
          "<td id='" + current_player + "-health'>" + player.fields.health + "</td>" +
          "<td id='" + current_player + "-armor'>" + player.fields.armor + "</td>" +
          "<td id='" + current_player + "-attack_damage'>" + player.fields.attack_damage + "</td>" +
          "<td id='" + current_player + "-attack_range'>" + player.fields.attack_range + "</td>" +
        "</tr>"
      );
      if (player.fields.turn_player) {
        $('#turn_player_' + player.fields.player_number).addClass('success');
      }
    });
    // $('#turn_player_1').addClass('success');
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
    console.log(action.alter_player_stats);
    stat = $('#' + action.alter_player_stats.target + '-' + action.alter_player_stats.stat_to_modify);
    stat.html(parseInt(stat.html()) + action.alter_player_stats.stat_to_modify_amount);
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
    target_tile_src = $(this).attr('src').length;
 
    if ((current_player == turn_player || target_tile == current_tile) && target_tile_src < 1) {
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



  /*
  **  CARD IMPLEMENTATION AND CARD LOGIC
  **  
  */

  // playable from hand targets ability, ultimate, and 5 randomly generated cards
  // can't use anon function for 'this'
  $('.playable-from-hand').on('click', function () {
    if (current_player === turn_player) { // only allow actions for turn player
      card = $(this).data('card-info'); // card obj attached to html

      if (card.name === 'Take Aim' && !($(this).hasClass('active-card'))) {
        $(this).addClass('active-card'); // prevents abilities from being played more than once per turn
        let take_aim_value = 1;
        let update_player_stats = {
          'alter_player_stats': {
            'target': current_player,
            'stat_to_modify': 'attack_damage',
            'stat_to_modify_amount': take_aim_value,
            'modification': 'add',
            'until_end_of_turn': true
          }
        };
        socket.send(JSON.stringify(update_player_stats));
      }

    //   if (card.name === "Shortbow") {
    //     // console.log("dmg + 2");
    //   }

    //   // need to add revert stats at end of turn
    //   if (card.name === "Take Aim" && !($(this).hasClass('active-card'))) {
    //     $(this).addClass('active-card'); // prevents abilities from being played over and over


    //     // console.log("+1 dmg until end of turn");
    //     // send update player_stats {}
    //     // send current hero
    //     // send which stat to change
    //     // send how to change +/-
    //     // sned how much to change

    //     // figure out a way to handle end of turn abilities
    //     // database stats name
    //     //    player_stats
    //     //        health 
    //     //        armor 
    //     //        attack_damage 
    //     //        attack_range 
    //     let dmg = parseInt($('#'+current_player+'-attack_damage').html()) + 1;
    //     let update_player_stats = {
    //       'update_player_stats': {
    //         'target': current_player,
    //         // 'health':
    //         // 'armor':=1
    //         'attack_damage': dmg,
    //         'until_end_of_turn': true,
    //         'modification': 'add',
    //         // 'attack_range':
    //       }
    //     };
    //     socket.send(JSON.stringify(update_player_stats));
    //   } // end take aim

    //   // deactivate after use
    //   // need to add revert stats at end of turn

    //   /* How should i implement until end of turn stats */
    //   // maybe don't update database with the data
    //   // maybe send original stats with updated stats
    //   //    would have to add more fields in the models, don't want to do that.
    //   // only send temp stats to players and keep the stats in the database unmodified
    //   // do calc on current stats
    //   if (card.name === "Snipe" && !($(this).hasClass('cannot-be-used-card'))) {
    //     $(this).addClass('cannot-be-used-card');
    //     let dmg = parseInt($('#'+current_player+'-attack_range').html()) 
    //       * 2 + parseInt($('#'+current_player+'-attack_damage').html());
    //     let update_player_stats = {
    //       'update_player_stats': {
    //         'target': current_player,
    //         'attack_damage': dmg,
    //         'until_end_of_turn': true,
    //         'modification': 'add',
    //       }
    //     };
    //     socket.send(JSON.stringify(update_player_stats));
    //   } // end snipe
    } // end if current_player == turn_player
  });
});