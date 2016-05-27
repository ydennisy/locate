'use strict'
var http = require('http');
var https = require('https');
var fs = require('fs');
var express = require('express');
var jsonexport = require('jsonexport');
var config = require('../config/config');
var latLongs = require('../config/ll');
var delKey = require('key-del');

var router = express.Router();
var userFileName = '';

router.get('/:place/:country', function(req, res) {

  console.log(req.url + ' ' + req.method);

  var masterDataArray   = [],
      userQueryCountry  = req.params.country,
      userQueryPlace    = req.params.place,
      reqCounter        = 0,
      selectedLatLongs  = '';

  if (userQueryCountry == 'uk' ){
    selectedLatLongs = latLongs.ukLatLongs;
  } else if (userQueryCountry == 'us') {
    selectedLatLongs = latLongs.usLatLongs;
  } else if (userQueryCountry == 'ca') {
    selectedLatLongs = latLongs.caLatLongs;
  } else if (userQueryCountry == 'de'){
    selectedLatLongs = latLongs.deLatLongs;
  } else if (userQueryCountry == 'au'){
    selectedLatLongs = latLongs.auLatLongs;
  } else {
    console.log('no selected input')
  }

console.log(selectedLatLongs)
 var fn = function (ll){
   return new Promise(function(resolve, reject){
     setTimeout(resolve, 10000, makeApiCall(ll))
   });
 }

 var actions = selectedLatLongs.map(fn);
 var results = Promise.all(actions);

 results.then(function(data){
   console.log('promise then: ' + data);
   onCompleteData(masterDataArray);
 });


function makeApiCall (ll){
  var resData = '';
  https.get(config.url + userQueryPlace + '&ll=' + ll, function(res) {
    console.log('latlong: ' + ll);
    res.setEncoding('utf8');
    res.on('data', function(chunk){
      resData += chunk.toString();
    })
    res.on('end', function(){
      console.log('resData length: ' + resData.length);
      if (resData.length < 1000){
        console.log(resData);
      }
      var obj = JSON.parse(resData);
      console.log(obj.meta.code);
      if (typeof obj == 'object' && obj.meta.code == 200) {
        delKey(obj.response.venues, ['formattedAddress', 'hereNow', 'contact', 'address', 'specials'], {copy: false});
        masterDataArray.push(obj.response.venues);
      }
    })
    res.resume();
  }).on('error', function(e){
      console.error(e);
  })
  res.end();
};

  function onCompleteData (data){
    jsonexport(data, { verticalOutput : false }, function (err, csv){
      if (err) return console.log(err);
      userFileName = userQueryPlace + '_' + userQueryCountry + '_' + Date.now();
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
