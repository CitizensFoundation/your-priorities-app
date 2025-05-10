import {
  sequelize as psSequelize,
  User,
} from "@policysynth/agents/dbModels/index.js";
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
import {
  PsAiModelSize,
  PsAiModelType,
} from "@policysynth/agents/aiModelTypes.js";

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
   * Initializes all models by calling their associate methods (if present).
   */
  static async initializeModels(): Promise<void> {
    try {
      if (process.env.FORCE_DB_SYNC || process.env.NODE_ENV === "development") {
        await psSequelize.sync();
      }

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
   * Seeds the test AI models (and a top-level agent class) if they do not exist.
   * @param userId the user id to associate with the new models
   */
  static async seedAnthropicModels(userId: number): Promise<void> {
    const anthropicSonnet = await PsAiModel.findOne({
      where: { name: "Anthropic Sonnet 3.5" },
    });
    const anthropicSonnetConfig = {
      type: PsAiModelType.Text,
      modelSize: PsAiModelSize.Medium,
      provider: "anthropic",
      prices: {
        costInTokensPerMillion: 3,
        costOutTokensPerMillion: 15,
        costInCachedContextTokensPerMillion: 0.3,
        currency: "USD",
      },
      maxTokensOut: 8000,
      defaultTemperature: 0.7,
      model: "claude-3-5-sonnet-20240620",
      active: true,
    };

    if (!anthropicSonnet) {
      const createdModel = await PsAiModel.create({
        name: "Anthropic Sonnet 3.5",
        organization_id: 1,
        user_id: userId,
        configuration: anthropicSonnetConfig,
      });
      console.log("Created Anthropic model:", createdModel);
    } else {
      console.log("Anthropic model already exists: Anthropic Sonnet 3.5");
      anthropicSonnet.set("configuration", anthropicSonnetConfig);
      anthropicSonnet.changed("configuration", true);
      await anthropicSonnet.save();
    }
  }

  static async seedAnthropic37Models(userId: number): Promise<void> {
    const anthropicSonnet = await PsAiModel.findOne({
      where: { name: "Anthropic Sonnet 3.7" },
    });
    const anthropicSonnetConfig = {
      type: PsAiModelType.TextReasoning,
      modelSize: PsAiModelSize.Medium,
      provider: "anthropic",
      prices: {
        costInTokensPerMillion: 3,
        costOutTokensPerMillion: 15,
        costInCachedContextTokensPerMillion: 0.3,
        currency: "USD",
      },
      maxTokensOut: 8000,
      defaultTemperature: 0.7,
      model: "claude-3-7-sonnet-20250219",
      active: true,
    };
    if (!anthropicSonnet) {
      const createdModel = await PsAiModel.create({
        name: "Anthropic Sonnet 3.7",
        organization_id: 1,
        user_id: userId,
        configuration: anthropicSonnetConfig,
      });
      console.log("Created Anthropic model:", createdModel);
    } else {
      console.log("Anthropic model already exists: Anthropic Sonnet 3.7");
      anthropicSonnet.set("configuration", anthropicSonnetConfig);
      anthropicSonnet.changed("configuration", true);
      await anthropicSonnet.save();
    }
  }

  /**
   * Seeds OpenAI models.
   * This currently creates several models including GPT-4o, GPT-4o Mini, o1 Mini,
   * o1 Preview, o1 24, and o3 mini.
   */
  static async seedOpenAiModels(userId: number): Promise<void> {
    // GPT-4o
    const openAiGpt4 = await PsAiModel.findOne({
      where: { name: "GPT-4o" },
    });
    const openAiGpt4oConfig = {
      type: PsAiModelType.Text,
      modelSize: PsAiModelSize.Medium,
      provider: "openai",
      prices: {
        costInTokensPerMillion: 2.5,
        costOutTokensPerMillion: 10,
        costInCachedContextTokensPerMillion: 1.25,
        currency: "USD",
      },
      maxTokensOut: 16384,
      defaultTemperature: 0.7,
      model: "gpt-4o",
      active: true,
    };

    if (!openAiGpt4) {
      await PsAiModel.create({
        name: "GPT-4o",
        organization_id: 1,
        user_id: userId,
        configuration: openAiGpt4oConfig,
      });
      console.log("Created OpenAI model: GPT-4o");
    } else {
      console.log("OpenAI model already exists: GPT-4o updating");
      openAiGpt4.set("configuration", openAiGpt4oConfig);
      openAiGpt4.changed("configuration", true);
      await openAiGpt4.save();
    }

    // GPT-4o Mini
    const openAiGpt4Mini = await PsAiModel.findOne({
      where: { name: "GPT-4o Mini" },
    });
    const openAiGpt4oMiniConfig = {
      type: PsAiModelType.Text,
      modelSize: PsAiModelSize.Small,
      provider: "openai",
      prices: {
        costInTokensPerMillion: 0.15,
        costOutTokensPerMillion: 0.6,
        costInCachedContextTokensPerMillion: 0.075,
        currency: "USD",
      },
      maxTokensOut: 16384,
      defaultTemperature: 0.0,
      model: "gpt-4o-mini",
      active: true,
    };
    if (!openAiGpt4Mini) {
      await PsAiModel.create({
        name: "GPT-4o Mini",
        organization_id: 1,
        user_id: userId,
        configuration: openAiGpt4oMiniConfig,
      });
      console.log("Created OpenAI model: GPT-4o Mini");
    } else {
      openAiGpt4Mini.set("configuration", openAiGpt4oMiniConfig);
      openAiGpt4Mini.changed("configuration", true);
      await openAiGpt4Mini.save();
      console.log("OpenAI model already exists: GPT-4o Mini");
    }

    // o1 Mini
    const openAio1Mini = await PsAiModel.findOne({
      where: { name: "o1 Mini" },
    });
    const openAio1MiniConfig = {
      type: PsAiModelType.TextReasoning,
      modelSize: PsAiModelSize.Small,
      provider: "openai",
      prices: {
        costInTokensPerMillion: 1.1,
        costOutTokensPerMillion: 4.4,
        costInCachedContextTokensPerMillion: 0.55,
        currency: "USD",
      },
      maxTokensOut: 32000,
      defaultTemperature: 0.0,
      model: "o1-mini",
      active: true,
    };
    if (!openAio1Mini) {
      await PsAiModel.create({
        name: "o1 Mini",
        organization_id: 1,
        user_id: userId,
        configuration: openAio1MiniConfig,
      });
      console.log("Created OpenAI model: o1 Mini");
    } else {
      openAio1Mini.set("configuration", openAio1MiniConfig);
      openAio1Mini.changed("configuration", true);
      await openAio1Mini.save();
      console.log("OpenAI model already exists: o1 Mini");
    }

    // o1 Preview
    const openAio1Preview = await PsAiModel.findOne({
      where: { name: "o1 Preview" },
    });
    const openAio1PreviewConfig = {
      type: PsAiModelType.TextReasoning,
      modelSize: PsAiModelSize.Medium,
      provider: "openai",
      prices: {
        costInTokensPerMillion: 15.0,
        costOutTokensPerMillion: 60.0,
        costInCachedContextTokensPerMillion: 7.5,
        currency: "USD",
      },
      maxTokensOut: 32000,
      defaultTemperature: 0.0,
      model: "o1-preview",
      active: true,
    };
    if (!openAio1Preview) {
      await PsAiModel.create({
        name: "o1 Preview",
        organization_id: 1,
        user_id: userId,
        configuration: openAio1PreviewConfig,
      });
      console.log("Created OpenAI model: o1 Preview");
    } else {
      openAio1Preview.set("configuration", openAio1PreviewConfig);
      openAio1Preview.changed("configuration", true);
      await openAio1Preview.save();
      console.log("OpenAI model already exists: o1 Preview");
    }

    // o1 24
    const openAio11712 = await PsAiModel.findOne({
      where: { name: "o1 24" },
    });

    const openAio11712Config = {
      type: PsAiModelType.TextReasoning,
      modelSize: PsAiModelSize.Medium,
      provider: "openai",
      prices: {
        costInTokensPerMillion: 15.0,
        costOutTokensPerMillion: 60.0,
        costInCachedContextTokensPerMillion: 7.5,
        currency: "USD",
      },
      maxTokensOut: 100000,
      defaultTemperature: 0.0,
      model: "o1",
      active: true,
    };

    if (!openAio11712) {
      await PsAiModel.create({
        name: "o1 24",
        organization_id: 1,
        user_id: userId,
        configuration: openAio11712Config,
      });
      console.log("Created OpenAI model: o1 24");
    } else {
      console.log("OpenAI model already exists: o1 24 updating");
      openAio11712.set("configuration", openAio11712Config);
      openAio11712.changed("configuration", true);
      await openAio11712.save();
    }

    // o3 mini
    const openAio3Mini = await PsAiModel.findOne({
      where: { name: "o3 mini" },
    });
    const openAio3MiniConfig = {
      type: PsAiModelType.TextReasoning,
      modelSize: PsAiModelSize.Small,
      provider: "openai",
      prices: {
        costInTokensPerMillion: 1.1,
        costOutTokensPerMillion: 4.4,
        costInCachedContextTokensPerMillion: 0.55,
        currency: "USD",
      },
      maxTokensOut: 100000,
      defaultTemperature: 0.0,
      model: "o3-mini",
      active: true,
    };

    if (!openAio3Mini) {
      await PsAiModel.create({
        name: "o3 mini",
        organization_id: 1,
        user_id: userId,
        configuration: openAio3MiniConfig,
      });
      console.log("Created OpenAI model: o3 mini");
    } else {
      openAio3Mini.set("configuration", openAio3MiniConfig);
      openAio3Mini.changed("configuration", true);
      await openAio3Mini.save();
      console.log("OpenAI model already exists: o3 mini");
    }

    const openAiGpt45 = await PsAiModel.findOne({
      where: { name: "GPT-4.5 Preview" },
    });
    const openAiGpt45Config = {
      type: PsAiModelType.Text,
      modelSize: PsAiModelSize.Large,
      provider: "openai",
      prices: {
        costInTokensPerMillion: 75,
        costOutTokensPerMillion: 150,
        costInCachedContextTokensPerMillion: 37.5,
        currency: "USD",
      },
      maxTokensOut: 100000,
      defaultTemperature: 0.7,
      model: "gpt-4.5-preview",
      active: true,
    };

    if (!openAiGpt45) {
      await PsAiModel.create({
        name: "GPT-4.5 Preview",
        organization_id: 1,
        user_id: userId,
        configuration: openAiGpt45Config,
      });
      console.log("Created OpenAI model: GPT-4.5 Preview");
    } else {
      openAiGpt45.set("configuration", openAiGpt45Config);
      openAiGpt45.changed("configuration", true);
      await openAiGpt45.save();
      console.log("OpenAI model already exists: GPT-4.5 Preview");
    }

    const openAio3 = await PsAiModel.findOne({
      where: { name: "o3" },
    });

    const openAio3Config = {
      type: PsAiModelType.TextReasoning,
      modelSize: PsAiModelSize.Medium,
      provider: "openai",
      prices: {
        costInTokensPerMillion: 10.0,
        costOutTokensPerMillion: 40.0,
        costInCachedContextTokensPerMillion: 2.5,
        currency: "USD",
      },
      maxTokensOut: 100000,
      defaultTemperature: 0.0,
      model: "o3",
      active: true,
    };

    if (!openAio3) {
      await PsAiModel.create({
        name: "o3",
        organization_id: 1,
        user_id: userId,
        configuration: openAio3Config,
      });
      console.log("Created OpenAI model: o3");
    } else {
      console.log("OpenAI model already exists: o3 updating");
      openAio3.set("configuration", openAio3Config);
      openAio3.changed("configuration", true);
      await openAio3.save();
    }

    const openAio4mini = await PsAiModel.findOne({
      where: { name: "o4 mini" },
    });

    const openAio4miniConfig = {
      type: PsAiModelType.TextReasoning,
      modelSize: PsAiModelSize.Small,
      provider: "openai",
      prices: {
        costInTokensPerMillion: 1.1,
        costOutTokensPerMillion: 4.4,
        costInCachedContextTokensPerMillion: 0.275,
        currency: "USD",
      },
      maxTokensOut: 100000,
      defaultTemperature: 0.0,
      model: "o4-mini",
      active: true,
    };

    if (!openAio4mini) {
      await PsAiModel.create({
        name: "o4 mini",
        organization_id: 1,
        user_id: userId,
        configuration: openAio4miniConfig,
      });
      console.log("Created OpenAI model: o4 mini");
    } else {
      openAio4mini.set("configuration", openAio4miniConfig);
      openAio4mini.changed("configuration", true);
      await openAio4mini.save();
      console.log("OpenAI model already exists: o4 mini");
    }

    const openAiGpt41 = await PsAiModel.findOne({
      where: { name: "GPT-4.1" },
    });

    const openAiGpt41Config = {
      type: PsAiModelType.Text,
      modelSize: PsAiModelSize.Medium,
      provider: "openai",
      prices: {
        costInTokensPerMillion: 2,
        costOutTokensPerMillion: 8,
        currency: "USD",
        costInCachedContextTokensPerMillion: 0.5,
      },
      maxTokensOut: 100000,
      defaultTemperature: 0.7,
      model: "gpt-4.1",
      active: true,
    };

    if (!openAiGpt41) {
      await PsAiModel.create({
        name: "GPT-4.1",
        organization_id: 1,
        user_id: userId,
        configuration: openAiGpt41Config,
      });
      console.log("Created OpenAI model: GPT-4.1");
    } else {
      openAiGpt41.set("configuration", openAiGpt41Config);
      openAiGpt41.changed("configuration", true);
      await openAiGpt41.save();
      console.log("OpenAI model already exists: GPT-4.1");
    }
  }

  /**
   * Seeds Google models.
   * Currently, this creates Gemini 1.5 Pro 2 and Gemini 1.5 Flash 2.
   */
  static async seedGoogleModels(userId: number): Promise<void> {
    // Gemini 1.5 Pro 2
    const geminiPro = await PsAiModel.findOne({
      where: { name: "Gemini 1.5 Pro 2" },
    });
    const geminiProConfig = {
      type: PsAiModelType.Text,
      modelSize: PsAiModelSize.Medium,
      provider: "google",
      prices: {
        costInTokensPerMillion: 1.25,
        costOutTokensPerMillion: 5.0,
        costInCachedContextTokensPerMillion: 0.875,
        currency: "USD",
      },
      maxTokensOut: 8192,
      defaultTemperature: 0.0,
      model: "gemini-1.5-pro-002",
      active: true,
    };

    if (!geminiPro) {
      await PsAiModel.create({
        name: "Gemini 1.5 Pro 2",
        organization_id: 1,
        user_id: userId,
        configuration: geminiProConfig,
      });
      console.log("Created Google model: Gemini 1.5 Pro 2");
    } else {
      geminiPro.set("configuration", geminiProConfig);
      geminiPro.changed("configuration", true);
      await geminiPro.save();
      console.log("Google model already exists: Gemini 1.5 Pro 2");
    }

    // Gemini 1.5 Flash 2
    const geminiPro15Flash = await PsAiModel.findOne({
      where: { name: "Gemini 1.5 Flash 2" },
    });
    const geminiPro15FlashConfig = {
      type: PsAiModelType.Text,
      modelSize: PsAiModelSize.Small,
      provider: "google",
      prices: {
        costInTokensPerMillion: 0.075,
        costOutTokensPerMillion: 0.3,
        costInCachedContextTokensPerMillion: 0.525,
        currency: "USD",
      },
      maxTokensOut: 8192,
      defaultTemperature: 0.0,
      model: "gemini-1.5-flash-002",
      active: true,
    };

    if (!geminiPro15Flash) {
      await PsAiModel.create({
        name: "Gemini 1.5 Flash 2",
        organization_id: 1,
        user_id: userId,
        configuration: geminiPro15FlashConfig,
      });
      console.log("Created Google model: Gemini 1.5 Flash 2");
    } else {
      geminiPro15Flash.set("configuration", geminiPro15FlashConfig);
      geminiPro15Flash.changed("configuration", true);
      await geminiPro15Flash.save();
      console.log("Google model already exists: Gemini 1.5 Flash 2");
    }

    // Gemini 2.0 Flash
    const gemini20Flash = await PsAiModel.findOne({
      where: { name: "Gemini 2.0 Flash" },
    });
    const gemini20FlashConfig = {
      type: PsAiModelType.Text,
      modelSize: PsAiModelSize.Medium,
      provider: "google",
      prices: {
        costInTokensPerMillion: 0.1,
        costOutTokensPerMillion: 0.4,
        costInCachedContextTokensPerMillion: 0.07,
        currency: "USD",
      },
      maxTokensOut: 8192,
      defaultTemperature: 0.0,
      model: "gemini-2.0-flash",
      active: true,
    };

    if (!gemini20Flash) {
      await PsAiModel.create({
        name: "Gemini 2.0 Flash",
        organization_id: 1,
        user_id: userId,
        configuration: gemini20FlashConfig,
      });
      console.log("Created Google model: Gemini 2.0 Flash");
    } else {
      gemini20Flash.set("configuration", gemini20FlashConfig);
      gemini20Flash.changed("configuration", true);
      await gemini20Flash.save();
      console.log("Google model already exists: Gemini 2.0 Flash");
    }

    const gemini25ProPreview1 = await PsAiModel.findOne({
      where: { name: "Gemini 2.5 Pro Preview 1" },
    });

    const gemini25ProPreview1Config = {
      type: PsAiModelType.TextReasoning,
      modelSize: PsAiModelSize.Medium,
      provider: "google",
      prices: {
        costInTokensPerMillion: 1.25,
        costOutTokensPerMillion: 10,
        costInCachedContextTokensPerMillion: 0.875,
        longContextTokenThreshold: 200_000,
        longContextCostInTokensPerMillion: 2.5,
        longContextCostInCachedContextTokensPerMillion: 1.75,
        longContextCostOutTokensPerMillion: 15,
        currency: "USD",
      },
      model: "gemini-2.5-pro-preview-04-17",
      active: true,
      maxTokensOut: 100000,
      defaultTemperature: 0.0
    };

    if (!gemini25ProPreview1) {
      await PsAiModel.create({
        name: "Gemini 2.5 Pro Preview 1",
        organization_id: 1,
        user_id: userId,
        configuration: gemini25ProPreview1Config,
      });
      console.log("Created Google model: Gemini 2.5 Pro Preview 1");
    } else {
      gemini25ProPreview1.set("configuration", gemini25ProPreview1Config);
      gemini25ProPreview1.changed("configuration", true);
      await gemini25ProPreview1.save();
      console.log("Google model already exists: Gemini 2.5 Pro Preview 1");
    }

    const gemini25ProPreview2 = await PsAiModel.findOne({
      where: { name: "Gemini 2.5 Pro Preview 2" },
    });

    const gemini25ProConfig = {
      type: PsAiModelType.TextReasoning,
      modelSize: PsAiModelSize.Medium,
      provider: "google",
      prices: {
        costInTokensPerMillion: 1.25,
        costOutTokensPerMillion: 10,
        costInCachedContextTokensPerMillion: 0.875,
        longContextTokenThreshold: 200_000,
        longContextCostInTokensPerMillion: 2.5,
        longContextCostInCachedContextTokensPerMillion: 1.75,
        longContextCostOutTokensPerMillion: 15,
        currency: "USD",
      },
      model: "gemini-2.5-pro-preview-05-06",
      active: true,
      maxTokensOut: 100000,
      defaultTemperature: 0.0
    };

    if (!gemini25ProPreview2) {
      await PsAiModel.create({
        name: "Gemini 2.5 Pro Preview 2",
        organization_id: 1,
        user_id: userId,
        configuration: gemini25ProConfig,

      });
      console.log("Created Google model: Gemini 2.5 Pro");
    } else {
      gemini25ProPreview2.set("configuration", gemini25ProConfig);
      gemini25ProPreview2.changed("configuration", true);
      await gemini25ProPreview2.save();
      console.log("Google model already exists: Gemini 2.5 Pro");
    }
  }

  /**
   * Master seeding function which calls the provider-specific functions
   * and also seeds a top-level agent class.
   */
  static async seedAiModels(userId: number): Promise<void> {
    try {
      await NewAiModelSetup.seedAnthropicModels(userId);
      await NewAiModelSetup.seedAnthropic37Models(userId);
      await NewAiModelSetup.seedOpenAiModels(userId);
      await NewAiModelSetup.seedGoogleModels(userId);

      // Optionally, seed the top-level agent class if it does not exist.
      const topLevelAgentClass = await PsAgentClass.findOne({
        where: { name: "Operations" },
      });
      if (!topLevelAgentClass) {
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
          requestedAiModelSizes: [
            PsAiModelSize.Large,
            PsAiModelSize.Medium,
            PsAiModelSize.Small,
          ],
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
        console.log("Created top-level agent class: Operations");
      } else {
        console.log("Top-level agent class: Operations already exists");
      }
    } catch (error) {
      console.error("Error seeding AI models:", error);
      process.exit(1);
    }
  }

  /**
   * Helper to delay model seeding slightly.
   */
  static setupAiModels(userId: number): void {
    setTimeout(async () => {
      console.log("Seeding AI models");
      const user = await User.findOne({
        attributes: ["id"],
        where: { id: userId },
      });
      if (!user) {
        console.error("User not found");
        return;
      }
      await NewAiModelSetup.seedAiModels(user.id);
    }, 100);
  }

  /**
   * Sets up the API keys for a given group based on the latest active AI models.
   * @param group The group instance on which to set the API keys
   */
  static async setupApiKeysForGroup(group: any): Promise<void> {
    // Helper to find the latest active model by name
    const findLatestActiveModel = async (name: string) => {
      return await PsAiModel.findOne({
        where: {
          name,
          configuration: { active: true },
        },
        order: [["created_at", "DESC"]],
      });
    };

    // Cache the API keys from environment variables
    const apiKeys: {
      ANTHROPIC_CLAUDE_API_KEY?: string;
      OPENAI_API_KEY?: string;
      GEMINI_API_KEY?: string;
    } = {
      ANTHROPIC_CLAUDE_API_KEY: process.env.ANTHROPIC_CLAUDE_API_KEY,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    };

    // Define a mapping between model names and their required API key
    // Explicitly type envKey as a key of apiKeys
    const modelsMapping: { name: string; envKey: keyof typeof apiKeys }[] = [
      { name: "Anthropic Sonnet 3.5", envKey: "ANTHROPIC_CLAUDE_API_KEY" },
      { name: "Anthropic Sonnet 3.7", envKey: "ANTHROPIC_CLAUDE_API_KEY" },
      { name: "GPT-4o", envKey: "OPENAI_API_KEY" },
      { name: "GPT-4o Mini", envKey: "OPENAI_API_KEY" },
      { name: "GPT-4.5 Preview", envKey: "OPENAI_API_KEY" },
      { name: "o1 Preview", envKey: "OPENAI_API_KEY" },
      { name: "o1 Mini", envKey: "OPENAI_API_KEY" },
      { name: "Gemini 1.5 Pro 2", envKey: "GEMINI_API_KEY" },
      { name: "Gemini 1.5 Flash 2", envKey: "GEMINI_API_KEY" },
      { name: "Gemini 2.0 Flash", envKey: "GEMINI_API_KEY" },
      { name: "Gemini 2.5 Pro Preview 1", envKey: "GEMINI_API_KEY" },
      { name: "Gemini 2.5 Pro Preview 2", envKey: "GEMINI_API_KEY" },
      { name: "o1 24", envKey: "OPENAI_API_KEY" },
      { name: "o3 mini", envKey: "OPENAI_API_KEY" },
      { name: "o4 mini", envKey: "OPENAI_API_KEY" },
      { name: "GPT-4.1", envKey: "OPENAI_API_KEY" },
      { name: "o3", envKey: "OPENAI_API_KEY" },
    ];

    const groupAccessConfig: { aiModelId: number; apiKey: string }[] = [];

    for (const { name, envKey } of modelsMapping) {
      const apiKey = apiKeys[envKey];
      if (!apiKey) continue; // Skip if the API key is not provided

      const model = await findLatestActiveModel(name);
      if (model) {
        groupAccessConfig.push({
          aiModelId: model.id,
          apiKey,
        });
      }
    }

    group.set("private_access_configuration", groupAccessConfig);
    group.changed("private_access_configuration", true);
    await group.save();
  }
}
