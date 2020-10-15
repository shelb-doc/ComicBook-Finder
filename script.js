$(document).ready(function () {
    

function superhero() {
    var queryURL = "https://superheroapi.com/api.php/10164273699360858/search/batman"
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
        console.log(response)
    });
  }
superhero()
})
