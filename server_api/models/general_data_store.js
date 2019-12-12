"use strict";

module.exports = function(sequelize, DataTypes) {
  const GeneralDataStore = sequelize.define("GeneralDataStore", {
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
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
    tableName: 'general_data_store'
  });
  return GeneralDataStore;
};
