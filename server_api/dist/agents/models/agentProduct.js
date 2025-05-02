import { DataTypes, Model } from "sequelize";
import { sequelize } from "@policysynth/agents/dbModels/sequelize.js";
export class YpAgentProduct extends Model {
}
YpAgentProduct.init({
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
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    group_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    domain_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    parent_agent_product_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    configuration: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    status: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
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
    tableName: "agent_products",
    indexes: [
        { fields: ["uuid"], unique: true },
        { fields: ["user_id"] },
        { fields: ["group_id"] },
        { fields: ["domain_id"] },
        { fields: ["parent_agent_product_id"] },
    ],
    timestamps: true,
    underscored: true,
});
YpAgentProduct.associate = (models) => {
    console.log(`YpAgentProduct.associate`);
    YpAgentProduct.belongsTo(models.YpSubscriptionUser, {
        foreignKey: "user_id",
        as: "User",
    });
    YpAgentProduct.belongsTo(models.Group, {
        foreignKey: "group_id",
        as: "Group",
    });
    YpAgentProduct.hasOne(models.YpAgentProductBundle, {
        foreignKey: "agent_bundle_id",
        as: "AgentBundle",
    });
    YpAgentProduct.hasMany(models.YpAgentProductBoosterPurchase, {
        foreignKey: "agent_product_id",
        as: "BoosterPurchases",
    });
    YpAgentProduct.hasMany(models.YpSubscription, {
        foreignKey: "agent_product_id",
        as: "Subscriptions",
    });
    YpAgentProduct.hasMany(models.YpSubscriptionPlan, {
        foreignKey: "agent_product_id",
        as: "SubscriptionPlans",
    });
    YpAgentProduct.hasMany(models.YpAgentProductRun, {
        foreignKey: "agent_product_id",
        as: "Runs",
    });
    YpAgentProduct.belongsToMany(models.YpAgentProductBundle, {
        through: "agent_product_bundles_products",
        foreignKey: "agent_product_id",
        otherKey: "agent_product_bundle_id",
        as: "AgentBundles",
    });
    YpAgentProduct.belongsTo(YpAgentProduct, {
        as: "ParentAgentProduct",
        foreignKey: "parent_agent_product_id",
    });
    YpAgentProduct.hasMany(YpAgentProduct, {
        as: "ChildAgentProducts",
        foreignKey: "parent_agent_product_id",
    });
};
