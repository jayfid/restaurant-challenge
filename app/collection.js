const { MongoClient } = require('mongodb');
const config = require('./config');

class Collection {
    async search(params, sortField = null, limit = 10) {
        return this.query(params, sortField, limit);
    }

    query(params, sortField, limit) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(
                config.get('env.db.url'),
                { useNewUrlParser: true },
                (err, db) => {
                    const collection = db
                        .db(config.get('env.db.name'))
                        .collection(config.get('env.db.collection'));
                    
                    const search = collection.find(params);
                    if (sortField) {
                        search.sort({ [sortField]: 1 });
                    }
                    if (limit) {
                        search.limit(limit);
                    }
                    search.toArray((error, docs) => {
                        if (error) { reject(err); }
                        resolve(docs);
                    });
                },
            );
        });
    }
}

module.exports = Collection;
