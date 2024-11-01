import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from "@policysynth/agents/dbModels/sequelize.js";
import { YpSubscription } from './subscription.js';
import { YpAgentProductBoosterPurchase } from './agentProductBoosterPurchase.js';
import { YpAgentProduct } from './agentProduct.js';

export class YpSubscriptionPlan extends Model {
  declare id: number;
  declare uuid: string;
  declare agent_product_id: number; // Add this line
  declare name: string;
  declare description?: string;
  declare configuration: YpSubscriptionPlanConfiguration;
  declare created_at: Date;
  declare updated_at: Date;

  // Associations
  declare AgentProduct?: YpAgentProduct;
  declare Subscriptions?: YpSubscription[];
  declare BoosterPurchases?: YpAgentProductBoosterPurchase[];
}

YpSubscriptionPlan.init(
  {
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
    name: { type: DataTypes.STRING(256), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    configuration: { type: DataTypes.JSONB, allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: 'subscription_plans',
    indexes: [
      { fields: ['uuid'], unique: true },
      { fields: ['name'] },
    ],
    timestamps: true,
    underscored: true,
  }
);

// Add the associate method
(YpSubscriptionPlan as any).associate = (models: any) => {
  YpSubscriptionPlan.hasMany(models.YpSubscription, {
    foreignKey: 'subscription_plan_id',
    as: 'Subscriptions',
  });

  YpSubscriptionPlan.hasMany(models.YpAgentProductBoosterPurchase, {
    foreignKey: 'subscription_plan_id',
    as: 'BoosterPurchases',
  });

  YpSubscriptionPlan.belongsTo(models.YpAgentProduct, {
    foreignKey: 'agent_product_id',
    as: 'AgentProduct',
  });
};
