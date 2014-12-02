"use strict";

module.exports = function(sequelize, DataTypes) {
  var IsoCountry = sequelize.define("IsoCountry", {
    code: DataTypes.STRING,
    country_english_name: DataTypes.STRING
  }, {
    underscored: true,
    tableName: 'tr8n_iso_countries',
    classMethods: {
      associate: function(models) {
        IsoCountry.hasMany(models.Group, {foreignKey: "iso_country_id"});
      }
    }
  });

  return IsoCountry;
};
