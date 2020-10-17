//"chris note" - please add the following ids for styling
// character image id ="image"
// element id where character image is held is id = "characterimage"
// comic book image id = "bimage"
// element id where comic book image is held is id = "bookimage"

//===this will be remove by chris, just in here for testing API data call =================

$(document).ready(function () {
  $("#myModal").modal();

  // Modal variables
  var questions = [
    { question: "Marvel or DC", choices: ["Marvel", "DC"] },
    { question: "Superman or Batman", choices: ["Superman", "Batman"] },
    {
      question: "Suicide Squad or The Avengers",
      choices: ["Suicide Squad", "The Avengers"],
    },
  ];
  var qIndex = 0;
  //FUNCTIONS
  function populateModal(num) {
    if (num === 3) {
      $(".modal-footer").empty();
      $(".modal-body").empty();
      $(".modal-body").append("<p>Enter a number between 1 and 731</p>");
      $(".modal-body").append(
        '<input type="numeric" id="userNumber" class="form-control">'
      );
      $(".modal-body").append(
        '<button id="goBtn" class="btn" data-dismiss="modal">Go</button>'
      );
    } else {
      $("#question").text(questions[num].question);
      $(".modal-footer").empty();
      for (var i = 0; i < questions[num].choices.length; i++) {
        $(".modal-footer").append(
          '<button class="btn choice">' +
            questions[num].choices[i] +
            "</button>"
        );
      }
    }
  }
  populateModal(qIndex);
  $("#myModal").modal();
  // EVENT LISTENERS
  $(document).on("click", ".choice", function () {
    qIndex++;
    populateModal(qIndex);
  });
  $(document).on("click", "#goBtn", function () {
    userNumber = $("#userNumber").val();
    getSuperHero(userNumber);
  });

  function superhero() {
    var queryURL =
      "https://superheroapi.com/api.php/10164273699360858/search/batman";
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      console.log(response.results[0].image.url);
      console.log(response.results[0].biography);
      var image = document.getElementById("characterImage");
      var imageURL = response.results[0].image.url;
      var name = response.results[0].name;

      //Variable need for the Character Details
      var description = response.results[0].biography;

      $("#characterImage").append(
        "<img id='image' src=" + imageURL + "></img>"
      );
      $("#characterName").append("<h1>" + name + "</h1>");
      $("#characterDetails").append("<p>" + description + "</p>");
      $("#characterDetails").append("<p>" + appearance + "</p>");
      $("#bookimage").append("<img src='backgroundinspo.png'></img>");
    });
  }
  superhero();
});

//=========================================================================================

//VARIABLES

//Number entered by user.
//4 is just a placeholder until we create the input and get the value.
var userNumber = 4;

//FUNCTIONS

//Function to get the superhero from the superhero api by id
//Must be between 1 and 731
function getSuperHero(id) {
  var queryURL = "https://superheroapi.com/api.php/10164273699360858/" + id;
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    var name = response.name;

    getBooks(name);
  });
}

//Function to get books and comics related to the superhero from goodreads api
function getBooks(name) {
  var queryURL =
    "https://v1.nocodeapi.com/shelboc/gr/dIBrccmAYkfwiAFv/search?q=" + name;
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    var books = response.results;
  });
}

// FUNCTION CALLS
getSuperHero(userNumber);

// EVENT LISTENERS
