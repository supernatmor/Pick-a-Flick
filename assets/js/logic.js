
var title = "Goodfellas";
var queryURL = "https://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=40e9cece";

$.ajax({
  url: queryURL,
  method: "GET"
}).done(function(response) {

  console.log(response);

  var title = response.Title;
  var plot = response.Plot;
  var rating = response.Rated;
  var released = response.Released;
  var imgURL = response.Poster;
  var score = response.Ratings[1].Value;
  var runTime = response.RunTime;

  console.log(title);
  console.log(plot);
  console.log(rating);
  console.log(released);
  console.log(imgURL);
  console.log(score);
  console.log(runTime);

});