'use strict'
var latLongs = require('./ll');

var clientId = 'MR42MXDBTL3AVYXWLWOHQDFYIVR22AICDHSCH0WQKBKT5ZJS';
var clientSecret = 'JCFV1EDYDD5QNO2OIUDSR1C35LVLDPTQKK1IE0U4B3REW5VK';
var radius = 100000; // radius set in metres
var config = {
  url : 'https://api.foursquare.com/v2/venues/search?client_id=' + clientId + '&client_secret=' + clientSecret + '&v=20150831&radius=' + radius + '&limit=50&query='
};
module.exports = config;
