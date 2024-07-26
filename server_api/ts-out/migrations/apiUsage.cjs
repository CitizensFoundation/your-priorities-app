'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
  await queryInterface.createTable('ps_external_api_usage', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    external_api_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    call_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    agent_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    connector_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  });

  await queryInterface.addIndex('ps_external_api_usage', ['user_id']);
  await queryInterface.addIndex('ps_external_api_usage', ['external_api_id']);
  await queryInterface.addIndex('ps_external_api_usage', ['agent_id']);
  await queryInterface.addIndex('ps_external_api_usage', ['connector_id']);
}
};