//"chris note" - please add the following ids for styling
// character image id ="image"
// element id where charcter image is held is id = "characterimage"
// comic book image id = "bimage"
// element id where comic book image is held is id = "bookimage"

//===this will be remove by chris, just in here for testing API data call =================

$(document).ready(function () {

  //VARIABLES

  //Number entered by user.
  //4 is just a placeholder until we create the input and get the value.
  var userNumber = Math.floor(Math.random() * 732);

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
      var heroImage = response.image.url;
      $("#characterName").append("<h1>" + name + "</h1>");
      $('#characterimage').append('<img id="image" src="' + heroImage + '"></img>');

      var aliases = response.biography.aliases;
      var aliasesText = "Aliases: ";

      for(var i = 0; i < aliases.length; i++){
          aliasesText += (i < aliases.length - 1) ? aliases[i] + ', ' : aliases[i];       
      }

      $('#characterDetails').append('<p>Full Name: ' + response.biography['full-name'] +  '</p>');
      $('#characterDetails').append('<p>' + aliasesText + '</p>');
      $('#characterDetails').append('<p>Place of Birth: ' + response.biography['place-of-birth'] + '</p>');
      $('#characterDetails').append('<p>First Appearance: ' + response.biography['first-appearance'] + '</p>');
      $('#characterDetails').append('<p>Publisher: ' + response.biography.publisher + '</p>');

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
  $("#myModal").modal();
  getSuperHero(userNumber);

  // EVENT LISTENERS
});
