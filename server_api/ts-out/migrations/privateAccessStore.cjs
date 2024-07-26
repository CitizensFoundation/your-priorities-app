"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("ps_private_access_store", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ai_model_id: DataTypes.INTEGER,
      external_api_id: DataTypes.INTEGER,
      configuration: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      usage: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {
          dailyUse: 0,
          monthlyUse: 0,
          totalUse: 0,
        },
      },
      encrypted_api_key: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      encrypted_aes_key: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      last_used_at: DataTypes.DATE,
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    });

    await queryInterface.addIndex("ps_private_access_store", ["group_id"]);
    await queryInterface.addIndex("ps_private_access_store", ["ai_model_id"]);
    await queryInterface.addIndex("ps_private_access_store", ["external_api_id"]);
    await queryInterface.addIndex("ps_private_access_store", ["user_id"]);
  },
};
