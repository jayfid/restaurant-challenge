const { MongoClient } = require('mongodb');
const config = require('./config.js');

const url = config.get('env.db.url');
const dbName = config.get('env.db.name');
let dbClient;


MongoClient.connect(url,
    { useNewUrlParser: true })
    .then((client) => {
        dbClient = client.db(dbName);
    })
    .catch((err) => {
        if (err) { throw err; }
    });

class Collection {
    /**
     * Resturn a promise
     *
     *
     * @returns Promise
     */
    static search(params = {}, sort_field = null, limit = 10) {
        dbClient.find(
            {
                [params]: params,
                [sort_field]: sort_field,
                [limit]: limit,
            },
        );
    }
}

module.exports = new Collection();
