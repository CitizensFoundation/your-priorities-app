var models = require('../../models/index.cjs');
var {forEach} = require('async');
var _ = require('lodash');
const async = require("async");

models.Group.findOne({
  where: {
    name: 'hidden_public_group_for_domain_level_points'
  },
  attributes: ['id','name'],
  include: [
    {
      model: models.User,
      as: 'GroupUsers',
      required: false
    }
  ]
}).then(group=>{
  if (group && group.GroupUsers.length>0) {
    async.forEachSeries(group.GroupUsers, (user, forEachSeriesCallback) => {
      group.removeGroupUser(user).then(()=>{
        log.info(`Removed ${user.email}`)
        forEachSeriesCallback();
      })
    }, error => {
      if (error) {
        log.error(error);
        process.exit();
      } else {
        log.info("Finished");
        process.exit();
      }
    })
  } else {
    log.warn(`Group not found or empty`);
    process.exit();
  }
}).catch(error=>{
  log.error(error);
  process.exit();
})