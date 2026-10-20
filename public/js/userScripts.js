// User class
// Watchlist not an empty list but a object/dictionary populated by 'ListBtn' toggle

// Create a User Class
class user {
    constructor(_email, _watchList) {
        this.email = _email;
        this.watchList = [];
    }
}

// on page load, use Firebase's onAuthStateChanged() to verify the login status instead of relying on an isLoggedIn flag.

const username = localStorage.getItem("username");

// Welcome message on home screen
function homeWelcomeMessage() {
    // Select the HTML Section to update
    let welcomeMessageSection = document.querySelector(".greetUser");
    // Write the HTML to the variable to be interpolated
    let output = `
           <h1>Welcome, ${username}!</h1>
        `;

    welcomeMessageSection.innerHTML = output;
}

// Display username next to t

function userWatchlistPage() {
    // Select the HTML Section to update
    let watchlistSection = document.querySelector(".userWatchlistHead");
    // Write the HTML to the variable to be interpolated
    let output = `
           <h1>${username}'s Watchlist</h1>
        `;

    watchlistSection.innerHTML = output;
}
