$(document).ready(function() {

  var lemons, sugar, ice

  var screen

  $( "body" ).on("click", "#start-button", function() {
    screen = $( "#introduction-screen" ).html()
    drawGame();
  });

  $( "body" ).on("click", "#begin-button", function() {
    screen = $( "#play-screen" ).html()
    drawGame();
  });

  function startGame() {
    screen = $( "#start-screen" ).html()
    drawGame();
  }

  function drawGame() {
    $( "#game" ).html(screen);
  }

  startGame();

});