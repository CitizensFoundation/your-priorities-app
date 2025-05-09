import { Model } from 'sequelize';
import { YpSubscriptionUser } from './subscriptionUser.js';
import { YpAgentProduct } from './agentProduct.js';
import { YpSubscriptionPlan } from './subscriptionPlan.js';
export declare class YpSubscription extends Model {
    id: number;
    uuid: string;
    user_id: number;
    domain_id: number;
    agent_product_id: number;
    subscription_plan_id: number;
    start_date: Date;
    end_date?: Date;
    next_billing_date: Date;
    status: 'active' | 'paused' | 'cancelled' | 'expired';
    payment_method?: string;
    transaction_id?: string;
    configuration?: YpSubscriptionConfiguration;
    metadata?: any;
    created_at: Date;
    updated_at: Date;
    User: YpSubscriptionUser;
    AgentProduct: YpAgentProduct;
    SubscriptionPlan: YpSubscriptionPlan;
    Plan: YpSubscriptionPlan;
}
