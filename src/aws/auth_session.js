const { v4: uuidv4 } = require('uuid');

function Manager() {
    this.map = new Map(),
        this.storeSession = function (tokens) {
            const uuid = uuidv4();
            console.log("Generated uuid: " + uuid);
            this.map.set(uuid, tokens);
            return uuid;
        },
        this.getSession = function (uuid) {
            return this.map.get(uuid);
        }

}

module.exports = {
    Manager: Manager
}