export declare class S3Service {
    private cloudflareApiKey?;
    private cloudflareZoneId?;
    constructor(cloudflareApiKey?: string | undefined, cloudflareZoneId?: string | undefined);
    uploadImageToS3(bucket: string, filePath: string, key: string): Promise<import("@aws-sdk/client-s3").PutObjectCommandOutput>;
    deleteS3Url(imageUrl: string): Promise<import("@aws-sdk/client-s3").DeleteObjectCommandOutput>;
    parseImageUrl(imageUrl: string): {
        bucket: string | undefined;
        key: string | undefined;
    };
    deleteMediaFormatsUrls(formats: string[]): Promise<void>;
}
