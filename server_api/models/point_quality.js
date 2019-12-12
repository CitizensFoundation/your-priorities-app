"use strict";

module.exports = (sequelize, DataTypes) => {
  const PointQuality = sequelize.define("PointQuality", {
    value: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    ip_address: { type: DataTypes.STRING, allowNull: false },
    user_agent: { type: DataTypes.TEXT, allowNull: false },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  }, {

    underscored: true,

    tableName: 'point_qualities',

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
        fields: ['user_id', 'deleted']
      },
      {
        fields: ['id', 'deleted']
      },
      {
        name: 'point_qualities_idx_deleted',
        fields: ['deleted']
      }
    ]
  });

  PointQuality.associate = (models) => {
    PointQuality.belongsTo(models.Point);
    PointQuality.belongsTo(models.User);
  };

  return PointQuality;
};
