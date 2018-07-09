const db = require('./db');

class Collection {
    constructor() {
        this.db = db;
    }

    /**
     * Resturn a promise
     *
     *
     * @returns Promise
     */
    search(params = {}, sort_field = null, limit = 10) {
        this.db.find(
            {
                [params]: params,
                [sort_field]: sort_field,
                [limit]: limit,
            },
        );
    }
}

module.exports = new Collection();
