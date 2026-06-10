import { IImageGenerator, YpAiGenerateImageTypes, YpImageGenerationOptions } from "./iImageGenerator.js";
export declare class DalleImageGenerator implements IImageGenerator {
    private maxRetryCount;
    private azureOpenaAiBase?;
    private azureOpenAiApiKey?;
    private azureDalleDeployment?;
    private openAiKey?;
    constructor(azureOpenaAiBase: string | undefined, azureOpenAiApiKey: string | undefined, azureDalleDeployment: string | undefined, openAiKey: string | undefined);
    generateImageUrl(prompt: string, type?: YpAiGenerateImageTypes, options?: YpImageGenerationOptions): Promise<string | undefined>;
}
