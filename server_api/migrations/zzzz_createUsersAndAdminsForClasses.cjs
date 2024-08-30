"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Agent Classes Users/Admins
    await queryInterface.createTable("AgentClassUsers", {
      agent_class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "ps_agent_classes",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    });

    await queryInterface.addIndex("AgentClassUsers", ["agent_class_id"]);
    await queryInterface.addIndex("AgentClassUsers", ["user_id"]);

    await queryInterface.createTable("AgentClassAdmins", {
      agent_class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "ps_agent_classes",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    });

    await queryInterface.addIndex("AgentClassAdmins", ["agent_class_id"]);
    await queryInterface.addIndex("AgentClassAdmins", ["user_id"]);

    // Connector Classes Users/Admins
    await queryInterface.createTable("AgentConnectorClassUsers", {
      agent_connector_class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "ps_agent_connector_classes",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    });

    await queryInterface.addIndex("AgentConnectorClassUsers", [
      "agent_connector_class_id",
    ]);
    await queryInterface.addIndex("AgentConnectorClassUsers", ["user_id"]);

    await queryInterface.createTable("AgentConnectorClassAdmins", {
      agent_connector_class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "ps_agent_connector_classes",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    });

    await queryInterface.addIndex("AgentConnectorClassAdmins", [
      "agent_connector_class_id",
    ]);
    await queryInterface.addIndex("AgentConnectorClassAdmins", ["user_id"]);
  },
};
