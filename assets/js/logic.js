$(document).ready(function () {
  // Remove data from database
  var removeData = database.ref().child("data");
  removeData.remove();
  console.log("ready");
});

// Initalize a random global number & page number 
var globalRandom = 0;
var pageNum = 1;
var titleArray = [];
var counter = 1;
var title1 = "";
var title2 = "";
var venueBool = false;
var genreBool = false;
var ratingBool = false;
var scoreBool = false;
var multiSearch = false;
var searches = 0;

// Initialize Firebase

var config = {
  apiKey: "AIzaSyC1_ZohEq6qS79WnJgg3WwW_QXOW_Ez_TA",
  authDomain: "deh2-6f6cf.firebaseapp.com",
  databaseURL: "https://deh2-6f6cf.firebaseio.com",
  projectId: "deh2-6f6cf",
  storageBucket: "deh2-6f6cf.appspot.com",
  messagingSenderId: "482010970500"
};

firebase.initializeApp(config);

// Firebase variables

var database = firebase.database();
var dataDB = database.ref("data");
var pickDB = database.ref("userPick");

// Grab user input 

$(".venPick a").on("click", function () {
  venueChoice = $(this).text().trim();
  console.log("Venue: " + venueChoice);
  $("#venue").prop("disabled", true);
  venueBool = true;
});
$(".genPick a").on("click", function () {
  genreChoice = $(this).text().trim();
  if (genreChoice === "Action") {
    genreID = 28;
  } else if (genreChoice === "Comedy") {
    genreID = 35;
  } else if (genreChoice === "Horror") {
    genreID = 27;
  } else if (genreChoice === "Romance") {
    genreID = 10749;
  } else if (genreChoice === "Sci-Fi") {
    genreID = 878;
  }
  console.log("Genre: " + genreChoice);
  $("#gen").prop("disabled", true);
  genreBool = true;
});
$(".ratePick a").on("click", function () {
  var rating = $(this).text().trim();
  // Convert to a number for comparison
  if (rating === "PG") {
    ratingChoice = 1;
  } else if (rating === "PG-13") {
    ratingChoice = 2;
  } else if (rating === "R") {
    ratingChoice = 3;
  } else {
    ratingChoice = 0;
  }
  console.log("Rating: " + ratingChoice);
  $("#rate").prop("disabled", true);
  ratingBool = true;
});
$(".scorePick a").on("click", function () {
  var score = $(this).text().trim();
  // Convert to a number for comparison
  if (score === "50%+") {
    scoreChoice = 50;
  } else if (score === "75%+") {
    scoreChoice = 75;
  } else if (score === "90%+") {
    scoreChoice = 90;
  } else {
    scoreChoice = 0;
  }
  console.log("Score: " + scoreChoice);
  $("#score").prop("disabled", true);
  scoreBool = true;
});

// Search event

$(".search").on("click", function () {
  if (venueBool && genreBool && ratingBool && scoreBool) {
    // If user searches more than once run program differently (currently not in use)
    if (multiSearch) {
      searches++;
      if (searches < 3) {
        counter = 1;
        genreChoice = dataDB.genre;
        movieTitle();
      } else {
        // Disable search button after 3rd search
        $(this).prop("disabled", true);
        console.log("RESET");
      }
    } else {
      var removeData = database.ref().child("data");
      removeData.remove();
      counter = 1;
      titleArray.length = 0;
      searches++;
      if (searches === 3) {
        // Disable search button after 3rd search
        $(this).prop("disabled", true);
        console.log("RESET");
      }
      // multiSearch = true;
      firebaseStorage();
    }
  } else {
    // Display error message
    console.log("Fill each category");
  }
});

// Clear button event

$(".clear").on("click", function () {
  clear();
  $("#venue").html("Stay In/Go Out?").css("background", "#CC0000").css("border-color", "#CC0000");
  $("#gen").html("Genre").css("background", "#CC0000").css("border-color", "#CC0000");
  $("#rate").html("Rating").css("background", "#CC0000").css("border-color", "#CC0000");
  $("#score").html("Score").css("background", "#CC0000").css("border-color", "#CC0000");
  $("#c1").text("Pic");
  $("#c2").text("A");
  $("#c3").text("Flik");
});

// Clear function to clear database & displayed results & reset booleans

function clear() {
  console.log("CLEARED");
  var removeData = database.ref().child("data");
  removeData.remove();
  $("#venue").prop("disabled", false);
  $("#gen").prop("disabled", false);
  $("#rate").prop("disabled", false);
  $("#score").prop("disabled", false);
  venueBool = false;
  genreBool = false;
  ratingBool = false;
  scoreBool = false;
  // multiSearch = false;
  titleArray.length = 0;
  for (var i = 0; i < 3; i++) {
    $("#card" + (i + 1) + " .card-img-top").attr("src", "assets/images/film.png");
    $("#card" + (i + 1) + " #plot").text("");
    $("#card" + (i + 1) + " #score").text("");
    $("#card" + (i + 1) + " #length").text("");
    $("#card" + (i + 1) + " #rating").text("");
  }
  // location.reload();
  $("#search").prop("disabled", false);
}

