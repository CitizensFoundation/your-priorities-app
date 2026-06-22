declare function _exports(options: any): MulterSharpS3Compat;
export = _exports;
declare class MulterSharpS3Compat {
    constructor(options: any);
    opts: any;
    _removeFile(req: any, file: any, cb: any): void;
    _handleFile(req: any, file: any, cb: any): void;
    _deleteUploadedObjects(uploads: any): Promise<void>;
    _uploadStreamToS3(params: any, readable: any): Promise<{
        uploadResult: import("@aws-sdk/client-s3").CompleteMultipartUploadCommandOutput;
        size: number;
    }>;
    _uploadImageVariant(tempFilePath: any, params: any, file: any, size: any): Promise<{
        uploadResult: import("@aws-sdk/client-s3").CompleteMultipartUploadCommandOutput;
        uploadedSize: number;
        contentType: any;
    }>;
    _uploadImageVariants(params: any, file: any): Promise<{
        mimetype: any;
    }>;
    _uploadNonImage(params: any, file: any): Promise<{
        Location?: string | undefined;
        Bucket?: string | undefined;
        Key?: string | undefined;
        Expiration?: string | undefined;
        ETag?: string | undefined;
        ChecksumCRC32?: string | undefined;
        ChecksumCRC32C?: string | undefined;
        ChecksumCRC64NVME?: string | undefined;
        ChecksumSHA1?: string | undefined;
        ChecksumSHA256?: string | undefined;
        ChecksumSHA512?: string | undefined;
        ChecksumMD5?: string | undefined;
        ChecksumXXHASH64?: string | undefined;
        ChecksumXXHASH3?: string | undefined;
        ChecksumXXHASH128?: string | undefined;
        ChecksumType?: import("@aws-sdk/client-s3").ChecksumType | undefined;
        ServerSideEncryption: any;
        VersionId?: string | undefined;
        SSEKMSKeyId?: string | undefined;
        BucketKeyEnabled?: boolean | undefined;
        RequestCharged?: import("@aws-sdk/client-s3").RequestCharged | undefined;
        $metadata: import("@smithy/types").ResponseMetadata;
        size: number;
        ACL: any;
        ContentDisposition: any;
        StorageClass: any;
        Metadata: any;
        ContentType: any;
        mimetype: any;
    }>;
}
