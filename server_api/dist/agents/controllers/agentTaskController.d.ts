import WebSocket from "ws";
export declare class AgentTaskController {
    path: string;
    router: import("express-serve-static-core").Router;
    private taskManager;
    constructor(wsClients: Map<string, WebSocket>);
    private initializeRoutes;
    private startTask;
    private stopTask;
    private agentStatus;
    private getAgentMemory;
}
