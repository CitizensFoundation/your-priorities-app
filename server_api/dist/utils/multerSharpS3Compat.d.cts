declare function _exports(options: any): MulterSharpS3Compat;
export = _exports;
declare class MulterSharpS3Compat {
    constructor(options: any);
    opts: any;
    _removeFile(req: any, file: any, cb: any): void;
    _handleFile(req: any, file: any, cb: any): void;
    _deleteUploadedObjects(uploads: any): Promise<void>;
    _uploadStreamToS3(params: any, readable: any): Promise<{
        uploadResult: any;
        size: number;
    }>;
    _uploadImageVariant(tempFilePath: any, params: any, file: any, size: any): Promise<{
        uploadResult: any;
        uploadedSize: number;
        contentType: any;
    }>;
    _uploadImageVariants(params: any, file: any): Promise<{
        mimetype: any;
    }>;
    _uploadNonImage(params: any, file: any): Promise<any>;
}
