"use strict";

// https://www.npmjs.org/package/enum for state of ideas

module.exports = function(sequelize, DataTypes) {
  var Community = sequelize.define("Community", {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    public: DateType.BOOLEAN
  }, {
    underscored: true,
    tableName: 'communities',
    classMethods: {
      associate: function(models) {
        Community.hasMany(models.Group, { foreignKey: "group_id" });
        Community.belongsTo(models.Domain, {foreignKey: "community_id"});
      }
    }
  });

  return Community;
};
