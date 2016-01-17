"use strict";

module.exports = function(sequelize, DataTypes) {
  var PointRevision = sequelize.define("PointRevision", {
    name: { type: DataTypes.STRING, allowNull: true },
    content: { type: DataTypes.TEXT, allowNull: false }
  }, {
    underscored: true,
    tableName: 'revisions',
    classMethods: {
      associate: function(models) {
        PointRevision.belongsTo(models.Point);
        PointRevision.belongsTo(models.User);
        PointRevision.belongsTo(models.Group);
      }
    }
  });

  return PointRevision;
};
