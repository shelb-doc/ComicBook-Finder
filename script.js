$(document).ready(function () {
  
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
    var queryURL = "https://v1.nocodeapi.com/shelboc/gr/dIBrccmAYkfwiAFv/search?q=" + name;
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
});
