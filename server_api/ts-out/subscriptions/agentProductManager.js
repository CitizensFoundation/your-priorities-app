// AgentProductManager.ts
import { YpAgentProduct } from './models/agentProduct.js';
import { YpAgentProductRun } from './models/agentProductRun.js';
export class AgentProductManager {
    constructor() {
        // Initialize if necessary
    }
    // Get all agent products, with optional filters
    async getAgentProducts(filters = {}) {
        try {
            const agentProducts = await YpAgentProduct.findAll({ where: filters });
            return agentProducts;
        }
        catch (error) {
            throw new Error(`Error fetching agent products: ${error.message}`);
        }
    }
    // Get a specific agent product
    async getAgentProduct(agentProductId) {
        try {
            const agentProduct = await YpAgentProduct.findByPk(agentProductId);
            return agentProduct;
        }
        catch (error) {
            throw new Error(`Error fetching agent product: ${error.message}`);
        }
    }
    // Create a new agent product
    async createAgentProduct(data) {
        try {
            const agentProduct = await YpAgentProduct.create(data);
            return agentProduct;
        }
        catch (error) {
            throw new Error(`Error creating agent product: ${error.message}`);
        }
    }
    // Update an existing agent product
    async updateAgentProduct(agentProductId, updates) {
        try {
            const agentProduct = await YpAgentProduct.findByPk(agentProductId);
            if (!agentProduct) {
                throw new Error('Agent product not found');
            }
            Object.assign(agentProduct, updates);
            await agentProduct.save();
            return agentProduct;
        }
        catch (error) {
            throw new Error(`Error updating agent product: ${error.message}`);
        }
    }
    // Delete an agent product
    async deleteAgentProduct(agentProductId) {
        try {
            const agentProduct = await YpAgentProduct.findByPk(agentProductId);
            if (!agentProduct) {
                throw new Error('Agent product not found');
            }
            await agentProduct.destroy();
        }
        catch (error) {
            throw new Error(`Error deleting agent product: ${error.message}`);
        }
    }
    // Get runs associated with an agent product
    async getAgentProductRuns(agentProductId) {
        try {
            const runs = await YpAgentProductRun.findAll({
                where: { agent_product_id: agentProductId },
            });
            return runs;
        }
        catch (error) {
            throw new Error(`Error fetching agent product runs: ${error.message}`);
        }
    }
    // Get the status of an agent product
    async getAgentProductStatus(agentProductId) {
        try {
            const agentProduct = await YpAgentProduct.findByPk(agentProductId);
            if (!agentProduct) {
                throw new Error('Agent product not found');
            }
            return agentProduct.status;
        }
        catch (error) {
            throw new Error(`Error fetching agent product status: ${error.message}`);
        }
    }
}
