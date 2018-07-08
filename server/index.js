'use strict';

require('dotenv').config();
const config = require('config');
const express = require('express');
const app = express();
const mongo = require('mongodb').MongoClient;

mongo.connect(config.get('db.url'), (err, client) => {
    if (err) { throw err; }
    this.db = client.db(config.get('db.name'));
});

// enable CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// may not need these if using GET"
// app.use(express.json());       // to support JSON-encoded bodies
// app.use(express.urlencoded()); // to support URL-encoded bodies

app.get('/search', (req, res) => {
    var params = {};
    if (req.param('type')) {
        params.type = req.param('type');
    }
    if (req.param('grade')) {
        params.grade = {$lte: parseInt(req.param('grade'), 10)};
    }
    return new Promise((resolve, reject) => {
        this.db.collection(config.get('db.collection'))
            .find(params)
            .sort({ camis: 1 })
            .limit(10)
            .toArray()
            .then(docs => { res.send(docs); });
    });
});

app.listen(config.get('listen_port'));
