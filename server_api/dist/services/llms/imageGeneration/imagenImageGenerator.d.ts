import { IImageGenerator, YpAiGenerateImageTypes } from "./iImageGenerator.js";
import { S3Service } from "./s3Service.js";
export declare class ImagenImageGenerator implements IImageGenerator {
    private s3Service;
    private maxRetryCount;
    private projectId;
    private location;
    private endpoint;
    private s3Bucket;
    constructor(s3Service: S3Service);
    /**
     * Generates an image from a text prompt using Vertex AI Imagen
     * and returns a public S3 URL to the uploaded image.
     */
    generateImageUrl(prompt: string, type?: YpAiGenerateImageTypes): Promise<string | undefined>;
}
