import express from 'express';
interface YpRequest extends express.Request {
    ypDomain?: any;
    ypCommunity?: any;
    sso?: any;
    redisClient?: any;
    user?: any;
}
export declare class AgentProductController {
    path: string;
    router: import("express-serve-static-core").Router;
    private agentProductManager;
    constructor();
    initializeRoutes(): void;
    getAgentProducts: (req: YpRequest, res: express.Response) => Promise<void>;
    getAgentProduct: (req: YpRequest, res: express.Response) => Promise<void>;
    createAgentProduct: (req: YpRequest, res: express.Response) => Promise<void>;
    updateAgentProduct: (req: YpRequest, res: express.Response) => Promise<void>;
    deleteAgentProduct: (req: YpRequest, res: express.Response) => Promise<void>;
    getAgentProductRuns: (req: YpRequest, res: express.Response) => Promise<void>;
    getAgentProductStatus: (req: YpRequest, res: express.Response) => Promise<void>;
}
export {};
