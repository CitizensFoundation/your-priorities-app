/// <reference types="../webApps/client/src/types.d.ts" />
export declare class AoiIconGenerator {
    resizeImage(imagePath: string, width: number, height: number): Promise<string>;
    downloadImage(imageUrl: string, imageFilePath: string): Promise<unknown>;
    uploadImageToS3(bucket: string, filePath: string, key: string): Promise<unknown>;
    getImageUrlFromPrompt(prompt: string, type?: YpAiGenerateImageTypes): Promise<any>;
    createCollectionImage(workPackage: YpGenerativeAiWorkPackageData): Promise<{
        imageId: number;
        imageUrl: string;
    }>;
}
//# sourceMappingURL=iconGenerator.d.ts.map