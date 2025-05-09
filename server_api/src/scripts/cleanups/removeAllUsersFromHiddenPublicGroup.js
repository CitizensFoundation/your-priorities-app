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
        console.log(`Removed ${user.email}`)
        forEachSeriesCallback();
      })
    }, error => {
      if (error) {
        console.error(error);
        process.exit();
      } else {
        console.log("Finished");
        process.exit();
      }
    })
  } else {
    console.warn(`Group not found or empty`);
    process.exit();
  }
}).catch(error=>{
  console.error(error);
  process.exit();
})