
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "@policysynth/agents/dbModels/sequelize.js";
import { YpSubscriptionUser } from './subscriptionUser.js';
import { Group } from '@policysynth/agents/dbModels/ypGroup.js';
import { YpAgentProductBoosterPurchase } from './agentProductBoosterPurchase.js';
import { YpSubscription } from './subscription.js';
import { YpAgentProductRun } from './agentProductRun.js';
import { YpSubscriptionPlan } from "./subscriptionPlan.js";

export class YpAgentProduct extends Model {
  declare id: number;
  declare uuid: string;
  declare user_id: number;
  declare group_id: number;
  declare domain_id: number;
  declare configuration: YpAgentProductConfiguration;
  declare status?: YpAgentProductStatus;
  declare created_at: Date;
  declare updated_at: Date;

  // Associations
  declare User?: YpSubscriptionUser;
  declare Group?: Group;
  declare BoosterPurchases?: YpAgentProductBoosterPurchase[];
  declare Subscriptions?: YpSubscription[];
  declare SubscriptionPlans?: YpSubscriptionPlan[];
  declare Runs?: YpAgentProductRun[];
}

YpAgentProduct.init(
  {
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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    domain_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    configuration: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
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
  },
  {
    sequelize,
    tableName: 'agent_products',
    indexes: [
      { fields: ['uuid'], unique: true },
      { fields: ['user_id'] },
      { fields: ['group_id'] },
      { fields: ['domain_id'] },
    ],
    timestamps: true,
    underscored: true,
  }
);

// Associations
YpAgentProduct.belongsTo(YpSubscriptionUser, { foreignKey: 'user_id', as: 'User' });

YpAgentProduct.belongsTo(Group, { foreignKey: 'group_id', as: 'Group' });

YpAgentProduct.hasMany(YpAgentProductBoosterPurchase, {
  foreignKey: 'agent_product_id',
  as: 'BoosterPurchases',
});

YpAgentProduct.hasMany(YpSubscription, {
  foreignKey: 'agent_product_id',
  as: 'Subscriptions',
});

YpAgentProduct.hasMany(YpSubscriptionPlan, {
  foreignKey: 'agent_product_id',
  as: 'SubscriptionPlans',
});

YpAgentProduct.hasMany(YpAgentProductRun, {
  foreignKey: 'agent_product_id',
  as: 'Runs',
});
