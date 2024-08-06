import { YpServerApiBase } from '../common/YpServerApiBase.js';
import { PsAiModelSize } from '@policysynth/agents/aiModelTypes.js';
export declare class PsServerApi extends YpServerApiBase {
    baseAgentsPath: string;
    constructor(urlPath?: string);
    getAgent(groupId: number): Promise<PsAgentAttributes>;
    getAgentMemory(groupId: number, agentId: number): Promise<object>;
    removeAgentAiModel(groupId: number, agentId: number, modelId: number): Promise<void>;
    getDetailedAgentCosts(groupId: number, agentId: number): Promise<PsDetailedAgentCostResults[]>;
    addAgentAiModel(groupId: number, agentId: number, modelId: number, size: PsAiModelSize): Promise<void>;
    updateAgentConfiguration(groupId: number, agentId: number, updatedConfig: Partial<PsAgentAttributes['configuration']>): Promise<void>;
    createAgent(name: string, agentClassId: number, aiModels: {
        [key: string]: number;
    }, parentAgentId: number, groupId?: number): Promise<PsAgentAttributes>;
    getAgentAiModels(groupId: number, agentId: number): Promise<PsAiModelAttributes[]>;
    getActiveAiModels(groupId: number): Promise<PsAiModelAttributes[]>;
    getActiveAgentClasses(groupId: number): Promise<PsAgentClassAttributes[]>;
    getActiveConnectorClasses(groupId: number): Promise<PsAgentConnectorClassAttributes[]>;
    getAgentCosts(groupId: number, agentId: number): Promise<number>;
    createConnector(groupId: number, agentId: number, connectorClassId: number, name: string, type: 'input' | 'output'): Promise<PsAgentConnectorAttributes>;
    updateNode(groupId: number, agentId: number, updatedNode: PsAgentAttributes): Promise<void>;
    updateNodeConfiguration(groupId: number, nodeType: 'agent' | 'connector', nodeId: number, updatedConfig: Partial<PsAgentAttributes['configuration'] | PsAgentConnectorAttributes['configuration']>): Promise<void>;
    getAgentStatus(groupId: number, agentId: number): Promise<PsAgentStatus>;
    controlAgent(groupId: number, agentId: number, action: 'start' | 'pause' | 'stop'): Promise<any>;
    startAgent(groupId: number, agentId: number): Promise<any>;
    pauseAgent(groupId: number, agentId: number): Promise<any>;
    stopAgent(groupId: number, agentId: number): Promise<any>;
}
//# sourceMappingURL=PsServerApi.d.ts.map