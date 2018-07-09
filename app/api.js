/**
 * A basic server to handle restaurant searches as well as some
 * extras, like 404s/500s/CORS config
 */

const express = require('express');
const config = require('./config.js');

const LISTEN_PORT = parseInt(config.get('listen_port'), 10) || 8080;
const app = express();

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
    if (req.param('type')) {
        params.type = req.param('type');
    }
    if (req.param('grade')) {
        params.grade = { $lte: parseInt(req.param('grade'), 10) };
    }
    return res.send(params);
});

// catch fallthrough with 404 responses
app.use((req, res) => {
    res.status(404).send('NOT FOUND');
});

// catch failures
app.use((error, req, res) => {
    console.error(error);
    res.send('SERVER ERROR', 500);
});

app.listen(LISTEN_PORT);
