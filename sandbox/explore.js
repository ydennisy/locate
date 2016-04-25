'use strict'
var http = require('http');
var https = require('https');
var fs = require('fs');
var express = require('express');
var jsonexport = require('jsonexport');
var config = require('../config/config');
var latLongs = require('../config/ll');
var async = require('async');

var router = express.Router();

var masterDataArray = [];

router.get('/:place', function(req, res){
  var userQuery = req.params.place;

  function httpGet(){
    // var testArray = [3, 1];
    var arrayOfFunctions = [];
    for (var i = 0; i < latLongs.ukLatLongs.length; i++){
      arrayOfFunctions[i] = new Promise (function(resolve, reject){
        (callFoursquareApi(userQuery, latLongs.ukLatLongs[i]));
      });
      // arrayOfFunctions.push(function () {callFoursquareApi(userQuery, latLongs.ukLatLongs[i]); });
    };
    console.log(arrayOfFunctions);
    Promise.all(arrayOfFunctions).then(function(values){
      return onCompleteData(values);
      //return console.log('Promise are here!!!');
    }).then(onCompleteData(masterDataArray)).catch(console.log.bind(console));
  };


  var httpGetPromise = new Promise(function(resolve, reject){
        function callFoursquareApi (q, ll){
        https.get(config.url + q + '&ll=' + ll, function(res){
          console.log('Got response: ' + res.statusCode);
          console.log(config.url + q + '&ll=' + ll)
          // var resData = '';
          res.setEncoding('utf8');
          res.on('data', function (chunk){
            // console.log(chunk);
              // resData += chunk.toString();
              // res.pipe(writeStream);
              masterDataArray.push(chunk);
          });
          res.on('end', function(data){
            // var jsonResData = JSON.parse(resData);
            console.log(masterDataArray.length);
            Promise.resolve(data);
          });
          res.resume();
        }).on('error', function (e) {
            console.log('Got error: ' + e.message);
        });
          res.end();
          return;
      };
  });

    function callFoursquareApi (q, ll){
    https.get(config.url + q + '&ll=' + ll, function(res){
      console.log('Got response: ' + res.statusCode);
      console.log(config.url + q + '&ll=' + ll)
      // var resData = '';
      res.setEncoding('utf8');
      res.on('data', function (chunk){
        // console.log(chunk);
          // resData += chunk.toString();
          // res.pipe(writeStream);
          masterDataArray.push(chunk);
      });
      res.on('end', function(data){
        // var jsonResData = JSON.parse(resData);
        console.log(masterDataArray.length);
      });
      res.resume();
    }).on('error', function (e) {
        console.log('Got error: ' + e.message);
    });
      res.end();
      return;
  };


  function onCompleteData (data){
    console.log(data);
    jsonexport(data, { verticalOutput : false }, function (err, csv){
      if (err) return console.log(err);
      fs.writeFile('userData/' + userQuery + '_' + Date.now() + '.csv', csv, 'utf8', function (err){
        if (err) {
          console.log('Error writing or saving file');
        } else {
          console.log('File is saved in userData folder, named: ' + userQuery + '_' + Date.now());
        }
      })
    });
  };

httpGet();

});

module.exports = router;

/*
  async.each(latLongs.ukLatLongs, function (ll, cb) {
    callFoursquareApi(userQuery, ll);
  }, onCompleteData());


  var writeStream = fs.createWriteStream('./output/stream.txt');

  function writeToFileStream () {
    var writeStream = fs.createWriteStream('./output');
  }



  for (var i = 0; i < latLongs.ukLatLongs.length; i++){
    callFoursquareApi(userQuery, latLongs.ukLatLongs[i], function(){
      console.log('cb firing!')
      if (i == latLongs.ukLatLongs.length){

      }
    });
  };



          // var writeToCsvData = jsonResData.response.venues;
          // function to convert object to CSV - callback writes data to a file
          jsonexport(writeToCsvData, { verticalOutput : false }, function (err, csv){
            if (err) return console.log(err);
            fs.writeFile('userData/' + userQuery + '_' + Date.now() + '.csv', csv, 'utf8', function (err){
              if (err) {
                console.log('Error writing or saving file');
              } else {
                console.log('File is saved in userData folder, named: ' + userQuery + '_' + Date.now());
              }
            })
          });
        */
