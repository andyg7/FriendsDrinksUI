
class CookieExtractor {

	constructor(sessionKey) {
	   this.sessionKey = sessionKey
	}

    getSessionId(req) {
        let sessionId = req.cookies[this.sessionKey];
        if (!sessionId) {
            if (!req.body) {
                return req.body.sessionId;
            } else {
                return null;
            }
        } else {
            return sessionId;
        }
    }
}

module.exports = CookieExtractor
