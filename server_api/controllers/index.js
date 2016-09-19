var express = require('express');
var router = express.Router();
var log = require('../utils/logger');
var toJson = require('../utils/to_json');
var path = require('path');

var sendIndex = function (req, res) {
  log.info('Index Viewed', { context: 'view', user: toJson(req.user) });
  if (FORCE_PRODUCTION || process.env.NODE_ENV == 'production') {
    if (req.hostname.indexOf('betrireykjavik.is') > -1) {
      res.sendFile(path.resolve(__dirname, '../../client_app/build/bundled/index_br.html'));
    } else if (req.hostname.indexOf('betraisland.is') > -1) {
      res.sendFile(path.resolve(__dirname, '../../client_app/build/bundled/index_bi.html'));
    } else {
      res.sendFile(path.resolve(__dirname, '../../client_app/build/bundled/index_yp.html'));
    }
  } else {
    if (req.path.indexOf('domain/1') > -1) {
      res.sendFile(path.resolve(__dirname, '../../client_app/index_br.html'));
    } else if (req.path.indexOf('domain/2') > -1) {
      res.sendFile(path.resolve(__dirname, '../../client_app/index_bi.html'));
    } else {
      res.sendFile(path.resolve(__dirname, '../../client_app/index_yp.html'));
    }
  }
}

router.get('/', function(req, res) {
  sendIndex(req, res);
});

router.get('/domain*', function(req, res) {
  sendIndex(req, res);
});

router.get('/community*', function(req, res) {
  sendIndex(req, res);
});

router.get('/group*', function(req, res) {
  sendIndex(req, res);
});

router.get('/post*', function(req, res) {
  sendIndex(req, res);
});

router.get('/user*', function(req, res) {
  sendIndex(req, res);
});

module.exports = router;
