"use strict";

module.exports = (sequelize, DataTypes) => {
  const PostStatusChange = sequelize.define("PostStatusChange", {
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

    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

    underscored: true,

    tableName: 'post_status_changes'
  });

  PostStatusChange.defaultAttributesPublic = [
    'id','subject','content','status','published_at','deleted',
    'status_changed_to'
  ];

  PostStatusChange.associate = (models) => {
    PostStatusChange.belongsTo(models.Post, { foreignKey: 'post_id'});
    PostStatusChange.belongsTo(models.User, { foreignKey: 'user_id'});
    PostStatusChange.hasMany(models.PointRevision);
    PostStatusChange.hasMany(models.PointQuality);
  };

  return PostStatusChange;
};
