   // START CODING BELOW!!

   // Initialize Firebase
   var config = {
       apiKey: "AIzaSyD2ktnDjKYioKddYj8g5T7xXSsxQHNGoCQ",
       authDomain: "geralds-first-project.firebaseapp.com",
       databaseURL: "https://geralds-first-project.firebaseio.com",
       projectId: "geralds-first-project",
       storageBucket: "geralds-first-project.appspot.com",
       messagingSenderId: "817156048996"
   };

   firebase.initializeApp(config);

   // Create a variable to reference the database
   var database = firebase.database();

   // Initial Values
   var IsNewUser = "";
   var userName = "";
   var pw = "";


   //modal screen handler    // Get the modal
   var modal = document.getElementById('myModal');

   // Get the button that opens the modal
   //var btn = document.getElementById("myBtn");

   // Get the <span> element that closes the modal
   var span = document.getElementsByClassName("close")[0];

   // When the user clicks the button, open the modal 
   // btn.onclick = function() {
   //    modal.style.display = "block";
   // }

   // When the user clicks on <span> (x), close the modal
   span.onclick = function() {
       modal.style.display = "none";
   }

   // When the user clicks anywhere outside of the modal, close it
   window.onclick = function(event) {
       if (event.target == modal) {
           modal.style.display = "none";
       }
   }



   // Capture default login page Button Click
   $("#default-login").on("click", function() {
       // Don't refresh the page!
       event.preventDefault();


       //Get the username and password values from the default login screen
       userName = $("#form-username").val().trim();
       pw = $("#form-password").val().trim();


       //First check to see if the user has logged in before. If they have, then they will be navigated to the application,
       //  otherwise, they their credentials will be added to the database and an alert posted informing them that they are a new user
       IsNewUser = readUserData(userName, pw);
       console.log("New user: " + IsNewUser);
       console.log("User name: " + userName);

       if (!(userName === IsNewUser)) {
           //first time application user
           alert("Welcome new user: " + userName);
           writeUserData(userName, pw);
       }

       window.open("main.html","_self");
   }); //end default login screen processing


   // Capture facebook button click event
   $("#facebook").on("click", function() {
       // Don't refresh the page!
       //event.preventDefault();
       modal.style.display = "block";
   });


   // Capture Twitter button click event
   $("#twitter").on("click", function() {
       // Don't refresh the page!
       //event.preventDefault();
       modal.style.display = "block";
   });

   // Capture Googleplus button click event
   $("#googleplus").on("click", function() {
       // Don't refresh the page!
       //event.preventDefault();
       modal.style.display = "block";
   });


   // Capture Googleplus button click event
   $("#linkedin").on("click", function() {
       // Don't refresh the page!
       event.preventDefault();
       modal.style.display = "block";
   });


   // Capture Googleplus button click event
   $("#flickr").on("click", function() {
       // Don't refresh the page!
       event.preventDefault();
       modal.style.display = "block";
   });


   // Capture Googleplus button click event
   $("#tumblr").on("click", function() {
       // Don't refresh the page!
       event.preventDefault();
       modal.style.display = "block";
   });



   //Write new user to the database
   // If already user in database, will write/update the password if the user enters a different value
   function writeUserData(userName, pw) {
       firebase.database().ref('users/' + userName).set({
           username: userName,
           password: pw,
           profile_picture: null
       });
   } //function writeUserData


   function readUserData(userName, pw) {
       //return firebase.database().ref('/users/' + userName.trim()).once('value') //.then(function(snapshot) {
       //newUser = (snapshot.val() && snapshot.val().username) || 'Anonymous';
       // ...
       // });

       // Find all dinosaurs whose height is exactly 25 meters.
       //alert("inside readUserData function");
       var result = "";
       var ref = firebase.database().ref("/users/");
       //console.log(ref);
       ref.orderByChild("username").equalTo(userName.trim()).on("child_added", function(snapshot) {
           console.log("snapshot.key: " + snapshot.key);
           console.log("snapshot value: " + snapshot.val().username);
           result = snapshot.val().username.trim();
           //alert(snapshot.key);
       });

       return result;

   } //function readUserData


   // Firebase watcher + initial loader HINT: .on("value")
   database.ref().on("value", function(snapshot) {

       // Handle the errors
   }, function(errorObject) {
       console.log("Errors handled: " + errorObject.code);
   });