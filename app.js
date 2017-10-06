var baseURL = "https://api.edamam.com/search"
var appId = "79cadef9"
var appKey = "0a17582107ea8f662ffaf8279e8731fa"
var from = 0
var to = 48
var range = "&from=" + from + "&to=" + to
let saveUnsaveRecipe

$(document).ready(function() {
  activateApp()
  smoothScroll()
  $("form.search-form").submit(findRecipes)
}); // end of document ready function

function validInput() {
  return $(".main-search").val() !== ""
}

function findRecipes(event) {
  event.preventDefault()
  if (validInput()) {
    initiateSearchBehavior()
    var query = $(".main-search").val().replace(/ /g, ",").replace(/,,/g, ",")
    var requestURL = `${baseURL}?q=${query}${range}`
    var settings = {
      "url": requestURL,
      "method": "GET",
      "headers": {
        "app_id": appId,
        "app_key": appKey,
      }
    }
    $.ajax(settings).then(appendRecipeCards)
    $(".main-search").val("")
  }
}

function initiateSearchBehavior() {
  $(".search-content").show()
  $('html, body').animate( {
    scrollTop: $(".search-content").offset().top
  }, 3000);
  $("#loading").show()
  $("#search-results").empty()
  $("#query").text($(".main-search").val())
}

function ingredientList(array) {
  var list = $("<ul></ul>")
  for (var i = 0; i < array.length; i++) {
    list.append("<li style='list-style-type: disc'>" + array[i])
  }
  return list
};

function createNewCard(parent, recipe, id, buttonContent) {
  let card = `
    <div class="card col s12 m3">
      <div class="card-image waves-effect waves-block waves-light">
        <img class="activator" src="${recipe.image}">
      </div>
      <div class='card-content'>
        <span class='card-title activator grey-text text-darken-4'>
          <i class='material-icons right'>more_vert</i>${recipe.label}
        </span>
        <a id='${id}' class='btn waves-effect waves-light'>${buttonContent}</a>
      </div>
      <div class='card-reveal'>
        <span class='card-title grey-text text-darken-4'>
          <i class='material-icons right'>close</i>${recipe.label}
        </span>
        ${ingredientList(recipe.ingredientLines)}
        <p>
          <a class='link' target='_blank' href='${recipe.url}'>See Full Recipe
            <i class='material-icons'>open_in_new</i>
          </a>
        </p>
      </div>
    </div>
  `
  addSaveUnsave(parent, card, id, recipe)
} // end of create new card function

function addSaveUnsave(parent, card, id, recipe) {
  $(parent).delay(200).fadeIn(800, function() {
    $(this).append(card)
    $('a#' + id).click(function() {
      event.preventDefault()
      if ($(this).text() == "Save") {
        increaseCounter(recipe)
        appendSaved(recipe)
        $(this).parent().parent().delay(1000).fadeOut(300, function() {
          $(this).remove();
        })
        console.log('save button');
      } else {
        console.log('not save button');
      }
    })
  })
}

function increaseCounter(recipe) {
  $("#parenthesis").show()
  var counter = Number($("#counter").text()) + 1
  $("#counter").text(counter)
}

function saveUnsave(recipe) {
  if ($(this).text() == "Save") {

  } else if ($(this).text() == "Unsave") {
    var counter = Number($("#counter").text()) - 1
    $("#counter").text(counter)
    createNewCard($("#search-results"), recipe, "Save")
    $(this).parent().parent().delay(500).fadeOut(400, function() {
      $(this).remove();
    })
    if (Number($("#counter").text()) === 0) {
      $("#saved-recipes").delay(500).fadeOut(400, function() {
        $(this).hide()
      })
      $("#parenthesis").hide()
      $(document).scrollTop("#saved-recipes").offset()
    }
  }
}

function appendRecipeCards(data) {
  $("#loading").hide()
  for (var i = 0; i < data.hits.length; i++) {
    createNewCard($("#search-results"), data.hits[i].recipe, i, "Save")
  }
}

function appendSaved(recipe) {
  $("#saved-recipes").show()
  createNewCard($(".saved-recipes"), recipe, "Unsave")
};

function smoothScroll() {
  $('a[href^="#"]').on('click',function (e) {
    e.preventDefault()
    var target = this.hash
    var $target = $(target)
    $('html, body').stop().animate({
        'scrollTop': $target.offset().top
    }, 900, 'swing', function () {
        window.location.hash = target
    })
  })
}

function activateApp() {
  $(".button-collapse").sideNav()
  $(".parallax").parallax();
  $("#parenthesis").hide()
  $(".search-content").hide()
  $("#saved-recipes").hide()
}
