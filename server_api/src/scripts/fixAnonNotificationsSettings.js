var models = require('../models/index.cjs');
var async = require('async');

let groupChangeCount = 0;
let communityChangeCount = 0;
models.User.findAll(
  {
    where: {
      profile_data: { isAnonymousUser: true }
    },
    attributes: ['id', 'email', 'notifications_settings']
  }).then(users=>{
    async.forEachSeries(users, (user, callback) => {
      let changed = false;
      if (user.notifications_settings &&
          user.notifications_settings.all_group &&
          user.notifications_settings.all_group.method!=0) {
        user.set('notifications_settings.all_group.method', 0);
        groupChangeCount++;
        changed = true;
      }

      if (user.notifications_settings &&
        user.notifications_settings.all_community &&
        user.notifications_settings.all_community.method!=0) {
        user.set('notifications_settings.all_community.method', 0);
        changed = true;
        communityChangeCount++;
      }

      if (changed) {
        user.save().then(()=>{
          log.info(`Saved ${user.email}`);
          callback();
        }).catch((error)=>{
          callback(error);
        })
      } else {
        callback();
      }
    }, (error) => {
      if (error) log.error(error);
      log.info(`groupChangeCount ${groupChangeCount}`)
      log.info(`communityChangeCount ${communityChangeCount}`)
      process.exit();
    })
}).catch(error=>{
  log.error(error);
});

