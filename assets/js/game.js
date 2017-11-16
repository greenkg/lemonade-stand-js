/*jslint white:true, devel:true */
/*jslint browser: true*/
/*global $, jQuery, alert*/
/* jshint latedef:nofunc */
$(document).ready(function () {

    "use strict";

    // Declare constants

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
        "partlyCloudy": 1,
        "cloudy": 0.8,
        "rainy": 0.2
    };

    // Declare variables

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
    };

    var screen;
    var price = 1;
    var displayPrice;
    var marketing = 0;
    var displayMarketing;
    var message = "Make sure you have lemonade and cups on hand before you start the day.";
    var day = 0;
    var customerBase = 10;
    var reputationTracker = 0;
    var reputationPoints = 0;
    var forecast = 0;
    var weather = 0;

    // Functions not directly called by user actions

    // OPTIONS MENU ANIMATIONS

    function openOptionsMenu() {
        $("#game").append($("#options-box").html());
        $("#options-screen").fadeIn(300, function () {
            $(".option").fadeIn({queue: false, duration: 600});
            $("#change-recipe").animate({left: "-=22vh", top: "+=10vh"}, 300);
            $("#set-marketing").animate({left: "-=0vh", top: "+=15vh"}, 300);
            $("#set-price").animate({left: "+=22vh", top: "+=10vh"}, 300);
        });
    }

    function closeOptionsMenu() {
        $("#options-screen").fadeOut();
        $(".option").fadeOut(function () {
            $(".option").css({top: "50vh", left: "25vh"});
        });
    }

    function animateOption(elementId) {
        var xCoord;
        var yCoord;
        var displayElement;
        if (elementId === "#set-price") {
            xCoord = "-=38vh";
            yCoord = "-=47vh";
            setDisplayPrice();
            drawPrice();
            displayElement = "#price-screen";
        } else if (elementId === "#set-marketing") {
            xCoord = "-=16vh";
            yCoord = "-=52vh";
            displayElement = "#marketing-screen";
            setDisplayMarketing();
            drawMarketing();
        } else if (elementId === "#change-recipe") {
            xCoord = "+=6vh";
            yCoord = "-=48vh";
            if (inventory.pitchers > 0) {
                displayElement = "#recipe-error";
            } else {
                displayElement = "#recipe-screen";
            }
            setDisplayRecipe();
            drawRecipe();
        }
        $(elementId).animate({left: xCoord, top: yCoord, height: "52vh", width: "52vh", borderRadius: "27vh"}, 300);
        $(elementId).addClass("clicked");
        $(elementId).children().css({height: "52vh", width: "52vh"}).html($(displayElement).html());
        $(elementId).siblings().fadeOut();
        drawMarketing();
    }

    function animatePriceReverse(elementId) {
        var xCoord;
        var yCoord;
        var displayText;
        if (elementId === "#set-price") {
            xCoord = "+=38vh";
            yCoord = "+=47vh";
            displayText = "Set price";
        } else if (elementId === "#set-marketing") {
            xCoord = "+=16vh";
            yCoord = "+=52vh";
            displayText = "Set marketing spend";
        } else if (elementId === "#change-recipe") {
            xCoord = "-=6vh";
            yCoord = "+=48vh";
            displayText = "Change recipe";
        }
        $(elementId).animate({left: xCoord, top: yCoord, height: "20vh", width: "20vh", borderRadius: "10vh"}, 300);
        $(elementId).children().empty().css({height: "20vh", width: "20vh"}).html(displayText);
        $(elementId).siblings().fadeIn();
        $(elementId).removeClass("clicked");
    }

    // START GAME FUNCTION

    function startGame(money, pitchers, lemons, sugar, ice, cups) {
        var keys = Object.keys(inventory);
        var i;
        var m = keys.length;
        screen = $("#start-screen").html();
        drawGame();
        for (i = 0; i < m; i += 1) {
            inventory[keys[i]] = arguments[i];
        }
        drawItems();
        drawInfo();
    }

    // DRAW FUNCTIONS

    function drawGame() {
        $("#game").html(screen);
    }

    function drawInfo() {
        drawMessage();
        drawDay();
    }

    function drawMessage() {
        $("#message").html(message);
    }

    function drawDay() {
        $("#day-num").html("Day " + day);
    }

    function drawItem(item) {
        var element = "#" + item;
        $(element).html(inventory[item]);
    }

    function drawItems() {
        var keys = Object.keys(inventory);
        var i;
        var m = keys.length;
        for (i = 0; i < m; i += 1) {
            drawItem(keys[i]);
        }
    }

    function drawPrice() {
        $("#display-price").html("$" + displayPrice);
    }

    function drawMarketing() {
        $("#display-marketing").html("$" + displayMarketing);
    }

    function drawRecipe() {
        $("#recipe-lemons").html(displayRecipe.lemons);
        $("#recipe-sugar").html(displayRecipe.sugar);
        $("#recipe-ice").html(displayRecipe.ice);
    }

    function drawWeather(weatherInput) {
        var weatherImg;
        switch (true) {
            case (weatherInput < 3):
                weatherImg = "sunny";
                break;
            case (weatherInput >= 3 && weatherInput < 6):
                weatherImg = "partlyCloudy";
                break;
            case (weatherInput >= 6 && weatherInput < 8):
                weatherImg = "cloudy";
                break;
            case (weatherInput >= 8 && weatherInput < 10):
                weatherImg = "rainy";
                break;
        }
        weatherImg = "url(https://s3.amazonaws.com/lemonade-stand/" + weatherImg + ".svg)";
        $("#weather").css("background-image", weatherImg);
    }

    // FUNCTIONS FOR ADJUSTING AND SAVING OPTIONS

    function setDisplayPrice() {
        displayPrice = price;
    }

    function changeDisplayPrice(clickedId) {
        switch (clickedId) {
            case "plus-price":
                if (displayPrice < 20) {
                    displayPrice+= 1;
                }
                break;
            case "minus-price":
                if (displayPrice > 0) {
                    displayPrice-= 1;
                }
                break;
        }
        drawPrice();
    }

    function savePrice() {
        price = displayPrice;
    }

    function setDisplayMarketing() {
        displayMarketing = marketing;
    }

    function changeDisplayMarketing(clickedId) {
        switch (clickedId) {
            case "plus-marketing":
                if (displayMarketing < 20) {
                    displayMarketing+= 1;
                }
                break;
            case "minus-marketing":
                if (displayMarketing > 0) {
                    displayMarketing-= 1;
                }
                break;
        }
        drawMarketing();
    }

    function saveMarketing() {
        marketing = displayMarketing;
    }

    function payMarketing() {
        inventory.money -= marketing;
    }

    function setDisplayRecipe() {
        displayRecipe.lemons = recipe.lemons;
        displayRecipe.sugar = recipe.sugar;
        displayRecipe.ice = recipe.ice;
    }

    function changeDisplayRecipe(clickedId) {
        switch (clickedId) {
            case "plus-lemons":
                if (displayRecipe.lemons < 20) {
                    displayRecipe.lemons+= 1;
                }
                break;
            case "minus-lemons":
                if (displayRecipe.lemons > 1) {
                    displayRecipe.lemons-= 1;
                }
                break;
            case "plus-sugar":
                if (displayRecipe.sugar < 10) {
                    displayRecipe.sugar+= 1;
                }
                break;
            case "minus-sugar":
                if (displayRecipe.sugar > 0) {
                    displayRecipe.sugar-= 1;
                }
                break;
            case "plus-ice":
                if (displayRecipe.ice < 10) {
                    displayRecipe.ice+= 1;
                }
                break;
            case "minus-ice":
                if (displayRecipe.ice > 0) {
                    displayRecipe.ice-= 1;
                }
                break;
        }
        drawRecipe();
    }

    function saveRecipe() {
        recipe.lemons = displayRecipe.lemons;
        recipe.sugar = displayRecipe.sugar;
        recipe.ice = displayRecipe.ice;
    }

    function confirmChanges(clickedId) {
        switch (clickedId) {
            case "#change-recipe":
                saveRecipe();
                break;
            case "#set-price":
                savePrice();
                break;
            case "#set-marketing":
                saveMarketing();
                break;
        }
    }

    // BUY INVENTORY

    function buyItem(item, qty, price) {
        if (inventory.money >= price) {
            inventory[item] += qty;
            inventory.money -= price;
            drawItem(item);
            drawItem("money");
            message = "You bought " + qty + " " + item + " for $" + (price) + ".";
        } else {
            message = "Oops! You don't have enough money to buy that.";
        }
        drawInfo();
    }

    // USE INVENTORY TO CREATE LEMONADE

    function makeLemonade(recipe) {
        var keys = Object.keys(recipe);
        var i;
        var enough = true;
        var errors = [];
        for (i = 0; i < keys.length; i += 1) {
            if (inventory[keys[i]] < recipe[keys[i]]) {
                errors.push(keys[i]);
                enough = false;
            }
        }
        if (enough === true) {
            for (i = 0; i < keys.length; i += 1) {
                inventory[keys[i]] -= recipe[keys[i]];
            }
            inventory.pitchers += 1;
            drawItems();
            message = "Great! You made a pitcher of lemonade.";
            drawInfo();
        } else {
            message = ("Oops! You don't have enough " + errors.slice(0, errors.length).join(" or ") + " to make lemonade.");
            drawInfo();
        }
    }


    // WEATHER-RELATED FUNCTIONS

    function forecastWeather() {
        forecast = Math.floor(Math.random() * 10);
        drawWeather(forecast);
    }

    function getActualWeather() {
        var adjWeather = Math.floor(Math.random()*3);
        adjWeather *= Math.floor(Math.random()*2) === 1 ? 1 : -1; // this will create a negative result in 50% of cases
        if (forecast + adjWeather > 9) {
            weather = 9;
        } else if (forecast - adjWeather < 0) {
            weather = 0;
        } else {
            weather = forecast + adjWeather;
        }
        drawWeather(weather);
    }


    // DETERMINE NUMBER OF CUSTOMERS

    function getCustomers() {
        var customers;
        //increase customer base by marketing dollars
        customerBase = customerBase + marketing;
        //get today's potential shoppers:
        customers = Math.floor(Math.random() * (customerBase));
        //adjust shoppers based on price curve:
        customers = priceAdjust(customers);
        //adjust remaining shoppers based on weather:
        customers = weatherAdjust(customers);
        //limit customers to lower of customers, cups, or lemonade
        customers = Math.min(customers, inventory.cups, inventory.pitchers*10);
        return Math.round(customers);
    }

    function priceAdjust(customers) {
        var multiplier = -0.175 + (reputationPoints * 5/1000);
        var constant = 1.2 + (reputationPoints * 5/1000);
        var adjustment = -0.025*(price**2) + (multiplier*price) + constant;
        adjustment = Math.max(0, adjustment);
        var adjustedCustomers = customers * adjustment;
        return adjustedCustomers;
    }

    function weatherAdjust(customers) {
        switch (true) {
            case (weather < 3):
                customers *= WEATHER.sunny;
                break;
            case (weather >= 3 && forecast < 6):
                customers *= WEATHER.partlyCloudy;
                break;
            case (weather >= 6 && forecast < 8):
                customers *= WEATHER.cloudy;
                break;
            case (weather >= 8 && forecast < 10):
                customers *= WEATHER.rainy;
                break;
        }
        return customers;
    }

    function marketingAdjust(customers) {
        return customers += marketing;
    }


    // FUNCTIONS FOR RUNNING THE DAY

    function startDay() {
        getActualWeather();
        var customers = getCustomers();
        animateDay(customers);
    }

    function sellLemonade(customers) {
        inventory.cups -= customers;
        inventory.pitchers = 0;
        inventory.money += customers * price;
        inventory.ice = 0;
        drawItems();
    }

    function animateDay(customers) {
        var hour = 0;
        day += 1;
        message = "Day " + day + " in progress.";
        drawInfo();
        function intervalFired() {
            hour += 1;
            if (hour <= 8) {
                message = "Day " + day + " in progress. Hour is " + hour;
                $("#info").css("background-color", DAYPROGRESS[hour]);
                drawInfo();
            } else {
                message = "You sold " + customers + " cups of lemonade." + updateReputation(customers);
                $("#info").css("background-color", "rgba(250, 240, 230, 1)");
                sellLemonade(customers);
                payMarketing();
                drawInfo();
                drawItems();
                clearInterval(interval);
                forecastWeather();
            }
        }
        var interval = setInterval(intervalFired, 300);
    }

    function updateReputation(customers) {
        reputationTracker += customers * getRecipeScore();
        var newRepPoints = Math.floor(reputationTracker / 10);
        var thisMessage = "";
        if (newRepPoints > reputationPoints) {
            thisMessage = " Your reputation increased!";
        }
        reputationPoints = newRepPoints;
        customerBase = reputationPoints + 10;
        $("#reputation").html(reputationPoints);
        return thisMessage;
    }

    function getRecipeScore() {
        //recipe score is based on quantity of lemons, quantity of ice, and ratio of sugar to lemons
        //lemon score
        var lemonScore;
        var x = recipe.lemons;
        if (x <= 0 || x >= 20) {
            lemonScore = -1;
        } else {
            lemonScore = -8.9922609E-05 * (x ** 4) + 0.00613695169 * (x ** 3) - 0.1411411871 * (x ** 2) + (1.1345878258 * x) - 1.9233230134;
        }
        lemonScore = Math.round(lemonScore * 10) / 10;

        //sugar score
        var sugarScore;
        var y = recipe.sugar / recipe.lemons;
        if (y <= 0 || y >= 1) {
            sugarScore = -1;
        } else {
            sugarScore = 0.0043069602 * (y ** 4) - 0.100287569 * (y ** 3) + 0.7916398999 * (y ** 2) - (2.40001202868 * y) + 1.1563859055;
        }
        sugarScore = Math.round(sugarScore * 10) / 10;

        //ice score
        var iceScore;
        var z = recipe.ice;
        if (z <= 0 || z >= 10) {
            iceScore = -1;
        } else {
            iceScore = -0.08 * (z ** 2) + 0.71 * z - 0.56;
        }
        iceScore = Math.round(iceScore * 10) / 10;

        //compute aggregate score
        var recipeScore = Math.round(((lemonScore * 0.4) + (sugarScore * 0.4) + (iceScore * 0.2)) * 10) / 10;
        return recipeScore;
    }

    // Functions that follow user actions

    $("body").on("click", "#start-button", function () {
        $("#introduction").html($("#intro1").html());
        screen = $("#introduction-screen").html();
        drawGame();
    });

    $("body").on("click", "#skip-intro", function () {
        screen = $("#play-screen").html();
        drawGame();
    });

    $("body").on("click", "#next-button", function () {
        if ($("#introduction").html() === $("#intro1").html()) {
            $("#introduction").html($("#intro2").html());
        } else if ($("#introduction").html() === $("#intro2").html()) {
            $("#introduction").html($("#intro3").html());
        } else if ($("#introduction").html() === $("#intro3").html()) {
            screen = $("#play-screen").html();
            drawGame();
        }
    });

    $("body").on("click", ".buyable", function (e) {
        var thisItem = e.target.id;
        buyItem(thisItem, ITEMS[thisItem].qty, ITEMS[thisItem].price);
    });

    $("body").on("click", "#pitchers", function () {
        makeLemonade(recipe);
    });

    $("body").on("click", "#start-day", function () {
        startDay();
    });

    // Open and close the options menu

    $("body").on("click", "#options-open", function () {
        openOptionsMenu();
    });

    $("body").on("click", "#options-close", function () {
        closeOptionsMenu();
    });

    // Open the individual options

    $("body").on("click", ".option", function (e) {
        var elementId = "#" + $(e.target).parent().attr("id");
        if (elementId === "#set-price" || elementId === "#set-marketing" || elementId === "#change-recipe") {
            if ($(elementId).hasClass("clicked") === false) {
                animateOption(elementId);
            }
        }
    });

    // Set behaviors for cancel and confirm buttons

    $("body").on("click", ".cancel", function (e) {
        var parentElementId = "#" + $(e.target).parents().eq(3).attr("id");
        e.stopPropagation();
        animatePriceReverse(parentElementId);
    });

    $("body").on("click", ".confirm", function (e) {
        var parentElementId = "#" + $(e.target).parents().eq(3).attr("id");
        e.stopPropagation();
        animatePriceReverse(parentElementId);
        confirmChanges(parentElementId);
        closeOptionsMenu();
    });

    // Update attributes based on changes in options menus

    $("body").on("click", ".change-recipe", function (e) {
        var clickedId = $(e.target).attr("id");
        changeDisplayRecipe(clickedId);
    });

    $("body").on("click", ".change-price", function (e) {
        var clickedId = $(e.target).attr("id");
        changeDisplayPrice(clickedId);
    });

    $("body").on("click", ".change-marketing", function (e) {
        var clickedId = $(e.target).attr("id");
        changeDisplayMarketing(clickedId);
    });

    startGame(100, 0, 0, 0, 0, 0);

});