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
  var queryURL = "https://v1.nocodeapi.com/shelboc/gr/dIBrccmAYkfwiAFv/search?q=" + name;
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    var books = response.results;
   
   // for loop that will display Book images from Goodread API Call, images are place in the carousel
    for (var i=0; i< books.length; i++){
      var bookImage = books[i].image_url
      console.log(bookImage)
    $(".carousel-inner").append("<div class='carousel-item '><img class='d-block w-100' src="+ bookImage +" alt='book slide'></div>");
    }
  });
}
  
// FUNCTION CALLS
  $('.carousel').carousel()
  $("#myModal").modal();
  getSuperHero(userNumber);

  // EVENT LISTENERS
});
