// AgentProductController.ts

import express from 'express';
import { AgentProductManager } from '../managers/agentProductManager.js';
import auth from '../../authorization.cjs';
import log from "../../utils/loggerTs.js";

interface YpRequest extends express.Request {
  ypDomain?: any;
  ypCommunity?: any;
  sso?: any;
  redisClient?: any;
  user?: any;
}


export class AgentProductController {
  public path = '/api/agent-products';
  public router = express.Router();
  private agentProductManager: AgentProductManager;

  constructor() {
    this.agentProductManager = new AgentProductManager();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get('/', auth.can('view agent products'), this.getAgentProducts);
    this.router.get(
      '/:agentProductId',
      auth.can('view agent products'),
      this.getAgentProduct
    );
    this.router.post(
      '/',
      auth.can('create agent products'),
      this.createAgentProduct
    );
    this.router.put(
      '/:agentProductId',
      auth.can('edit agent products'),
      this.updateAgentProduct
    );
    this.router.delete(
      '/:agentProductId',
      auth.can('delete agent products'),
      this.deleteAgentProduct
    );

    this.router.get(
      '/:agentProductId/runs',
      auth.can('view agent products'),
      this.getAgentProductRuns
    );
    this.router.get(
      '/:agentProductId/status',
      auth.can('view agent products'),
      this.getAgentProductStatus
    );
  }

  getAgentProducts = async (req: YpRequest, res: express.Response) => {
    try {
      const filters = req.query;
      const agentProducts = await this.agentProductManager.getAgentProducts(
        filters
      );
      res.json(agentProducts);
    } catch (error: any) {
      log.error('Error fetching agent products:', error);
      res.status(500).json({ error: error.message });
    }
  };

  getAgentProduct = async (req: YpRequest, res: express.Response) => {
    try {
      const agentProductId = parseInt(req.params.agentProductId);
      const agentProduct = await this.agentProductManager.getAgentProduct(
        agentProductId
      );
      if (!agentProduct) {
        res.status(404).json({ error: 'Agent product not found' });
        return;
      }
      res.json(agentProduct);
    } catch (error: any) {
      log.error('Error fetching agent product:', error);
      res.status(500).json({ error: error.message });
    }
  };

  createAgentProduct = async (req: YpRequest, res: express.Response) => {
    try {
      const data = req.body;
      data.user_id = req.user.id; // Assuming the agent product belongs to the user
      const agentProduct = await this.agentProductManager.createAgentProduct(
        data
      );
      res.status(201).json(agentProduct);
    } catch (error: any) {
      log.error('Error creating agent product:', error);
      res.status(500).json({ error: error.message });
    }
  };

  updateAgentProduct = async (req: YpRequest, res: express.Response) => {
    try {
      const agentProductId = parseInt(req.params.agentProductId);
      const updates = req.body;
      const agentProduct = await this.agentProductManager.updateAgentProduct(
        agentProductId,
        updates
      );
      res.json(agentProduct);
    } catch (error: any) {
      log.error('Error updating agent product:', error);
      res.status(500).json({ error: error.message });
    }
  };

  deleteAgentProduct = async (req: YpRequest, res: express.Response) => {
    try {
      const agentProductId = parseInt(req.params.agentProductId);
      await this.agentProductManager.deleteAgentProduct(agentProductId);
      res.status(200).json({ message: 'Agent product deleted successfully' });
    } catch (error: any) {
      log.error('Error deleting agent product:', error);
      res.status(500).json({ error: error.message });
    }
  };


  getAgentProductRuns = async (req: YpRequest, res: express.Response) => {
    try {
      const agentProductId = parseInt(req.params.agentProductId);
      const runs = await this.agentProductManager.getAgentProductRuns(
        agentProductId
      );
      res.json(runs);
    } catch (error: any) {
      log.error('Error fetching agent product runs:', error);
      res.status(500).json({ error: error.message });
    }
  };

  getAgentProductStatus = async (req: YpRequest, res: express.Response) => {
    try {
      const agentProductId = parseInt(req.params.agentProductId);
      const status = await this.agentProductManager.getAgentProductStatus(
        agentProductId
      );
      res.json(status);
    } catch (error: any) {
      log.error('Error fetching agent product status:', error);
      res.status(500).json({ error: error.message });
    }
  };
}
