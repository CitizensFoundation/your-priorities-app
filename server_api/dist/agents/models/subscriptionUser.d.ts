import { Model } from 'sequelize';
import { YpAgentProduct } from './agentProduct.js';
import { YpAgentProductBoosterPurchase } from './agentProductBoosterPurchase.js';
import { YpSubscription } from './subscription.js';
export declare class YpSubscriptionUser extends Model {
    id: number;
    name: string;
    AgentProducts?: YpAgentProduct[];
    AgentProductBoosterPurchases?: YpAgentProductBoosterPurchase[];
    Subscriptions?: YpSubscription[];
}
