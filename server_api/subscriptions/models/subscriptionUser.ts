import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from "@policysynth/agents/dbModels/sequelize.js";
import { YpAgentProduct } from './agentProduct.js';
import { YpAgentProductBoosterPurchase } from './agentProductBoosterPurchase.js';
import { YpSubscription } from './subscription.js';

export class YpSubscriptionUser extends Model {
  declare id: number;
  declare uuid: string;
  // Other fields...

  // Associations
  declare AgentProducts?: YpAgentProduct[];
  declare AgentProductBoosterPurchases?: YpAgentProductBoosterPurchase[];
  declare Subscriptions?: YpSubscription[];
}

YpSubscriptionUser.init(
  {
    // Define user fields
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true,
  }
);

// Associations
YpSubscriptionUser.hasMany(YpAgentProduct, { foreignKey: 'user_id', as: 'AgentProducts' });
YpSubscriptionUser.hasMany(YpAgentProductBoosterPurchase, {
  foreignKey: 'user_id',
  as: 'AgentProductBoosterPurchases',
});
YpSubscriptionUser.hasMany(YpSubscription, { foreignKey: 'user_id', as: 'Subscriptions' });
