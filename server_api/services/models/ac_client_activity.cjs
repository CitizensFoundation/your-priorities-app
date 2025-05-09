"use strict";

module.exports = (sequelize, DataTypes) => {
  const AcClientActivity = sequelize.define("AcClientActivity", {
    type: { type: DataTypes.STRING, allowNull: false },
    sub_type: { type: DataTypes.STRING, allowNull: true },
    domain_id: { type: DataTypes.INTEGER, allowNull: true },
    community_id: { type: DataTypes.INTEGER, allowNull: true },
    group_id: { type: DataTypes.INTEGER, allowNull: true },
    user_id: { type: DataTypes.INTEGER, allowNull: true },
    post_id: { type: DataTypes.INTEGER, allowNull: true },

    object: DataTypes.JSONB,
    actor: DataTypes.JSONB,
    target: DataTypes.JSONB,
    context: DataTypes.JSONB
  }, {

    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',

    underscored: true,

    tableName: 'ac_client_activities',
  });

  return AcClientActivity;
};
