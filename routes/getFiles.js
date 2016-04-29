var fs = require('fs');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  console.log(req.url + ' ' + req.method);

  var fileArray = fs.readdirSync('./userData', function(err, files) {
    if (err) return;
    return files;
  });
  console.log(fileArray);
  res.json(fileArray);
  res.end();
});

module.exports = router;
