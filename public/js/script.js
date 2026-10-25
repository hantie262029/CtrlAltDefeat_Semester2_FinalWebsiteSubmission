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

    let movies = data.results.filter((movie) => movie.poster_path).map( // skip movies that don't have a poster
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
            <a href="individualmovie.html?id=${movie.id}" class="text-decoration-none text-reset">
                <div class="card movie-card border-0 bg-transparent">
                    <img src="${movie.poster}" class="movie-poster rounded-2" alt="${movie.title}">
                    <h6 class="movie-title mt-2 mb-1 d-none d-md-block">${movie.title}</h6>
                    <p class="movie-rating mb-0"><img src="../assets/img/star-symbol-icon.png" class="star-icon" alt="star"> ${movie.rating.toFixed(1)}</p>
                </div>
            </a>
        </div>`;
}

function watchCard(movie) { // use in wishlist
    console.log("Movie card being built: " + movie.title);
    return `
        <div class="col-md-2 mt-3 watchlistDiv">
            <div class="text-decoration-none text-reset">
                <div class="card movie-card border-0 bg-transparent">
                    <a href="individualmovie.html?id=${movie.id}">
                        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="movie-poster rounded-2" alt="${movie.title}"></a>
                    <div class="watchlistCardDiv">
                        <div>
                            <h6 class="movie-title mt-2 mb-1 d-none d-md-block">${movie.title}</h6>
                            <p class="movie-rating mb-0"><img src="../assets/img/star-symbol-icon.png" class="star-icon" alt="star"> ${movie.vote_average.toFixed(1)}</p>
                        </div>
                            <button class="ListBtn iconWrapper btn btn-primary" onclick="addToWatchlist(${movie.id})"><i class="fa-regular fa-heart"></i><i class="fa-solid fa-heart"></i></button>
                        </div>
                </div>
            </div>
        </div>`;
}


function libraryCard(movie) {
    console.log("Library card being built: " + movie.title);
    return `
        <div class="col-lg-6 mt-3">
            <div class="card libraryCard info-box h-100">
            <div class="row h-100">
            <div class="col-sm-5">
                <div class="libraryCardImg">
                    <img src="${movie.poster}" class="card-img" style="object-fit:cover;" alt="${movie.title}">
                </div>
            </div>

            <div class="col-sm-7 card-body">
            <div class="libraryCardInfo">
                <h3 class="card-title libraryCardTitle">${movie.title}</h3>
                <p>
                <span class="libraryRating"><img src="../assets/img/star-symbol-icon.png" class="star-icon" alt="star"> ${movie.rating.toFixed(1)}</span> <br />
                Release date: <span class="libraryReleaseDate">${movie.releaseDate}</span>
                </p>
                <p class="card-title">${movie.overview}</p>
                <div class="movieCardBtn">
                    <a href="individualmovie.html?id=${movie.id}" class="MovieBtn btn btn-primary">View Movie</a>
                    <button class="ListBtn iconWrapper btn btn-primary" onclick="addToWatchlist(${movie.id})"><i class="fa-regular fa-heart"></i><i class="fa-solid fa-heart"></i></button>
                </div>
            </div>
            </div>

            </div>
            </div>
        </div>`;
}

// Watchlist functionality
async function addToWatchlist(movieID) {
    // Load UsersArray & CurrentUser from localStorage
    const usersArray = JSON.parse(localStorage.getItem("usersArray"));
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // Identify which movie's id matches that of the clicked button
    let response = await fetch(`https://api.themoviedb.org/3/movie/${movieID}`, options); // this is the movie being selected
    let movie = await response.json();
    // console.log("Movie Selected: ", movie);

    // Check if it is already in the watchlist
    // Use the some() method to check if the movieID is present in the currentUser.watchList array
    const result = currentUser.watchList.some(
        movie => movie.id === movieID);

    let title = movie.title;

    // Check the result and log a message
    if (result) {
        // If already in watchlist, remove it
        // Find the movie's index in the watchlist
        const movieIndex = currentUser.watchList.findIndex(
            movie => movie.id === movieID
        );

        currentUser.watchList.splice(movieIndex, 1);
        alert("Removed '" + title + "' from Watchlist");

    } else {
        //If not, add to watchlist
        currentUser.watchList.push(movie);

        alert("Added '" + title + "' to Watchlist");
    }

    // Update currentUser in localStorage
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    // Find currentUser in userArray and update in localStorage
    // Find the current user in usersArray
    const userIndex = usersArray.findIndex(
        user => user.email === currentUser.email);

    // Update the user
    usersArray[userIndex] = currentUser;

    localStorage.setItem("usersArray", JSON.stringify(usersArray));
}


