import { DataTypes, Model } from 'sequelize';
import { sequelize } from "@policysynth/agents/dbModels/sequelize.js";
import { YpSubscription } from './subscription.js';
import { YpAgentProductBoosterPurchase } from './agentProductBoosterPurchase.js';
export class YpSubscriptionPlan extends Model {
}
YpSubscriptionPlan.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false },
    agent_product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'agent_products',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    name: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    type: { type: DataTypes.ENUM('free', 'paid'), allowNull: false, defaultValue: 'free' },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    currency: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'USD' },
    billing_cycle: { type: DataTypes.ENUM('monthly', 'yearly', 'weekly'), allowNull: false },
    max_runs_per_cycle: { type: DataTypes.INTEGER, allowNull: false },
    booster_runs: { type: DataTypes.INTEGER, allowNull: false },
    booster_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    booster_currency: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'USD' },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, {
    sequelize,
    tableName: 'subscription_plans',
    indexes: [
        { fields: ['uuid'], unique: true },
        { fields: ['name'] },
        { fields: ['type'] },
    ],
    timestamps: true,
    underscored: true,
});
// Associations
YpSubscriptionPlan.hasMany(YpSubscription, { foreignKey: 'plan_id', as: 'Subscriptions' });
YpSubscriptionPlan.hasMany(YpAgentProductBoosterPurchase, {
    foreignKey: 'subscription_plan_id',
    as: 'BoosterPurchases',
});
