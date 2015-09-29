"use strict";

// https://www.npmjs.org/package/enum for state of ideas

module.exports = function(sequelize, DataTypes) {
  var Activity = sequelize.define("Activity", {
    verb: DataTypes.STRING
  }, {
    underscored: true,

    tableName: 'activities',

    classMethods: {
      associate: function(models) {
        Activity.belongsTo(models.Community);
        Activity.belongsTo(models.Group);
        Activity.belongsTo(models.Idea);
        Activity.belongsTo(models.Point);
        Activity.belongsToMany(models.User, { through: 'ActivityUser' });
      }
    }
  });

  return Activity;
};
