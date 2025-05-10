"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Add new columns
      await queryInterface.addColumn(
        "ps_model_usage",
        "long_context_token_in_count",
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "ps_model_usage",
        "long_context_token_in_cached_context_count",
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "ps_model_usage",
        "token_out_reasoning_count",
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "ps_model_usage",
        "token_out_audio_count",
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "ps_model_usage",
        "token_out_image_count",
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "ps_model_usage",
        "long_context_token_out_count",
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "ps_model_usage",
        "long_context_token_out_reasoning_count",
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "ps_model_usage",
        "long_context_token_out_audio_count",
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "ps_model_usage",
        "long_context_token_out_image_count",
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        { transaction }
      );

      // Modify existing columns to add defaultValue
      await queryInterface.changeColumn(
        "ps_model_usage",
        "token_in_count",
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        { transaction }
      );
      await queryInterface.changeColumn(
        "ps_model_usage",
        "token_in_cached_context_count",
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        { transaction }
      );
      await queryInterface.changeColumn(
        "ps_model_usage",
        "token_out_count",
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        { transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {},
};
