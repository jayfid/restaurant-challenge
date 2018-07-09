const express = require('express');
const config = require('./config.js');

const LISTEN_PORT = config.get('listen_port') || 8080;
const app = express();

// enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// may not need these if using GET"
// app.use(express.json());       // to support JSON-encoded bodies
// app.use(express.urlencoded()); // to support URL-encoded bodies

app.get('/search', (req, res) => {
    const params = {};
    if (req.param('type')) {
        params.type = req.param('type');
    }
    if (req.param('grade')) {
        params.grade = { $lte: parseInt(req.param('grade'), 10) };
    }
    res.send(params);
});

app.listen(LISTEN_PORT);
