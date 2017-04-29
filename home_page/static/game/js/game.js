// document.ready()
$(() => {
  // create super image on mouse over
  $('.card').on('mouseenter', (currentImg) => {
    let localpath = currentImg.target.src;
    let index = localpath.search('/static/');
    let path = localpath.substr(index);

    $('#supersize').attr('src', path);
    $('#supersize').css('visibility', 'visible');
  });

  // delete super image
  $('.card').on('mouseleave', () => {
    // $('#supersize').attr('src', '');
    $('#supersize').css('visibility', 'hidden');
      // $('#supersize').remove();
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
    tolerance: 'pointer'
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

  // console.log(document.getElementById('mage').clientWidth);
  // console.log(document.getElementById('mage').clientHeight);
});