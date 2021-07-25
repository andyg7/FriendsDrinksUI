
class CookieExtractor {

	constructor(sessionKey) {
	   this.sessionKey = sessionKey
	}

    getSessionId(req) {
        let sessionId = req.cookies[this.sessionKey];
        if (!sessionId) {
            return null;
        }
    }
}

module.exports = CookieExtractor
