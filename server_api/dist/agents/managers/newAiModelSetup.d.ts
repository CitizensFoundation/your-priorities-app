export declare class NewAiModelSetup {
    /**
     * Initializes all models by calling their associate methods (if present).
     */
    static initializeModels(): Promise<void>;
    /**
     * Seeds the test AI models (and a top-level agent class) if they do not exist.
     * @param userId the user id to associate with the new models
     */
    static seedAnthropic45Models(userId: number): Promise<void>;
    /**
     * Seeds OpenAI models.
     * This currently creates several models including GPT-4o, GPT-4o Mini, o1 Mini,
     * o1 Preview, o1 24, o3 mini, GPT-5.4 variants, GPT-5.5,
     * GPT-5.5 tier variants, and GPT-5.6 tier variants.
     */
    static seedOpenAiModels(userId: number): Promise<void>;
    /**
     * Seeds Google models.
     * Currently, this creates Gemini 1.5 Pro 2 and Gemini 1.5 Flash 2.
     */
    static seedGoogleModels(userId: number): Promise<void>;
    /**
     * Master seeding function which calls the provider-specific functions
     * and also seeds a top-level agent class.
     */
    static seedAiModels(userId: number): Promise<void>;
    /**
     * Helper to delay model seeding slightly.
     */
    static setupAiModels(userId: number): void;
    /**
     * Sets up the API keys for a given group based on the latest active AI models.
     * @param group The group instance on which to set the API keys
     */
    static setupApiKeysForGroup(group: any): Promise<void>;
}
