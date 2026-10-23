/** Explicit fixture pricing; injected providers never read a real credential. */
export declare const fixtureModel: {
    id: string;
    label: string;
    provider: "openai";
    keyEnv: string;
    inputMicrosPerMillion: number;
    outputMicrosPerMillion: number;
    cachedInputMicrosPerMillion: number;
    maxOutputTokens: number;
    contextTokens: number;
    priceVersion: string;
};
export declare const fixtureModelsJson: string;
