const { MongoClient } = require('mongodb');
const config = require('./config.js');

class DB {
    constructor() {
        MongoClient.connect(config.get('db.url'), { useNewUrlParser: true })
            .then((err, connection) => {
                if (err) { throw err; }
                this.db = connection.db(config.get('db_name'));
            });
    }

    insertOne(document) {
        return new Promise((resolve, reject) => {
            this.db.collection(config.get('db.collection')).insertOne(document)
                .then((err) => { if (err) { reject(err); } });
        });
    }

    update(document) {
        return new Promise((resolve, reject) => {
            this.db.collection(config.get('db_collection')).update({
                id: document.camis,
            }, document)
                .then((err) => { if (err) { reject(err); } });
        });
    }

    find(params, sort = { camis: 1 }, limit = 10) {
        return new Promise((resolve, reject) => {
            this.query = this.db.collection(config.get('db_collection')).find(params);
            if (sort) {
                this.query.sort(sort);
            }
            if (limit) {
                this.query.limit(limit);
            }
            this.query.toArray()
                .then((docs) => { resolve(docs); });
        });
    }
}

module.exports = new DB();
