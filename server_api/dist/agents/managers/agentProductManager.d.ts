import { YpAgentProduct } from '../models/agentProduct.js';
import { YpAgentProductRun } from '../models/agentProductRun.js';
export declare class AgentProductManager {
    constructor();
    getAgentProducts(filters?: any): Promise<YpAgentProduct[]>;
    getAgentProduct(agentProductId: number): Promise<YpAgentProduct | null>;
    createAgentProduct(data: any): Promise<YpAgentProduct>;
    updateAgentProduct(agentProductId: number, updates: any): Promise<YpAgentProduct>;
    deleteAgentProduct(agentProductId: number): Promise<void>;
    getAgentProductRuns(agentProductId: number): Promise<YpAgentProductRun[]>;
    getAgentProductStatus(agentProductId: number): Promise<any>;
}
