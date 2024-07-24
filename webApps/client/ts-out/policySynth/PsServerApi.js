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
    async removeAgentAiModel(agentId, modelId) {
        return this.fetchWrapper(`${this.baseUrlPath}/agents/${agentId}/ai-models/${modelId}`, {
            method: 'DELETE',
        });
    }
    async addAgentAiModel(agentId, modelId, size) {
        return this.fetchWrapper(`${this.baseUrlPath}/agents/${agentId}/ai-models`, {
            method: 'POST',
            body: JSON.stringify({ modelId, size }),
        });
    }
    async updateAgentConfiguration(agentId, updatedConfig) {
        return this.fetchWrapper(this.baseUrlPath + `${this.baseAgentsPath}${agentId}/configuration`, {
            method: 'PUT',
            body: JSON.stringify(updatedConfig),
        }, false);
    }
    async createAgent(name, agentClassId, aiModels, parentAgentId, groupId) {
        return this.fetchWrapper(this.baseUrlPath + this.baseAgentsPath, {
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
    async getAgentAiModels(agentId) {
        return this.fetchWrapper(`${this.baseUrlPath}/agents/${agentId}/ai-models`);
    }
    async getActiveAiModels() {
        return this.fetchWrapper(this.baseUrlPath + `${this.baseAgentsPath}registry/aiModels`, {
            method: 'GET',
        }, false);
    }
    async getActiveAgentClasses() {
        return this.fetchWrapper(this.baseUrlPath + `${this.baseAgentsPath}registry/agentClasses`, {
            method: 'GET',
        }, false);
    }
    async getActiveConnectorClasses() {
        return this.fetchWrapper(this.baseUrlPath + `${this.baseAgentsPath}registry/connectorClasses`, {
            method: 'GET',
        }, false);
    }
    async getAgentCosts(agentId) {
        const response = (await this.fetchWrapper(this.baseUrlPath + `${this.baseAgentsPath}${agentId}/costs`, {
            method: 'GET',
        }, false));
        return parseFloat(response.totalCost);
    }
    async createConnector(agentId, connectorClassId, name, type) {
        const response = await fetch(`/api/agents/${agentId}/${type}Connectors`, {
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
    updateNode(agentId, updatedNode) {
        return this.fetchWrapper(this.baseUrlPath + `${this.baseAgentsPath}${agentId}`, {
            method: 'PUT',
            body: JSON.stringify(updatedNode),
        }, false);
    }
    async updateNodeConfiguration(nodeType, nodeId, updatedConfig) {
        return this.fetchWrapper(this.baseUrlPath +
            `${this.baseAgentsPath}${nodeId}/${nodeType}/configuration`, {
            method: 'PUT',
            body: JSON.stringify(updatedConfig),
        }, false);
    }
    async getAgentStatus(agentId) {
        return this.fetchWrapper(this.baseUrlPath + `${this.baseAgentsPath}${agentId}/status`, {
            method: 'GET',
        }, false);
    }
    async controlAgent(agentId, action) {
        return this.fetchWrapper(`/api/agents/${agentId}/control`, {
            method: 'POST',
            body: JSON.stringify({ action: action }),
        });
    }
    async startAgent(agentId) {
        return this.controlAgent(agentId, 'start');
    }
    async pauseAgent(agentId) {
        return this.controlAgent(agentId, 'pause');
    }
    async stopAgent(agentId) {
        return this.controlAgent(agentId, 'stop');
    }
    deleteNode(treeId, nodeId) {
        return this.fetchWrapper(this.baseUrlPath + `${this.baseAgentsPath}${treeId}`, {
            method: 'DELETE',
            body: JSON.stringify({ nodeId }),
        }, false);
    }
}
//# sourceMappingURL=PsServerApi.js.map