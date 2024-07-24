'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
  await queryInterface.createTable('ps_agents', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    uuid: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
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
    class_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    group_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    configuration: {
      type: Sequelize.JSONB,
      allowNull: false,
    },
    parent_agent_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  });

  await queryInterface.addIndex('ps_agents', ['uuid'], {
    unique: true,
  });
  await queryInterface.addIndex('ps_agents', ['user_id']);
  await queryInterface.addIndex('ps_agents', ['class_id']);
  await queryInterface.addIndex('ps_agents', ['group_id']);
  // Add index to both id and version on agent_classes
}
};