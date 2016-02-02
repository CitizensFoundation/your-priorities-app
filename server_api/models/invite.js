"use strict";

module.exports = function(sequelize, DataTypes) {
  var Invite = sequelize.define("Invite", {
    type: { type: DataTypes.INTEGER, allowNull: false },
    expires_at: DataTypes.DATE,
    joined_at: DataTypes.DATE
  }, {
    underscored: true,

    tableName: 'invites',

    classMethods: {

      INVITE_TO_GROUP: 0,
      INVITE_TO_COMMUNITY: 1,
      INVITE_TO_IDEA: 2,
      INVITE_TO_FRIEND: 3,

      associate: function(models) {
        Invite.belongsTo(models.Community);
        Invite.belongsTo(models.Group);
        Invite.belongsTo(models.Post);
        Invite.belongsTo(models.User, { as: 'FromUser' });
        Invite.belongsTo(models.User, { as: 'ToUser' });
      }
    }
  });

  return Invite;
};
