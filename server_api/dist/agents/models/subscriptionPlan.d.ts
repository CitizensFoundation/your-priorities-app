import { Model } from 'sequelize';
import { YpSubscription } from './subscription.js';
import { YpAgentProductBoosterPurchase } from './agentProductBoosterPurchase.js';
import { YpAgentProduct } from './agentProduct.js';
export declare class YpSubscriptionPlan extends Model {
    id: number;
    uuid: string;
    agent_product_id: number;
    name: string;
    description?: string;
    configuration: YpSubscriptionPlanConfiguration;
    created_at: Date;
    updated_at: Date;
    AgentProduct?: YpAgentProduct;
    Subscriptions?: YpSubscription[];
    BoosterPurchases?: YpAgentProductBoosterPurchase[];
}
