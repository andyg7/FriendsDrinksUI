const { v4: uuidv4 } = require('uuid');

class Manager {
    constructor() {
        this.map = new Map();
    }

    storeSession(tokens) {
        const uuid = uuidv4();
        console.log("Generated uuid: ", uuid);
        let session = new Session(uuid, tokens);
        this.map.set(uuid, session);
        return uuid;
    }

    getSession(uuid) {
        let session = this.map.get(uuid);
        if (!session) {
            return null;
        } else {
            if (session.isExpired()) {
                console.log("uuid ", uuid, " is expired")
                this.map.delete(uuid);
                return null;
            } else {
                return session.getTokens();
            }
        }
    }

    deleteSession(uuid) {
        return this.map.delete(uuid);
    }
}

class Session {
    constructor(uuid, tokens) {
        this.uuid = uuid;
        this.tokens = tokens;
        let expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getMinutes() + 5);
        this.expiration = expirationDate.toISOString();
        console.log("expiration: ", this.expiration);
    }

    getUuid() {
        return this.uuid;
    }

    getTokens() {
        return this.tokens;
    }

    isExpired() {
       let now = new Date().toISOString();
       console.log("comparing ", this.expiration, now);
       if (this.expiration < now) {
        return true;
       } else {
        return false;
       }
    }
}

module.exports = Manager