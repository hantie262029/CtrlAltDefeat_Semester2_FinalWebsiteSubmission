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



