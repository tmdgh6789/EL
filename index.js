var express = require('express');
// noinspection Eslint
var ejs = require('ejs');

var app = express();

app.use('/static', express.static('public'));

app.set('view engine', 'ejs');

app.listen(5000, function () {
    console.log('listening on port 5000!');
});
