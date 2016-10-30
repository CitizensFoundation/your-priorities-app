"use strict";

module.exports = function(sequelize, DataTypes) {
  var BulkStatusUpdate = sequelize.define("BulkStatusUpdate", {
    config: { type: DataTypes.JSONB, allowNull: true },
    name: { type: DataTypes.STRING, allowNull: false },
    sent_at: { type: DataTypes.DATE },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  }, {
    defaultScope: {
      where: {
        deleted: false
      }
    },
    underscored: true,
    tableName: 'bulk_status_updates',
    classMethods: {
      associate: function(models) {
        Promotion.belongsTo(models.Group);
        Promotion.belongsTo(models.Community);
        Promotion.belongsTo(models.User);
      }
    }
  });

  return BulkStatusUpdate;
};
