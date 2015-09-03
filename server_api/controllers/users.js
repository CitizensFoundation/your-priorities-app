var express = require('express');
var router = express.Router();
var models = require("../models");
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

router.get('/loggedin', function(req, res) {
  res.send(req.isAuthenticated() ? req.user : '0');
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.send(200);
//  console.log("In login");
//  res.send(req.user);
});

router.post('/logout', function(req, res) {
  req.logOut();
  res.send(200);
});

module.exports = router;
