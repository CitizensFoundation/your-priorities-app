import { Model } from 'sequelize';
import { YpSubscriptionUser } from './subscriptionUser.js';
import { YpAgentProduct } from './agentProduct.js';
import { YpSubscriptionPlan } from './subscriptionPlan.js';
import { YpDiscount } from './discount.js';
export declare class YpAgentProductBoosterPurchase extends Model {
    id: number;
    uuid: string;
    user_id: number;
    agent_product_id: number;
    subscription_plan_id: number;
    runs_purchased: number;
    amount: number;
    currency: string;
    purchase_date: Date;
    payment_method?: string;
    status: string;
    transaction_id?: string;
    metadata?: any;
    discount_id?: number;
    created_at: Date;
    updated_at: Date;
    User?: YpSubscriptionUser;
    AgentProduct?: YpAgentProduct;
    SubscriptionPlan?: YpSubscriptionPlan;
    Discount?: YpDiscount;
}
