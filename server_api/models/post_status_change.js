"use strict";

module.exports = function(sequelize, DataTypes) {
  var PostStatusChange = sequelize.define("PostStatusChange", {
    subject: { type: DataTypes.STRING, allowNull: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    status_changed_to: { type: DataTypes.STRING },
    published_at: DataTypes.DATE,
    ip_address: { type: DataTypes.STRING, allowNull: false },
    user_agent: { type: DataTypes.TEXT, allowNull: false },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  }, {
    defaultScope: {
      where: {
        deleted: false
      }
    },
    
    underscored: true,

    tableName: 'post_status_changes',
    classMethods: {
      associate: function(models) {
        PostStatusChange.belongsTo(models.Post);
        PostStatusChange.belongsTo(models.User);
        PostStatusChange.hasMany(models.PointRevision);
        PostStatusChange.hasMany(models.PointQuality);
      }
    }
  });

  return PostStatusChange;
};
