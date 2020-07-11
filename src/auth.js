
class User {
    constructor(username) {
        this.username = username;
    }

    getUsername() {
        return this.username;
    }
}

class LoggedInUser {
    constructor(user, sessionId) {
        this.user = user;
        this.sessionId = sessionId;
    }

    getSessionId() {
        return this.sessionId;
    }

    getUser() {
        return this.user;
    }
}

module.exports = {
    User,
    LoggedInUser
}