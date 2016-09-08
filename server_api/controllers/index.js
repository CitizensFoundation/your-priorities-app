var express = require('express');
var router = express.Router();
var log = require('../utils/logger');
var toJson = require('../utils/to_json');
var path = require('path');

/* GET home page. */
router.get('/', function(req, res) {
  log.info('Index Viewed', { context: 'view', user: toJson(req.user) });
  res.sendFile(path.resolve(__dirname, '../../client_app/index_yp.html'));
});

module.exports = router;
