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

  var displayRecipe = {
    "lemons": 0,
    "sugar": 0,
    "ice": 0
  }

  var screen;
  var price = 2;
  var displayPrice;
  var marketing = 0;
  var displayMarketing;
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
    openOptionsMenu();
  });

  $( "body" ).on("click", "#options-close", function(e) {
    closeOptionsMenu();
  });

  // Open the individual options

  $( "body" ).on("click", ".option", function(e) {
    elementId = "#" + $(e.target).parent().attr("id");
    if ( elementId === "#set-price" || elementId === "#set-marketing" || elementId === "#change-recipe" ) {
      if ( $( elementId ).hasClass("clicked") === false ) {
        animateOption(elementId);
      }
    }
  });

  // Set behaviors for cancel and confirm buttons

  $( "body" ).on("click", ".cancel", function(e) {
      parentElementId = "#" + $(e.target).parents().eq(3).attr("id");
      e.stopPropagation();
      animatePriceReverse(parentElementId);
  });

  $( "body" ).on("click", ".confirm", function(e) {
      parentElementId = "#" + $(e.target).parents().eq(3).attr("id");
      e.stopPropagation();
      animatePriceReverse(parentElementId);
      confirmChanges(parentElementId);
      closeOptionsMenu();
  });

  // Update attributes based on changes in options menus

  $( "body" ).on("click", ".change-recipe", function(e) {
    clickedId = $( e.target ).attr("id");
    changeDisplayRecipe(clickedId)
  });

  $( "body" ).on("click", ".change-price", function(e) {
    clickedId = $( e.target ).attr("id");
    changeDisplayPrice(clickedId);
  });

  $( "body" ).on("click", ".change-marketing", function(e) {
    clickedId = $( e.target ).attr("id");
    console.log( $( e.target ).attr("id") );
    changeDisplayMarketing(clickedId);
  });

  function openOptionsMenu() {
    $( "#options-screen" ).fadeIn(300, function() {
      $( ".option" ).fadeIn({queue: false, duration: 600});
      $( "#change-recipe" ).animate({left: '-=100px', top: '+=50px'}, 300);
      $( "#set-marketing" ).animate({left: '-=0px', top: '+=100px'}, 300);
      $( "#set-price" ).animate({left: '+=100px', top: '+=50px'}, 300);
    });
  };

  function closeOptionsMenu() {
    $( "#options-screen" ).fadeOut();
    $( ".option" ).fadeOut( function() {
      $( ".option" ).css( {top: 250, left: 150} );
    });
  };

  function animateOption(elementId) {
    var xCoord, yCoord, displayElement
    if ( elementId === "#set-price" ) {
      xCoord = "-=172px";
      yCoord = "-=213px";
      setDisplayPrice();
      drawPrice();
      displayElement = "#price-screen"
    } else if ( elementId === "#set-marketing" ) {
      xCoord = "-=78px";
      yCoord = "-=265px";
      displayElement = "#marketing-screen";
      setDisplayMarketing();
      drawMarketing();
    } else if ( elementId === "#change-recipe" ) {
      xCoord = "+=26px";
      yCoord = "-=213px";
      displayElement = "#recipe-screen"
      setDisplayRecipe();
      drawRecipe();
    }

    $( elementId ).animate( {left: xCoord, top: yCoord, height: "257px", width: "257px", borderRadius: "153px"}, 300);    
    $( elementId ).addClass("clicked");
    $( elementId ).children().css( {height: "257px", width: "257px"} ).html( $( displayElement ).html() );
    $( elementId ).siblings().fadeOut();
    drawMarketing();
  };

  function animatePriceReverse(elementId) {
    var xCoord, yCoord, displayText
    if ( elementId === "#set-price") {
      xCoord = "+=172px";
      yCoord = "+=213px";
      displayText = "Set price"
    } else if ( elementId === "#set-marketing" ) {
      xCoord = "+=78px";
      yCoord = "+=265px";
      displayText = "Set marketing spend";
    } else if ( elementId === "#change-recipe" ) {
      xCoord = "-=26px";
      yCoord = "+=213px";
      displayText = "Change recipe"
    }    
    $( elementId ).animate( {left: xCoord, top: yCoord, height: "100px", width: "100px", borderRadius: "150px"}, 300);
    $( elementId ).children().empty().css( {height: "100px", width: "100px"} ).html( displayText);
    $( elementId ).siblings().fadeIn();
    $( elementId ).removeClass("clicked");
  };

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
    for ( i = 0; i < keys.length; i++ ) {
      drawItem(keys[i]);
    };
  };

  function drawPrice() {
    $( "#display-price").html( "$" + displayPrice );
  };

  function setDisplayPrice() {
    displayPrice = price;
  };

  function changeDisplayPrice(clickedId) {
    switch( clickedId ) {
      case "plus-price":
        if ( displayPrice < 20 ) {
          displayPrice++;
        }
        break;
      case "minus-price":
        if ( displayPrice > 0 ) {
          displayPrice--;
        }
        break;
    };
    drawPrice();
  };

  function savePrice() {
    price = displayPrice;
  };

  function drawMarketing() {
    $( "#display-marketing" ).html("$" + displayMarketing);
  };

  function setDisplayMarketing() {
    displayMarketing = marketing;
  };

  function changeDisplayMarketing(clickedId) {
    switch( clickedId ) {
      case "plus-marketing":
        if ( displayMarketing < 20 ) {
          displayMarketing++;
        }
        break;
      case "minus-marketing":
        if ( displayMarketing > 0 ) {
          displayMarketing--;
        }
        break;
    };
    drawMarketing();
  };

  function saveMarketing() {
    marketing = displayMarketing;
  };

  function payMarketing() {
    inventory["money"] -= marketing;
  };

  function setDisplayRecipe() {
    displayRecipe["lemons"] = recipe["lemons"];
    displayRecipe["sugar"] = recipe["sugar"];
    displayRecipe["ice"] = recipe["ice"];
  };

  function changeDisplayRecipe(clickedId) {
    switch(clickedId) {
      case "plus-lemons":
        if ( displayRecipe["lemons"] < 20) {
          displayRecipe["lemons"]++;
        }
        break;
      case "minus-lemons":
        if ( displayRecipe["lemons"] > 1) {
          displayRecipe["lemons"]--;
        }
        break;
      case "plus-sugar":
        if ( displayRecipe["sugar"] < 20) {
          displayRecipe["sugar"]++;
        }
        break;
      case "minus-sugar":
        if ( displayRecipe["sugar"] > 0) {
          displayRecipe["sugar"]--;
        }
        break;
      case "plus-ice":
        if ( displayRecipe["ice"] < 20) {
          displayRecipe["ice"]++;
        }
        break;
      case "minus-ice":
        if ( displayRecipe["ice"] > 0) {
          displayRecipe["ice"]--;
        }
        break;
    }
    drawRecipe();
  };

  function drawRecipe() {
    $( "#recipe-lemons" ).html(displayRecipe["lemons"]);
    $( "#recipe-sugar" ).html(displayRecipe["sugar"]);
    $( "#recipe-ice" ).html(displayRecipe["ice"]);
  };

  function saveRecipe() {
    recipe["lemons"] = displayRecipe["lemons"];
    recipe["sugar"] = displayRecipe["sugar"];
    recipe["ice"] = displayRecipe["ice"];
  };

  function confirmChanges(clickedId) {
    switch ( clickedId ) {
      case "#change-recipe":
        saveRecipe();
        break;
      case "#set-price":
        savePrice();
        break;
      case "#set-marketing":
        console.log("Saving marketing. . . ");
        saveMarketing();
        break;
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
        payMarketing();
        drawInfo();
        drawItems();
        clearInterval(interval);        
      }
    }
    var interval = setInterval(intervalFired, 300);
  };

  startGame(100, 0, 0, 0, 0, 0);

});