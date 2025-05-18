import { IImageGenerator, YpAiGenerateImageTypes } from "./iImageGenerator.js";
export declare class ChatGptImageGenerator implements IImageGenerator {
    private readonly maxRetryCount;
    private readonly openAiKey?;
    constructor(openAiKey?: string);
    /**
     * Generates an image URL from a prompt using OpenAI's gpt-image-1 model.
     * The returned link remains live for ~60 minutes – be sure to download
     * or cache it right away in the calling service.
     */
    generateImageUrl(prompt: string, type?: YpAiGenerateImageTypes): Promise<string | undefined>;
}
export default ChatGptImageGenerator;
