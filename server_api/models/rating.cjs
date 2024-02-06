"use strict";

module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define("Rating", {
    value: { type: DataTypes.INTEGER, allowNull: false },
    type_index: { type: DataTypes.INTEGER, allowNull: false },
    ip_address: { type: DataTypes.STRING, allowNull: false },
    user_agent: { type: DataTypes.TEXT, allowNull: false },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    data: { type: DataTypes.JSONB, allowNull: true}
  }, {

    underscored: true,

    tableName: 'ratings',

    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

    defaultScope: {
      where: {
        deleted: false
      }
    },

    indexes: [
      {
        fields: ['post_id', 'deleted'],
      },
      {
        fields: ['post_id', 'user_id', 'deleted'],
      },
      {
        fields: ['post_id', 'user_id', 'type_index', 'deleted'],
      },
      {
        fields: ['point_id', 'deleted'],
      },
      {
        fields: ['point_id', 'user_id', 'deleted'],
      },
      {
        fields: ['point_id', 'user_id', 'type_index', 'deleted'],
      },
      {
        fields: ['user_id', 'deleted']
      }
    ]
  });

  Rating.associate = (models) => {
    Rating.belongsTo(models.Post, { foreignKey: 'post_id'});
    Rating.belongsTo(models.Point, { foreignKey: 'point_id'});
    Rating.belongsTo(models.User, { foreignKey: 'user_id'});
  };

  return Rating;
};
