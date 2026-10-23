import { IImageGenerator, YpAiGenerateImageTypes, YpImageGenerationOptions } from "./iImageGenerator.js";
export declare class ChatGptImageGenerator implements IImageGenerator {
    private readonly maxRetryCount;
    private readonly openAiKey?;
    constructor(openAiKey?: string);
    /**
     * Generates a PNG data URI using the configured OpenAI GPT Image model.
     */
    generateImageUrl(prompt: string, type?: YpAiGenerateImageTypes, options?: YpImageGenerationOptions): Promise<string | undefined>;
}
export default ChatGptImageGenerator;
