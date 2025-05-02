// AgentProductController.ts
import express from 'express';
import { AgentProductManager } from '../managers/agentProductManager.js';
import auth from '../../authorization.cjs';
export class AgentProductController {
    constructor() {
        this.path = '/api/agent-products';
        this.router = express.Router();
        this.getAgentProducts = async (req, res) => {
            try {
                const filters = req.query;
                const agentProducts = await this.agentProductManager.getAgentProducts(filters);
                res.json(agentProducts);
            }
            catch (error) {
                console.error('Error fetching agent products:', error);
                res.status(500).json({ error: error.message });
            }
        };
        this.getAgentProduct = async (req, res) => {
            try {
                const agentProductId = parseInt(req.params.agentProductId);
                const agentProduct = await this.agentProductManager.getAgentProduct(agentProductId);
                if (!agentProduct) {
                    return res.status(404).json({ error: 'Agent product not found' });
                }
                res.json(agentProduct);
            }
            catch (error) {
                console.error('Error fetching agent product:', error);
                res.status(500).json({ error: error.message });
            }
        };
        this.createAgentProduct = async (req, res) => {
            try {
                const data = req.body;
                data.user_id = req.user.id; // Assuming the agent product belongs to the user
                const agentProduct = await this.agentProductManager.createAgentProduct(data);
                res.status(201).json(agentProduct);
            }
            catch (error) {
                console.error('Error creating agent product:', error);
                res.status(500).json({ error: error.message });
            }
        };
        this.updateAgentProduct = async (req, res) => {
            try {
                const agentProductId = parseInt(req.params.agentProductId);
                const updates = req.body;
                const agentProduct = await this.agentProductManager.updateAgentProduct(agentProductId, updates);
                res.json(agentProduct);
            }
            catch (error) {
                console.error('Error updating agent product:', error);
                res.status(500).json({ error: error.message });
            }
        };
        this.deleteAgentProduct = async (req, res) => {
            try {
                const agentProductId = parseInt(req.params.agentProductId);
                await this.agentProductManager.deleteAgentProduct(agentProductId);
                res.status(200).json({ message: 'Agent product deleted successfully' });
            }
            catch (error) {
                console.error('Error deleting agent product:', error);
                res.status(500).json({ error: error.message });
            }
        };
        this.getAgentProductRuns = async (req, res) => {
            try {
                const agentProductId = parseInt(req.params.agentProductId);
                const runs = await this.agentProductManager.getAgentProductRuns(agentProductId);
                res.json(runs);
            }
            catch (error) {
                console.error('Error fetching agent product runs:', error);
                res.status(500).json({ error: error.message });
            }
        };
        this.getAgentProductStatus = async (req, res) => {
            try {
                const agentProductId = parseInt(req.params.agentProductId);
                const status = await this.agentProductManager.getAgentProductStatus(agentProductId);
                res.json(status);
            }
            catch (error) {
                console.error('Error fetching agent product status:', error);
                res.status(500).json({ error: error.message });
            }
        };
        this.agentProductManager = new AgentProductManager();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get('/', auth.can('view agent products'), this.getAgentProducts);
        this.router.get('/:agentProductId', auth.can('view agent products'), this.getAgentProduct);
        this.router.post('/', auth.can('create agent products'), this.createAgentProduct);
        this.router.put('/:agentProductId', auth.can('edit agent products'), this.updateAgentProduct);
        this.router.delete('/:agentProductId', auth.can('delete agent products'), this.deleteAgentProduct);
        this.router.get('/:agentProductId/runs', auth.can('view agent products'), this.getAgentProductRuns);
        this.router.get('/:agentProductId/status', auth.can('view agent products'), this.getAgentProductStatus);
    }
}
