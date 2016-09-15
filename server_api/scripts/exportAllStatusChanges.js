var models = require('../models');
var async = require('async');
var ip = require('ip');

var domainId = process.argv[2];

models.PostStatusChange.findAll({
  include: [
    {
      model: models.Post,
      attributes: ['id'],
      required: true,
      include: [
        {
          model: models.Group,
          attributes: ['id'],
          where: {
            access: models.Group.ACCESS_PUBLIC
          },
          required: true
        }
      ]
    }
  ]
}).then(function (updates) {

  async.eachSeries(updates, function (update, seriesCallback) {
    if (update.content) {
      console.log("------------------------------------------ STATUS CHANGE ID "+update.id+" ------------------------------------------");
      console.log("\n");
      console.log(update.content);
      console.log("\n");
    }
    seriesCallback();
  }, function () {
    process.exit();
    console.log("Done");
  });
});
