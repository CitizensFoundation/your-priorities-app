import { PsAiModel } from "../dbModels/aiModel.js";
import { PsAiModelSize, PsAiModelType } from "../aiModelTypes.js";
const user = await User.create({ email: "example@example.com", name: "Example User" });
const anthropicSonnetConfig = {
    type: PsAiModelType.Text,
    modelSize: PsAiModelSize.Medium,
    provider: "anthropic",
    prices: {
        costInTokensPerMillion: 3,
        costOutTokensPerMillion: 15,
        currency: "USD"
    },
    maxTokensOut: 8000,
    defaultTemperature: 0.7,
    model: "claude-3-5-sonnet-20240620",
    active: true
};
const anthropicSonnet = await PsAiModel.create({
    name: "Anthropic Sonnet 3.5",
    organization_id: 1,
    user_id: user.id,
    configuration: anthropicSonnetConfig,
});
const openAiGpt4oConfig = {
    type: PsAiModelType.Text,
    modelSize: PsAiModelSize.Medium,
    provider: "openai",
    prices: {
        costInTokensPerMillion: 5,
        costOutTokensPerMillion: 15,
        currency: "USD"
    },
    maxTokensOut: 4096,
    defaultTemperature: 0.7,
    model: "gpt-4o",
    active: true
};
const openAiGpt4oMiniConfig = {
    type: PsAiModelType.Text,
    modelSize: PsAiModelSize.Small,
    provider: "openai",
    prices: {
        costInTokensPerMillion: 0.15,
        costOutTokensPerMillion: 0.6,
        currency: "USD"
    },
    maxTokensOut: 16000,
    defaultTemperature: 0.0,
    model: "gpt-4o-mini",
    active: true
};
const openAiGpt4 = await PsAiModel.create({
    name: "GPT-4o",
    organization_id: 1,
    user_id: user.id,
    configuration: openAiGpt4oConfig,
});
const openAiGpt4Mini = await PsAiModel.create({
    name: "GPT-4o Mini",
    organization_id: 1,
    user_id: user.id,
    configuration: openAiGpt4oMiniConfig,
});
// Create a group with both AI model API keys
