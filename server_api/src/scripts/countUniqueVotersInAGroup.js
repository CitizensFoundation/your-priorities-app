var models = require('../models/index.cjs');
var async = require('async');
var _ = require('lodash');
var moment = require('moment');

var groupId = process.argv[2];

const allUsers = {};

var size = function(obj) {
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

models.Endorsement.findAll({
  attributes:["id","user_id"],
  where: {
    value: {
      $or: [
        -1,1
      ]
    }
  },
  include: [
    {
      model: models.Post,
      attributes: ["id"],
      include: [
        {
          model: models.Group,
          attributes: ["id"],
          where: {
            id: groupId
          }
        }
      ]
    }
  ]
}).then((endorsements) => {
  log.info(`Votes: ${endorsements.length}`);

  endorsements.forEach(e=>{
    allUsers[e.user_id] = 1;
  })

  log.info(`Voters: ${size(allUsers)}`);

  log.info(`Average votes per user: ${parseInt(endorsements.length/size(allUsers))}`);

  process.exit();
});

