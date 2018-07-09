const db = require('./db');

class Collection {
    constructor() {
        this.db = db;
    }
}

module.exports = new Collection();
