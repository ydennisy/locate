'use strict'
var http = require('http');
var https = require('https');
var fs = require('fs');
var express = require('express');
var jsonexport = require('jsonexport');
var config = require('../config/config');
var latLongs = require('../config/ll');
var async = require('async');
var delKey = require('key-del');

var router = express.Router();
var userFileName = '';

router.get('/:place', function(req, res) {
  var masterDataArray = [];
  var userQuery = req.params.place;
  var reqCounter = 0;
  //var url = config.url + query + '&ll=' + ll;
  latLongs.ukLatLongs.forEach(function(ll) {
    var resData = '';
    https.get(config.url + userQuery + '&ll=' + ll, function(res) {
      res.setEncoding('utf8');
      res.on('data', function(chunk){
        // masterDataArray.push(chunk.toString());
        resData += chunk.toString();
      })
      res.on('end', function(){
        console.log(resData.length);
        if (resData.length < 1000){
          console.log(resData);
        }
        // console.log(resData);
        var obj = JSON.parse(resData);
        // delete obj.response.venues.location['formattedAddress'];
        // delKey(obj.response.venues, ['formattedAddress', 'hereNow', 'contact', 'address', 'specials'], {copy: false});
        // console.log(Object.keys(obj.response.venues));
        if (typeof obj == 'object' && obj.meta.code == 200) {
          delKey(obj.response.venues, ['formattedAddress', 'hereNow', 'contact', 'address', 'specials'], {copy: false});
          masterDataArray.push(obj.response.venues);
        }
        if (reqCounter++ == latLongs.ukLatLongs.length - 1) {
          onCompleteData(masterDataArray);
          // console.log(Object.keys(masterDataArray[0][0].location.formattedAddress));
        }
      })
      res.resume();
    }).on('error', function(e){
      // if (e) throw new error;
    });
    res.end();
  })

  function onCompleteData (data){
    jsonexport(data, { verticalOutput : false }, function (err, csv){
      if (err) return console.log(err);
      userFileName = userQuery + '_' + Date.now();
      fs.writeFile('userData/' + userFileName + '.csv', csv, 'utf8', function (err){
        if (err) {
          console.log('Error writing or saving file');
        } else {
          console.log('File is saved in userData folder, named: ' + userFileName);
          console.log(userFileName);
        }
      })
    });
  };

});

module.exports = router;