// Store in firebase

function firebaseStorage() {
  dataDB.push({
    venue: venueChoice,
    genre: genreChoice,
    rating: ratingChoice,
    score: scoreChoice
  });
  run2();
}

function run2() {
  // Determine if user is staying in or going out
  // if (venueChoice === "Out") {
  //   pageNum = 0;
  //   var number = 19;
  // } else {
  //   var number = 0;
  // }

  // Search for movies and add titles to movie title array

  for (var i = 0; i < 75; i++) {
    pageNum++;
    setTimeout(movieTitle, 1500);
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://api.themoviedb.org/3/genre/" + genreID + "/movies?sort_by=created_at.asc&page=" + pageNum + "&include_adult=false&language=en-US&api_key=c46142c3f1b1cbfb5aa59c22ce677737",
      "method": "GET",
      "headers": {},
      "data": "{}"
    }

    $.ajax(settings).done(function (response2) {
      console.log(response2);

      for (var i = 0; i < 10; i++) {
        var random = Math.floor(Math.random() * 19);
        console.log(random);
        // Make sure same movie isn't displayed 
        if (globalRandom != random) {
          var title = response2.results[random].original_title;
          console.log(title);
          globalRandom = random;
          titleArray.push(title);
        } else {
          var random = Math.floor(Math.random() * 19);
        }
      }
      console.log(titleArray);
    });
  }
}

// When user selects a movie to watch redirect them so they can buy tickets/movie

$(".card-img-top").on("click", function () {
  console.log(this.title);
  var title = this.title;
  if (venueChoice === "In") {
    window.open("https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=" + title + " blu ray", '_blank');
  } else {
    window.open("https://www.fandango.com/search?q=" + title, "_blank");
  }
  // Store choice in firebase
  pickDB.push({
    choice: title
  });
});

// Pass random movie titles from array into OMDB API

function movieTitle() {
  console.log("COUNTER: " + counter);
  if (counter < 3) {
    var random = Math.floor(Math.random() * titleArray.length);
    var title = titleArray[random];
    run(title);
  }
}
// OMDB API

function run(title) {

  var queryURL = "https://www.omdbapi.com/?t=" + title + "&plot=short&apikey=40e9cece";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function (response) {

    console.log(response);

    // Grab API values and set variables

    var title = response.Title;
    var plot = response.Plot;
    var rating = response.Rated;
    var genre = response.Genre;
    var released = response.Released;
    var imgURL = response.Poster;
    var score = response.Ratings[1].Value;
    var runTime = response.Runtime;

    console.log(title);
    console.log(plot);
    console.log(rating);
    console.log(released);
    console.log(imgURL);
    console.log(score);
    console.log(runTime);

    // Format and create numbers for comarison

    var scoreCompare = score.slice(0, 2);

    if (rating === "PG") {
      ratingCompare = 1;
    } else if (rating === "PG-13") {
      ratingCompare = 2;
    } else if (rating === "R") {
      ratingCompare = 3;
    } else {
      ratingCompare = 0;
    }

    console.log("ScoreCompare: " + scoreCompare);
    console.log("RatingCompare: " + ratingCompare);

    // Determine if rating & score are correct & if titles are not equal

    if (ratingCompare <= ratingChoice && scoreCompare >= scoreChoice && title != title1 && title != title2) {
      $("#card" + (counter) + " .card-img-top").attr("src", imgURL).attr("title", title);
      $("#card" + (counter) + " #plot").text(plot);
      $("#card" + (counter) + " #score").text(score);
      $("#card" + (counter) + " #length").text(runTime);
      $("#card" + (counter) + " #rating").text(rating);
      if (counter === 1) {
        var title1 = title;
        console.log("TITLE1: " + title1);
      } else if (counter === 2) {
        var title2 = title;
        console.log("TITLE2: " + title2);
      }
      if (counter < 3) {
        counter++;
      }
    } else if (counter < 3) {
      movieTitle();
    } else {
      console.log("DONE");
    }

  });

}

// ----- Things to Add ----
// If all parameters not selected notify the user
// Limit amount of searches to 3
// Make local counters and make global max counter
// !!!!! Don't forget about disabling search button !!!!!
// If api doesn't have value pick backup 

// ----- Known Bugs -----
// If no results match page just stays blank & usually a bunch of erros in console
// Duplicate movies will show up
// If you hit search over and over then it eventually breaks
// Counter runs too high