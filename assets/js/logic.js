$(document).ready(function () {
  console.log("ready");
});

// var title = "";
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

var database = firebase.database();

var dataDB = database.ref("data");

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
  ratingChoice = $(this).text().trim();
  console.log(ratingChoice);
});
$(".scorePick a").on("click", function () {
  scoreChoice = $(this).text().trim();
  console.log(scoreChoice);
});

// Search event

$(".search").on("click", function () {
  firebaseStorage();
});

// Store in firebase

function firebaseStorage() {
  dataDB.push({
    venue: venueChoice,
    genre: genreChoice,
    rating: ratingChoice,
    score: scoreChoice
  });
}

// Ajax call to grab movies from OMBD API

function run(counter, title) {

  var queryURL = "https://www.omdbapi.com/?t=" + title + "&plot=short&apikey=40e9cece";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function (response) {

    console.log(response);

    // Set variables

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

    $(".customText").remove();

    $("#card" + (counter + 1) + " .card-img-top").attr("src", imgURL);
    $("#card" + (counter + 1) + " #plot").text(plot);
    $("#card" + (counter + 1) + " #score").text(score);
    $("#card" + (counter + 1) + " #length").text(runTime);
    $("#card" + (counter + 1) + " #rating").text(rating);

    // Determine if correct parameters 

  });

}

// Grab a random movie title 

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

  $.ajax(settings).done(function (response2) {
    console.log(response2);

    for (var i = 0; i < 3; i++) {
      var random = Math.floor(Math.random() * 19);
      console.log(random);
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

// // Click event for movie selection

// $(DIV that holds diplay results).on("click", ".poster", function () {

//   var movie = $(this).val();

//   // Push choice to firebase

//   database.ref().push({
//     choice: movie
//   });

//   // Send to fandango/amazon

// });