// document.ready()
$(() => {
  // show super image on mouse over
  $('.card').on('mouseenter', (currentImg) => {
    let localpath = currentImg.target.src;
    // console.log(localpath.search('media_files/'))
    if (localpath.search('cards/') > 0) {
      $('#supersize').attr('src', localpath);
      $('#supersize').css('visibility', 'visible');
    }
  });

  // hide super image
  $('.card').on('mouseleave', () => {
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