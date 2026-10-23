// User class

// on page load, use Firebase's onAuthStateChanged() to verify the login status instead of relying on an isLoggedIn flag.

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

const username = currentUser?.username ?? "Guest";

// Welcome message on home screen
function homeWelcomeMessage() {
    // Select the HTML Section to update

    let welcomeMessageSection = document.querySelector(".greetUser");

    // Write the HTML to the variable to be interpolated
    if (welcomeMessageSection) {
        welcomeMessageSection.innerHTML = `<h1>Welcome back, ${username}!</h1>`;
    }
}

function userWatchlistPage() {
    // Select the HTML Section to update
    let watchlistSection = document.querySelector(".userWatchlistHead");

    // Write the HTML to the variable to be interpolated
    if (watchlistSection) {
        let output = `
           <h1>${username}'s Watchlist</h1>
        `;

        watchlistSection.innerHTML = output;
    }
}
