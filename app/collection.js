const config = require('./config.js');
const client = db.connectToServer( function( err ) {
    throw err;
  } );

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
            const query = dbClient.collection(config.get('env.db.connection')).find(params);
            if (sortField) {
                query.sort();
            }
            query.limit(limit);
            query.toArray()
                .then((docs) => {
                    this.res.send(docs);
                })
                .catch((err) => {
                    console.log(err);
                    reject(err);
                });
        });
    }
}

module.exports = Collection;
