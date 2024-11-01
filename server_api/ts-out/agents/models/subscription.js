import { DataTypes, Model } from 'sequelize';
import { sequelize } from "@policysynth/agents/dbModels/sequelize.js";
import { YpSubscriptionUser } from './subscriptionUser.js';
import { YpAgentProduct } from './agentProduct.js';
import { YpSubscriptionPlan } from './subscriptionPlan.js';
import { YpAgentProductRun } from './agentProductRun.js';
export class YpSubscription extends Model {
}
YpSubscription.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    domain_id: { type: DataTypes.INTEGER, allowNull: false },
    agent_product_id: { type: DataTypes.INTEGER, allowNull: false },
    configuration: { type: DataTypes.JSONB, allowNull: true },
    plan_id: { type: DataTypes.INTEGER, allowNull: false },
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
        { fields: ['plan_id'] },
    ],
    timestamps: true,
    underscored: true,
});
// Associations
YpSubscription.belongsTo(YpSubscriptionUser, { foreignKey: 'user_id', as: 'User' });
YpSubscription.belongsTo(YpAgentProduct, {
    foreignKey: 'agent_product_id',
    as: 'AgentProduct',
});
YpSubscription.belongsTo(YpSubscriptionPlan, { foreignKey: 'plan_id', as: 'Plan' });
YpSubscription.hasMany(YpAgentProductRun, {
    foreignKey: 'subscription_id',
    as: 'Runs',
});
