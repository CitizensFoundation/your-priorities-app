/** Explicit fixture pricing; injected providers never read a real credential. */
export const fixtureModel = {
    id: "test-model",
    label: "Test",
    provider: "openai",
    keyEnv: "YP_TEST_MODEL_KEY",
    inputMicrosPerMillion: 2000000,
    outputMicrosPerMillion: 8000000,
    cachedInputMicrosPerMillion: 500000,
    maxOutputTokens: 1024,
    contextTokens: 200000,
    priceVersion: "fixture",
};
export const fixtureModelsJson = JSON.stringify([fixtureModel]);
