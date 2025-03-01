"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("workflows", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            agent_product_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "agent_products",
                    key: "id",
                },
                onDelete: "SET NULL",
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onDelete: "SET NULL",
            },
            configuration: {
                type: Sequelize.JSONB,
                allowNull: false,
                defaultValue: {},
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("NOW()"),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("NOW()"),
            },
        });
        // Optionally, add indexes for performance:
        await queryInterface.addIndex("workflows", ["agent_product_id"]);
        await queryInterface.addIndex("workflows", ["user_id"]);
        await queryInterface.addColumn("agent_products", "parent_agent_product_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: "agent_products",
                key: "id",
            },
            onDelete: "SET NULL",
        });
        await queryInterface.addIndex("agent_products", ["parent_agent_product_id"]);
        // Add agent_product_run_id to agent_product_runs table (acting as parent_agent_product_run_id)
        await queryInterface.addColumn("agent_product_runs", "agent_product_run_id", {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: "agent_product_runs",
                key: "id",
            },
            onDelete: "SET NULL",
        });
        await queryInterface.addIndex("agent_product_runs", ["agent_product_run_id"]);
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("workflows");
    },
};
