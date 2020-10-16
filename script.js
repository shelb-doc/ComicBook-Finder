$(document).ready(function () {
  // JS VARIABLES

  // FUNCTION DEFINITIONS
  function superhero() {
    var queryURL = "https://superheroapi.com/api.php/10164273699360858/search/batman"
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
        console.log(response)
    });
  }

  function goodReads() {
    var queryURL = "https://v1.nocodeapi.com/shelboc/gr/dIBrccmAYkfwiAFv/search?q=spiderman"
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
        console.log(response)
    });
  }

  // FUNCTION CALLS
  goodReads()
  superhero()

  // EVENT LISTENERS

})
