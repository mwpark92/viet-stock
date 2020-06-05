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
  const ticker = req.query.ticker.toUpperCase();

  //TODO: crawl data using this urls
  //http://ra.vcsc.com.vn/Financial/PV_Index?ticker=mch&filter=0&unit=1000000000
  //http://ra.vcsc.com.vn/Financial/PV_CashFlowStatement?ticker=mch&filter=0&unit=1000000000

  c.direct({
    uri: `http://ra.vcsc.com.vn/Financial/PV_Index?ticker=${ticker}&filter=0&unit=1000000000`,
    callback: function (error, response) {
      if (error) {
        res.send('error');
      } else {
        res.send(response);
      }
    }
  });
});

module.exports = router;