!(async function () {
    // Load genre data
    let genres = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options);
    let genreData = await genres.json();

    console.log("genre data: ", genreData);

    if (document.getElementById("heroInner")) {

        // Hero
        let heroMovies = await getMovies("https://api.themoviedb.org/3/movie/popular?language=en-US&page=1", options);
        heroMovies = heroMovies.slice(0, 5); // only 5
        console.log("Hero movies: ", heroMovies);

        document.getElementById("heroInner").innerHTML = heroMovies
            .map((movie, i) => `
            <div class="carousel-item ${i === 0 ? "active" : ""}">
                <a href="individualmovie.html?id=${movie.id}" class="d-block text-decoration-none text-reset">
                    <img src="${movie.backdrop}" class="d-block w-100 hero-img" alt="${movie.title}">
                    <div class="carousel-caption text-start">
                        <h2>${movie.title}</h2>
                        <p class="hero-rating">
                        <img src="../assets/img/star-symbol-icon.png" class="star-icon" alt="star"> ${movie.rating.toFixed(1)}
                        </p>
                        <p class="hero-overview d-none d-md-block">${movie.overview}</p>
                    </div>
                </a>
            </div>
            `,
        ).join("");

    let carousel = new bootstrap.Carousel("#heroCarousel");
    carousel.cycle(); // autoplay

    // Carousel - 12 trending movies
    let trendingMovies = await getMovies("https://api.themoviedb.org/3/trending/movie/day?language=en-US");
    trendingMovies = trendingMovies.slice(0, 12); // grab 12
    console.log("Carousel movies (12): ", trendingMovies);

    let currentSlideAmount = 0;

    function buildCarousel() {
        let slideAmount = window.innerWidth < 992 ? 3 : 6; // 3 on phone, 6 on desktop

        if (slideAmount === currentSlideAmount) return; // only rebuild when window size changes
        currentSlideAmount = slideAmount;

        let carouselHTML = "";

        for (let i = 0; i < trendingMovies.length; i = i + slideAmount) {
            // loops through slides until its double the slide amount
            let slideMovies = trendingMovies.slice(i, i + slideAmount);
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

    } else if (document.getElementById("watchlistInner")) {
        // watchlist code goes here -->

        // Load UsersArray & CurrentUser from localStorage
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        console.log(currentUser.watchList.length)
        console.log(currentUser)
        watchListDiv = document.getElementById("watchlistInner");

        // If the watchlist is empty, display a message
        if (currentUser.watchList.length === 0) {
            watchListDiv.innerHTML = `
                <div class='watchListEmptyDiv '>
                    <h5>Your Watchlist is currently empty</h5>
                    <p>Please heart some movies to see your watchlist</p>

                </div>`
        } else { // otherwise, populate with page similarly to the home screen
            const moviesList = currentUser.watchList;

            watchListDiv.innerHTML = moviesList.map(watchCard).join("");
        }

    } else if (document.getElementById("libraryInner")) {
        // Library
        async function loadLibrary(genreId) {
            let url = "https://api.themoviedb.org/3/discover/movie?language=en-US&sort_by=popularity.desc&with_genres=" + genreId;

            let page1 = await getMovies(url + "&page=1");
            let page2 = await getMovies(url + "&page=2");
            let libraryMovies = page1.concat(page2); // 40 movies (brief needs 25+)
            console.log("Library Movie list:", libraryMovies);

            document.getElementById("libraryInner").innerHTML = libraryMovies.map(libraryCard).join("");
        }

        let searchTerm = localStorage.getItem("searchTerm");
        localStorage.removeItem("searchTerm"); // clear search term local storage after putting it in variable

        if (searchTerm) {
            let results = await getMovies("https://api.themoviedb.org/3/search/movie?language=en-US&query=" + searchTerm);

            if (results.length > 0) {
                document.getElementById("libraryInner").innerHTML = results.map(libraryCard).join("");
            } else {
                document.getElementById("libraryInner").innerHTML = `<p class="text-center py-5">No movies found for "${searchTerm}"</p>`;
            }
        } else {
            loadLibrary(""); // load movies as usual if no search
        }

        let buttons = document.querySelectorAll(".filterBtn button"); // fetch filter buttons

        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                buttons.forEach((b) => {
                    b.classList.remove("active");
                });

                button.classList.add("active");

                let genreId = button.dataset.genre;
                console.log("Genre ID:", genreId);

                loadLibrary(genreId);
            });
        });

    } else if (document.getElementById("moviePageInner")) {

        let params = new URLSearchParams(window.location.search);
        let movieId = params.get("id");
        console.log("Movie ID:", movieId);

        let response = await fetch (`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, options);
        let movie = await response.json();
        console.log("Selected Movie:", movie);

        let genreNames = movie.genres.map((genre) => genre.name).join(", ");

        document.getElementById("moviePageInner").innerHTML=`
            <div class="col-sm-12 col-lg-6">
                <img class="card-img-top rounded-3" style="object-fit:cover;" src="https://image.tmdb.org/t/p/w1280${movie.backdrop_path}" alt="${movie.title}" />
            </div>
            <div class="movieText col-sm-12 col-lg-6">
                <h1>${movie.title}</h1>
                <p>
                <img src="../assets/img/star-symbol-icon.png" class="star-icon" alt="star"> ${movie.vote_average.toFixed(1)} <br />
                ${genreNames} <br />
                ${movie.runtime} min<br />
                Release date: ${movie.release_date}
                </p>
                <p>${movie.overview}</p>
                <div class="individualMovieBtn">
                    <div>
                        <button type="button" class="playBtn btn btn-primary"><i class="fa-solid fa-play"></i></button>
                    </div>
                    <div>
                        <button class="ListBtn iconWrapper btn btn-primary col-md-8" onclick="addToWatchlist(${movie.id})">
                    <i class="fa-regular fa-heart"></i><i class="fa-solid fa-heart"></i>
                </button>
                    </div>
                </div>
        </div>`;

        // Similiar Movie reccomendations
        let similiarMovies = await getMovies(`https://api.themoviedb.org/3/movie/${movieId}/similar`);
        similiarMovies = similiarMovies.slice(0,12); // grab 12 movies
        console.log("Similiar Movies movies: ", similiarMovies);

        let currentSlideAmount = 0;

        function buildCarousel() {
        let slideAmount = window.innerWidth < 992 ? 3 : 6; // 3 on phone, 6 on desktop

        if (slideAmount === currentSlideAmount) return; // only rebuild when window size changes
        currentSlideAmount = slideAmount;

        let carouselHTML = "";

        for (let i = 0; i < similiarMovies.length; i = i + slideAmount) {
            // loops through slides until its double the slide amount
            let slideMovies = similiarMovies.slice(i, i + slideAmount);
            carouselHTML += `
                <div class="carousel-item ${i === 0 ? "active" : ""}">
                    <div class="row row-cols-${slideAmount} g-2">
                        ${slideMovies.map(movieCard).join("")}
                    </div>
                </div>`;
        }

        document.querySelector("#similiarCarousel .carousel-inner").innerHTML = carouselHTML;
    }

    buildCarousel();
    window.addEventListener("resize", buildCarousel);

    } else {
        return
    }

})();

// SEARCH BAR
document.querySelectorAll(".searchNav").forEach((input) => {
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
        let searchText = input.value.trim(); // get what the user typed

            if (searchText !== "") {
                localStorage.setItem("searchTerm", searchText); // save the search
                window.location.href = "library.html"; // go to the library page
            }
        }
    });
});

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
