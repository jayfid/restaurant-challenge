const { MongoClient } = require('mongodb');
const config = require('./config.js');
const mongo = require('./mongo.js');

this.conn = MongoClient.connect(
    config.get('env.db.url'),
    { useNewUrlParser: true },
).then((client) => {
    connections.mongo = client

class Collection {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    /**
     * Returns a promise
     *
     *
     * @returns Promise
     */
    search(params = {}, sortField = null, limit = 10) {
        const sort = {};
        return new Promise((resolve, reject) => {
            if (sortField) {
                sort.sortField = 1;
            }
            const query = collection.mongo.collection(config.get('env.db.connection')).find(params);
            if (sortField) {
                query.sort();
            }
            query.limit(limit);
            query.toArray()
                .then((docs) => {
                    this.res.send(docs);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}

module.exports = Collection;
