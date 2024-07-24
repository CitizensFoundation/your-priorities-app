import { YpServerApiBase } from '../common/YpServerApiBase.js';
import { PsAiModelSize } from '@policysynth/agents/aiModelTypes.js';

export class PsServerApi extends YpServerApiBase {
  baseAgentsPath = '/agents/';
  constructor(urlPath: string = '/api') {
    super();
    this.baseUrlPath = urlPath;
  }

  public async getAgent(groupId: number): Promise<PsAgentAttributes> {
    return (await this.fetchWrapper(
      this.baseUrlPath + `${this.baseAgentsPath}${groupId}`,
      {},
      false
    )) as unknown as PsAgentAttributes;
  }

  public async removeAgentAiModel(
    agentId: number,
    modelId: number
  ): Promise<void> {
    return this.fetchWrapper(
      `${this.baseUrlPath}/agents/${agentId}/ai-models/${modelId}`,
      {
        method: 'DELETE',
      }
    );
  }

  public async addAgentAiModel(
    agentId: number,
    modelId: number,
    size: PsAiModelSize
  ): Promise<void> {
    return this.fetchWrapper(
      `${this.baseUrlPath}/agents/${agentId}/ai-models`,
      {
        method: 'POST',
        body: JSON.stringify({ modelId, size }),
      }
    );
  }


  public async updateAgentConfiguration(
    agentId: number,
    updatedConfig: Partial<PsAgentAttributes['configuration']>
  ): Promise<void> {
    return this.fetchWrapper(
      this.baseUrlPath + `${this.baseAgentsPath}${agentId}/configuration`,
      {
        method: 'PUT',
        body: JSON.stringify(updatedConfig),
      },
      false
    ) as Promise<void>;
  }

  public async createAgent(
    name: string,
    agentClassId: number,
    aiModels: { [key: string]: number },
    parentAgentId: number,
    groupId?: number
  ): Promise<PsAgentAttributes> {
    return this.fetchWrapper(
      this.baseUrlPath + this.baseAgentsPath,
      {
        method: 'POST',
        body: JSON.stringify({
          name,
          agentClassId,
          aiModels,
          parentAgentId,
          groupId,
        }),
      },
      false
    ) as Promise<PsAgentAttributes>;
  }

  public async getAgentAiModels(
    agentId: number
  ): Promise<PsAiModelAttributes[]> {
    return this.fetchWrapper(
      `${this.baseUrlPath}/agents/${agentId}/ai-models`
    ) as Promise<PsAiModelAttributes[]>;
  }

  public async getActiveAiModels(): Promise<PsAiModelAttributes[]> {
    return this.fetchWrapper(
      this.baseUrlPath + `${this.baseAgentsPath}registry/aiModels`,
      {
        method: 'GET',
      },
      false
    ) as Promise<PsAiModelAttributes[]>;
  }

  public async getActiveAgentClasses(): Promise<PsAgentClassAttributes[]> {
    return this.fetchWrapper(
      this.baseUrlPath + `${this.baseAgentsPath}registry/agentClasses`,
      {
        method: 'GET',
      },
      false
    ) as Promise<PsAgentClassAttributes[]>;
  }

  public async getActiveConnectorClasses(): Promise<
    PsAgentConnectorClassAttributes[]
  > {
    return this.fetchWrapper(
      this.baseUrlPath + `${this.baseAgentsPath}registry/connectorClasses`,
      {
        method: 'GET',
      },
      false
    ) as Promise<PsAgentConnectorClassAttributes[]>;
  }



  public async getAgentCosts(agentId: number): Promise<number> {
    const response = (await this.fetchWrapper(
      this.baseUrlPath + `${this.baseAgentsPath}${agentId}/costs`,
      {
        method: 'GET',
      },
      false
    )) as { totalCost: string };
    return parseFloat(response.totalCost);
  }


  async createConnector(
    agentId: number,
    connectorClassId: number,
    name: string,
    type: 'input' | 'output'
  ): Promise<PsAgentConnectorAttributes> {
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

  public updateNode(
    agentId: number,
    updatedNode: PsAgentAttributes
  ): Promise<void> {
    return this.fetchWrapper(
      this.baseUrlPath + `${this.baseAgentsPath}${agentId}`,
      {
        method: 'PUT',
        body: JSON.stringify(updatedNode),
      },
      false
    ) as Promise<void>;
  }

  public async updateNodeConfiguration(
    nodeType: 'agent' | 'connector',
    nodeId: number,
    updatedConfig: Partial<
      | PsAgentAttributes['configuration']
      | PsAgentConnectorAttributes['configuration']
    >
  ): Promise<void> {
    return this.fetchWrapper(
      this.baseUrlPath +
        `${this.baseAgentsPath}${nodeId}/${nodeType}/configuration`,
      {
        method: 'PUT',
        body: JSON.stringify(updatedConfig),
      },
      false
    ) as Promise<void>;
  }

  public async getAgentStatus(agentId: number): Promise<PsAgentStatus> {
    return this.fetchWrapper(
      this.baseUrlPath + `${this.baseAgentsPath}${agentId}/status`,
      {
        method: 'GET',
      },
      false
    ) as Promise<PsAgentStatus>;
  }

  async controlAgent(agentId: number, action: 'start' | 'pause' | 'stop') {
    return this.fetchWrapper(`/api/agents/${agentId}/control`, {
      method: 'POST',
      body: JSON.stringify({ action: action }),
    });
  }

  async startAgent(agentId: number) {
    return this.controlAgent(agentId, 'start');
  }

  async pauseAgent(agentId: number) {
    return this.controlAgent(agentId, 'pause');
  }

  async stopAgent(agentId: number) {
    return this.controlAgent(agentId, 'stop');
  }

  public deleteNode(treeId: string | number, nodeId: string): Promise<void> {
    return this.fetchWrapper(
      this.baseUrlPath + `${this.baseAgentsPath}${treeId}`,
      {
        method: 'DELETE',
        body: JSON.stringify({ nodeId }),
      },
      false
    ) as Promise<void>;
  }
}
