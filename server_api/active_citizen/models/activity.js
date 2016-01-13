"use strict";

// https://www.w3.org/TR/activitystreams-core/

module.exports = function(sequelize, DataTypes) {
  var AcActivity = sequelize.define("AcActivity", {
    context: { type: DataTypes.STRING, default: 'http://www.w3.org/ns/activitystreams' },
    type: DataTypes.STRING,
    object: DataTypes.JSONB,
    actor: DataTypes.JSONB,
    target: DataTypes.JSONB
  }, {

    underscored: true,

    tableName: 'ac_activities',

    classMethods: {
      associate: function(models) {
        AcActivity.belongsTo(models.Group);
        AcActivity.belongsTo(models.Post);
        AcActivity.belongsTo(models.Point);
        AcActivity.belongsTo(models.User);
        AcActivity.belongsToMany(models.User, { through: 'OtherUsers' });
      }
    }
  });

  return AcActivity;
};
