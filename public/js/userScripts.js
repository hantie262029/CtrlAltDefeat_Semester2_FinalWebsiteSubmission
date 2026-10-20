// User class
// Needs to pull info from firebase user authentication
// Add username/nickname to sign up form and have that link back to the firebase database
// Watchlist not an empty list but a object/dictionary populated by 'ListBtn' toggle

// Create a User Class
export class UserProfile {
    constructor(_uid, _email) {
        this.uid = _uid;
        this.email = _email;
        this.username = _email.split("@")[0];
        this.watchlist = [];
    }
}
