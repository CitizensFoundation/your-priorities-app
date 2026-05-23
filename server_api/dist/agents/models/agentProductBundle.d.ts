import { Model } from "sequelize";
import { YpAgentProduct } from './agentProduct.js';
export declare class YpAgentProductBundle extends Model {
    id: number;
    uuid: string;
    name: string;
    description?: string;
    configuration?: YpAgentProductBundleConfiguration;
    created_at: Date;
    updated_at: Date;
    AgentProducts?: YpAgentProduct[];
}
