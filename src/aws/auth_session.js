const { v4: uuidv4 } = require('uuid');

class Manager {
    constructor() {
        this.map = new Map();
    }

    storeSession(tokens) {
        const uuid = uuidv4();
        console.log("Generated uuid: " + uuid);
        this.map.set(uuid, tokens);
        return uuid;
    }

    getSession(uuid) {
        return this.map.get(uuid);
    }

    deleteSession(uuid) {
        return this.map.delete(uuid);
    }
}

module.exports = Manager