import { IImageGenerator, YpAiGenerateImageTypes } from "./iImageGenerator.js";
export declare class FluxImageGenerator implements IImageGenerator {
    private replicateApiKey;
    private fluxProModelName;
    private replicate;
    private maxRetryCount;
    constructor(replicateApiKey: string, fluxProModelName: string);
    generateImageUrl(prompt: string, type?: YpAiGenerateImageTypes): Promise<string | undefined>;
}
