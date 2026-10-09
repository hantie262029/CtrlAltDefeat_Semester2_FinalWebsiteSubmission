class Movie {
    constructor(_title, _releaseDate, _poster) {
        this.title = _title;
        this.releaseDate = _releaseDate;
        this.poster = _poster;
    }
}

!async function () {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MDUxNTM3ZDVkZjIzNzM4OGM4N2U2NmYyYTliYTY5ZSIsIm5iZiI6MTc4Njk3NDU1Ny42MDgsInN1YiI6IjZhODMxMTVkZTBhMTc0YTEyZDc2OTNhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.j9JoxPxjbm8XUQ8D-EoDN9RCzUKfHzO4k-qOiGvhu3w'
        }
    };

    let data = await fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
        .then(res => res.json())
        .catch(err => console.error(err));

    console.log(data);

    let movie = data.results[0]; //First movie

    let title = movie.original_title;
    let releaseDate = movie.release_date;
    let poster = "https://image.tmdb.org/t/p/w500" + movie.poster_path;

    let newMovie = new Movie(title, releaseDate, poster);

    document.getElementById('title').innerHTML = newMovie.title;
    document.getElementById('releaseDate').innerHTML = newMovie.releaseDate;
    document.getElementById('poster').src = newMovie.poster;
}();





// Navbar CodePen based js below:

(function($) { // Begin jQuery
  $(function() { // DOM ready
    // If a link has a dropdown, add sub menu toggle.
    $('nav ul li a:not(:only-child)').click(function(e) {
      $(this).siblings('.nav-dropdown').toggle();
      // Close one dropdown when selecting another
      $('.nav-dropdown').not($(this).siblings()).hide();
      e.stopPropagation();
    });
    // Clicking away from dropdown will remove the dropdown class
    $('html').click(function() {
      $('.nav-dropdown').hide();
    });
    // Toggle open and close nav styles on click
    $('#nav-toggle').click(function() {
      $('nav ul').slideToggle();
    });
    // Hamburger to X toggle
    $('#nav-toggle').on('click', function() {
      this.classList.toggle('active');
    });
  }); // end DOM ready
})(jQuery); // end jQuery


// CodePen Based Sign in/up js below:
// INPUT FIELDS

$(function() {
   $(".input input").focus(function() {
      $(this).parent(".input").each(function() {
         $("label", this).addClass("label-active label-blue")
         $("input", this).addClass("line-active")
      });
   }).blur(function() {
      $("input").removeClass("line-active")
     $("label").removeClass("label-blue")
      if ($(this).val() == "") {
         $(this).parent(".input").each(function() {
            $("label", this).removeClass("label-active")
         });
      }
   });

});

// CARD SWAPPING

$(".account-check").click(function(){
    $(".card").toggleClass("hidden");
  
  $("#register").removeClass("register-swap");
  $("#login").removeClass("login-swap");
  setTimeout(function() {
    $("#register").addClass("register-swap");
  $("#login").addClass("login-swap");
}, 50);
});


// MOUSE EVENTS

$('#phone *').mouseover(function(){
  $(this).css({cursor: 'none'});
});

$(document).on('mousemove', function(e){
  $('#cursor').css({
    left:  e.pageX,
    top:   e.pageY
  });
});

$( "#phone" ).mouseover(function() {
  $( "#cursor" ).css("display", "block")
});

$( "#phone *" ).mouseout(function() {
  $( "#cursor" ).css("display", "none")
});

$( "#phone *" ).mousedown(function() {
   $( "#cursor" ).css("transform", "scale(0.8)")
});

$( "#phone *" ).mouseup(function() {
   $( "#cursor" ).css("transform", "scale(1)")
});


// CLOCK

var $document = $(document);
(function () { 
  var clock = function () {
      clearTimeout(timer);
    
      date = new Date();    
      hours = date.getHours();
      minutes = date.getMinutes();
      dd = (hours >= 12) ? 'pm' : 'am';
      hours = (hours > 12) ? (hours - 12) : hours
      
      var timer = setTimeout(clock, 10000);
    
    $('.hours').html('<p>' + Math.floor(hours) + ':</p>');
    $('.minutes').html('<p>' + Math.floor(minutes) + '</p>');
   $('.twelvehr').html('<p>' + dd + '</p>');
  };
  clock();
})();

