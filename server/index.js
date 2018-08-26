const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
var path = require('path');
const app = express();

app.use(bodyParser.json());

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.set('port', (process.env.PORT || 8090));
app.use(express.static(path.resolve("../dist")));

app.post('/api/survey', function (req, res) {
  res.sendFile(path.resolve(config.perguntas));
});

app.get('*', function (req, res) {
  res.sendFile(path.resolve(config.front,'index.html'));
});

app.listen(app.get('port'), function () {
  console.log('Survey Royale Server iniciado na porta ', app.get('port'));
  console.log(`http://localhost:${app.get('port')}/`);
});
