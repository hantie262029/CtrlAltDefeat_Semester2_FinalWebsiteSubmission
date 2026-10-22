// Movie Class
class Movie {
    constructor(_id, _title, _releaseDate, _poster, _rating, _backdrop, _overview, _genres) {
        this.id = _id;
        this.title = _title;
        this.releaseDate = _releaseDate;
        this.poster = _poster;
        this.rating = _rating;
        this.backdrop = _backdrop;
        this.overview = _overview;
        this.genres = _genres;
    }
}

const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MDUxNTM3ZDVkZjIzNzM4OGM4N2U2NmYyYTliYTY5ZSIsIm5iZiI6MTc4Njk3NDU1Ny42MDgsInN1YiI6IjZhODMxMTVkZTBhMTc0YTEyZDc2OTNhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.j9JoxPxjbm8XUQ8D-EoDN9RCzUKfHzO4k-qOiGvhu3w",
    },
};

async function getMovies(url) {
    let data = await fetch(url, options)
        .then((res) => res.json())
        .catch((err) => console.error(err));

    console.log("API response:", data);

    let movies = data.results.map(
        (movie) =>
            new Movie(
                movie.id,
                movie.title,
                movie.release_date,
                "https://image.tmdb.org/t/p/w500" + movie.poster_path,
                movie.vote_average,
                "https://image.tmdb.org/t/p/w1280" + movie.backdrop_path,
                movie.overview,
                movie.genre_ids,
            ),
    );

    console.log("Movie results:", movies);
    return movies;
}

function movieCard(movie) {
    console.log("Movie card being built: " + movie.title);
    return `
        <div class="col">
            <div class="card movie-card border-0 bg-transparent">
                <img src="${movie.poster}" class="movie-poster rounded-2" alt="${movie.title}">
                <h6 class="movie-title mt-2 mb-1 d-none d-md-block">${movie.title}</h6>
                <p class="movie-rating mb-0"><img src="../assets/img/star-symbol-icon.png" class="star-icon" alt="star"> ${movie.rating.toFixed(1)}</p>
            </div>
        </div>`;
}

!(async function () {
    // Load genre data
    let genres = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options);
    let genreData = await genres.json();

    console.log("genre data: ", genreData);
    // Hero
    let popularMovies = await fetch("https://api.themoviedb.org/3/movie/popular?language=en-US&page=1", options);
    let heroData = await popularMovies.json();

    let heroMovies = heroData.results.slice(0, 5); // only 5
    console.log("Hero movies: ", heroData);

    document.getElementById("heroInner").innerHTML = heroMovies
        .map(
            (movie, i) => `
    <div class="carousel-item ${i === 0 ? "active" : ""}">
      <img src="https://image.tmdb.org/t/p/w1280${movie.backdrop_path}" class="d-block w-100 hero-img" alt="${movie.title}">
      <div class="carousel-caption text-start">
        <h2>${movie.title}</h2>
        <p class="hero-rating">
        <img src="../assets/img/star-symbol-icon.png" class="star-icon" alt="star"> ${movie.vote_average.toFixed(1)}
        </p>
      <p class="hero-overview">${movie.overview}</p>
      </div>
    </div>
    `,
        )
        .join("");

    let carousel = new bootstrap.Carousel("#heroCarousel");
    carousel.cycle(); // autoplay

    // Carousel - 12 trending movies
    let randomMovies = await getMovies("https://api.themoviedb.org/3/trending/movie/day?language=en-US");
    randomMovies = randomMovies.slice(0, 12); // grab 12
    console.log("Carousel movies (12): ", randomMovies);

    let currentSlideAmount = 0;

    function buildCarousel() {
        let slideAmount = window.innerWidth < 992 ? 3 : 6; // 3 on phone, 6 on desktop

        if (slideAmount === currentSlideAmount) return; // only rebuild when window size changes
        currentSlideAmount = slideAmount;

        let carouselHTML = "";

        for (let i = 0; i < randomMovies.length; i = i + slideAmount) {
            // loops through slides until its double the slide amount
            let slideMovies = randomMovies.slice(i, i + slideAmount);
            carouselHTML += `
                <div class="carousel-item ${i === 0 ? "active" : ""}">
                    <div class="row row-cols-${slideAmount} g-2">
                        ${slideMovies.map(movieCard).join("")}
                    </div>
                </div>`;
        }

        document.querySelector("#trendingCarousel .carousel-inner").innerHTML = carouselHTML;
    }

    buildCarousel();
    window.addEventListener("resize", buildCarousel);

    // Top rated - 24 movies
    let page1 = await getMovies("https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1");
    let page2 = await getMovies("https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=2");
    let topRated = page1.concat(page2); // combine the movies
    console.log("Fetched Movies:", topRated);

    topRated = topRated.slice(0, 24); // only grab 24
    console.log("Top rated Movies (24):", topRated);

    let grid = document.getElementById("topRatedGrid");
    let showMoreBtn = document.getElementById("showMoreTopRated");

    grid.innerHTML = topRated.slice(0, 12).map(movieCard).join("");

    showMoreBtn.addEventListener("click", function () {
        grid.innerHTML += topRated.slice(12, 24).map(movieCard).join("");
        showMoreBtn.classList.add("d-none");
    });

    // Library

    


})();

