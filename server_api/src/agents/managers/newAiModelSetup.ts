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
import log from "../../utils/loggerTs.js";

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

      log.info("All Models Loaded Init");

      for (const modelName of Object.keys(psModels)) {
        if (typeof psModels[modelName].associate === "function") {
          await psModels[modelName].associate(psSequelize.models);
        }
      }

      log.info("All models initialized successfully.");
    } catch (error) {
      log.error("Error initializing models:", error);
      process.exit(1);
    }
  }

  /**
   * Seeds the test AI models (and a top-level agent class) if they do not exist.
   * @param userId the user id to associate with the new models
   */
  static async seedAnthropic45Models(userId: number): Promise<void> {
    const anthropicSonnet45 = await PsAiModel.findOne({
      where: { name: "Anthropic Sonnet 4.5" },
    });
    const anthropicSonnet45Config: PsAiModelConfiguration = {
      type: PsAiModelType.TextReasoning,
      modelSize: PsAiModelSize.Medium,
      provider: "anthropic",
      prices: {
        costInTokensPerMillion: 3,
        costOutTokensPerMillion: 15,
        costInCachedContextTokensPerMillion: 0.3,
        currency: "USD",
      },
      maxTokensOut: 64000,
      maxContextTokens: 200000,
      defaultTemperature: 0.7,
      model: "claude-sonnet-4-5-20250929",
      active: true,
    };

    if (!anthropicSonnet45) {
      const createdModel = await PsAiModel.create({
        name: "Anthropic Sonnet 4.5",
        organization_id: 1,
        user_id: userId,
        configuration: anthropicSonnet45Config,
      });
      log.info("Created Anthropic model:", createdModel);
    } else {
      log.debug("Anthropic model already exists: Anthropic Sonnet 4.5");
      anthropicSonnet45.set("configuration", anthropicSonnet45Config);
      anthropicSonnet45.changed("configuration", true);
      await anthropicSonnet45.save();
    }

    const anthropicOpus45 = await PsAiModel.findOne({
      where: { name: "Anthropic Opus 4.5" },
    });
    const anthropicOpus45Config: PsAiModelConfiguration = {
      type: PsAiModelType.TextReasoning,
      modelSize: PsAiModelSize.Large,
      provider: "anthropic",
      prices: {
        costInTokensPerMillion: 6.0,
        costOutTokensPerMillion: 27.5,
        costInCachedContextTokensPerMillion: 0.55,
        currency: "USD",
      },
      maxTokensOut: 64000,
      maxContextTokens: 200000,
      defaultTemperature: 0.7,
      model: "claude-opus-4-5-20251101",
      active: true,
    };

    if (!anthropicOpus45) {
      const createdModel = await PsAiModel.create({
        name: "Anthropic Opus 4.5",
        organization_id: 1,
        user_id: userId,
        configuration: anthropicOpus45Config,
      });
      log.info("Created Anthropic model:", createdModel);
    } else {
      log.debug("Anthropic model already exists: Anthropic Opus 4.5");
      anthropicOpus45.set("configuration", anthropicOpus45Config);
      anthropicOpus45.changed("configuration", true);
      await anthropicOpus45.save();
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
    const openAiGpt4oConfig: PsAiModelConfiguration = {
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
      maxContextTokens: 128000,
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
      log.info("Created OpenAI model: GPT-4o");
    } else {
      log.debug("OpenAI model already exists: GPT-4o updating");
      openAiGpt4.set("configuration", openAiGpt4oConfig);
      openAiGpt4.changed("configuration", true);
      await openAiGpt4.save();
    }

    // GPT-4o Mini
    const openAiGpt4Mini = await PsAiModel.findOne({
      where: { name: "GPT-4o Mini" },
    });
    const openAiGpt4oMiniConfig: PsAiModelConfiguration = {
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
      maxContextTokens: 128000,
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
      log.info("Created OpenAI model: GPT-4o Mini");
    } else {
      openAiGpt4Mini.set("configuration", openAiGpt4oMiniConfig);
      openAiGpt4Mini.changed("configuration", true);
      await openAiGpt4Mini.save();
      log.debug("OpenAI model already exists: GPT-4o Mini");
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
      maxContextTokens: 128000,
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
      log.info("Created OpenAI model: o1 Mini");
    } else {
      openAio1Mini.set("configuration", openAio1MiniConfig);
      openAio1Mini.changed("configuration", true);
      await openAio1Mini.save();
      log.debug("OpenAI model already exists: o1 Mini");
    }

    // o1 Preview
    const openAio1Preview = await PsAiModel.findOne({
      where: { name: "o1 Preview" },
    });
    const openAio1PreviewConfig: PsAiModelConfiguration = {
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
      maxContextTokens: 200000,
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
      log.info("Created OpenAI model: o1 Preview");
    } else {
      openAio1Preview.set("configuration", openAio1PreviewConfig);
      openAio1Preview.changed("configuration", true);
      await openAio1Preview.save();
      log.debug("OpenAI model already exists: o1 Preview");
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
      maxContextTokens: 200000,
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
      log.info("Created OpenAI model: o1 24");
    } else {
      log.debug("OpenAI model already exists: o1 24 updating");
      openAio11712.set("configuration", openAio11712Config);
      openAio11712.changed("configuration", true);
      await openAio11712.save();
    }

    // o3 mini
    const openAio3Mini = await PsAiModel.findOne({
      where: { name: "o3 mini" },
    });
    const openAio3MiniConfig: PsAiModelConfiguration = {
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
      maxContextTokens: 200000,
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
      log.info("Created OpenAI model: o3 mini");
    } else {
      openAio3Mini.set("configuration", openAio3MiniConfig);
      openAio3Mini.changed("configuration", true);
      await openAio3Mini.save();
      log.debug("OpenAI model already exists: o3 mini");
    }

    const openAiGpt45 = await PsAiModel.findOne({
      where: { name: "GPT-4.5 Preview" },
    });
    const openAiGpt45Config: PsAiModelConfiguration = {
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
      maxContextTokens: 128000,
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
      log.info("Created OpenAI model: GPT-4.5 Preview");
    } else {
      openAiGpt45.set("configuration", openAiGpt45Config);
      openAiGpt45.changed("configuration", true);
      await openAiGpt45.save();
      log.debug("OpenAI model already exists: GPT-4.5 Preview");
    }

    const openAio3 = await PsAiModel.findOne({
      where: { name: "o3" },
    });

    const openAio3Config: PsAiModelConfiguration = {
      type: PsAiModelType.TextReasoning,
      modelSize: PsAiModelSize.Medium,
      provider: "openai",
      prices: {
        costInTokensPerMillion: 2.0,
        costOutTokensPerMillion: 8.0,
        costInCachedContextTokensPerMillion: 0.5,
        currency: "USD",
      },
      maxTokensOut: 100000,
      maxContextTokens: 200000,
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
      log.info("Created OpenAI model: o3");
    } else {
      log.debug("OpenAI model already exists: o3 updating");
      openAio3.set("configuration", openAio3Config);
      openAio3.changed("configuration", true);
      await openAio3.save();
    }

    const openAio4mini = await PsAiModel.findOne({
      where: { name: "o4 mini" },
    });

    const openAio4miniConfig: PsAiModelConfiguration = {
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
      maxContextTokens: 200000,
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
      log.info("Created OpenAI model: o4 mini");
    } else {
      openAio4mini.set("configuration", openAio4miniConfig);
      openAio4mini.changed("configuration", true);
      await openAio4mini.save();
      log.debug("OpenAI model already exists: o4 mini");
    }

    const openAiGpt41 = await PsAiModel.findOne({
      where: { name: "GPT-4.1" },
    });

    const openAiGpt41Config: PsAiModelConfiguration = {
      type: PsAiModelType.Text,
      modelSize: PsAiModelSize.Medium,
      provider: "openai",
      prices: {
        costInTokensPerMillion: 2,
        costOutTokensPerMillion: 8,
        currency: "USD",
        costInCachedContextTokensPerMillion: 0.5,
      },
      maxTokensOut: 32768,
      maxContextTokens: 1000000,
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
      log.info("Created OpenAI model: GPT-4.1");
    } else {
      openAiGpt41.set("configuration", openAiGpt41Config);
      openAiGpt41.changed("configuration", true);
      await openAiGpt41.save();
      log.debug("OpenAI model already exists: GPT-4.1");
    }

    const openAiGpt41Mini = await PsAiModel.findOne({
      where: { name: "GPT-4.1 mini" },
    });

    const openAiGpt41MiniConfig: PsAiModelConfiguration = {
      type: PsAiModelType.Text,
      modelSize: PsAiModelSize.Small,
      provider: "openai",
      prices: {
        costInTokensPerMillion: 0.4,
        costOutTokensPerMillion: 1.6,
        costInCachedContextTokensPerMillion: 0.10,
        currency: "USD",
      },
      maxTokensOut: 32768,
      maxContextTokens: 1047576,
      defaultTemperature: 0.7,
      model: "gpt-4.1-mini",
      active: true,
    };

    if (!openAiGpt41Mini) {
      await PsAiModel.create({
        name: "GPT-4.1 mini",
        organization_id: 1,
        user_id: userId,
        configuration: openAiGpt41MiniConfig,
      });
      log.info("Created OpenAI model: GPT-4.1 mini");
    } else {
      openAiGpt41Mini.set("configuration", openAiGpt41MiniConfig);
      openAiGpt41Mini.changed("configuration", true);
      await openAiGpt41Mini.save();
      log.debug("OpenAI model already exists: GPT-4.1 mini");
    }

    const openAiGpt41Nano = await PsAiModel.findOne({
      where: { name: "GPT-4.1 nano" },
    });

    const openAiGpt41NanoConfig: PsAiModelConfiguration = {
      type: PsAiModelType.Text,
      modelSize: PsAiModelSize.Small,
      provider: "openai",
      prices: {
        costInTokensPerMillion: 0.1,
        costOutTokensPerMillion: 0.4,
        costInCachedContextTokensPerMillion: 0.025,
        currency: "USD",
      },
      maxTokensOut: 32768,
      maxContextTokens: 1047576,
      defaultTemperature: 0.7,
      model: "gpt-4.1-nano",
      active: true,
    };

    if (!openAiGpt41Nano) {
      await PsAiModel.create({
        name: "GPT-4.1 nano",
        organization_id: 1,
        user_id: userId,
        configuration: openAiGpt41NanoConfig,
      });
      log.info("Created OpenAI model: GPT-4.1 nano");
    } else {
      openAiGpt41Nano.set("configuration", openAiGpt41NanoConfig);
      openAiGpt41Nano.changed("configuration", true);
      await openAiGpt41Nano.save();
      log.debug("OpenAI model already exists: GPT-4.1 nano");
    }

    const openAiGpt5 = await PsAiModel.findOne({
      where: { name: "GPT-5" },
    });

    const openAiGpt5Config: PsAiModelConfiguration = {
      type: PsAiModelType.TextReasoning,
      modelSize: PsAiModelSize.Large,
      provider: "openai",
      prices: {
        costInTokensPerMillion: 1.25,
        costOutTokensPerMillion: 10.0,
        costInCachedContextTokensPerMillion: 0.125,
        currency: "USD",
      },
      maxTokensOut: 128000,
      maxContextTokens: 400000,
      defaultTemperature: 0.7,
      model: "gpt-5",
      active: true,
    };

    if (!openAiGpt5) {
      await PsAiModel.create({
        name: "GPT-5",
        organization_id: 1,
        user_id: userId,
        configuration: openAiGpt5Config,
      });
      log.info("Created OpenAI model: GPT-5");
    } else {
      openAiGpt5.set("configuration", openAiGpt5Config);
      openAiGpt5.changed("configuration", true);
      await openAiGpt5.save();
      log.debug("OpenAI model already exists: GPT-5");
    }

    const openAiGpt51 = await PsAiModel.findOne({
      where: { name: "GPT-5.1" },
    });

    const openAiGpt51Config: PsAiModelConfiguration = {
      type: PsAiModelType.TextReasoning,
      modelSize: PsAiModelSize.Large,
      provider: "openai",
      prices: {
        costInTokensPerMillion: 1.25,
        costOutTokensPerMillion: 10.0,
        costInCachedContextTokensPerMillion: 0.125,
        currency: "USD",
      },
      maxTokensOut: 128000,
      maxContextTokens: 400000,
      defaultTemperature: 0.7,
      model: "gpt-5.1",
      active: true,
    };

    if (!openAiGpt51) {
      await PsAiModel.create({
        name: "GPT-5.1",
        organization_id: 1,
        user_id: userId,
        configuration: openAiGpt51Config,
      });
      log.info("Created OpenAI model: GPT-5.1");
    } else {
      openAiGpt51.set("configuration", openAiGpt51Config);
      openAiGpt51.changed("configuration", true);
      await openAiGpt51.save();
      log.debug("OpenAI model already exists: GPT-5.1");
    }

    const openAiGpt52 = await PsAiModel.findOne({
      where: { name: "GPT-5.2" },
    });

    const openAiGpt52Config: PsAiModelConfiguration = {
      type: PsAiModelType.TextReasoning,
      modelSize: PsAiModelSize.Large,
      provider: "openai",
      prices: {
        costInTokensPerMillion: 1.75,
        costOutTokensPerMillion: 14.0,
        costInCachedContextTokensPerMillion: 0.175,
        currency: "USD",
      },
      maxTokensOut: 128000,
      maxContextTokens: 400000,
      defaultTemperature: 0.7,
      model: "gpt-5.2",
      active: true,
    };

    if (!openAiGpt52) {
      await PsAiModel.create({
        name: "GPT-5.2",
        organization_id: 1,
        user_id: userId,
        configuration: openAiGpt52Config,
      });
      log.info("Created OpenAI model: GPT-5.2");
    } else {
      openAiGpt52.set("configuration", openAiGpt52Config);
      openAiGpt52.changed("configuration", true);
      await openAiGpt52.save();
      log.debug("OpenAI model already exists: GPT-5.2");
    }
  }

  /**
   * Seeds Google models.
   * Currently, this creates Gemini 1.5 Pro 2 and Gemini 1.5 Flash 2.
   */
  static async seedGoogleModels(userId: number): Promise<void> {    // Gemini 2.0 Flash
    const gemini20Flash = await PsAiModel.findOne({
      where: { name: "Gemini 2.0 Flash" },
    });
    const gemini20FlashConfig: PsAiModelConfiguration = {
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
      maxContextTokens: 1000000,
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
      log.info("Created Google model: Gemini 2.0 Flash");
    } else {
      gemini20Flash.set("configuration", gemini20FlashConfig);
      gemini20Flash.changed("configuration", true);
      await gemini20Flash.save();
      log.debug("Google model already exists: Gemini 2.0 Flash");
    }

    const gemini25Pro = await PsAiModel.findOne({
      where: { name: "Gemini 2.5 Pro" },
    });

    const gemini25ProConfig: PsAiModelConfiguration = {
      type: PsAiModelType.TextReasoning,
      modelSize: PsAiModelSize.Large,
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
      model: "gemini-2.5-pro",
      active: true,
      maxTokensOut: 100000,
      maxContextTokens: 1000000,
      defaultTemperature: 0.0
    };

    if (!gemini25Pro) {
      await PsAiModel.create({
        name: "Gemini 2.5 Pro",
        organization_id: 1,
        user_id: userId,
        configuration: gemini25ProConfig,

      });
      log.info("Created Google model: Gemini 2.5 Pro");
    } else {
      gemini25Pro.set("configuration", gemini25ProConfig);
      gemini25Pro.changed("configuration", true);
      await gemini25Pro.save();
      log.debug("Google model already exists: Gemini 2.5 Pro");
    }

    const gemini25Flash = await PsAiModel.findOne({
      where: { name: "Gemini 2.5 Flash" },
    });

    const gemini25FlashConfig: PsAiModelConfiguration = {
      type: PsAiModelType.Text,
      modelSize: PsAiModelSize.Medium,
      provider: "google",
      prices: {
        costInTokensPerMillion: 0.30,
        costOutTokensPerMillion: 2.5,
        costInCachedContextTokensPerMillion: 0.15,
        currency: "USD",
      },
      model: "gemini-2.5-flash",
      active: true,
      maxTokensOut: 32000,
      maxContextTokens: 1000000,
      defaultTemperature: 0.0,
    };

    if (!gemini25Flash) {
      await PsAiModel.create({
        name: "Gemini 2.5 Flash",
        organization_id: 1,
        user_id: userId,
        configuration: gemini25FlashConfig,
      });
    }
    else {
      gemini25Flash.set("configuration", gemini25FlashConfig);
      gemini25Flash.changed("configuration", true);
      await gemini25Flash.save();
      log.debug("Google model already exists: Gemini 2.5 Flash");
    }

    const gemini25FlashLite = await PsAiModel.findOne({
      where: { name: "Gemini 2.5 Flash Lite" },
    });

    const gemini25FlashLiteConfig: PsAiModelConfiguration = {
      type: PsAiModelType.Text,
      modelSize: PsAiModelSize.Medium,
      provider: "google",
      prices: {
        costInTokensPerMillion: 0.10,
        costOutTokensPerMillion: 0.4,
        costInCachedContextTokensPerMillion: 0.07,
        currency: "USD",
      },
      model: "gemini-2.5-flash-lite-preview-09-2025",
      active: true,
      maxTokensOut: 32000,
      maxContextTokens: 1000000,
      defaultTemperature: 0.0,
    };

    if (!gemini25FlashLite) {
      await PsAiModel.create({
        name: "Gemini 2.5 Flash Lite",
        organization_id: 1,
        user_id: userId,
        configuration: gemini25FlashLiteConfig,
      });
      log.info("Created Google model: Gemini 2.5 Flash Lite");
    }
    else {
      gemini25FlashLite.set("configuration", gemini25FlashLiteConfig);
      gemini25FlashLite.changed("configuration", true);
      await gemini25FlashLite.save();
      log.debug("Google model already exists: Gemini 2.5 Flash Lite");
    }

    const gemini3ProPreview = await PsAiModel.findOne({
      where: { name: "Gemini 3 Pro Preview" },
    });

    const gemini3ProPreviewConfig: PsAiModelConfiguration = {
      type: PsAiModelType.Text,
      modelSize: PsAiModelSize.Medium,
      provider: "google",
      prices: {
        costInTokensPerMillion: 2,
        costOutTokensPerMillion: 12,
        costInCachedContextTokensPerMillion: 1,
        longContextTokenThreshold: 200_000,
        longContextCostInTokensPerMillion: 4.0,
        longContextCostInCachedContextTokensPerMillion: 2,
        longContextCostOutTokensPerMillion: 18,
        currency: "USD",
      },
      model: "gemini-3-pro-preview",
      active: true,
      maxTokensOut: 100000,
      maxContextTokens: 1000000,
      defaultTemperature: 0.0,
    };

    if (!gemini3ProPreview) {
      await PsAiModel.create({
        name: "Gemini 3 Pro Preview",
        organization_id: 1,
        user_id: userId,
        configuration: gemini3ProPreviewConfig,
      });
      log.info("Created Google model: Gemini 3 Pro Preview");
    } else {
      gemini3ProPreview.set("configuration", gemini3ProPreviewConfig);
      gemini3ProPreview.changed("configuration", true);
      await gemini3ProPreview.save();
      log.debug("Google model already exists: Gemini 3 Pro Preview");
    }

    const gemini30Flash = await PsAiModel.findOne({
      where: { name: "Gemini 3.0 Flash" },
    });

    const gemini30FlashConfig: PsAiModelConfiguration = {
      type: PsAiModelType.Text,
      modelSize: PsAiModelSize.Medium,
      provider: "google",
      prices: {
        costInTokensPerMillion: 0.5,
        costOutTokensPerMillion: 3.0,
        costInCachedContextTokensPerMillion: 0.25,
        currency: "USD",
      },
      model: "gemini-3-flash-preview",
      active: true,
      maxTokensOut: 100000,
      maxContextTokens: 1000000,
      defaultTemperature: 0.0,
    };

    if (!gemini30Flash) {
      await PsAiModel.create({
        name: "Gemini 3.0 Flash",
        organization_id: 1,
        user_id: userId,
        configuration: gemini30FlashConfig,
      });
      log.info("Created Google model: Gemini 3.0 Flash");
    } else {
      gemini30Flash.set("configuration", gemini30FlashConfig);
      gemini30Flash.changed("configuration", true);
      await gemini30Flash.save();
      log.debug("Google model already exists: Gemini 3.0 Flash");
    }

    const gemini30FlashPreview = await PsAiModel.findOne({
      where: { name: "Gemini 3.0 Flash Preview" },
    });

    if (gemini30FlashPreview) {
      gemini30FlashPreview.set("configuration", {...gemini30FlashConfig, model: "gemini-3-flash-preview-disabled"});
      gemini30FlashPreview.changed("configuration", true);
      await gemini30FlashPreview.save();
      log.debug("Google model already exists: Gemini 3.0 Flash Preview (disabled)");
    }
  }

  /**
   * Master seeding function which calls the provider-specific functions
   * and also seeds a top-level agent class.
   */
  static async seedAiModels(userId: number): Promise<void> {
    try {
      await NewAiModelSetup.seedAnthropic45Models(userId);
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
        log.info("Created top-level agent class: Operations");
      } else {
        log.info("Top-level agent class: Operations already exists");
      }
    } catch (error) {
      log.error("Error seeding AI models:", error);
      process.exit(1);
    }
  }

  /**
   * Helper to delay model seeding slightly.
   */
  static setupAiModels(userId: number): void {
    setTimeout(async () => {
      log.info("Seeding AI models");
      const user = await User.findOne({
        attributes: ["id"],
        where: { id: userId },
      });
      if (!user) {
        log.error("User not found");
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
      { name: "Anthropic Sonnet 4.5", envKey: "ANTHROPIC_CLAUDE_API_KEY" },
      { name: "Anthropic Opus 4.5", envKey: "ANTHROPIC_CLAUDE_API_KEY" },
      { name: "GPT-4o", envKey: "OPENAI_API_KEY" },
      { name: "GPT-4o Mini", envKey: "OPENAI_API_KEY" },
      { name: "GPT-4.5 Preview", envKey: "OPENAI_API_KEY" },
      { name: "o1 Preview", envKey: "OPENAI_API_KEY" },
      { name: "o1 Mini", envKey: "OPENAI_API_KEY" },
      { name: "Gemini 2.0 Flash", envKey: "GEMINI_API_KEY" },
      { name: "Gemini 2.5 Pro", envKey: "GEMINI_API_KEY" },
      { name: "Gemini 2.5 Flash Preview 1", envKey: "GEMINI_API_KEY" },
      { name: "Gemini 2.5 Flash Preview", envKey: "GEMINI_API_KEY" },
      { name: "o3 mini", envKey: "OPENAI_API_KEY" },
      { name: "o4 mini", envKey: "OPENAI_API_KEY" },
      { name: "GPT-4.1", envKey: "OPENAI_API_KEY" },
      { name: "GPT-4.1 mini", envKey: "OPENAI_API_KEY" },
      { name: "GPT-4.1 nano", envKey: "OPENAI_API_KEY" },
      { name: "o3", envKey: "OPENAI_API_KEY" },
      { name: "GPT-5", envKey: "OPENAI_API_KEY" },
      { name: "GPT-5.1", envKey: "OPENAI_API_KEY" },
      { name: "GPT-5.2", envKey: "OPENAI_API_KEY" },
      { name: "Gemini 3.0 Flash", envKey: "GEMINI_API_KEY" },
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
