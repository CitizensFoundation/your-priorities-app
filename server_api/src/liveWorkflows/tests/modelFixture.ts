/** Explicit fixture pricing; injected providers never read a real credential. */
export const fixtureModel = {
  id: "test-model",
  label: "Test",
  provider: "openai" as const,
  keyEnv: "YP_TEST_MODEL_KEY",
  inputMicrosPerMillion: 2_000_000,
  outputMicrosPerMillion: 8_000_000,
  cachedInputMicrosPerMillion: 500_000,
  maxOutputTokens: 1024,
  contextTokens: 200_000,
  priceVersion: "fixture",
};
export const fixtureModelsJson = JSON.stringify([fixtureModel]);
