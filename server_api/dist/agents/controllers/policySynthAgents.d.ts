import express from "express";
import WebSocket from "ws";
interface YpRequest extends express.Request<Record<string, string>> {
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
    getAgent: (req: YpRequest, res: express.Response) => Promise<void>;
    getAgentAiModels: (req: YpRequest, res: express.Response) => Promise<void>;
    removeAgentAiModel: (req: YpRequest, res: express.Response) => Promise<void>;
    addAgentAiModel: (req: YpRequest, res: express.Response) => Promise<void>;
    updateNodeConfiguration: (req: YpRequest, res: express.Response) => Promise<void>;
    createInputConnector: (req: YpRequest, res: express.Response) => Promise<void>;
    createOutputConnector: (req: YpRequest, res: express.Response) => Promise<void>;
    createConnector: (req: YpRequest, res: express.Response, type: "input" | "output") => Promise<express.Response<any, Record<string, any>> | undefined>;
    getActiveAiModels: (req: YpRequest, res: express.Response) => Promise<void>;
    getActiveAgentClasses: (req: YpRequest, res: express.Response) => Promise<void>;
    getActiveConnectorClasses: (req: YpRequest, res: express.Response) => Promise<void>;
    createAgent: (req: YpRequest, res: express.Response) => Promise<void>;
    controlAgent: (req: YpRequest, res: express.Response) => Promise<void>;
    getAgentStatus: (req: YpRequest, res: express.Response) => Promise<void>;
    updateAgentStatus: (req: YpRequest, res: express.Response) => Promise<void>;
    private recursiveDeleteAgent;
    deleteAgent: (req: YpRequest, res: express.Response) => Promise<void>;
    startAgentProcessing: (req: YpRequest, res: express.Response) => Promise<void>;
    pauseAgentProcessing: (req: YpRequest, res: express.Response) => Promise<void>;
    getAgentCosts: (req: YpRequest, res: express.Response) => Promise<void>;
    getAgentCostsDetail: (req: YpRequest, res: express.Response) => Promise<void>;
}
export {};
