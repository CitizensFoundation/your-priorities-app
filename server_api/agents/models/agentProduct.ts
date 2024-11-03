import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "@policysynth/agents/dbModels/sequelize.js";
import { YpSubscriptionUser } from './subscriptionUser.js';
import { Group } from '@policysynth/agents/dbModels/ypGroup.js';
import { YpAgentProductBoosterPurchase } from './agentProductBoosterPurchase.js';
import { YpSubscription } from './subscription.js';
import { YpAgentProductRun } from './agentProductRun.js';
import { YpSubscriptionPlan } from "./subscriptionPlan.js";
import { YpAgentProductBundle } from "./agentProductBundle.js";

export class YpAgentProduct extends Model {
  declare id: number;
  declare uuid: string;
  declare name: string;
  declare description: string;
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
  declare AgentBundles?: YpAgentProductBundle[];
  declare AgentBundle?: YpAgentProductBundle;
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
    configuration: {
      type: DataTypes.JSONB,
      allowNull: false
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

(YpAgentProduct as any).associate = (models: any) => {
  console.log(`YpAgentProduct.associate`);

  YpAgentProduct.belongsTo(models.YpSubscriptionUser, {
    foreignKey: 'user_id',
    as: 'User'
  });

  YpAgentProduct.belongsTo(models.Group, {
    foreignKey: 'group_id',
    as: 'Group'
  });

  YpAgentProduct.hasOne(models.YpAgentProductBundle, {
    foreignKey: 'agent_bundle_id',
    as: 'AgentBundle'
  });

  YpAgentProduct.hasMany(models.YpAgentProductBoosterPurchase, {
    foreignKey: 'agent_product_id',
    as: 'BoosterPurchases',
  });

  YpAgentProduct.hasMany(models.YpSubscription, {
    foreignKey: 'agent_product_id',
    as: 'Subscriptions',
  });

  YpAgentProduct.hasMany(models.YpSubscriptionPlan, {
    foreignKey: 'agent_product_id',
    as: 'SubscriptionPlans',
  });

  YpAgentProduct.hasMany(models.YpAgentProductRun, {
    foreignKey: 'agent_product_id',
    as: 'Runs',
  });

  YpAgentProduct.belongsToMany(models.YpAgentProductBundle, {
    through: 'agent_product_bundles_products',
    foreignKey: 'agent_product_id',
    otherKey: 'agent_product_bundle_id',
    as: 'AgentBundles'
  });
};
