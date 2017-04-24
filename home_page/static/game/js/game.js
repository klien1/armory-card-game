//see http://www.greensock.com/draggable/ for more details.
$(".movable-card").draggable({
  // snap: "#front-zone"
  snap: ".main-front",
  revert: true
});

//draggable
//droppable
// $(".movable-card").draggable({
  // helper: 'original,'
// });

// var droppables = $(".movable-card");
// var dropArea = $("#front-zone");

//the overlapThreshold can be a percentage ("50%", for example, would only trigger when 
//50% or more of the surface area of either element overlaps) or 
//a number of pixels (20 would only trigger when 20 pixels or more overlap), 
//or 0 will trigger when any part of the two elements overlap.
// var overlapThreshold = "50%";

// Draggable.create(droppables, {
//   bounds: window,
//   onDrag: function(e) {
//     if (this.hitTest(dropArea, overlapThreshold)) {
//       $(this.target).addClass("valid");
//     } else {
//       $(this.target).removeClass("valid");
//     }
//   },
//   onDragEnd: function(e) {
//     //instead of doing hitTest again, just see if it has the highligh class.
//     if (!$(this.target).hasClass("valid")) {
//       //if there isn't a highlight, send it back to starting position
//       TweenLite.to(this.target, 0.2, {
//         x: 0,
//         y: 0
//       });
//     } else {
//       console.log("placed correctly!");
//       console.log(this.target);
//       $(this.target).removeClass("movable-card");
//     }

//   }
// });

function display(pic) {
  
  // console.log(image);
  // console.log(image.src);

  let image = document.createElement(pic.src);
  document.body.appendChild(image);
}

// $('img').hover(function() {
//     $(this).width('20%').height('20%');
// }, function() {
//     $(this).width('7%').height('7%');
// });

// $('img').on("mouseenter", () => {
//     console.log(this);
// });

// $('img').on("mouseleave", function() {
//     console.log("end");
// });