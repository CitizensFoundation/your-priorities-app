import { NotificationAgentQueueManager } from "../managers/notificationAgentQueueManager.js";
import { AgentManager } from "@policysynth/agents/operations/agentManager.js";
import WebSocket from "ws";
import models from "../../models/index.cjs";
import { copyCommunity } from "../../utils/copy_utils.cjs";
import {
  PsAgent,
  PsAgentConnector,
  PsAiModel,
  User as UserClass,
} from "@policysynth/agents/dbModels/index.js";

export class TaskManager {
  private queueManager: NotificationAgentQueueManager;
  private agentManager: AgentManager;

  constructor(wsClients: Map<string, WebSocket>) {
    this.queueManager = new NotificationAgentQueueManager(wsClients);
    this.agentManager = new AgentManager();
  }

  private async cloneCommunityTemplate(
    communityTemplateId: number,
    toDomainId: number
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      copyCommunity(
        communityTemplateId,
        toDomainId,
        {
          copyGroups: true,
          copyPosts: false,
          copyPoints: false,
          skipUsers: true,
          recountGroupPosts: true,
          skipEndorsementQualitiesAndRatings: true,
          resetEndorsementCounters: true,
          skipActivities: true,
        },
        null,
        (error: any, newCommunity: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(newCommunity);
          }
        }
      );
    });
  }

  private async cloneAgentAssets(
    originalAgent: PsAgent,
    clonedAgent: PsAgent,
    groupId: number
  ): Promise<void> {
    // Clone AI Models
    const originalAiModels = await originalAgent.getAiModels();
    if (originalAiModels && originalAiModels.length > 0) {
      await clonedAgent.setAiModels(originalAiModels);
    }

    // Clone Input Connectors
    if (originalAgent.InputConnectors && originalAgent.InputConnectors.length > 0) {
      for (const connector of originalAgent.InputConnectors as PsAgentConnector[]) {
        const connectorConfig = { ...connector.configuration };
        const clonedConnector = await PsAgentConnector.create({
          user_id: clonedAgent.user_id,
          group_id: groupId,
          class_id: connector.class_id,
          configuration: connectorConfig,
        });
        await (models as any).AgentInputConnectors.create({
          agent_id: clonedAgent.id,
          connector_id: clonedConnector.id,
        });
      }
    }

    // Clone Output Connectors
    if (originalAgent.OutputConnectors && originalAgent.OutputConnectors.length > 0) {
      for (const connector of originalAgent.OutputConnectors as PsAgentConnector[]) {
        const connectorConfig = { ...connector.configuration };
        const clonedConnector = await PsAgentConnector.create({
          user_id: clonedAgent.user_id,
          group_id: groupId,
          class_id: connector.class_id,
          configuration: connectorConfig,
        });
        await (models as any).AgentOutputConnectors.create({
          agent_id: clonedAgent.id,
          connector_id: clonedConnector.id,
        });
      }
    }
  }

  async startTask(
    communityIdToCloneFrom: number,
    domainId: number,
    currentUser: UserClass
  ): Promise<number> {
    const newCommunity = await this.cloneCommunityTemplate(
      communityIdToCloneFrom,
      domainId
    );

    const groups = await (models.Group as any).findAll({
      where: { community_id: newCommunity.id },
      include: [
        {
          model: models.User,
          as: "GroupAdmins",
          attributes: ["id"],
          required: false,
        },
      ],
    });

    const workflowGroup = groups.find((g: any) => g.configuration?.agents?.topLevelAgentId);
    if (!workflowGroup) {
      throw new Error("Workflow group not found");
    }

    const topLevelAgentId = workflowGroup.configuration.agents.topLevelAgentId;
    const originalTopLevelAgent = await PsAgent.findByPk(topLevelAgentId, {
      include: [
        {
          model: PsAgent,
          as: "SubAgents",
          include: [
            { model: PsAiModel, as: "AiModels", required: false },
            { model: PsAgentConnector, as: "InputConnectors", required: false },
            { model: PsAgentConnector, as: "OutputConnectors", required: false },
          ],
        },
      ],
    });

    if (!originalTopLevelAgent) {
      throw new Error("Original top level agent not found");
    }

    const clonedTopLevelAgent = await PsAgent.create({
      user_id: currentUser.id,
      class_id: originalTopLevelAgent.class_id,
      configuration: { ...originalTopLevelAgent.configuration },
      group_id: workflowGroup.id,
      parent_agent_id: undefined,
    });

    const clonedSubAgents: PsAgent[] = [];
    if (originalTopLevelAgent.SubAgents && originalTopLevelAgent.SubAgents.length > 0) {
      for (const subAgent of originalTopLevelAgent.SubAgents) {
        let clonedSub = await PsAgent.create({
          user_id: currentUser.id,
          class_id: subAgent.class_id,
          configuration: { ...subAgent.configuration },
          group_id: workflowGroup.id,
          parent_agent_id: clonedTopLevelAgent.id,
        });
        await this.cloneAgentAssets(subAgent, clonedSub, workflowGroup.id);
        clonedSubAgents.push(clonedSub);
      }
    }

    workflowGroup.configuration.agents.topLevelAgentId = clonedTopLevelAgent.id;
    (workflowGroup as any).changed("configuration", true);
    await workflowGroup.save();

    const userInstance = await models.User.findByPk(currentUser.id);
    if (userInstance) {
      await newCommunity.addCommunityUsers(userInstance);
      await workflowGroup.addGroupAdmins(userInstance);
      await workflowGroup.addGroupUsers(userInstance);
    }

    if (clonedSubAgents.length === 0) {
      throw new Error("No sub agents found to start");
    }

    const firstSubAgentId = clonedSubAgents[0].id;
    await this.queueManager.startAgentProcessing(firstSubAgentId);
    return firstSubAgentId;
  }

  async stopTask(
    agentId: number,
    agentRunId: number,
    wsClientId: string
  ): Promise<boolean> {
    return this.queueManager.stopAgentProcessing(agentId, wsClientId, agentRunId);
  }

  async agentStatus(agentId: number) {
    return this.queueManager.getAgentStatus(agentId);
  }

  async getAgentMemory(
    groupId: string,
    agentId: number,
    redisClient: any
  ): Promise<any> {
    const key = await this.agentManager.getSubAgentMemoryKey(groupId, agentId);
    if (!key) return null;
    const memoryContents = await redisClient.get(key);
    return memoryContents ? JSON.parse(memoryContents) : null;
  }
}
