"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queue = require("../active-citizen/workers/queue.cjs");
module.exports = (sequelize, DataTypes) => {
    const Campaign = sequelize.define("Campaign", {
        configuration: DataTypes.JSONB,
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        post_id: { type: DataTypes.INTEGER, allowNull: true },
        group_id: { type: DataTypes.INTEGER, allowNull: true },
        community_id: { type: DataTypes.INTEGER, allowNull: true },
        domain_id: { type: DataTypes.INTEGER, allowNull: true },
        deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        underscored: true,
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        tableName: "campaigns",
        defaultScope: {
            where: {
                deleted: false,
            },
        },
        indexes: [
            {
                fields: ["configuration"],
                using: "gin",
                operator: "jsonb_path_ops",
            },
            {
                fields: ["id", "group_id", "deleted"],
            },
            {
                fields: ["id", "community_id", "deleted"],
            },
            {
                fields: ["id", "domain_id", "deleted"],
            },
            {
                fields: ["id", "post_id", "deleted"],
            },
            {
                fields: ["id", "user_id", "deleted"],
            },
            {
                fields: ["id", "group_id", "deleted", "active"],
            },
            {
                fields: ["id", "community_id", "deleted", "active"],
            },
            {
                fields: ["id", "domain_id", "deleted", "active"],
            },
            {
                fields: ["id", "post_id", "deleted", "active"],
            },
            {
                fields: ["id", "user_id", "deleted", "active"],
            },
        ],
    });
    Campaign.associate = (models) => {
        Campaign.belongsTo(models.User, { foreignKey: "user_id" });
        Campaign.belongsTo(models.Post, { foreignKey: "post_id" });
        Campaign.belongsTo(models.Group, { foreignKey: "group_id" });
        Campaign.belongsTo(models.Community, { foreignKey: "community_id" });
        Campaign.belongsTo(models.Domain, { foreignKey: "domain_id" });
    };
    return Campaign;
};
