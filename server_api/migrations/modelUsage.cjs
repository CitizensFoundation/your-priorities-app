'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ps_model_usage', {
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
      model_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      token_in_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      token_out_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      token_in_cached_context_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
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

    await queryInterface.addIndex('ps_model_usage', ['user_id']);
    await queryInterface.addIndex('ps_model_usage', ['model_id']);
    await queryInterface.addIndex('ps_model_usage', ['agent_id']);
    await queryInterface.addIndex('ps_model_usage', ['connector_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ps_model_usage');
  },
};