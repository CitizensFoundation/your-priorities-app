"use strict";

module.exports = function(sequelize, DataTypes) {
  var Category = sequelize.define("Category", {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    group_id: DataTypes.INTEGER,
    icon_file_name: DataTypes.STRING
  }, {
    underscored: true,
    tableName: 'categories',
    classMethods: {
      associate: function(models) {
        Category.hasMany(models.Idea);
      }
    }
  });

  return Category;
};
