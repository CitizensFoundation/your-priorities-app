import { YpServerApiBase } from '../common/YpServerApiBase.js';
export class PsServerApi extends YpServerApiBase {
    constructor(urlPath = '/api') {
        super();
        this.baseAgentsPath = '/agents/';
        this.baseUrlPath = urlPath;
    }
    async getAgent(groupId) {
        return (await this.fetchWrapper(this.baseUrlPath + `${this.baseAgentsPath}${groupId}`, {}, false));
    }
    async getAgentMemory(groupId, agentId) {
        return this.fetchWrapper(this.baseUrlPath + `${this.baseAgentsPath}${groupId}/${agentId}/memory`, {
            method: 'GET',
        }, false);
    }
    async replaceAgentMemory(groupId, agentId, memory) {
        return this.fetchWrapper(this.baseUrlPath + `${this.baseAgentsPath}${groupId}/${agentId}/memory`, {
            method: 'PUT',
            body: JSON.stringify(memory),
        }, false);
    }
    async removeAgentAiModel(groupId, agentId, modelId) {
        return this.fetchWrapper(`${this.baseUrlPath}/agents/${groupId}/${agentId}/ai-models/${modelId}`, {
            method: 'DELETE',
        });
    }
    async getDetailedAgentCosts(groupId, agentId) {
        return this.fetchWrapper(this.baseUrlPath + `${this.baseAgentsPath}${groupId}/${agentId}/costs/detail`, {
            method: 'GET',
        }, false);
    }
    async addAgentAiModel(groupId, agentId, modelId, size) {
        return this.fetchWrapper(`${this.baseUrlPath}/agents/${groupId}/${agentId}/ai-models`, {
            method: 'POST',
            body: JSON.stringify({ modelId, size }),
        });
    }
    async updateAgentConfiguration(groupId, agentId, updatedConfig) {
        return this.fetchWrapper(this.baseUrlPath + `${this.baseAgentsPath}${groupId}/${agentId}/configuration`, {
            method: 'PUT',
            body: JSON.stringify(updatedConfig),
        }, false);
    }
    async addExistingConnector(groupId, agentId, connectorId, type) {
        return this.fetchWrapper(`${this.baseUrlPath}/agents/${groupId}/${agentId}/${type}Connectors/existing`, {
            method: 'POST',
            body: JSON.stringify({ connectorId }),
        });
    }
    async createAgent(name, agentClassId, aiModels, parentAgentId, groupId) {
        return this.fetchWrapper(this.baseUrlPath + this.baseAgentsPath + `${groupId}`, {
            method: 'POST',
            body: JSON.stringify({
                name,
                agentClassId,
                aiModels,
                parentAgentId,
                groupId,
            }),
        }, false);
    }
    async getAgentAiModels(groupId, agentId) {
        return this.fetchWrapper(`${this.baseUrlPath}/agents/${groupId}/${agentId}/ai-models`);
    }
    async getActiveAiModels(groupId) {
        return this.fetchWrapper(this.baseUrlPath + `${this.baseAgentsPath}${groupId}/registry/aiModels`, {
            method: 'GET',
        }, false);
    }
    async getActiveAgentClasses(groupId) {
        return this.fetchWrapper(this.baseUrlPath + `${this.baseAgentsPath}${groupId}/registry/agentClasses`, {
            method: 'GET',
        }, false);
    }
    async getActiveConnectorClasses(groupId) {
        return this.fetchWrapper(this.baseUrlPath + `${this.baseAgentsPath}${groupId}/registry/connectorClasses`, {
            method: 'GET',
        }, false);
    }
    async getAgentCosts(groupId, agentId) {
        const response = (await this.fetchWrapper(this.baseUrlPath + `${this.baseAgentsPath}${groupId}/${agentId}/costs`, {
            method: 'GET',
        }, false));
        return parseFloat(response.totalCost);
    }
    async createConnector(groupId, agentId, connectorClassId, name, type) {
        const response = await fetch(`/api/agents/${groupId}/${agentId}/${type}Connectors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ connectorClassId, name }),
        });
        if (!response.ok) {
            throw new Error(`Failed to create ${type} connector`);
        }
        return response.json();
    }
    updateNode(groupId, agentId, updatedNode) {
        return this.fetchWrapper(this.baseUrlPath + `${this.baseAgentsPath}${groupId}/${agentId}`, {
            method: 'PUT',
            body: JSON.stringify(updatedNode),
        }, false);
    }
    async updateNodeConfiguration(groupId, nodeType, nodeId, updatedConfig) {
        return this.fetchWrapper(this.baseUrlPath +
            `${this.baseAgentsPath}${groupId}/${nodeId}/${nodeType}/configuration`, {
            method: 'PUT',
            body: JSON.stringify(updatedConfig),
        }, false);
    }
    async getAgentStatus(groupId, agentId) {
        return this.fetchWrapper(this.baseUrlPath + `${this.baseAgentsPath}${groupId}/${agentId}/status`, {
            method: 'GET',
        }, false);
    }
    async controlAgent(groupId, agentId, action) {
        return this.fetchWrapper(`/api/agents/${groupId}/${agentId}/control`, {
            method: 'POST',
            body: JSON.stringify({ action: action }),
        });
    }
    async startAgent(groupId, agentId) {
        return this.controlAgent(groupId, agentId, 'start');
    }
    async pauseAgent(groupId, agentId) {
        return this.controlAgent(groupId, agentId, 'pause');
    }
    async stopAgent(groupId, agentId) {
        return this.controlAgent(groupId, agentId, 'stop');
    }
}
//# sourceMappingURL=PsServerApi.js.map