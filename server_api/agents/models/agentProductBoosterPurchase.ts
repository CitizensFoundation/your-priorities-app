import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from "@policysynth/agents/dbModels/sequelize.js";
import { YpSubscriptionUser } from './subscriptionUser.js';
import { Group } from '@policysynth/agents/dbModels/ypGroup.js';
import { YpAgentProduct } from './agentProduct.js';
import { YpSubscriptionPlan } from './subscriptionPlan.js';
import { YpDiscount } from './discount.js';

export class YpAgentProductBoosterPurchase extends Model {
  declare id: number;
  declare uuid: string;
  declare user_id: number;
  declare agent_product_id: number;
  declare subscription_plan_id: number;
  declare runs_purchased: number;
  declare amount: number;
  declare currency: string;
  declare purchase_date: Date;
  declare payment_method?: string;
  declare status: string;
  declare transaction_id?: string;
  declare metadata?: any;
  declare discount_id?: number;
  declare created_at: Date;
  declare updated_at: Date;

  // Associations
  declare User?: YpSubscriptionUser;
  declare AgentProduct?: YpAgentProduct;
  declare SubscriptionPlan?: YpSubscriptionPlan;
  declare Discount?: YpDiscount;
}

YpAgentProductBoosterPurchase.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    agent_product_id: { type: DataTypes.INTEGER, allowNull: false },
    subscription_plan_id: { type: DataTypes.INTEGER, allowNull: false },
    runs_purchased: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    currency: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'USD' },
    purchase_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    payment_method: { type: DataTypes.STRING(50), allowNull: true },
    status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'completed' },
    transaction_id: { type: DataTypes.STRING(100), allowNull: true },
    metadata: { type: DataTypes.JSONB, allowNull: true, defaultValue: {} },
    discount_id: { type: DataTypes.INTEGER, allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: 'agent_product_booster_purchases',
    indexes: [
      { fields: ['uuid'], unique: true },
      { fields: ['user_id'] },
      { fields: ['agent_product_id'] },
      { fields: ['subscription_plan_id'] },
      { fields: ['discount_id'] },
    ],
    timestamps: true,
    underscored: true,
  }
);

// Associations
(YpAgentProductBoosterPurchase as any).associate = (models: any) => {
  console.log('YpAgentProductBoosterPurchase.associate');

  YpAgentProductBoosterPurchase.belongsTo(models.YpSubscriptionUser, {
    foreignKey: 'user_id',
    as: 'User'
  });

  YpAgentProductBoosterPurchase.belongsTo(models.YpAgentProduct, {
    foreignKey: 'agent_product_id',
    as: 'AgentProduct',
  });

  YpAgentProductBoosterPurchase.belongsTo(models.YpSubscriptionPlan, {
    foreignKey: 'subscription_plan_id',
    as: 'SubscriptionPlan',
  });

  YpAgentProductBoosterPurchase.belongsTo(models.YpDiscount, {
    foreignKey: 'discount_id',
    as: 'Discount',
  });
};
