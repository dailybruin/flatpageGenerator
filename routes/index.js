var express = require('express');
var router = express.Router();
var fs = require('fs');
var Page = require('../models/page');

function buildHtml(req) {
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
  header += '</div></div><p class="caption_content" style="float: right; margin-right: 10px;">' + req.body.coverCaption + '</p>';
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

  var quoters = quotes;

  var sImages = 0;
  for (var k = 0; k < req.body.sideImages.length; k++) {
    if (req.body.sideImages[k] == '')
      break;
    else
      sImages++;
  }

  var mImages = 0;
  for (var k = 0; k < req.body.mainImages.length; k++) {
    if (req.body.mainImages[k] == '')
      break;
    else
      mImages++;
  }

  var sCaptions = sImages;
  var mCaptions = mImages;

  var body = '<body>';

  var left = false;

  //console.log("lower bound is: " + ((sections/2)-1));

  var totalParas = 0;

  for (var k = 0; k < sections; k++) {
    var para = req.body.paragraphs[k].split(/\r?\n/);
    totalParas += para.length;
  }

  var parasPerSide = Math.floor(totalParas/(sImages+quotes));
  var parasPassed = 0;
  var imageNext = true;

  for (var k = 0; k < sections; k++) {
    if (((sections <= 3 && k > 0) || (k >= ((sections/2)-1)))  && mImages > 0) {
      body += '<div class="row">';
      body += '<div class="parallax-window" data-parallax="scroll" data-image-src="' + req.body.mainImages[mImages-1] + '"></div>';
      body += '<p class="caption_content" style="float: right;">' + req.body.mainImageCaptions[mCaptions-1] + '</p>';
      body += '</div>';
      mCaptions--;
      mImages--;
    }

    body += '<div class="row"><div class="large-6 large-centered columns"><div class="content">';
    //if (k == 0)
      //body += '<br><br>';

    var paras = req.body.paragraphs[k].split(/\r?\n/);

    for (var i = 0; i < paras.length; i++) {
      body += '<p>' + paras[i] + '</p>';

      //if ((sections <= 3) || (k > 0 && k < sections-1)) {
        if ((parasPassed % parasPerSide == 0)) {
          if (imageNext) {
            if (sImages > 0) {       
              if (left) {
                body += '<div class="block_photo_left"><img src="' + req.body.sideImages[sImages-1] + '" class="photo"><div class="caption_left"><p class="caption_left">' + req.body.sideImageCaptions[sCaptions-1] + '</p></div></div>';
                left = false;
              }

              else {
                body += '<div class="block_photo_right"><img src="' + req.body.sideImages[sImages-1] + '" class="photo"><div class="caption_right"><p class="caption_right">' + req.body.sideImageCaptions[sCaptions-1] + '</p></div></div>';          
                left = true;
              }

              sImages--;
              sCaptions--;
            }

            else if (quotes > 0) {
              if (left) {
                body += '<div class="pullquote"><p>' + req.body.quotes[quotes-1] + '</p>';
                body += '<p><cite>' + req.body.quoteMakers[quoters-1] + '</cite></p></div>';
                left = false;
              }

              else {
                body += '<div class="pullquote-right"><p>' + req.body.quotes[quotes-1] + '</p>';
                body += '<p><cite>' + req.body.quoteMakers[quoters-1] + '</cite></p></div>';
                left = true;
              }
              quotes--;
              quoters--;
            }

            imageNext = false;
          }

          else {
            if (quotes > 0) {
              if (left) {
                body += '<div class="pullquote"><p>' + req.body.quotes[quotes-1] + '</p>';
                body += '<p><cite>' + req.body.quoteMakers[quoters-1] + '</cite></p></div>';
                left = false;
              }

              else {
                body += '<div class="pullquote-right"><p>' + req.body.quotes[quotes-1] + '</p>';
                body += '<p><cite>' + req.body.quoteMakers[quoters-1] + '</cite></p></div>';
                left = true;
              }
              quotes--;
              quoters--;
            }

            else if (sImages > 0) {
              if (left) {
                body += '<div class="block_photo_left"><img src="' + req.body.sideImages[sImages-1] + '" class="photo"><div class="caption_left"><p class="caption_left">' + req.body.sideImageCaptions[sCaptions-1] + '</p></div></div>';
                left = false;
              }

              else {
                body += '<div class="block_photo_right"><img src="' + req.body.sideImages[sImages-1] + '" class="photo"><div class="caption_right"><p class="caption_right">' + req.body.sideImageCaptions[sCaptions-1] + '</p></div></div>';          
                left = true;
              }

              sImages--;
              sCaptions--;
            }

            imageNext = true;
          }
        }

        parasPassed++;
      //}

      if (i == paras.length - 1) {
        if (k != sections - 1)
          body += '<div class="linebreak"></div></div></div></div>';
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
  var page = new Page();
  page.authors = req.body.authors;
  page.title = req.body.title;
  page.coverPhoto = req.body.cover;
  page.coverPhotoCaption = req.body.coverCaption;
  page.subheading = req.body.subheading;
  page.sideImageCaptions = req.body.sideImageCaptions;
  page.mainImageCaptions = req.body.mainImagesImageCaptions;
  page.quotes = req.body.quotes;
  page.quoteMakers = req.body.quoteMakers;
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
    res.redirect('/');
  });
});

module.exports = router;
