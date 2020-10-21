$(document).ready(function () {
  //VARIABLES

  //Number entered by user.
  //4 is just a placeholder until we create the input and get the value.
  var userNumber = Math.floor(Math.random() * 732);

  //Constants for comicvine api
  const comicvineToken = "8d92360fbb7a0ea6865f81ff20b7b95c10523143";
  const comicvineRoot = "https://cors-anywhere.herokuapp.com/https://comicvine.gamespot.com/api/";

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
      $(".modal-body").append('<input type="numeric" id="userNumber" class="form-control" required >');
      $(".modal-footer").append('<button id="goBtn" class="btn" >Go</button>');
    } else {
      $("#question").text(questions[num].question);
      $(".modal-footer").empty();

      for (var i = 0; i < questions[num].choices.length; i++) {
        $(".modal-footer").append('<button class="btn choice">' + questions[num].choices[i] + "</button>");
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
      var name = response.name;
      var fullName = response.biography["full-name"];
      var searchObject = {};

      //Format the name and fullname to be used in comicvine api
      name = name.replace(/\sI+/g, "").replace(/(.+?)\s(.+?)\s(.+?)/, "$1 $3");
      fullName = fullName.replace(/(.+?)\s(.+?)\s(.+?)/, "$1 $3");

      //Object with search paramters to use for searc in comicvine api
      searchObject.name = name;
      searchObject.fullName = fullName;
      searchObject.publisher = response.biography.publisher;
      searchObject.aliases = [];

      var heroImage = response.image.url;

      //Update DOM with superhero data
      $("#characterName").append("<h1>" + name + "</h1>");
      $('#issue-header span').text(name);
      $("#image").attr("src", heroImage).attr("alt", name);

      var aliases = response.biography.aliases;
      var aliasesText = "Aliases: ";

      for (var i = 0; i < aliases.length; i++) {
        aliasesText += i < aliases.length - 1 ? aliases[i] + ", " : aliases[i];
        searchObject.aliases.push(aliases[i]);
      }

      $("#characterDetails").append("<p>Full Name: " + response.biography["full-name"] + "</p>");
      $("#characterDetails").append("<p>" + aliasesText + "</p>");
      $("#characterDetails").append("<p>Place of Birth: " + response.biography["place-of-birth"] + "</p>");
      $("#characterDetails").append("<p>First Appearance: " + response.biography["first-appearance"] + "</p>");
      $("#characterDetails").append("<p>Publisher: " + response.biography.publisher + "</p>");

      getComics(searchObject);
    });
  }

  //Function to get books and comics related to the superhero from goodreads api
  function getComics(searchObject) {
    //Remove punctuation and make names lower case to use in search
    searchObject.aliases = searchObject.aliases.map((name) => normalizeName(name)).filter((x) => x);
    searchObject.fullName = normalizeName(searchObject.fullName);
    searchObject.name = normalizeName(searchObject.name);
    searchObject.publisher = normalizeName(searchObject.publisher);

    //Get the result from the comicvine api search endpoint to get characterid
    var queryURL = comicvineRoot + "search/?api_key=" + comicvineToken + "&query=" + searchObject.name +
      "&resources=character&resource_type=character&format=json&limit=100";

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {

      //Get the character from the search results
      var character = response.results.find((x) =>
          (searchObject.publisher.includes(x.publisher ? normalizeName(x.publisher.name) : "") && searchObject.name === normalizeName(x.name)) ||
          searchObject.fullName === normalizeName(x.real_name) ||
          foundInAliases(x.aliases, searchObject.aliases)
      );

      if(!character){
        showErrorModal('No comics found for ' + searchObject.name);
        return;
      }

      //Get the character details, specifically the issue credits that the character appeared in
      $.ajax({
        url: comicvineRoot + "character/4005-" + character.id + "/?api_key=" + comicvineToken + "&format=json",
        method: "GET",
      }).then(function (r) {
        var comics = r.results.issue_credits.slice(0, 10);

        if(comics.length === 0){
          showErrorModal('No comics found for ' + searchObject.name);
          return;
        }

        for (var i = 0; i < comics.length; i++) {
          getComicDetails(comics[i].id, i);
        }
      });
    });
  }

  //Get the image url for the comics and set up the carousel
  function getComicDetails(id, index) {
    $.ajax({
      url: comicvineRoot + "/issue/4000-" + id + "/?api_key=" + comicvineToken + "&format=json",
      method: "GET",
    }).then(function (r) {
      var active = index === 0 ? " active" : "";
      var comicImage = r.results.image.super_url;
      var comicName =  r.results.volume.name ? r.results.volume.name : "Slide " + index + 1;



      $(".carousel-inner").append(
        "<div class='carousel-item" + active + " col-12 col-sm-6 col-md-4 col-lg-3 px-0'><a href='" + r.results.site_detail_url + "' target='_blank'><img class='d-block w-100 h-100 mx-auto' src=" +
          comicImage + " alt='" + comicName + "'></a></div>");
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

  function foundInAliases(list, aliases) {
    if (list && aliases) {
      list = list.split("\n");

      for (var i = 0; i < list.length; i++) {
        if (aliases.includes(normalizeName(list[i]))) {
          return true;
        }
      }
    }

    return false;
  }

  function normalizeName(name) {
    var result = "";

    if (name) {
      result = removePunctuation(name.toLowerCase());
    }

    return result;
  }

  function showErrorModal(error){
    var modalBody = $('.modal-body');
    var modalFooter = $('.modal-footer')

    modalBody.empty();
    modalFooter.empty();

    modalBody.append('<p>' + error + '<p>');
    modalFooter.append('<button data-dismiss="modal" class="btn">OK</button>');

    $('#myModal').modal();

  }

  // FUNCTION CALLS
  $('.container').hide();
  $(".carousel").carousel();
  populateModal(qIndex);
  $("#myModal").modal();

  // EVENT LISTENERS
  
  // listens for button clicks
  $(document).on("click", ".choice", function () {
    qIndex++;
    populateModal(qIndex);
  });

  $(document).on("click", "#goBtn", function (event) {
    event.preventDefault();
    userNumber = $("#userNumber").val();

    if (userNumber <= 0 || userNumber > 731 || isNaN(userNumber)) {
      $("#numQuestion").text(
        "'" +
          userNumber +
          "' is not a valid answer. Please enter a number between 1 and 731."
      );
    } else {
      $("#myModal").modal("hide");
      $('.container').show();
      getSuperHero(userNumber);
    }
  });

  //When an item is slid append it to the list again
  $('#carouselExampleControls').on('slide.bs.carousel', function (e) {
    var e = $(e.relatedTarget);
    var index = e.index();
    
    var itemsPerSlide = 4;
    var totalItems = $('.carousel-item').length;
    
    if (index >= totalItems-(itemsPerSlide-1)) {
        var it = itemsPerSlide - (totalItems - index);
        for (var i=0; i<it; i++) {
            // append slides to end
            if (e.direction=="left") {
                $('.carousel-item').eq(i).appendTo('.carousel-inner');
            }
            else {
                $('.carousel-item').eq(0).appendTo('.carousel-inner');
            }
        }
    }
});
});
