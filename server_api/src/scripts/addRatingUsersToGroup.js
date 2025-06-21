var models = require('../models/index.cjs');
var async = require('async');
var _ = require('lodash');

var groupId = process.argv[2];

models.Rating.findAll({
  attributes: ['user_id'],
  include: [
    {
      model: models.User,
      attributes:['id','email']
    },
    {
      model: models.Post,
      attributes: ['id','group_id'],
      include: [
        {
          model: models.Group,
          attributes: ['id'],
          where: {
            id: groupId
          },
          include: [
            {
              model: models.Community,
              attributes: ['id'],
              include: [
                {
                  model: models.Domain,
                  attributes: ['id']
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}).then(function (groupRatings) {
  async.eachSeries(groupRatings, (rating, callback) => {
    models.Group.addUserToGroupIfNeeded(rating.Post.group_id, {
      user: rating.User,
      ypDomain: rating.Post.Group.Community.Domain
    }, function () {
      callback();
    });
  }, (error) => {
    error ? log.error(error) : log.info("Done");
    process.exit();
  })
})
