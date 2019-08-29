"use strict";

module.exports = function(sequelize, DataTypes) {
  var GeneralDataStore = sequelize.define("GeneralDataStore", {
    data: DataTypes.JSONB
  }, {
    indexes: [
      {
        fields: ['data'],
        using: 'gin',
        operator: 'jsonb_path_ops'
      }
    ],
    timestamps: true,
    underscored: true,
    tableName: 'general_data_store'
  });
  return GeneralDataStore;
};
