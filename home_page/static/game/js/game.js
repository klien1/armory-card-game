let socket = new WebSocket("ws://" + window.location.host + window.location.pathname); //need to add id here
socket.onopen = () => {
  // console.log('CONNECTED to GAME');

  // data = {
  //   "hello": "world!",
  // };
  // socket.send(JSON.stringify(data));
  // console.log(data);

}


socket.onmessage = (msg) => {
  console.log(JSON.parse(msg.data));
  action = JSON.parse(msg.data);

  if (action.redirect !== undefined) {
    // window.location.replace("http://" + window.location.host + action.redirect);
    window.location.href = "http://" + window.location.host + action.redirect;
  }
}

if (socket.readyState == WebSocket.OPEN) {
  socket.onopen();
}


function display(pic) {
  let image = document.createElement(pic.src);
  document.body.appendChild(image);
  // $("body").append("<img src=\'" + pic.src + "\'alt="supersize">");
}

// document.ready()
$(() => {
  // create super image on mouse over
  $('.card').on('mouseenter', (currentImg) => {
    let localpath = currentImg.target.src;
    let index = localpath.search('/static/');
    let path = localpath.substr(index);

    $('body').append("<img id='supersize' src='" + path + 
      "' style='width: 20%; height: 20%; float:right; margin-top:2em; margin-right:1em'" +
      " alt='superimage'>");
  });

  // delete super image
  $('.card').on('mouseleave', () => {
      $('#supersize').remove();
  });

  $('#front-zone').on('click', (test_function) => {
    // let localpath = currentImg.target.src;
    // let index = localpath.search("/static/");
    // let path = localpath.substr(index);
    console.log("hello");
    data = {
      "sending": "test data!",
    };
    socket.send(JSON.stringify(data));

  });


  $('.movable-card').draggable({
    // snap: "#front-zone"
    containment: 'window',
    // snap: '.main-front',
    revert: true
  });

  $('.main-front').droppable({
    drop: onTarget,
    out: offTarget,
  });

  function onTarget(event, ui) {
    console.log(ui);
    ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
    ui.draggable.draggable('option', 'revert', false);
  }

  function offTarget(event, ui) {
    ui.draggable.draggable('option', 'revert', true);
  }

  $('.start-class').on('click', (picked) => {
    console.log(picked.target.id);
    $("#board").show();
    $('#pick-class').hide();
  });

});