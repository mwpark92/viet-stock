var express = require('express');
var Crawler = require('crawler');
var router = express.Router();
var c = new Crawler({
  rateLimit: 1000,
  maxConnections: 10
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/company', function (req, res, next) {
  c.direct({
    uri: 'http://www.google.com/',
    callback: function (error, response) {
      if (error) {
        console.log('erro111r');
        res.send('error')
      } else {
        res.send(response)
      }
    }
  });
});

module.exports = router;
