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

  public async getAgentMemory(groupId: number, agentId: number): Promise<object> {
    return this.fetchWrapper(
      this.baseUrlPath + `${this.baseAgentsPath}${groupId}/${agentId}/memory`,
      {
        method: 'GET',
      },
      false
    ) as Promise<object>;
  }

  public async removeAgentAiModel(
    groupId: number,
    agentId: number,
    modelId: number
  ): Promise<void> {
    return this.fetchWrapper(
      `${this.baseUrlPath}/agents/${groupId}/${agentId}/ai-models/${modelId}`,
      {
        method: 'DELETE',
      }
    );
  }

  public async getDetailedAgentCosts(groupId: number, agentId: number): Promise<PsDetailedAgentCostResults[]> {
    return this.fetchWrapper(
      this.baseUrlPath + `${this.baseAgentsPath}${groupId}/${agentId}/costs/detail`,
      {
        method: 'GET',
      },
      false
    ) as Promise<PsDetailedAgentCostResults[]>;
  }

  public async addAgentAiModel(
    groupId: number,
    agentId: number,
    modelId: number,
    size: PsAiModelSize
  ): Promise<void> {
    return this.fetchWrapper(
      `${this.baseUrlPath}/agents/${groupId}/${agentId}/ai-models`,
      {
        method: 'POST',
        body: JSON.stringify({ modelId, size }),
      }
    );
  }


  public async updateAgentConfiguration(
    groupId: number,
    agentId: number,
    updatedConfig: Partial<PsAgentAttributes['configuration']>
  ): Promise<void> {
    return this.fetchWrapper(
      this.baseUrlPath + `${this.baseAgentsPath}${groupId}/${agentId}/configuration`,
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
      this.baseUrlPath + this.baseAgentsPath+`${groupId}`,
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
    groupId: number,
    agentId: number
  ): Promise<PsAiModelAttributes[]> {
    return this.fetchWrapper(
      `${this.baseUrlPath}/agents/${groupId}/${agentId}/ai-models`
    ) as Promise<PsAiModelAttributes[]>;
  }

  public async getActiveAiModels(
    groupId: number
  ): Promise<PsAiModelAttributes[]> {
    return this.fetchWrapper(
      this.baseUrlPath + `${this.baseAgentsPath}${groupId}/registry/aiModels`,
      {
        method: 'GET',
      },
      false
    ) as Promise<PsAiModelAttributes[]>;
  }

  public async getActiveAgentClasses( groupId: number): Promise<PsAgentClassAttributes[]> {
    return this.fetchWrapper(
      this.baseUrlPath + `${this.baseAgentsPath}${groupId}/registry/agentClasses`,
      {
        method: 'GET',
      },
      false
    ) as Promise<PsAgentClassAttributes[]>;
  }

  public async getActiveConnectorClasses(groupId: number): Promise<
    PsAgentConnectorClassAttributes[]
  > {
    return this.fetchWrapper(
      this.baseUrlPath + `${this.baseAgentsPath}${groupId}/registry/connectorClasses`,
      {
        method: 'GET',
      },
      false
    ) as Promise<PsAgentConnectorClassAttributes[]>;
  }



  public async getAgentCosts(groupId: number, agentId: number): Promise<number> {
    const response = (await this.fetchWrapper(
      this.baseUrlPath + `${this.baseAgentsPath}${groupId}/${agentId}/costs`,
      {
        method: 'GET',
      },
      false
    )) as { totalCost: string };
    return parseFloat(response.totalCost);
  }


  async createConnector(
    groupId: number,
    agentId: number,
    connectorClassId: number,
    name: string,
    type: 'input' | 'output'
  ): Promise<PsAgentConnectorAttributes> {
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

  public updateNode(
    groupId: number,
    agentId: number,
    updatedNode: PsAgentAttributes
  ): Promise<void> {
    return this.fetchWrapper(
      this.baseUrlPath + `${this.baseAgentsPath}${groupId}/${agentId}`,
      {
        method: 'PUT',
        body: JSON.stringify(updatedNode),
      },
      false
    ) as Promise<void>;
  }

  public async updateNodeConfiguration(
    groupId: number,
    nodeType: 'agent' | 'connector',
    nodeId: number,
    updatedConfig: Partial<
      | PsAgentAttributes['configuration']
      | PsAgentConnectorAttributes['configuration']
    >
  ): Promise<void> {
    return this.fetchWrapper(
      this.baseUrlPath +
        `${this.baseAgentsPath}${groupId}/${nodeId}/${nodeType}/configuration`,
      {
        method: 'PUT',
        body: JSON.stringify(updatedConfig),
      },
      false
    ) as Promise<void>;
  }

  public async getAgentStatus(groupId: number, agentId: number): Promise<PsAgentStatus> {
    return this.fetchWrapper(
      this.baseUrlPath + `${this.baseAgentsPath}${groupId}/${agentId}/status`,
      {
        method: 'GET',
      },
      false
    ) as Promise<PsAgentStatus>;
  }

  async controlAgent(groupId: number, agentId: number, action: 'start' | 'pause' | 'stop') {
    return this.fetchWrapper(`/api/agents/${groupId}/${agentId}/control`, {
      method: 'POST',
      body: JSON.stringify({ action: action }),
    });
  }

  async startAgent(groupId: number, agentId: number) {
    return this.controlAgent(groupId, agentId, 'start');
  }

  async pauseAgent(groupId: number,agentId: number) {
    return this.controlAgent(groupId,agentId, 'pause');
  }

  async stopAgent(groupId: number, agentId: number) {
    return this.controlAgent(groupId, agentId, 'stop');
  }
}
