"use strict";

// https://www.npmjs.org/package/enum for state of posts

module.exports = function(sequelize, DataTypes) {
  var AcActivity = sequelize.define("AcActivity", {
    context: DataTypes.STRING,
    verb: DataTypes.STRING,
    object: DataTypes.JSONB,
    actor: DataTypes.JSONB
  }, {
    underscored: true,

    tableName: 'ac_activities',

    classMethods: {
      associate: function(models) {
        AcActivity.belongsTo(models.Community);
        AcActivity.belongsTo(models.Group);
        AcActivity.belongsTo(models.Post);
        AcActivity.belongsTo(models.Point);
        AcActivity.belongsToMany(models.User, { through: 'ActivityUser' });
      }
    }
  });

  return AcActivity;
};
