var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/api/hello', function (req, res) {
  res.send('hello world fro NodeJS');
});

app.listen(3000);
