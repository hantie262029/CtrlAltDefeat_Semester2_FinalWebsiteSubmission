// One user class to be pulled from across pages/scripts
export class User {
    constructor(email) {
        this.email = email;
        this.username = email.split("@")[0];
        this.watchList = [];
    }
}
