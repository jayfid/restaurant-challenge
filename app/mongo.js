const {
    MongoClient,
} = require('mongodb');
const config = require('./config.js');

class MongoInterface {
    constructor() {
        this.conn = MongoClient.connect(config.get('env.db.url'), { useNewUrlParser: true })
            .then((client) => {
                this.dbClient = client.db(config.get('env.db.name'));
            });
    }

    insert(record) {
        this.dbClient.collection(config.get('env.db.collection')).insertOne(record);
    }

    getDB() {
        return this.dbClient;
    }
}

module.exports = MongoInterface;
