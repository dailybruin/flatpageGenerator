var express = require('express');
var router = express.Router();
var fs = require('fs');


function buildHtml(req) {

  // concatenate header string
  // concatenate body string
  var css = '<link rel="stylesheet" type="text/css" href="/stylesheets/style.css">';
  css += '<link rel="stylesheet" type="text/css" href="bootstrap.css">';
  css += '<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/foundation/6.2.1/foundation.min.css">';

  var declaration = '<!DOCTYPE html><html>';
  var header = '<header>' + css + '</header>';
  
  var body = '<body>';
  body += ('<h1>' + req.body.title + '</h1>');
  body += ('<h4>Written by: ');
  for (var i = 0; i < req.body.authors.length; i++) {
    body += (req.body.authors[i]);
    if (i === req.body.authors.length - 1 || req.body.authors[i+1] == '') {
      body += '</h4>';
      break;
    }

    else {
      body += ', ';
    }
  }

  for (var i = 0; i < req.body.images.length; i++) {
    body += "<img src='" + req.body.images[i] +"' />";
  }
  

  body += '</body>';

  return declaration + header + body + '</html>';
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('dashboard');
});

router.post('/generate', function (req, res) {
  var stream = fs.createWriteStream('flatpage.html');
  stream.once('open', function(fd) {
    var html = buildHtml(req);
    stream.end(html);
    res.end(html);
  });
});

module.exports = router;
