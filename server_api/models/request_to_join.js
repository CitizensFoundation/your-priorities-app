"use strict";

module.exports = function(sequelize, DataTypes) {
  var RequestToJoin = sequelize.define("RequestToJoin", {
    type: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    underscored: true,

    tableName: 'requests_to_join',

    classMethods: {

      JOIN_GROUP: 0,
      JOIN_COMMUNITY: 1,

      associate: function(models) {
        RequestToJoin.belongsTo(models.Community);
        RequestToJoin.belongsTo(models.Group);
        RequestToJoin.belongsTo(models.User);
      }
    }
  });

  return RequestToJoin;
};
