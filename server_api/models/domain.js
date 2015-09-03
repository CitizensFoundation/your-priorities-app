"use strict";

// https://www.npmjs.org/package/enum for state of ideas

module.exports = function(sequelize, DataTypes) {
  var Domain = sequelize.define("Domain", {
    name: DataTypes.STRING,
    domain_name: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    underscored: true,

    tableName: 'domains',

    classMethods: {
      associate: function(models) {
        Domain.hasMany(models.Community, { foreignKey: "domain_id" });
      }
    }
  });

  return Domain;
};
