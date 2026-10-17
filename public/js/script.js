class Movie {
    constructor(_title, _releaseDate, _poster, _rating) {
        this.title = _title;
        this.releaseDate = _releaseDate;
        this.poster = _poster;
        this.rating = _rating;
    }
}

const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MDUxNTM3ZDVkZjIzNzM4OGM4N2U2NmYyYTliYTY5ZSIsIm5iZiI6MTc4Njk3NDU1Ny42MDgsInN1YiI6IjZhODMxMTVkZTBhMTc0YTEyZDc2OTNhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.j9JoxPxjbm8XUQ8D-EoDN9RCzUKfHzO4k-qOiGvhu3w'
        }
    };

    async function getMovies(url) {
    let data = await fetch(url, options)
        .then(res => res.json())
        .catch(err => console.error(err));

    console.log('API response:', data);
 
    let movies = data.results.map(movie => new Movie(
            movie.title,
            movie.release_date,
            "https://image.tmdb.org/t/p/w500" + movie.poster_path,
            movie.vote_average
        ));

        console.log('Movie results:', movies);
        return movies;
    }

    function movieCard(movie) {
      console.log("Movie card being built: " + movie.title)
    return `
        <div class="col">
            <div class="card movie-card border-0 bg-transparent">
                <img src="${movie.poster}" class="movie-poster rounded-2" alt="${movie.title}">
                <h6 class="movie-title mt-2 mb-1 d-none d-md-block">${movie.title}</h6>
                <p class="movie-rating mb-0"><img src="../assets/img/star-symbol-icon.png" class="star-icon" alt="star"> ${movie.rating.toFixed(1)}</p>
            </div>
        </div>`;
    }

    !async function () {

     // Carousel - 12 random movies
    let randomPage = Math.floor(Math.random() * 10) + 1; // random page between 1 and 10
    let randomMovies = await getMovies('https://api.themoviedb.org/3/movie/popular?language=en-US&page=' + randomPage);
    randomMovies = randomMovies.slice(0, 12); // grab 12
    console.log("Carousel movies (12):", randomMovies);

    let currentSlideAmount = 0;

    function buildCarousel() {
        let slideAmount = window.innerWidth < 992 ? 3 : 6; // 3 on phone, 6 on desktop

        if (slideAmount === currentSlideAmount) return; // only rebuild when window size changes
        currentSlideAmount = slideAmount;

        let carouselHTML = '';

        for (let i = 0; i < randomMovies.length; i = i + slideAmount) { // loops through slides until its double the slide amount
            let slideMovies = randomMovies.slice(i, i + slideAmount);
            carouselHTML += `
                <div class="carousel-item ${i === 0 ? 'active' : ''}">
                    <div class="row row-cols-${slideAmount} g-2">
                        ${slideMovies.map(movieCard).join('')}
                    </div>
                </div>`;
        }

        document.querySelector('#trendingCarousel .carousel-inner').innerHTML = carouselHTML;
    }

    buildCarousel();
    window.addEventListener('resize', buildCarousel);

    // Top rated - 24 movies
    let randomPage1 = Math.floor(Math.random() * 10) + 1; // random page between 1 and 10
    let randomPage2;

    do { // checking for duplicate numbers
      randomPage2 = Math.floor(Math.random() * 10) + 1;// random page between 1 and 10
    } while (randomPage1 === randomPage2);

    let page1 = await getMovies('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=' + randomPage1); // fetching 2 pages of movies
    let page2 = await getMovies('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=2' + randomPage2);
    let topRated = page1.concat(page2); // combine the movies
    console.log("Fetched Movies:" + topRated)

    topRated.sort((a, b) => b.rating - a.rating); // sort them
    console.log("Sorted Movies:" + topRated)

    topRated = topRated.slice(0, 24); // only grab 24
    console.log("Sorted Movies (24):" + topRated)

    let grid = document.getElementById('topRatedGrid');
    let showMoreBtn = document.getElementById('showMoreTopRated');

    grid.innerHTML = topRated.slice(0, 12).map(movieCard).join('');

    showMoreBtn.addEventListener('click', function () {
        grid.innerHTML += topRated.slice(12, 24).map(movieCard).join('');
        showMoreBtn.classList.add('d-none');
    });
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
