const { MongoClient } = require('mongodb');
const config = require('./config.js');

class DB {
    getDB() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                return this.db;
            }
            MongoClient.connect(
                config.get('env.db.url'),
                { useNewUrlParser: true },
                (err, conn) => {
                    if (err) { reject(err); }
                    const db = conn.db(conn.db.name);
                    this.db = db;
                    resolve(db);
                },
            );
        },
        );
    }

    insertOne(document) {
        this.getDB.insert(document);
    }

    update(document) {
        const callback = (document) => {
            this.db.collection(
                config.get('env.db.collection')
            )
                .update({
                    camis: document.camis,
                }, document);
        };
    }

    find(params, sort = null, limit = 10) {
        return new Promise((resolve, reject) => {
            this.query = this.conn.collection(config.get('env.db.collection')).find(params);
            if (sort) {
                const sortObj = {};
                sortObj[sort] = 1;
                this.query.sort(sortObj);
            }
            if (limit) {
                this.query.limit(limit);
            }
            this.query.toArray()
                .then((docs) => { resolve(docs); })
                .catch((e) => { reject(e); });
        });
    }
}

module.exports = new DB();
