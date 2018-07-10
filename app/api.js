/**
 * A basic server to handle restaurant searches as well as some
 * extras, like 404s/500s/CORS config
 */

const bodyParser = require('body-parser');
const express = require('express');
const config = require('./config.js');
const Collection = require('./collection.js');

const app = express();

// enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/search', async (req, res) => {
    const params = {};
    // could make this list more dynamic, but this
    // seemed like a good approach for now
    if (req.query.type) {
        params.type = req.query.type;
    }
    if (req.query.grade) {
        params.grade = { $lte: parseInt(req.query.grade, 10) };
    }
    const collection = new Collection(req, res);
    const docs = await collection.search(params, 'camis', 10);
    res.send(docs);
});

// parse application/x-www-form-urlencoded
// catch fallthrough with 404 responses
app.use((req, res) => {
    res.status(404).send('NOT FOUND');
});

// catch failures
app.use((error, req, res) => {
    res.status(500).send('SERVER ERROR', 500);
});

app.listen(config.get('env.server.port'));
