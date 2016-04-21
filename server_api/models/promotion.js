"use strict";

module.exports = function(sequelize, DataTypes) {
  var Promotion = sequelize.define("Promotion", {
    content: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    cost: { type: DataTypes.INTEGER, allowNull: false },
    per_viewer_cost: DataTypes.FLOAT,
    spent: DataTypes.FLOAT,
    position: { type: DataTypes.INTEGER, defaultValue: 0 },
    finished_at: { type: DataTypes.DATE },
    counter_up_endorsements: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_down_endorsements: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_skips: { type: DataTypes.INTEGER, defaultValue: 0 },
    counter_views: { type: DataTypes.INTEGER, defaultValue: 0 },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  }, {
    defaultScope: {
      where: {
        deleted: false
      }
    },

    underscored: true,
    tableName: 'promotions',
    classMethods: {
      associate: function(models) {
        Promotion.belongsTo(models.Group);
        Promotion.belongsTo(models.Post);
        Promotion.belongsTo(models.User);
      }
    }
  });

  return Promotion;
};
