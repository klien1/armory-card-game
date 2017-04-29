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

  function display(pic) {
    let image = document.createElement(pic.src);
    document.body.appendChild(image);
  }


  $('.movable-card').draggable({
    containment: 'window',
    revert: true
  });

  $('.main-front').droppable({
    accept: allowedTarget,
    drop: onTarget,
    out: offTarget,
  });

  function allowedTarget(target) {
    // console.log(target);
    // if (ui.draggable)
    return true;
  }

  function onTarget(event, ui) {
    console.log(ui);
    ui.draggable.position({ 
      of: $(this), 
      my: 'left top', 
      at: 'left top' 
    });
    ui.draggable.draggable('option', 'revert', false);
  }

  function offTarget(event, ui) {
    ui.draggable.draggable('option', 'revert', true);
  }

  $('.start-class').hover(
    //mouse enter
    function() { //can't use arrow functions for this
      $(this).addClass('border-green');
    },
    //mouse leave
    function() { //can't use arrow functions for this
      $(this).removeClass('border-green');
    }
  );

  $('.start-class').on('click', (picked) => {
    console.log(picked.target.id);
    $("#board").show();
    $('#pick-class').hide();
  });

});