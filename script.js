$(document).ready(function () {
  //VARIABLES

  //Number entered by user.
  //4 is just a placeholder until we create the input and get the value.
  var userNumber = Math.floor(Math.random() * 732);

  const comicVineToken = "8d92360fbb7a0ea6865f81ff20b7b95c10523143";
  const comicVineRoot = "https://cors-anywhere.herokuapp.com/https://comicvine.gamespot.com/api/";
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
      $(".modal-body").append('<p id="numQuestion" >Enter a number between 1 and 731</p>');
      $(".modal-body").append(
        '<input type="numeric" id="userNumber" class="form-control" required >'
      );
      $(".modal-footer").append(
        '<button id="goBtn" class="btn" >Go</button>'
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
      var fullName = response.biography["full-name"];
      var publisher = response.biography.publisher;

      //Format the name and fullname to be used in comicvine api
      name = name.replace(/\sI+/g, "").replace(/(.+?)\s(.+?)\s(.+?)/, "$1 $3");
      fullName = fullName.replace(/(.+?)\s(.+?)\s(.+?)/, "$1 $3");
      console.log(fullName);

      //Array of names to use in search for superhero in comicvine api
      var names = [];
      names.push(name);
      names.push(fullName);

      var heroImage = response.image.url;

      $("#characterName").append("<h1>" + name + "</h1>");
      $("#characterImage").append(
        '<img id="image" src="' + heroImage + '"></img>'
      );

      var aliases = response.biography.aliases;
      var aliasesText = "Aliases: ";

      for (var i = 0; i < aliases.length; i++) {
        aliasesText += i < aliases.length - 1 ? aliases[i] + ", " : aliases[i];
        names.push(aliases[i]);
      }

      $("#characterDetails").append(
        "<p>Full Name: " + response.biography["full-name"] + "</p>"
      );
      $("#characterDetails").append("<p>" + aliasesText + "</p>");
      $("#characterDetails").append(
        "<p>Place of Birth: " + response.biography["place-of-birth"] + "</p>"
      );
      $("#characterDetails").append(
        "<p>First Appearance: " +
          response.biography["first-appearance"] +
          "</p>"
      );
      $("#characterDetails").append(
        "<p>Publisher: " + response.biography.publisher + "</p>"
      );

      getComics(names);
    });
  }

  //Function to get books and comics related to the superhero from goodreads api
  function getComics(names) {
    //Remove punctuation and make names lower case to use in search
    names = names.map((name) => normalizeName(name)).filter((x) => x);
    console.log(names);

    //Get the result from the comicvine api search endpoint to get characterid
    var queryURL = comicVineRoot + "search/?api_key=" + comicVineToken + "&query=" + names.toString() +
      "&resources=character&resource_type=character&format=json&limit=100";

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);

      //Get the character from the searh results
      var character = response.results.find((x) => names.includes(normalizeName(nullCheck(x.real_name))) ||
          names.includes(normalizeName(nullCheck(x.name))));

      console.log(character);

      //Get the character details, specifically the issue credits that the character appeared in
      $.ajax({
        url: comicVineRoot + "character/4005-" + character.id + "/?api_key=" + comicVineToken + "&format=json",
        method: "GET",
      }).then(function (r) {
        console.log(r);
        var comics = r.results.issue_credits.slice(0, 10);

        for (var i = 0; i < comics.length; i++) {
          getComicDetails(comics[i].id, i);
        }
      });
    });
  }

  //Get the image url for the comics and set up the carousel
  function getComicDetails(id, index) {
    $.ajax({
      url: comicVineRoot + "/issue/4000-" + id + "/?api_key=" + comicVineToken + "&format=json",
      method: "GET",
    }).then(function (r) {
      console.log(r);

      var active = index === 0 ? " active" : "";

      var comicImage = r.results.image.original_url;
      $(".carousel-inner").append(
        "<div class='carousel-item" +
          active +
          "'><img class='d-block w-100' src=" +
          comicImage +
          " alt='book slide'></div>"
      );
    });
  }

  function removePunctuation(word) {
    var result = "";
    var characters = "abcdefghijklmnopqrstuvwxyz1234567890 ";

    for (var i = 0; i < word.length; i++) {
      if (characters.includes(word[i].toLowerCase() || word[i] == " ")) {
        result += word[i];
      }
    }

    return result;
  }

  function nullCheck(item) {
    if (item == undefined || item == null) {
      return "";
    }

    return item;
  }

  function normalizeName(name) {
    var result = "";

    if (name) {
      result = removePunctuation(name.toLowerCase());
    }

    return result;
  }

  // FUNCTION CALLS
  $(".carousel").carousel();
  populateModal(qIndex);
  $("#myModal").modal();

  // EVENT LISTENERS
  $(document).on("click", ".choice", function () {
    qIndex++;
    populateModal(qIndex);
  });
  $(document).on("click", "#goBtn", function () {
    event.preventDefault();
    userNumber = $("#userNumber").val();
    console.log(userNumber)
    if((userNumber <= 0) || (userNumber > 731) || (isNaN(userNumber)) ){
      $("#numQuestion").text("'"+ userNumber + "' is not a valid answer. Please enter a number between 1 and 731.");
    } else{
      $('#myModal').modal('hide');
      getSuperHero(userNumber);
    }
  });
});
