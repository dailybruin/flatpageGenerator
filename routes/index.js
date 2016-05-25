var express = require('express');
var router = express.Router();
var fs = require('fs');
var Page = require('../models/page.js');

function buildHtml(req) {

  // concatenate header string
  // concatenate body string
  var css = '<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/foundation/6.2.1/foundation.min.css">';
  css +='<link rel="stylesheet" type="text/css" href="bootstrap.css">';
  css += '<link rel="stylesheet" type="text/css" href="/stylesheets/style.css">';

  var declaration = '<!DOCTYPE html><html>';
  var header = '<header>' + css + '</header>';
  
  var body = '<body>';

  var coverImgURL = req.body.cover.replace(/\s/g, '/');
  var landing = "<div class='landing' style='background-image: url(" + coverImgURL + ")'>";
  landing += '<div class="header">'
  // Title
  landing += ('<h1 class="title">' + req.body.title + '</h1>');
  landing += "<hr>";
  // Author
  landing += ('<h4 class="author">Written by: ');
  for (var i = 0; i < req.body.authors.length; i++) {
    landing += req.body.authors[i];
    if (i == req.body.authors.length - 1 || req.body.authors[i+1] == '') {
      landing += '</h4>';
      break;
    }
    else {
      landing += ', ';
    }
  }
  
  // Get subhead
  landing += '<h6 class="subhead">' + req.body.subheading + "</h6>";
  landing += "</div>" // close .header tag
  landing += "</div>"; // close .landing tag

  body += landing;

  for (var i = 0; i < req.body.images.length; i++) {
    body += "<div class='story-photo-right'><img src='" + req.body.images[i] +"' /></div>";
  }

  for (var i = 0; i < req.body.paragraphs.length; i++){
    body += "<p>" + req.body.paragraphs[i] + "</p>";
    body += "<div class='linebreak'></div>";
  }
  

  body += '</body>';

  return declaration + header + body + '</html>';
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('dashboard');
});

/* GET saved pages */
router.get('/all', function(req, res) {
    var pages;
    Page.find(function (err, pages) {
      if (err) return console.error(err);
      console.log(pages);
      res.render('all', { pages : pages } );
    })
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
