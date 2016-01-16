var express = require('express');
var router = express.Router();
var log = require('../utils/logger');

/* GET home page. */
router.get('/', function(req, res) {
  log.info('Index Viewed', { context: 'view', user: req.user });
  res.sendfile('./client_app/index.html');
});

module.exports = router;
