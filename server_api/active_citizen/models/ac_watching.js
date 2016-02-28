"use strict";

// Notify user about this object

module.exports = function(sequelize, DataTypes) {
  var AcWatching = sequelize.define("AcWatching", {
    priority: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.INTEGER, allowNull: false },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  }, {

    defaultScope: {
      where: {
        deleted: false
      }
    },

    underscored: true,

    tableName: 'ac_watching',

    classMethods: {

      associate: function(models) {
        AcWatching.belongsTo(models.Community);
        AcWatching.belongsTo(models.Group);
        AcWatching.belongsTo(models.Post);
        AcWatching.belongsTo(models.Point);
        AcWatching.belongsTo(models.User, { as: 'WatchingUser' });
        AcWatching.belongsTo(models.User);
      },

      watchCommunity: function(community, user) {

      }
    }
  });

  return AcWatching;
};
