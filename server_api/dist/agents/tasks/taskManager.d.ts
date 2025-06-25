import WebSocket from "ws";
import { User as UserClass } from "@policysynth/agents/dbModels/index.js";
export declare class TaskManager {
    private queueManager;
    private agentManager;
    constructor(wsClients: Map<string, WebSocket>);
    private cloneCommunityTemplate;
    private cloneAgentAssets;
    startTask(communityIdToCloneFrom: number, domainId: number, currentUser: UserClass): Promise<number>;
    stopTask(agentId: number, agentRunId: number, wsClientId: string): Promise<boolean>;
    agentStatus(agentId: number): Promise<PsAgentStatus | null>;
    getAgentMemory(groupId: string, agentId: number, redisClient: any): Promise<any>;
}
