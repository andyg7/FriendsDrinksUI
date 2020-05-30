function User(username) {
    this.username = username;
}

function LoggedInUser(user, sessionId) {
    this.user = user;
    this.sessionId = sessionId;
}

module.exports = {
    User: User,
    LoggedInUser: LoggedInUser
}