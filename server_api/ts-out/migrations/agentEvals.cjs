'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
  await queryInterface.createTable('ps_agent_evals', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    agent_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    overall_score: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    results: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  await queryInterface.addIndex('ps_agent_evals', ['user_id']);
  await queryInterface.addIndex('ps_agent_evals', ['agent_id']);
}};