// Navbar CodePen based js below:

(function ($) {
    // Begin jQuery
    $(function () {
        // DOM ready
        // If a link has a dropdown, add sub menu toggle.
        $("nav ul li a:not(:only-child)").click(function (e) {
            $(this).siblings(".nav-dropdown").toggle();
            // Close one dropdown when selecting another
            $(".nav-dropdown").not($(this).siblings()).hide();
            e.stopPropagation();
        });
        // Clicking away from dropdown will remove the dropdown class
        $("html").click(function () {
            $(".nav-dropdown").hide();
        });
        // Toggle open and close nav styles on click
        $("#nav-toggle").click(function () {
            $("nav ul").slideToggle();
        });
        // Hamburger to X toggle
        $("#nav-toggle").on("click", function () {
            this.classList.toggle("active");
        });
    }); // end DOM ready
})(jQuery); // end jQuery

// Home page Hero image slider form codepen

const carouselFrames = Array.from(document.querySelectorAll(".carousel-frame"));

function makeCarousel(frame) {
    const carouselSlide = frame.querySelector(".carousel-slide");
    const carouselImages = getImagesPlusClones();
    const prevBtn = frame.querySelector(".carousel-prev");
    const nextBtn = frame.querySelector(".carousel-next");
    const navDots = Array.from(frame.querySelectorAll(".carousel-dots li"));

    let imageCounter = 1;

    function getImagesPlusClones() {
        let images = frame.querySelectorAll(".carousel-slide img");

        const firstClone = images[0].cloneNode();
        const lastClone = images[images.length - 1].cloneNode();

        firstClone.className = "first-clone";
        lastClone.className = "last-clone";

        // we need clones to make an infinite loop effect
        carouselSlide.append(firstClone);
        carouselSlide.prepend(lastClone);

        // must reassign images to include the newly cloned images
        images = frame.querySelectorAll(".carousel-slide img");

        return images;
    }

    function initializeNavDots() {
        if (navDots.length) navDots[0].classList.add("active-dot");
    }

    function initializeCarousel() {
        carouselSlide.style.transform = "translateX(-100%)";
    }

    function slideForward() {
        // first limit counter to prevent fast-change bugs
        if (imageCounter >= carouselImages.length - 1) return;
        carouselSlide.style.transition = "transform 400ms";
        imageCounter++;
        carouselSlide.style.transform = `translateX(-${100 * imageCounter}%)`;
    }

    function slideBack() {
        // first limit counter to prevent fast-change bugs
        if (imageCounter <= 0) return;
        carouselSlide.style.transition = "transform 400ms";
        imageCounter--;
        carouselSlide.style.transform = `translateX(-${100 * imageCounter}%)`;
    }

    function makeLoop() {
        // instantly move from clones to originals to produce 'infinite-loop' effect
        if (carouselImages[imageCounter].classList.contains("last-clone")) {
            carouselSlide.style.transition = "none";
            imageCounter = carouselImages.length - 2;
            carouselSlide.style.transform = `translateX(-${100 * imageCounter}%)`;
        }

        if (carouselImages[imageCounter].classList.contains("first-clone")) {
            carouselSlide.style.transition = "none";
            imageCounter = carouselImages.length - imageCounter;
            carouselSlide.style.transform = `translateX(-${100 * imageCounter}%)`;
        }
    }

    function goToImage(e) {
        carouselSlide.style.transition = "transform 800ms";
        imageCounter = 1 + navDots.indexOf(e.target);
        carouselSlide.style.transform = `translateX(-${100 * imageCounter}%)`;
    }

    function highlightCurrentDot() {
        navDots.forEach((dot) => {
            if (navDots.indexOf(dot) === imageCounter - 1) {
                dot.classList.add("active-dot");
            } else {
                dot.classList.remove("active-dot");
            }
        });
    }

    function addBtnListeners() {
        nextBtn.addEventListener("click", slideForward);
        prevBtn.addEventListener("click", slideBack);
    }

    function addNavDotListeners() {
        navDots.forEach((dot) => {
            dot.addEventListener("click", goToImage);
        });
    }

    function addTransitionListener() {
        carouselSlide.addEventListener("transitionend", () => {
            makeLoop();
            highlightCurrentDot();
        });
    }

    function autoAdvance() {
        let play = setInterval(slideForward, 5000);

        frame.addEventListener("mouseover", () => {
            clearInterval(play); // pause when mouse enters carousel
        });

        frame.addEventListener("mouseout", () => {
            play = setInterval(slideForward, 5000); // resume when mouse leaves carousel
        });

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                clearInterval(play); // pause when user leaves page
            } else {
                play = setInterval(slideForward, 5000); // resume when user returns to page
            }
        });
    }

    function buildCarousel() {
        initializeCarousel();
        initializeNavDots();
        addNavDotListeners();
        addBtnListeners();
        addTransitionListener();
        autoAdvance();
    }

    buildCarousel();
}

carouselFrames.forEach((frame) => makeCarousel(frame));
