const { MongoClient } = require('mongodb');
const config = require('./config.js');

const connections = {};
this.conn = MongoClient.connect(
    config.get('env.db.url'),
    { useNewUrlParser: true },
).then((client) => {
    connections.mongo = client;
});

class Collection {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }
    /**
     */
    search(params = {}, sortField = null, limit = 10) {
        // const items = Promise.resolve(this.getItemList(params, sortField, limit));
        // console.log(items);
    }
}

module.exports = Collection;
