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
    "ghostwhite",
    "gainsboro",
    "lightpink",
    "lightcyan",
    "lavender",
    "mediumturquoise",
    "slateblue",
    "mediumblue",
    "midnightblue"
  ];

  var WEATHER = {
    "sunny": 1.2,
    "partly-cloudy": 1,
    "cloudy": 0.8,
    "rainy": 0.2
  };

  var inventory = {
    "money": 0,
    "pitchers": 0,
    "lemons": 0,
    "sugar": 0,
    "ice": 0,
    "cups": 0
  };

  var recipe = {
    "lemons": 3,
    "sugar": 2,
    "ice": 3
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
  var customerBase = 10;
  var reputationTracker = 0;
  var reputationPoints = 0;
  var forecast = 0;
  var weather = 0;

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
      if ( inventory["pitchers"] > 0 ) {
        displayElement = "#recipe-error";
      } else {
        displayElement = "#recipe-screen";
      };
      
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
        if ( displayRecipe["sugar"] < 10) {
          displayRecipe["sugar"]++;
        }
        break;
      case "minus-sugar":
        if ( displayRecipe["sugar"] > 0) {
          displayRecipe["sugar"]--;
        }
        break;
      case "plus-ice":
        if ( displayRecipe["ice"] < 10) {
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

  function forecastWeather() {
    forecast = Math.floor(Math.random() * 10);
    console.log("Random weather number is " + forecast);
    drawWeather(forecast);
  };

  function getActualWeather() {
    var adjWeather = Math.floor(Math.random()*3);
    adjWeather *= Math.floor(Math.random()*2) == 1 ? 1 : -1; // this will create a negative result in 50% of cases
    if ( forecast + adjWeather > 9 ) {
      weather = 9;
    } else if ( forecast - adjWeather < 0 ) {
      weather = 0;
    } else {
      weather = forecast + adjWeather;
    };
    drawWeather(weather);
  };

  function drawWeather(weatherInput) {
    console.log("Weather is " + weatherInput);
    var weatherImg;
    switch( true ) {
      case ( weatherInput < 3 ):
        weatherImg = "sunny";
        break;
      case ( weatherInput >= 3 && weatherInput < 6 ):
        weatherImg = "partly-cloudy";
        break;
      case ( weatherInput >= 6 && weatherInput < 8 ):
        weatherImg = "cloudy";
        console.log("It's cloudy!");
        break;
      case ( weatherInput >= 8 && weatherInput < 10):
        weatherImg = "rainy";
        break;
    };
    weatherImg = '<img src="https://s3.amazonaws.com/lemonade-stand/' + weatherImg + '.svg" class="option-img">'
    $( "#weather" ).html(weatherImg);
  };

  function getCustomers() {
    //get today's potential shoppers:
    var customers = Math.floor(Math.random() * (customerBase));
    console.log("Total potential shoppers: " + customers);
    //adjust shoppers based on price curve:
    customers = priceAdjust(customers);
    console.log("Price adjusted potential shoppers: " + customers);
    //adjust remaining shoppers based on weather:
    customers = weatherAdjust(customers);
    console.log("Weather adjusted potential shoppers: " + customers);
    //limit customers to lower of customers, cups, or lemonade
    customers = Math.min(customers, inventory["cups"], inventory["pitchers"]*10 );
    console.log("Final shoppers: " + Math.round(customers));
    return Math.round(customers);
  };

  function priceAdjust(customers) {
    var multiplier = -0.175 + (reputationPoints * .005);
    var constant = 1.2 + (reputationPoints * .005);
    var adjustment = -0.025*(price**2) + (multiplier*price) + constant;
    adjustment = Math.max(0, adjustment);
    var adjustedCustomers = customers * adjustment;
    return adjustedCustomers;
  };

  function weatherAdjust(customers) {
    var customers = customers;
    switch( true ) {
      case ( weather < 3 ):
        customers *= WEATHER["sunny"];
        break;
      case ( weather >= 3 && forecast < 6 ):
        customers *= WEATHER["partly-cloudy"];
        break;
      case ( weather >= 6 && forecast < 8 ):
        customers *= WEATHER["cloudy"];
        break;
      case ( weather >= 8 && forecast < 10):
        customers *= WEATHER["rainy"];
        break;
    };
    return customers;
  };

  function startDay() {
    getActualWeather();
    var customers = getCustomers();
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
        message = "You sold " + customers + " cups of lemonade." + updateReputation(customers);
        $( "#info" ).css("background-color", "rgba(250, 240, 230, 1)" );
        sellLemonade(customers);
        payMarketing();
        drawInfo();
        drawItems();
        clearInterval(interval);
        forecastWeather();     
      }
    }
    var interval = setInterval(intervalFired, 300);
  };

  function updateReputation(customers) {
    reputationTracker += customers * getRecipeScore();
    console.log("reputation tracker is at: " + reputationTracker);
    var newRepPoints = Math.floor(reputationTracker / 10);
    if ( newRepPoints > reputationPoints ) {
      reputationPoints = newRepPoints;
      $( "#reputation" ).html(reputationPoints);
      return " Your reputation increased!";
    } else {
      reputationPoints = newRepPoints;
      $( "#reputation" ).html(reputationPoints);
      return "";
    }
    
  };

  function getRecipeScore() {
    //recipe score is based on quantity of lemons, quantity of ice, and ratio of sugar to lemons
    //lemon score
    var lemonScore;
    var x = recipe["lemons"];
    if ( x <= 0 || x >= 20 ) {
      lemonScore = -1;
    } else {
      lemonScore = -8.9922609E-05*(x**4) + 0.00613695169*(x**3) - 0.1411411871*(x**2) + (1.1345878258*x) - 1.9233230134;
    }    
    lemonScore = Math.round(lemonScore * 10) / 10;
    console.log("Lemon score is " + lemonScore);

    //sugar score
    var sugarScore;
    var y = recipe["sugar"] / recipe["lemons"];
    if ( y <= 0 || y >= 1 ) {
      sugarScore = -1;
    } else {
      sugarScore = 0.0043069602*(y**4) - 0.100287569*(y**3) + 0.7916398999*(y**2) - (2.40001202868*y) + 1.1563859055;
    }  
    sugarScore = Math.round(sugarScore * 10) / 10;
    console.log("Sugar score is " + sugarScore);

    //ice score
    var iceScore;
    var z = recipe["ice"];
    if ( z <= 0 || z >=10 ) {
      iceScore = -1;
    } else {
      iceScore = -0.08*(z**2) + 0.71*z - 0.56;
    }
    iceScore = Math.round(iceScore * 10) / 10;
    console.log("Ice score is " + iceScore);

    //compute aggregate score
    var recipeScore = Math.round( ((lemonScore * 0.4) + (sugarScore * 0.4) + (iceScore * 0.2)) * 10 ) / 10;
    console.log("Total score is " + recipeScore);
    return recipeScore;
  };

  startGame(100, 0, 0, 0, 0, 0);

});