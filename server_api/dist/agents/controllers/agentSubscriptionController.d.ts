import express from "express";
import WebSocket from "ws";
interface YpRequest extends express.Request {
    ypDomain?: any;
    ypCommunity?: any;
    sso?: any;
    redisClient?: any;
    user?: any;
}
export declare class AgentSubscriptionController {
    path: string;
    router: import("express-serve-static-core").Router;
    private subscriptionManager;
    private wsClients;
    constructor(wsClients: Map<string, WebSocket>);
    initializeRoutes(): void;
    initializeRoutesSecure(): void;
    getAgentConfigurationAnswers: (req: YpRequest, res: express.Response) => Promise<void>;
    updateAgentConfiguration: (req: YpRequest, res: express.Response) => Promise<void>;
    getPlans: (req: YpRequest, res: express.Response) => Promise<void>;
    createSubscriptions: (req: YpRequest, res: express.Response) => Promise<void>;
    startAgentRun: (req: YpRequest, res: express.Response) => Promise<void>;
    stopAgentRun: (req: YpRequest, res: express.Response) => Promise<void>;
    getSubscriptions: (req: YpRequest, res: express.Response) => Promise<void>;
    cancelSubscription: (req: YpRequest, res: express.Response) => Promise<void>;
    updateSubscription: (req: YpRequest, res: express.Response) => Promise<void>;
    createPaymentIntent: (req: YpRequest, res: express.Response) => Promise<void>;
    handleWebhook: (req: YpRequest, res: express.Response) => Promise<void>;
}
export {};
