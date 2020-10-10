
class User {
    constructor(email, firstName, lastName) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}

class LoggedInUser {
    constructor(user, sessionId) {
        this.user = user;
        this.sessionId = sessionId;
    }
}

module.exports = {
    User,
    LoggedInUser
}