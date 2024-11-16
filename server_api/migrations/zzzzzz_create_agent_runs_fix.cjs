"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, remove the ENUM constraint
    await queryInterface.sequelize.query(
      'ALTER TABLE agent_product_runs ALTER COLUMN status DROP DEFAULT;'
    );
    await queryInterface.sequelize.query(
      'ALTER TABLE agent_product_runs ALTER COLUMN status TYPE VARCHAR(50);'
    );
    // Then set the new default
    await queryInterface.sequelize.query(
      'ALTER TABLE agent_product_runs ALTER COLUMN status SET DEFAULT \'ready\';'
    );
  },

  down: async (queryInterface, Sequelize) => {},
};
