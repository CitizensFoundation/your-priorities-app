import {
  PsAiModelSize,
  PsAiModelType,
} from "@policysynth/agents/aiModelTypes.js";

/** Shared by database seeding and Live Workflows, without database bootstrap. */
export function openAiGpt6Models(): {
  name: string;
  configuration: PsAiModelConfiguration;
}[] {
  const models = [
    {
      name: "GPT-6 Astra",
      model: "gpt-6-astra",
      modelSize: PsAiModelSize.Large,
      inputPrice: 10,
      cachedInputPrice: 1,
      outputPrice: 50,
    },
    {
      name: "GPT-6 Sol",
      model: "gpt-6-sol",
      modelSize: PsAiModelSize.Large,
      inputPrice: 2,
      cachedInputPrice: 0.2,
      outputPrice: 10,
    },
    {
      name: "GPT-6 Luna",
      model: "gpt-6-luna",
      modelSize: PsAiModelSize.Small,
      inputPrice: 0.1,
      cachedInputPrice: 0.01,
      outputPrice: 0.5,
    },
  ];
  const tiers: {
    nameSuffix: string;
    modelSuffix: string;
    inferenceType?: "priority" | "flex";
    priceMultiplier: number;
  }[] = [
    { nameSuffix: "", modelSuffix: "", priceMultiplier: 1 },
    {
      nameSuffix: " Priority",
      modelSuffix: "-priority",
      inferenceType: "priority",
      priceMultiplier: 2,
    },
    {
      nameSuffix: " Flex",
      modelSuffix: "-flex",
      inferenceType: "flex",
      priceMultiplier: 0.5,
    },
  ];
  return models.flatMap((model) =>
    tiers.map((tier) => {
      const inputPrice = model.inputPrice * tier.priceMultiplier;
      const cachedInputPrice = model.cachedInputPrice * tier.priceMultiplier;
      const outputPrice = model.outputPrice * tier.priceMultiplier;
      return {
        name: `${model.name}${tier.nameSuffix}`,
        configuration: {
          type: PsAiModelType.TextReasoning,
          modelSize: model.modelSize,
          provider: "openai",
          ...(tier.inferenceType ? { inferenceType: tier.inferenceType } : {}),
          prices: {
            costPerThousandWebSearches: 10,
            costInTokensPerMillion: inputPrice,
            costOutTokensPerMillion: outputPrice,
            costInCachedContextTokensPerMillion: cachedInputPrice,
            cacheWriteInputCostMultiplier: 1.25,
            longContextTokenThreshold: 272_000,
            longContextCostInTokensPerMillion: inputPrice * 2,
            longContextCostInCachedContextTokensPerMillion:
              cachedInputPrice * 2,
            longContextCostOutTokensPerMillion: outputPrice * 1.5,
            regionalProcessingMargin: 10,
            currency: "USD",
          },
          maxTokensOut: 128000,
          maxContextTokens: 1050000,
          defaultTemperature: 0.7,
          model: `${model.model}${tier.modelSuffix}`,
          ...(tier.inferenceType ? { apiModel: model.model } : {}),
          active: true,
        },
      };
    }),
  );
}
