"use strict";

module.exports = function(sequelize, DataTypes) {
  var PointRevision = sequelize.define("PointRevision", {
    name: DataTypes.STRING,
    content: DataTypes.TEXT,
    user_id: DataTypes.INTEGER
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
