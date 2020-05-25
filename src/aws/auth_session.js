var uuid = require('uuid');

function Manager() {
    this.map = new Map(),
    this.storeSession = function (tokens) {
        const uuid = uuid.uuidv4();
        this.map.insert(uuid, tokens);
    },
    this.getSession = function (uuid) {
        return this.map.get(uuid);
    }

}

module.exports = {
    Manager: Manager
}