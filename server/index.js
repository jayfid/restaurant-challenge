const express = require('express');
const mongo = require('mongodb').MongoClient;

const app = express();

const LISTEN_PORT = 8080;
const DB_URL = 'mongodb://localhost:27017';
const DB_NAME = 'myApp';
const COLLECTION_NAME = 'restaurants';

mongo.connect(DB_URL, (err, client) => {
  if (err) {
    throw err;
  }
  const db = client.db(DB_NAME);
  this.db = db;
});

// enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// request body parsing
app.use(express.json());
app.use(express.urlencoded());

app.post('/restaurants', (req, res) => {
  const params = {};
  if (req.body.type) {
    params.type = req.body.type;
  }
  if (req.body.grade) {
    params.grade = { $lte: parseInt(req.body.grade, 10) };
  }
  return new Promise(() => {
    this.db.collection(COLLECTION_NAME)
      .find(params)
      .sort({ camis: 1 })
      .limit(10)
      .toArray()
      .then((docs) => { res.send(docs); });
  });
});

app.listen(LISTEN_PORT);
