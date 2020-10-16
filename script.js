//"chris note" - please add the following ids for styling
      // character image id ="image"
      // element id where charcter image is held is id = "characterimage"
      // comic book image id = "bimage"
      // element id where comic book image is held is id = "bookimage"



//===this will be remove by chris, just in here for testing API data call =================
$(document).ready(function () {
    

    function superhero() {
        var queryURL = "https://superheroapi.com/api.php/10164273699360858/search/batman"
        $.ajax({
          url: queryURL,
          method: "GET",
        }).then(function (response) {
            console.log(response)
            console.log(response.results[0].image.url)
            console.log(response.results[0].biography)
            var image = document.getElementById("characterimage")
            var imageURL = response.results[0].image.url
            var name = response.results[0].name

            //Variable need for the Character Details
            var description = response.results[0].biography

            $('#characterimage').append("<img id='image' src=" +imageURL+"></img>")
            $('#characterName').append("<h1>"+name+"</h1>")
            $('#characterDetails').append("<p>"+description+"</p>")
            $('#characterDetails').append("<p>"+appearance+"</p>")
            $('#bookimage').append("<img src='background\inspo.png'></img>")
            
        });
      }
    superhero()
    })

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
