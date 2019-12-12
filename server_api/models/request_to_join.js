"use strict";

module.exports = (sequelize, DataTypes) => {
  const RequestToJoin = sequelize.define("RequestToJoin", {
    type: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    underscored: true,

    tableName: 'requests_to_join',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  RequestToJoin.associate = (models) => {
    RequestToJoin.belongsTo(models.Community);
    RequestToJoin.belongsTo(models.Group);
    RequestToJoin.belongsTo(models.User);
  };

  RequestToJoin.JOIN_GROUP = 0;
  RequestToJoin.JOIN_COMMUNITY = 1;

  return RequestToJoin;
};
