import { sequelize as psSequelize } from "@policysynth/agents/dbModels/index.js";
import { PsAiModel } from "@policysynth/agents/dbModels/aiModel.js";
import { PsAgentClass } from "@policysynth/agents/dbModels/agentClass.js";
import { PsAgentClassCategories } from "@policysynth/agents/agentCategories.js";
import { PsExternalApiUsage } from "@policysynth/agents/dbModels/externalApiUsage.js";
import { PsExternalApi } from "@policysynth/agents/dbModels/externalApis.js";
import { PsModelUsage } from "@policysynth/agents/dbModels/modelUsage.js";
import { PsAgent } from "@policysynth/agents/dbModels/agent.js";
import { PsAgentAuditLog } from "@policysynth/agents/dbModels/agentAuditLog.js";
import { PsAgentConnector } from "@policysynth/agents/dbModels/agentConnector.js";
import { PsAgentConnectorClass } from "@policysynth/agents/dbModels/agentConnectorClass.js";
import { PsAgentRegistry } from "@policysynth/agents/dbModels/agentRegistry.js";
import { PsAiModelSize, PsAiModelType } from "@policysynth/agents/aiModelTypes.js";
import models from "../../models/index.cjs";

// Group and User are available from our models
const dbModels: any = models;
const Group = dbModels.Group;
const User = dbModels.User;

// List of models that need to be initialized/associated
const psModels: { [key: string]: any } = {
  PsAgentClass,
  PsExternalApiUsage,
  PsModelUsage,
  PsAgentConnector,
  PsAgent,
  PsAgentAuditLog,
  PsAgentConnectorClass,
  PsAgentRegistry,
  PsAiModel,
  PsExternalApi,
};

export class NewAiModelSetup {
  /**
   * Initialize all models (i.e. call their associate methods if they exist)
   */
  static async initializeModels(): Promise<void> {
    try {
      console.log("All Models Loaded Init");

      for (const modelName of Object.keys(psModels)) {
        if (typeof psModels[modelName].associate === "function") {
          await psModels[modelName].associate(psSequelize.models);
        }
      }

      console.log("All models initialized successfully.");
    } catch (error) {
      console.error("Error initializing models:", error);
      process.exit(1);
    }
  }

