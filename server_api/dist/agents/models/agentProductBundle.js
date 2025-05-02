// Import necessary modules and models
import { DataTypes, Model } from "sequelize";
import { sequelize } from "@policysynth/agents/dbModels/sequelize.js";
import { YpAgentProduct } from './agentProduct.js';
// Define the YpAgentProductBundle model
export class YpAgentProductBundle extends Model {
}
// Initialize the YpAgentProductBundle model
YpAgentProductBundle.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    configuration: {
        type: DataTypes.JSONB,
        allowNull: true,
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
}, {
    sequelize,
    tableName: 'agent_product_bundles',
    timestamps: true,
    indexes: [
        { fields: ['uuid'], unique: true },
        { fields: ['name'] },
    ],
    underscored: true,
});
// Add the associate static method
YpAgentProductBundle.associate = (models) => {
    YpAgentProductBundle.belongsToMany(models.YpAgentProduct, {
        through: 'agent_product_bundles_products',
        as: 'AgentProducts',
        foreignKey: 'agent_product_bundle_id',
        otherKey: 'agent_product_id',
    });
};
YpAgentProduct.associate = (models) => {
    YpAgentProduct.belongsToMany(models.YpAgentProductBundle, {
        through: 'agent_product_bundles_products',
        as: 'AgentBundles',
        foreignKey: 'agent_product_id',
        otherKey: 'agent_product_bundle_id',
    });
};
