function User(username) {
    this.username = username;
    this.getUsername = function () {
        return this.username;
    }
}

function LoggedInUser(user, sessionId) {
    this.user = user;
    this.sessionId = sessionId;

    this.getSessionId = function () {
        return this.sessionId;
    }
    this.getUser = function () {
        return this.user;
    }
}

module.exports = {
    User,
    LoggedInUser
}