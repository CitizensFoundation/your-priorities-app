import {
  initializeModels,
  PsAgent,
  PsAiModel,
} from "@policysynth/agents/dbModels/index.js";
import { PsAiModelSize, PsAiModelType } from "@policysynth/agents/aiModelTypes.js";
import models from "../../models/index.cjs";
import { NewAiModelSetup } from "../../agents/managers/newAiModelSetup.js";

(async () => {
  const [groupIdArg, sizeArg, typeArg, modelNameArg] = process.argv.slice(2);

  if (!groupIdArg || !sizeArg || !typeArg || !modelNameArg) {
    console.error(
      "Usage: ts-node changeModelForWorkflowGroupTemplate.ts <groupId> <modelSize (small, medium, large)> <modeltype: text, textReasoning> <model_name>"
    );
    process.exit(1);
  }

  const groupId = Number(groupIdArg);
  if (isNaN(groupId)) {
    console.error("groupId must be a number");
    process.exit(1);
  }

  const sizeMap: Record<string, PsAiModelSize> = {
    small: PsAiModelSize.Small,
    medium: PsAiModelSize.Medium,
    large: PsAiModelSize.Large,
  };
  const typeMap: Record<string, PsAiModelType> = {
    text: PsAiModelType.Text,
    textreasoning: PsAiModelType.TextReasoning,
  };

  const size = sizeMap[sizeArg.toLowerCase()];
  const modelType = typeMap[typeArg.toLowerCase()];

  if (!size) {
    console.error("modelSize must be one of small, medium or large");
    process.exit(1);
  }

  if (!modelType) {
    console.error("modeltype must be text or textReasoning");
    process.exit(1);
  }

  try {
    await initializeModels();

    const group = await models.Group.findByPk(groupId);
    if (!group) {
      throw new Error(`Group ${groupId} not found`);
    }

    const topLevelAgentId = group.configuration?.agents?.topLevelAgentId;
    if (!topLevelAgentId) {
      throw new Error("Top level agent id not found in group configuration");
    }

    const subAgents: any[] = await PsAgent.findAll({
      where: { group_id: groupId, parent_agent_id: topLevelAgentId },
    });

    if (subAgents.length === 0) {
      throw new Error("No sub-agents found for workflow group");
    }

    const newModel = await PsAiModel.findOne({
      where: { configuration: { model: modelNameArg } },
    });

    if (!newModel) {
      throw new Error(`AI model with configuration.model ${modelNameArg} not found`);
    }

    const privateConfig = (group.private_access_configuration ?? []) as any[];

    for (const agent of subAgents) {
      console.log(`Updating agent ${agent.id} to use model ${newModel.name}`);
      const currentModels: any[] = await agent.getAiModels();
      console.log(`Current models: ${currentModels.length}`);
      for (const current of currentModels) {
        const cfg = current.configuration || {};
        if (cfg.modelSize === size && cfg.type === modelType) {
          await agent.removeAiModel(current);
          const entry = privateConfig.find((p) => p.aiModelId === current.id);
          if (entry) {
            console.log(`Updating entry ${entry.id} to use model ${newModel.name}`);
            entry.aiModelId = newModel.id;
          } else {
            console.log(`Adding entry for agent ${agent.id} to use model ${newModel.name}`);
            privateConfig.push({
              aiModelId: newModel.id,
              agentId: agent.id,
            });
          }
        } else {
          console.log(`Skipping model ${current.name} for agent ${agent.id} because it does not match size ${size} and type ${modelType}`);
        }
      }
      await agent.addAiModel(newModel);
      console.log(`Updated agent ${agent.id} to use model ${newModel.name}`);
    }

    group.set("private_access_configuration", privateConfig);
    group.changed("private_access_configuration", true);
    await group.save();

    await NewAiModelSetup.setupApiKeysForGroup(group);

    console.log(`Group ${groupId} updated successfully`);
  } catch (error) {
    console.error(error);
  } finally {
    await models.sequelize.close();
  }
})();
