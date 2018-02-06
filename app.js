const express = require('express');
const app = express();
const bodyparser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');


// Connection URL
// const url = 'mongodb://' + process.env.MONGO_PORT_27017_TCP_ADDR + ':27017';
const url = 'mongodb://' + 'my-db' + ':27017';
const dbName = 'dockerdemo';

var db;

MongoClient.connect(url, function (err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  db = client.db(dbName);

  // client.close();
});

app.use(bodyparser.json());
app.use(express.static('public'));

const insertDocument = function (db, document, callback) {

  // Get the documents collection
  const collection = db.collection('documents');
  // Insert some documents
  collection.insertOne(document, function (err, result) {
    callback(err, JSON.stringify(result.ops[0]));
  });
};

app.post('/api/hello', function (req, res) {
  var data = req.body;
  insertDocument(db, data, function(err, result) {
    res.status(201).send(result)
  })
});

app.get('/api/hello', function (req, res) {
  res.send('docker');
});

app.listen(3000);
