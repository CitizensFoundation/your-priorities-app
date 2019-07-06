"use strict";

module.exports = function(sequelize, DataTypes) {
  const Rating = sequelize.define("Rating", {
    value: { type: DataTypes.INTEGER, allowNull: false },
    type_index: { type: DataTypes.INTEGER, allowNull: false },
    ip_address: { type: DataTypes.STRING, allowNull: false },
    user_agent: { type: DataTypes.TEXT, allowNull: false },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  }, {

    underscored: true,

    tableName: 'ratings',

    timestamps: true,

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
    ],

    classMethods: {
      associate: function(models) {
        Rating.belongsTo(models.Post);
        Rating.belongsTo(models.Point);
        Rating.belongsTo(models.User);
      }
    }
  });

  return Rating;
};
