var express = require('express');
var router = express.Router();
var models = require("../models");
var auth = require('../authorization');
var log = require('../utils/logger');
var toJson = require('../utils/to_json');

var botOptions = {
  img       : 'placeholder.png',
  url       : 'https://bot-social-share.herokuapp.com/',
  title     : 'Bot Test',
  descriptionText
    : 'This is designed to appeal to bots',
  imageUrl  : 'https://bot-social-share.herokuapp.com/placeholder.png'
};

router.get('/', function(req, res) {
  res.render('bot', botOptions);
});

module.exports = router;
