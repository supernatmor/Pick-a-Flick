$(document).ready(function () {
  console.log("ready");
});

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

// Grab user input  
$(".venPick a").on("click", function venue() {
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
  firebaseStorage();
});



// Store in firebase

function firebaseStorage() {
  database.ref().push({
    venue: venueChoice,
    genre: genreChoice,
    rating: ratingChoice,
    score: scoreChoice
  });
  run();
}

// Ajax call to grab movies from OMBD API

var queryURL = "https://www.omdbapi.com/?t=Goodfellas&plot=short&apikey=40e9cece";

function run() {

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

    $(".card-img-top").attr("src", imgURL);
    $(".card-text").text(plot);
    // $(Rating).text(rating);
    // $(Score).text(score);
    // $(RunTime).text(runTime);

    // Determine if correct parameters 

    // if (genreChoice === genre && rating === ratingChoice && scoreChoice < score) {

    //   // Diplay results

    //   for (var i = 0; i < 3; i++) {

    //     var imgDiv = $("<img class='poster'>");

    //     imgDiv.append(imgURL);
    //     $(POSTER).append(imgDiv);
    //     $(TITLE).append(title);
    //     $(SCORE).append(score);
    //     $(RUNTIME).append(runTime);
    //     $(PLOT).append(plot);
    //   } else {

    //     // Rerun the function if movie doesn't match parameters

    //     run();
    //   }

    // }

  });

}

// // Click event for movie selection

// $(DIV that holds diplay results).on("click", ".poster", function () {

//   var movie = $(this).val();

//   // Push choice to firebase

//   database.ref().push({
//     choice: movie
//   });

//   // Send to fandango/amazon

// });