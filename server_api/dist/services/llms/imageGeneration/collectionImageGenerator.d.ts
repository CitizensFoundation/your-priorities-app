import { FluxImageGenerator } from "./fluxImageGenerator.js";
import { DalleImageGenerator } from "./dalleImageGenerator.js";
import { ImageProcessorService } from "./imageProcessorService.js";
import { S3Service } from "./s3Service.js";
import { ImagenImageGenerator } from "./imagenImageGenerator.js";
import { ChatGptImageGenerator } from "./chatGptImageGenerator.js";
export declare class CollectionImageGenerator {
    protected s3Service: S3Service;
    protected imageProcessorService: ImageProcessorService;
    protected fluxImageGenerator?: FluxImageGenerator;
    protected dalleImageGenerator: DalleImageGenerator;
    protected imagenImageGenerator?: ImagenImageGenerator;
    protected chatGptImageGenerator: ChatGptImageGenerator;
    constructor();
    /**
     * Orchestrates image generation (via Flux or DALL·E), downloads that image,
     * uploads it to S3, and saves a record in the DB.
     */
    createCollectionImage(workPackage: YpGenerativeAiWorkPackageData): Promise<{
        imageId: number;
        imageUrl: string;
    }>;
}
