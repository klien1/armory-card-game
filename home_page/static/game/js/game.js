// document.ready()
$(() => {
  // show super image on mouse over
  $(document.body).on('mouseenter', '.card', (currentImg) => {
    let localpath = currentImg.target.src;
    if (localpath.search('cards/') > 0) {
      $('#supersize').attr('src', localpath);
      $('#supersize').css('visibility', 'visible');
    }
  });

  // hide super image
  $(document.body).on('mouseleave', '.card', () => {
    $('#supersize').css('visibility', 'hidden');
  });


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
});