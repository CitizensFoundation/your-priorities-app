var models = require('../models');
var async = require('async');
var ip = require('ip');

var allUsers = {};

var size = function(obj) {
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

models.Domain.find({where: {id: 3}}).then(function(domain) {
  domain.getDomainUsers().then(function (users) {
    console.log(users.length);
    users.map(function(user) {
      allUsers[user.email] = 1;
    });
    console.log(size(allUsers));
  });
});

