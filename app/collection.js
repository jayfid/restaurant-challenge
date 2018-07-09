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
    static search(params = {}, sortField = null, limit = 10) {
        return new Promise((resolve, reject) => {
            const query = dbClient. .find(params);
            if (sortField) {
                query.sort({ [sortField]: 1 });
            }
            query.limit(limit);
            query.toArray()
                .then((docs) => {
                    resolve(docs);
                })
                .catch((err) => {
                    console.log(err);
                    reject(err);
                });
        });
    }
}

module.exports = Collection;
