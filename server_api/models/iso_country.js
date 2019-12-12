"use strict";

module.exports = function(sequelize, DataTypes) {
  const IsoCountry = sequelize.define("IsoCountry", {
    code: DataTypes.STRING,
    country_english_name: DataTypes.STRING
  }, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'tr8n_iso_countries'
  });

  IsoCountry.associate = (models) => {
    IsoCountry.hasMany(models.Group, {foreignKey: "iso_country_id"});
  };

  return IsoCountry;
};
