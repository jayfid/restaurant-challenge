const { MongoClient } = require('mongodb');
const config = require('./config');

function connect(url) {
    return MongoClient.connect(url)
        .then(client => client.db());
}

module.exports = async function() {
    let databases = await Promise.all([connect(config.get('env.db.url'))]);
    return {
        development: databases[0]
    }
};
