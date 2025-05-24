import { initializeModels, PsAgentClass, PsAgent, PsAiModel } from "@policysynth/agents/dbModels/index.js";
import { PsAiModelType, PsAiModelSize } from "@policysynth/agents/aiModelTypes.js";
import models from "../../src/models/index.cjs";

(async () => {
  const [domainIdArg, agentClassIdArg] = process.argv.slice(2);

  if (!domainIdArg || !agentClassIdArg) {
    console.error(
      "Usage: ts-node generateAgentWorkflowTemplateFromAgentClass.ts <domainId> <psAgentClassId>"
    );
    process.exit(1);
  }

  const domainId = Number(domainIdArg);
  const agentClassId = Number(agentClassIdArg);

  if (isNaN(domainId) || isNaN(agentClassId)) {
    console.error("Both domainId and psAgentClassId must be valid numbers");
    process.exit(1);
  }

  try {
    await initializeModels();

    const domain = await models.Domain.findByPk(domainId);
    if (!domain) {
      throw new Error(`Domain ${domainId} not found`);
    }

    // Create Community
    const community = await models.Community.create({
      domain_id: domainId,
      name: `Agent Workflow Template ${Date.now()}`,
      hostname: `agent-workflow-${Date.now()}`,
      access: models.Community.ACCESS_PUBLIC,
      ip_address: "127.0.0.1",
      user_agent: "generateAgentWorkflowTemplateFromAgentClass.ts",
      configuration: {},
    });

    // Create Workflow Group
    const group = await models.Group.create({
      community_id: community.id,
      name: "Agent Workflow",
      access: models.Group.ACCESS_PUBLIC,
      ip_address: "127.0.0.1",
      user_agent: "generateAgentWorkflowTemplateFromAgentClass.ts",
      configuration: { groupType: 3, agents: {} },
    });

    // Create PsAgent from class
    const agentClass = await PsAgentClass.findByPk(agentClassId);
    if (!agentClass) {
      throw new Error(`PsAgentClass ${agentClassId} not found`);
    }

    const psAgent = await PsAgent.create({
      user_id: agentClass.user_id,
      class_id: agentClass.id,
      group_id: group.id,
      configuration: {},
    });

    // Add Gemini 2.5 Pro Preview 2 model
    const geminiReasoning = await PsAiModel.findOne({
      where: { name: "Gemini 2.5 Pro Preview 2" },
    });
    if (geminiReasoning) {
      await psAgent.addAiModel(geminiReasoning);
    } else {
      const created = await PsAiModel.create({
        name: "Gemini 2.5 Pro Preview 2",
        user_id: agentClass.user_id,
        organization_id: 1,
        configuration: {
          type: PsAiModelType.TextReasoning,
          modelSize: PsAiModelSize.Medium,
          provider: "google",
          model: "gemini-2.5-pro-preview-05-06",
          active: true,
        },
      });
      await psAgent.addAiModel(created);
    }

    // Add Gemini 2.0 Flash model
    const geminiFlash = await PsAiModel.findOne({
      where: { name: "Gemini 2.0 Flash" },
    });
    if (geminiFlash) {
      await psAgent.addAiModel(geminiFlash);
    } else {
      const created = await PsAiModel.create({
        name: "Gemini 2.0 Flash",
        user_id: agentClass.user_id,
        organization_id: 1,
        configuration: {
          type: PsAiModelType.Text,
          modelSize: PsAiModelSize.Medium,
          provider: "google",
          model: "gemini-2.0-flash",
          active: true,
        },
      });
      await psAgent.addAiModel(created);
    }

    // Update group configuration with top level agent id
    group.configuration.agents = { topLevelAgentId: psAgent.id };
    (group as any).changed("configuration", true);
    await group.save();

    console.log(
      `Created community ${community.id}, group ${group.id}, agent ${psAgent.id}`
    );
  } catch (error) {
    console.error(error);
  } finally {
    await models.sequelize.close();
  }
})();
