import { Model } from 'sequelize';
import { YpSubscription } from './subscription.js';
import { YpAgentProductBoosterPurchase } from './agentProductBoosterPurchase.js';
export declare class YpDiscount extends Model {
    id: number;
    uuid: string;
    code: string;
    description?: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    max_uses?: number;
    uses: number;
    start_date?: Date;
    end_date?: Date;
    applicable_to: 'agent_product' | 'booster' | 'subscription' | 'both';
    created_at: Date;
    updated_at: Date;
    Subscriptions?: YpSubscription[];
    BoosterPurchases?: YpAgentProductBoosterPurchase[];
    static associate(models: any): void;
}
