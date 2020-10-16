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

            $('#characterimage').append("<img src=" +imageURL+"></img>")
            $('#characterName').append("<h1>"+name+"</h1>")
            $('#characterDetails').append("<p>"+description+"</p>")
            $('#characterDetails').append("<p>"+appearance+"</p>")
            
        });
      }
    superhero()
    })
