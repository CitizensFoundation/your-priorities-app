import { CollectionImageGenerator } from "../../llms/imageGeneration/collectionImageGenerator.js";
export declare class AoiIconGenerator extends CollectionImageGenerator {
    createCollectionImage(workPackage: YpGenerativeAiWorkPackageData): Promise<{
        imageId: number;
        imageUrl: string;
    }>;
}
