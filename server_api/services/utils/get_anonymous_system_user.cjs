const models = require("../../models/index.cjs");

module.exports = (callback) => {
  models.User.findOrCreate({
    where: {
      email: "system.anonymous.user72@citizens.is"
    },
    defaults: {
      profile_data: { isAnonymousUser: true },
      email: "system.anonymous.user72@citizens.is",
      name: "Anonymous",
      notifications_settings: models.AcNotification.anonymousNotificationSettings,
      status: 'active'
    }
  }).then( results => {
    const [ user, created ] = results;
    callback(null, user);
  }).catch(function (error) {
    callback(error);
  });
};