  /**
   * Seed the test AI models and an initial Agent Class if they do not already exist.
   * @param userId the user id to associate with the new models
   */
  static async seedTestAiModels(userId: number): Promise<void> {
    const testModel = await PsAiModel.findOne({
      where: {
        name: "Anthropic Sonnet 3.5",
      },
    });

    if (!testModel) {
      const anthropicSonnetConfig = {
        type: PsAiModelType.Text,
        modelSize: PsAiModelSize.Medium,
        provider: "anthropic",
        prices: {
          costInTokensPerMillion: 3,
          costOutTokensPerMillion: 15,
          currency: "USD",
        },
        maxTokensOut: 8000,
        defaultTemperature: 0.7,
        model: "claude-3-5-sonnet-20240620",
        active: true,
      };

      const anthropicSonnet = await PsAiModel.create({
        name: "Anthropic Sonnet 3.5",
        organization_id: 1,
        user_id: userId,
        configuration: anthropicSonnetConfig,
      });

      console.log("Created test AI model:", anthropicSonnet);

      const openAiGpt4oConfig = {
        type: PsAiModelType.Text,
        modelSize: PsAiModelSize.Medium,
        provider: "openai",
        prices: {
          costInTokensPerMillion: 5,
          costOutTokensPerMillion: 15,
          currency: "USD",
        },
        maxTokensOut: 4096,
        defaultTemperature: 0.7,
        model: "gpt-4o",
        active: true,
      };

      const openAiGpt4oMiniConfig = {
        type: PsAiModelType.Text,
        modelSize: PsAiModelSize.Small,
        provider: "openai",
        prices: {
          costInTokensPerMillion: 0.15,
          costOutTokensPerMillion: 0.6,
          currency: "USD",
        },
        maxTokensOut: 16000,
        defaultTemperature: 0.0,
        model: "gpt-4o-mini",
        active: true,
      };

      const openAiGpt4 = await PsAiModel.create({
        name: "GPT-4o",
        organization_id: 1,
        user_id: userId,
        configuration: openAiGpt4oConfig,
      });

      console.log("Created test AI model:", openAiGpt4);

      const openAiGpt4Mini = await PsAiModel.create({
        name: "GPT-4o Mini",
        organization_id: 1,
        user_id: userId,
        configuration: openAiGpt4oMiniConfig,
      });

      console.log("Created test AI model:", openAiGpt4Mini);

      const topLevelAgentClassConfig = {
        category: PsAgentClassCategories.PolicySynthTopLevel,
        subCategory: "group",
        hasPublicAccess: true,
        description: "A top-level agent that coordinates other agents",
        queueName: "noqueue",
        imageUrl:
          "https://yrpri-eu-direct-assets.s3.eu-west-1.amazonaws.com/topLevelAgent.png",
        iconName: "coordinator",
        capabilities: [
          "process coordination",
          "task management",
          "result aggregation",
        ],
        questions: [],
        requestedAiModelSizes: ["large", "medium", "small"] as PsAiModelSize[],
        supportedConnectors: [],
      };

      await PsAgentClass.create({
        class_base_id: "c375c1fb-58ca-4372-a567-0e02b2c3d479",
        name: "Operations",
        version: 1,
        available: true,
        configuration: topLevelAgentClassConfig,
        user_id: userId,
      });
    } else {
      console.log("Test AI models already exist");
    }

    const testOMiniModel = await PsAiModel.findOne({
      where: {
        name: "o1 Mini",
      },
    });

    if (!testOMiniModel) {
      const openAio1MiniConfig = {
        type: PsAiModelType.TextReasoning,
        modelSize: PsAiModelSize.Small,
        provider: "openai",
        prices: {
          costInTokensPerMillion: 3.0,
          costOutTokensPerMillion: 12.0,
          currency: "USD",
        },
        maxTokensOut: 32000,
        defaultTemperature: 0.0,
        model: "o1-mini",
        active: true,
      };

      await PsAiModel.create({
        name: "o1 Mini",
        organization_id: 1,
        user_id: userId,
        configuration: openAio1MiniConfig,
      });
    } else {
      console.log("Test O models already exist");
    }

    const testOPreviewModel = await PsAiModel.findOne({
      where: {
        name: "o1 Preview",
      },
    });

    if (!testOPreviewModel) {
      const openAio1PreviewConfig = {
        type: PsAiModelType.TextReasoning,
        modelSize: PsAiModelSize.Medium,
        provider: "openai",
        prices: {
          costInTokensPerMillion: 15.0,
          costOutTokensPerMillion: 60.0,
          currency: "USD",
        },
        maxTokensOut: 32000,
        defaultTemperature: 0.0,
        model: "o1-preview",
        active: true,
      };

      await PsAiModel.create({
        name: "o1 Preview",
        organization_id: 1,
        user_id: userId,
        configuration: openAio1PreviewConfig,
      });
    } else {
      console.log("Test O preview models already exist");
    }

    const testO1712Model = await PsAiModel.findOne({
      where: {
        name: "o1 24",
      },
    });

    if (!testO1712Model) {
      const openAio11712Config = {
        type: PsAiModelType.TextReasoning,
        modelSize: PsAiModelSize.Medium,
        provider: "openai",
        prices: {
          costInTokensPerMillion: 15.0,
          costOutTokensPerMillion: 60.0,
          currency: "USD",
        },
        maxTokensOut: 100000,
        defaultTemperature: 0.0,
        model: "o1-2024-12-17",
        active: true,
      };

      await PsAiModel.create({
        name: "o1 24",
        organization_id: 1,
        user_id: userId,
        configuration: openAio11712Config,
      });
    } else {
      console.log("Test o1 1712 models already exist");
    }

    const geminiProModel = await PsAiModel.findOne({
      where: {
        name: "Gemini 1.5 Pro 2",
      },
    });

    if (!geminiProModel) {
      const geminiProConfig = {
        type: PsAiModelType.Text,
        modelSize: PsAiModelSize.Medium,
        provider: "google",
        prices: {
          costInTokensPerMillion: 1.25,
          costOutTokensPerMillion: 5.0,
          currency: "USD",
        },
        maxTokensOut: 8192,
        defaultTemperature: 0.0,
        model: "gemini-1.5-pro-002",
        active: true,
      };

      await PsAiModel.create({
        name: "Gemini 1.5 Pro 2",
        organization_id: 1,
        user_id: userId,
        configuration: geminiProConfig,
      });
    } else {
      console.log("Gemini 1.5 Pro 2 models already exist");
    }

    const geminiPro15FlashModel = await PsAiModel.findOne({
      where: {
        name: "Gemini 1.5 Flash 2",
      },
    });

    if (!geminiPro15FlashModel) {
      const geminiPro15FlashConfig = {
        type: PsAiModelType.Text,
        modelSize: PsAiModelSize.Small,
        provider: "google",
        prices: {
          costInTokensPerMillion: 0.075,
          costOutTokensPerMillion: 0.3,
          currency: "USD",
        },
        maxTokensOut: 8192,
        defaultTemperature: 0.0,
        model: "gemini-1.5-flash-002",
        active: true,
      };

      await PsAiModel.create({
        name: "Gemini 1.5 Flash 2",
        organization_id: 1,
        user_id: userId,
        configuration: geminiPro15FlashConfig,
      });
    }
  }

  /**
   * A helper to delay model seeding slightly. This method uses a timeout to seed
   * the test AI models.
   * @param userId the user id to pass to seedTestAiModels
   */
  static setupAiModels(userId: number): void {
    setTimeout(async () => {
      console.log("Seeding test AI models");
      await NewAiModelSetup.seedTestAiModels(userId);
    }, 100);
  }
}
