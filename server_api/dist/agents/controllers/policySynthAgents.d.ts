import express from "express";
import WebSocket from "ws";
interface YpRequest extends express.Request {
    ypDomain?: any;
    ypCommunity?: any;
    sso?: any;
    redisClient?: any;
    user?: any;
}
export declare class PolicySynthAgentsController {
    path: string;
    router: import("express-serve-static-core").Router;
    wsClients: Map<string, WebSocket>;
    private agentQueueManager;
    private agentCostManager;
    private agentManager;
    private agentConnectorManager;
    private agentRegistryManager;
    constructor(wsClients: Map<string, WebSocket>);
    /**
     * A proxy for setting up API keys for a group.
     * @param group The group instance to configure
     */
    static setupApiKeysForGroup(group: any): Promise<void>;
    initializeRoutes(): void;
    replaceAgentMemory: (req: YpRequest, res: express.Response) => Promise<void>;
    addExistingConnector: (req: YpRequest, res: express.Response) => Promise<void>;
    getAgentMemory: (req: YpRequest, res: express.Response) => Promise<void>;
    getAgent: (req: express.Request, res: express.Response) => Promise<void>;
    getAgentAiModels: (req: express.Request, res: express.Response) => Promise<void>;
    removeAgentAiModel: (req: express.Request, res: express.Response) => Promise<void>;
    addAgentAiModel: (req: express.Request, res: express.Response) => Promise<void>;
    updateNodeConfiguration: (req: express.Request, res: express.Response) => Promise<void>;
    createInputConnector: (req: express.Request, res: express.Response) => Promise<void>;
    createOutputConnector: (req: express.Request, res: express.Response) => Promise<void>;
    createConnector: (req: YpRequest, res: express.Response, type: "input" | "output") => Promise<express.Response<any, Record<string, any>> | undefined>;
    getActiveAiModels: (req: express.Request, res: express.Response) => Promise<void>;
    getActiveAgentClasses: (req: YpRequest, res: express.Response) => Promise<void>;
    getActiveConnectorClasses: (req: YpRequest, res: express.Response) => Promise<void>;
    createAgent: (req: YpRequest, res: express.Response) => Promise<void>;
    controlAgent: (req: express.Request, res: express.Response) => Promise<void>;
    getAgentStatus: (req: express.Request, res: express.Response) => Promise<void>;
    updateAgentStatus: (req: express.Request, res: express.Response) => Promise<void>;
    private recursiveDeleteAgent;
    deleteAgent: (req: YpRequest, res: express.Response) => Promise<void>;
    startAgentProcessing: (req: express.Request, res: express.Response) => Promise<void>;
    pauseAgentProcessing: (req: express.Request, res: express.Response) => Promise<void>;
    getAgentCosts: (req: express.Request, res: express.Response) => Promise<void>;
    getAgentCostsDetail: (req: express.Request, res: express.Response) => Promise<void>;
}
export {};
