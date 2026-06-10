export type YpAiGenerateImageTypes = "logo" | "icon" | "other";
export type YpAiGenerateImageProvider = "openai" | "azureOpenai" | "flux" | "imagen";
export interface YpImageGenerationOptions {
    imageProvider?: YpAiGenerateImageProvider;
    imageModel?: string;
    imageSize?: string;
    imageQuality?: string;
}
export interface IImageGenerator {
    /**
     * Generates an image URL given a prompt and a type (logo, icon, etc.)
     */
    generateImageUrl(prompt: string, type: YpAiGenerateImageTypes, options?: YpImageGenerationOptions): Promise<string | undefined>;
}
