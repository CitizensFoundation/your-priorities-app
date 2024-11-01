import { DataTypes, Model } from 'sequelize';
import { sequelize } from "@policysynth/agents/dbModels/sequelize.js";
export class YpSubscription extends Model {
}
YpSubscription.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    domain_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "domains",
            key: "id",
        },
        onDelete: "CASCADE",
    },
    agent_product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "agent_products",
            key: "id",
        },
        onDelete: "CASCADE",
    },
    configuration: { type: DataTypes.JSONB, allowNull: true },
    subscription_plan_id: { type: DataTypes.INTEGER, allowNull: false },
    start_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    end_date: { type: DataTypes.DATE, allowNull: true },
    next_billing_date: { type: DataTypes.DATE, allowNull: false },
    status: {
        type: DataTypes.ENUM('active', 'paused', 'cancelled', 'expired'),
        allowNull: false,
        defaultValue: 'active',
    },
    payment_method: { type: DataTypes.STRING(50), allowNull: true },
    transaction_id: { type: DataTypes.STRING(100), allowNull: true },
    metadata: { type: DataTypes.JSONB, allowNull: true, defaultValue: {} },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, {
    sequelize,
    tableName: 'subscriptions',
    indexes: [
        { fields: ['uuid'], unique: true },
        { fields: ['user_id'] },
        { fields: ['agent_product_id'] },
        { fields: ['subscription_plan_id'] },
    ],
    timestamps: true,
    underscored: true,
});
// Associations
YpSubscription.associate = (models) => {
    // Define associations
    YpSubscription.belongsTo(models.YpSubscriptionUser, {
        foreignKey: 'user_id',
        as: 'User'
    });
    YpSubscription.belongsTo(models.YpAgentProduct, {
        foreignKey: 'agent_product_id',
        as: 'AgentProduct',
    });
    YpSubscription.belongsTo(models.YpSubscriptionPlan, {
        foreignKey: 'subscription_plan_id',
        as: 'Plan',
    });
    YpSubscription.hasMany(models.YpAgentProductRun, {
        foreignKey: 'subscription_id',
        as: 'Runs',
    });
    YpSubscription.belongsToMany(models.YpDiscount, {
        through: 'subscription_discounts',
        foreignKey: 'subscription_id',
        otherKey: 'discount_id',
        as: 'Discounts',
    });
};
