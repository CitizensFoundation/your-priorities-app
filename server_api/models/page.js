"use strict";

module.exports = function(sequelize, DataTypes) {
  var Page = sequelize.define("Page", {
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    weight: { type: DataTypes.INTEGER, defaultValue: 0 },
    locale: { type: DataTypes.STRING, defaultValue: 'en' }
  }, {
    underscored: true,
    tableName: 'pages',
    classMethods: {
      associate: function(models) {
        Page.belongsTo(models.Domain);
        Page.belongsTo(models.Community);
        Page.belongsTo(models.Group);
        Page.belongsTo(models.User);
      }
    }
  });
  return Page;
};
