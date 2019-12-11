"use strict";

module.exports = function(sequelize, DataTypes) {
  const Invite = sequelize.define("Invite", {
    type: { type: DataTypes.INTEGER, allowNull: false },
    expires_at: DataTypes.DATE,
    token: DataTypes.STRING,
    joined_at: DataTypes.DATE,
    metadata: DataTypes.JSONB,
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  }, {

    defaultScope: {
      where: {
        deleted: false
      }
    },

    timestamps: true,

    indexes: [
      {
        fields: ['token'],
        where: {
          deleted: false
        }
      }
    ],

    underscored: true,

    tableName: 'invites'
  });

  Invite.associate = (models) => {
    Invite.belongsTo(models.Community);
    Invite.belongsTo(models.Group);
    Invite.belongsTo(models.Post);
    Invite.belongsTo(models.User, { as: 'FromUser' });
    Invite.belongsTo(models.User, { as: 'ToUser' });
  };

  Invite.INVITE_TO_GROUP = 0;
  Invite.INVITE_TO_COMMUNITY = 1;
  Invite.INVITE_TO_IDEA = 2;
  Invite.INVITE_TO_FRIEND = 3;

  Invite.checkIfColumnExists = (columnName) => {
    const a = this.rawAttributes;
    const b = this.rawAttributes[columnName];
    return this.rawAttributes[columnName]!=null;
  };

  return Invite;
};
