import {
  initializeModels,
  PsAgentClass,
  PsAgent,
  PsAiModel,
} from "@policysynth/agents/dbModels/index.js";
import models from "../../models/index.cjs";
import { NewAiModelSetup } from "../../agents/managers/newAiModelSetup.js";

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
    await NewAiModelSetup.seedAiModels(1);

    const domain = await models.Domain.findByPk(domainId);
    if (!domain) {
      throw new Error(`Domain ${domainId} not found`);
    }

    // Create Community
    const community = await models.Community.create({
      domain_id: domainId,
      name: `Agent Workflow Template ${Date.now()}`,
      hostname: `agent-workflow-${Date.now()}`,
      access: 1,
      user_id: 1,
      ip_address: "127.0.0.1",
      user_agent: "generateAgentWorkflowTemplateFromAgentClass.ts",
      configuration: {},
    });

    // Create Workflow Group
    const group = await models.Group.create({
      community_id: community.id,
      name: "Agent Workflow",
      access: 0,
      user_id: 1,
      ip_address: "127.0.0.1",
      user_agent: "generateAgentWorkflowTemplateFromAgentClass.ts",
      configuration: { groupType: 3, agents: {} },
    });

    // Create top level agent for the workflow
    const topLevelUuid = process.env.CLASS_ID_FOR_TOP_LEVEL_AGENT;
    if (!topLevelUuid) {
      throw new Error("CLASS_ID_FOR_TOP_LEVEL_AGENT environment variable not set");
    }

    const topLevelClass = await PsAgentClass.findOne({
      where: { class_base_id: topLevelUuid },
    });

    if (!topLevelClass) {
      throw new Error("Top level agent class not found");
    }

    const topLevelAgent = await PsAgent.create({
      user_id: topLevelClass.user_id,
      class_id: topLevelClass.id,
      group_id: group.id,
      configuration: { name: `${group.name} Top-Level Agent` },
    });

    // Update group configuration with top level agent id
    group.configuration.agents = { topLevelAgentId: topLevelAgent.id };
    group.changed("configuration", true);
    await group.save();

    await NewAiModelSetup.setupApiKeysForGroup(group);

    // Create working agent from class and attach to top level agent
    const agentClass = await PsAgentClass.findByPk(agentClassId);
    if (!agentClass) {
      throw new Error(`PsAgentClass ${agentClassId} not found`);
    }

    const psAgent = await PsAgent.create({
      user_id: agentClass.user_id,
      class_id: agentClass.id,
      group_id: group.id,
      parent_agent_id: topLevelAgent.id,
      configuration: {},
    });

    // Add Gemini 2.5 Pro Preview 2 model
    const geminiReasoning = await PsAiModel.findOne({
      where: { name: "Gemini 2.5 Pro Preview 2" },
    });

    if (geminiReasoning) {
      await psAgent.addAiModel(geminiReasoning);
    } else {
      throw new Error("Gemini 2.5 Pro Preview 2 model not found");
    }

    // Add Gemini 2.0 Flash model
    const geminiFlash = await PsAiModel.findOne({
      where: { name: "Gemini 2.0 Flash" },
    });

    if (geminiFlash) {
      await psAgent.addAiModel(geminiFlash);
    } else {
      throw new Error("Gemini 2.0 Flash model not found");
    }

    console.log(
      `Created community ${community.id}, group ${group.id}, top-level agent ${topLevelAgent.id}, working agent ${psAgent.id}`
    );
  } catch (error) {
    console.error(error);
  } finally {
    await models.sequelize.close();
  }
})();
