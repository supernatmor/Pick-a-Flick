$(document).ready(function () {
  var removeData = database.ref().child("data");
  removeData.remove();
  console.log("ready");
});

// Initalize a random global number
var globalRandom = 0;

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
  console.log(venueChoice);
});
$(".genPick a").on("click", function () {
  genreChoice = $(this).text().trim();
  console.log(genreChoice);
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
  console.log(ratingChoice);
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
  console.log(scoreChoice);
});

// Search event

$(".search").on("click", function () {
  var removeData = database.ref().child("data");
  removeData.remove();
  firebaseStorage();
});

// Clear button event

$(".clear").on("click", function () {
  clear();
});

// Clear function to clear database and displayed results

function clear() {
  console.log("CLEARED");
  var removeData = database.ref().child("data");
  removeData.remove();
  for (var i = 0; i < 3; i++) {
    $("#card" + (i + 1) + " .card-img-top").attr("src", "assets/images/film.png");
    $("#card" + (i + 1) + " #plot").text("Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vel veritatis dicta, minus dignissimos illo quasi porro sint adipisci, fugit nisi saepe vero!");
    $("#card" + (i + 1) + " #score").text("Score: 92%");
    $("#card" + (i + 1) + " #length").text("Length: 96 min");
    $("#card" + (i + 1) + " #rating").text("Rating: PG");
  }
}

// Store in firebase

function firebaseStorage() {
  dataDB.push({
    venue: venueChoice,
    genre: genreChoice,
    rating: ratingChoice,
    score: scoreChoice
  });
}

// OMDB API

function run(counter, title) {

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

    // Format and create numbers to compare

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

    console.log(scoreCompare);
    console.log(ratingCompare);

    // Determine if rating & score are correct 

    if (ratingCompare <= ratingChoice && scoreCompare >= scoreChoice) {

      $("#card" + (counter + 1) + " .card-img-top").attr("src", imgURL).attr("title", title);
      $("#card" + (counter + 1) + " #plot").text(plot);
      $("#card" + (counter + 1) + " #score").text(score);
      $("#card" + (counter + 1) + " #length").text(runTime);
      $("#card" + (counter + 1) + " #rating").text(rating);
    } else {
      // Clear fields and database if one fails
      clear();
    }

  });

}

// Grab random movie title to pass to OMDB API

dataDB.on("child_added", function (snapshot) {

  // Grab chosen genre and assign search id

  var chosenGenre = snapshot.val().genre;

  if (chosenGenre === "Action") {
    var genreID = 28;
  } else if (chosenGenre === "Comedy") {
    var genreID = 35;
  } else if (chosenGenre === "Horror") {
    var genreID = 27;
  } else if (chosenGenre === "Romance") {
    var genreID = 10749;
  } else if (chosenGenre === "Sci-Fi") {
    var genreID = 878;
  }

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.themoviedb.org/3/genre/" + genreID + "/movies?sort_by=created_at.asc&include_adult=false&language=en-US&api_key=c46142c3f1b1cbfb5aa59c22ce677737",
    "method": "GET",
    "headers": {},
    "data": "{}"
  }

  //The Movie Database API 

  $.ajax(settings).done(function (response2) {
    console.log(response2);

    // Grab random movie out of API list and pass it into OMDB API

    for (var i = 0; i < 3; i++) {
      var random = Math.floor(Math.random() * 19);
      console.log(random);
      // Make sure same movie isn't displayed 
      if (globalRandom != random) {
        var title = response2.results[random].original_title;
        console.log(title);
        var counter = i;
        globalRandom = random;
        run(counter, title);
      } else {
        i--;
        var random = Math.floor(Math.random() * 19);
      }
    }
  });

});

// Click event for poster to redirect to either Amazon or Fandango

$(".card-img-top").on("click", function () {
  console.log(this.title);
  var title = this.title;
  if (venueChoice === "In") {
    window.open("https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=" + title + " blu ray", '_blank');
  } else {
    window.open("https://www.fandango.com/search?q=" + title, "_blank");
  }
  pickDB.push({
    choice: title
  });
});

// // Click event for movie selection

// $(DIV that holds diplay results).on("click", ".poster", function () {

//   var movie = $(this).val();

//   // Push choice to firebase

//   database.ref().push({
//     choice: movie
//   });

//   // Send to fandango/amazon

// });