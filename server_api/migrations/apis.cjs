'use strict';


module.exports = {
  up: async (queryInterface, Sequelize) => {
  await queryInterface.createTable('ps_external_apis', {
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
    organization_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    priceAdapter: {
      type: Sequelize.JSONB,
      allowNull: false,
    },
  });

  await queryInterface.addIndex('ps_external_apis', ['uuid'], {
    unique: true,
  });
  await queryInterface.addIndex('ps_external_apis', ['user_id']);
  await queryInterface.addIndex('ps_external_apis', ['type']);
  await queryInterface.addIndex('ps_external_apis', ['organization_id']);
}
};