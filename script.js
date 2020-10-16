$(document).ready(function () {

  //Number entered by user.
  //4 is just a placeholder until we create the input and get the value.
  var userNumber = 4;

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

    });
  }

  getSuperHero(userNumber);

});
