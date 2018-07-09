/**
 * A basic server to handle restaurant searches as well as some
 * extras, like 404s/500s/CORS config
 */

const bodyParser = require('body-parser');
const express = require('express');
const { MongoClient } = require('mongodb');
const config = require('./config.js');
const Collection = require('./collection.js');

const app = express();

let dbClient;

MongoClient.connect(config.get('env.db.url'), { useNewUrlParser: true })
    .then((client) => {
        dbClient = client.db(config.get('env.db.name'));
    });

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/search', (req, res) => {
    const params = {};
    // could make this list more dynamic, but this
    // seemed like a good approach for now
    if (req.params.type) {
        params.type = req.params.type;
    }
    if (req.params.grade) {
        params.grade = { $lte: parseInt(req.param.grade, 10) };
    }
    const collection = new Collection(req, res);
    return res.send(collection.search(params));
});

// catch fallthrough with 404 responses
app.use((req, res) => {
    res.status(404).send('NOT FOUND');
});

// catch failures
app.use((error, req, res) => {
    res.status(500).send('SERVER ERROR', 500);
});
app.listen(config.get('env.server.port'));
