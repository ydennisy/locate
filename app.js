'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var explore = require('./routes/explore');
var getFiles = require('./routes/getFiles');

var app = express();

app.set('port', process.env.PORT || 3001);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/explore', explore);
app.use('/getFiles', getFiles);

app.use(express.static('public'));
app.use(express.static('userData'));


app.listen(app.get('port'), function () {
    console.log("Express server running on port: " + app.get('port'));
});
