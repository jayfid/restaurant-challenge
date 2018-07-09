/**
 * A basic server to handle restaurant searches as well as some
 * extras, like 404s/500s/CORS config
 */

const express = require('express');
const config = require('./config.js');
const Collection = require('./collection');
const bodyParser = require('body-parser');

const app = express();

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
    // seemed like a good apprach for now
    if (req.params.type) {
        params.type = req.params.type;
    }
    if (req.params.grade) {
        params.grade = { $lte: parseInt(req.param.grade, 10) };
    }
    return res.send(Collection.search(params));
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
