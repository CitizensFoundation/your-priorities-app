"use strict";

module.exports = (sequelize, DataTypes) => {
  const AcWatching = sequelize.define("AcWatching", {
    priority: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.INTEGER, allowNull: false },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  }, {

    defaultScope: {
      where: {
        deleted: false
      }
    },

    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

    underscored: true,

    tableName: 'ac_watching'
  });

  AcWatching.associate = (models) => {
    AcWatching.belongsTo(models.Domain,{ foreignKey: 'domain_id' });
    AcWatching.belongsTo(models.Community,{ foreignKey: 'community_id' });
    AcWatching.belongsTo(models.Group,{ foreignKey: 'group_id' });
    AcWatching.belongsTo(models.Post,{ foreignKey: 'post_id' });
    AcWatching.belongsTo(models.Point,{ foreignKey: 'point_id' });
    AcWatching.belongsTo(models.User,{ foreignKey: 'user_id' });
    AcWatching.belongsTo(models.User, { as: 'WatchingUser' });
  };

  AcWatching.watchCommunity = function(community, user) {
  };

  return AcWatching;
};
