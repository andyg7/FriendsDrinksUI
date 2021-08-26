
class SessionIdExtractor {

    constructor(sessionKey) {
        this.sessionKey = sessionKey
    }

    getSessionId(req) {
        let sessionId = req.cookies[this.sessionKey];
        if (!sessionId) {
            return null;
        } else {
            return sessionId;
        }
    }
}

module.exports = SessionIdExtractor
