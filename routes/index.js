var express = require('express');
var router = express.Router();
var fs = require('fs');
var Page = require('../models/page');
var mkdirp = require('mkdirp');

function buildHtml(req) {
  console.log(req.body);
  // concatenate header string
  // concatenate body string
  var css = '<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/foundation/6.2.1/foundation.min.css">';
  //css += '<link rel="stylesheet" type="text/css" href="/stylesheets/style.css">';
  css += '<link rel="stylesheet" type="text/css" href="app.css"';

  var declaration = '<!DOCTYPE html><html>';
  var head = '<meta name="viewport" content="width=device-width, initial-scale=1.0" /><link rel="icon" type="image/png" href="http://dailybruin.com/img/favicons/favicon-32x32.png" sizes="32x32">' + css + '</head>';

  var header = '<header><div id="plate" class= "top"><a href="http://dailybruin.com"><img src="http://graphics.dailybruin.com/gradissue-2015/30-columns/image/nameplate.png"/></a></div>';
  header += '<div class="headerimg" data-parallax="scroll"  data-image-src="' + req.body.cover + '">';
  header += '<div class="headertitle"><h2><span>' + req.body.title + '</span></h2><hr>';
  
  var authors = "By ";
  for (var k = 0; k < req.body.authors.length; k++) {
    if (req.body.authors[k] == '')
      break;
    
    if ((k == req.body.authors.length - 1 || req.body.authors[k+1] == '') && k != 0)
      authors += " and " + req.body.authors[k];
    
    else {
      if (req.body.authors[k+1] != '')
        authors += req.body.authors[k] + ", ";
      else
        authors += req.body.authors[k];
    }
  }

  header += '<p style="font-weight: bold">' + authors + '</p>';
  header += '<p style="font-family: Sans-Serif; line-height: 140%; font-weight: light">' + req.body.subheading + '</p>'
  header += '</div></div><p class="caption_content" style="float: right; margin-right: 10px;">(Photo by Aubrey Yeo/Daily Bruin Senior Staff)</p>';
  header += '</header>';

  var sections = 0;
  for (var k = 0; k < req.body.paragraphs.length; k++) {
    if (req.body.paragraphs[k] == '')
      break;
    else
      sections++;
  }

  var quotes = 0;
  for (var k = 0; k < req.body.quotes.length; k++) {
    if (req.body.quotes[k] == '')
      break;
    else
      quotes++;
  }

  var sImages = req.body.sideImages.length;
  var mImages = req.body.mainImages.length;

  var captions = sImages + mImages; //already known they're the same

  var body = '<body>';

  for (var k = 0; k < sections; k++) {
    body += '<div class="row"><div class="large-6 large-centered columns"><div class="content">';
    if (k == 0)
      body += '<br><br>';

    var paras = req.body.paragraphs[k].split(/\r?\n/);

    for (var i = 0; i < paras.length; i++) {
      body += '<p>' + paras[i] + '</p>';
      if (i == paras.length - 1) {
        if (k != sections - 1)
          body += '<div class="linebreak"></div></div></div></div></div>';
        else
          body += '</div></div></div>';
      }
    }
  }
  
  var scripts = '<script src="jquery.min.js"></script><script src="parallax.min.js"></script><script src="what-input.min.js"></script><script src="foundation.min.js"></script><script src="/app.js"></script>';
  body += scripts + '</body>';

  return declaration + head + header + body;
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('dashboard');
});

router.post('/generate', function (req, res) {
  var page = new Page();
  page.authors = req.body.authors;
  page.title = req.body.title;
  page.coverPhoto = req.body.cover;
  page.subheading = req.body.subheading;
  page.captions = req.body.captions;
  page.quotes = req.body.quotes;
  page.paragraphs = req.body.paragraphs;
  page.sideImages = req.body.sideImages;
  page.mainImages = req.body.mainImages;

  page.save(function (err) {
      if (err) {
        res.render('error', {error: err});
      }
  });

  var stream = fs.createWriteStream('output/flatpage.html');
  stream.once('open', function(fd) {
    var html = buildHtml(req);
    stream.end(html);
    //res.end(html);
    res.render('dashboard');
  });
});

module.exports = router;
