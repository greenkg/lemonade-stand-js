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

  $( "body" ).on("click", "#start-button", function() {
    screen = $( "#introduction-screen" ).html()
    drawGame();
  });

  $( "body" ).on("click", "#begin-button", function() {
    screen = $( "#play-screen" ).html()
    drawGame();
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
    $( "#info" ).html(message);
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
    inventory[item] += qty;
    inventory["money"] -= qty * price;
    drawItem(item);
    drawItem("money");
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
    } else {
      console.log("Not enough: ", errors);
    };
  };

  function startDay() {
    var customers = Math.floor(Math.random() * (10));
    customers = Math.min(customers, inventory["cups"], inventory["pitchers"]*10 );
    animateDay(customers);
    sellLemonade(customers);
  };

  function sellLemonade(customers) {
    inventory["cups"] -= customers;
    inventory["pitchers"] -= Math.ceil(customers/10);
    inventory["money"] += customers * price;
    $( "#info" ).html("Day in progress")
    drawItems();
  };

  function animateDay(customers) {
    var hour = 0;
    function intervalFired() {
      hour++;
      if (hour <= 8) {
        message = "Day in progress. Hour is " + hour;
        $( "#info" ).css("background-color", DAYPROGRESS[hour]);
        drawInfo();
      } else {
        message = "Day is done. You sold " + customers + " cups of lemonade.";
        $( "#info" ).css("background-color", "yellow");
        drawInfo();
        clearInterval(interval);
      }
    }
    var interval = setInterval(intervalFired, 300);
  };

  startGame(200, 5, 6, 7, 8, 60);

});