import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from "@policysynth/agents/dbModels/sequelize.js";
import { YpSubscriptionUser } from './subscriptionUser.js';
import { YpAgentProduct } from './agentProduct.js';
import { YpSubscriptionPlan } from './subscriptionPlan.js';
import { YpAgentProductRun } from './agentProductRun.js';
import { YpDiscount } from './discount.js';

export class YpSubscription extends Model {
  declare id: number;
  declare uuid: string;
  declare user_id: number;
  declare domain_id: number;
  declare agent_product_id: number;
  declare subscription_plan_id: number;
  declare start_date: Date;
  declare end_date?: Date;
  declare next_billing_date: Date;
  declare status: 'active' | 'paused' | 'cancelled' | 'expired';
  declare payment_method?: string;
  declare transaction_id?: string;
  declare configuration?: YpSubscriptionConfiguration;
  declare metadata?: any;
  declare created_at: Date;
  declare updated_at: Date;

  // Associations
  declare User: YpSubscriptionUser;
  declare AgentProduct: YpAgentProduct;
  declare Plan: YpSubscriptionPlan;
}

YpSubscription.init(
  {
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
  },
  {
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
  }
);

// Associations
YpSubscription.belongsTo(YpSubscriptionUser, { foreignKey: 'user_id', as: 'User' });
YpSubscription.belongsTo(YpAgentProduct, {
  foreignKey: 'agent_product_id',
  as: 'AgentProduct',
});
YpSubscription.belongsTo(YpSubscriptionPlan, {
  foreignKey: 'subscription_plan_id',
  as: 'Plan',
});
YpSubscription.hasMany(YpAgentProductRun, {
  foreignKey: 'subscription_id',
  as: 'Runs',
});

YpSubscription.belongsToMany(YpDiscount, {
  through: 'subscription_discounts',
  foreignKey: 'subscription_id',
  otherKey: 'discount_id',
  as: 'Discounts',
});
