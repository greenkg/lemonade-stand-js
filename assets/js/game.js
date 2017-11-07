$(document).ready(function() {

  var ITEMS = {
    "lemons": {
      "qty": 1,
      "price": 1
    },
    "sugar": {
      "qty": 6,
      "price": 3
    },
    "ice": {
      "qty": 10,
      "price": 2
    },
    "cups": {
      "qty": 20,
      "price": 4
    }
  };

  var DAYPROGRESS = [
    "floralwhite",
    "lemonchiffon",
    "lightpink",
    "lightcyan",
    "lavender",
    "lightblue",
    "lightskyblue",
    "lightseagreen",
    "lightslategray"
  ];

  var inventory = {
    "money": 0,
    "pitchers": 0,
    "lemons": 0,
    "sugar": 0,
    "ice": 0,
    "cups": 0
  };

  var recipe = {
    "lemons": 6,
    "sugar": 1,
    "ice": 5
  };

  var screen;
  var price = 2;
  var message = "Oh, hello.";
  var day = 0;

  $( "body" ).on("click", "#start-button", function() {
    $( "#introduction" ).html( $( "#intro1").html() );
    screen = $( "#introduction-screen" ).html();
    drawGame();
  });

  $( "body" ).on("click", "#next-button", function() {
    if ( $( "#introduction" ).html() == $( "#intro1").html() ) {
      $( "#introduction" ).html( $( "#intro2").html() );
    } else if ( $( "#introduction" ).html() == $( "#intro2").html() ) {
      screen = $( "#play-screen" ).html()
      drawGame();
    };    
  });

  $( "body" ).on("click", ".buyable", function(e) {
    var thisItem = e.target.id;
    buyItem(thisItem, ITEMS[thisItem]["qty"], ITEMS[thisItem]["price"]);
  });

  $( "body" ).on("click", "#pitchers", function(e) {
    makeLemonade(recipe);
  });

  $( "body" ).on("click", "#start-day", function(e) {
    startDay();
  });

  // Open and close the options menu

  $( "body" ).on("click", "#options-open", function(e) {
    $( "#options-screen" ).fadeIn(300, function() {
      $( ".option" ).fadeIn({queue: false, duration: 600});
      $( "#change-recipe" ).animate({left: '-=100px', top: '+=50px'}, 300);
      $( "#buy-advertising" ).animate({left: '-=0px', top: '+=100px'}, 300);
      $( "#set-price" ).animate({left: '+=100px', top: '+=50px'}, 300);
    });
  });

  $( "body" ).on("click", "#options-close", function(e) {
    $( "#options-screen" ).fadeOut();
    $( ".option" ).fadeOut( function() {
      $( ".option" ).css( {top: 250, left: 150} );
    })
  });

  // Open the individual options

  $( "body" ).on("click", "#set-price", function() {
    $( "#set-price" ).animate({left: '-=200px', top: '-=250px', height: "300px", width: "300px", borderRadius: "150px"}, 300);

  });

  function startGame(money, pitchers, lemons, sugar, ice, cups) {
    screen = $( "#start-screen" ).html()
    drawGame();
    var keys = Object.keys(inventory);
    for (i = 0; i < keys.length; i++) {
      inventory[keys[i]] = arguments[i];
    };
    drawItems();
    drawInfo();
  };

  function drawGame() {
    $( "#game" ).html(screen);
  };

  function drawInfo() {
    drawMessage();
    drawDay();
  }

  function drawMessage() {
    $( "#message" ).html(message);
  }

  function drawDay() {
    $( "#day-num" ).html( "Day " + day);
  }

  function drawItem(item) {
    var element = "#" + item;
    $( element ).html(inventory[item]);
  };

  function drawItems() {
    var keys = Object.keys(inventory);
    for (i = 0; i < keys.length; i++) {
      drawItem(keys[i]);
    };
  };

  function buyItem(item, qty, price) {
    if ( inventory["money"] >= price ) {
      inventory[item] += qty;
      inventory["money"] -= price;
      drawItem(item);
      drawItem("money");
      message = "You bought " + qty + " " + item + " for $" + ( price ) + "."
    } else {
      message = "Oops! You don't have enough money to buy that."
    }
    drawInfo();    
  };

  function makeLemonade(recipe) {
    var keys = Object.keys(recipe);

    var enough = true;
    var errors = [];

    for (i = 0; i < keys.length; i++) {
      if (inventory[keys[i]] < recipe[keys[i]]) {
        errors.push(keys[i]);
        enough = false;
      };
    };
    if ( enough === true) {
      for (i = 0; i < keys.length; i++) {
        inventory[keys[i]] -= recipe[keys[i]];
      };
      inventory["pitchers"]++;
      drawItems();
      message = "Great! You made a pitcher of lemonade."
      drawInfo();
    } else {
      message = ("Oops! You don't have enough " + errors.slice(0, errors.length).join(' or ') + " to make lemonade.");
      drawInfo();
    };
  };

  function startDay() {
    var customers = Math.floor(Math.random() * (10));
    customers = Math.min(customers, inventory["cups"], inventory["pitchers"]*10 );
    animateDay(customers);
  };

  function sellLemonade(customers) {
    inventory["cups"] -= customers;
    inventory["pitchers"] -= Math.ceil(customers/10);
    inventory["money"] += customers * price;
    drawItems();
  };

  function animateDay(customers) {
    var hour = 0;
    message = "Day in progress"
    day ++;
    drawInfo();
    drawInfo();
    function intervalFired() {
      hour++;
      if (hour <= 8) {
        message = "Day in progress. Hour is " + hour;
        $( "#info" ).css("background-color", DAYPROGRESS[hour]);
        drawInfo();
      } else {
        message = "Day is done. You sold " + customers + " cups of lemonade.";
        $( "#info" ).css("background-color", "yellow");
        sellLemonade(customers);
        drawInfo();
        clearInterval(interval);        
      }
    }
    var interval = setInterval(intervalFired, 300);
  };

  startGame(100, 0, 0, 0, 0, 0);

});