import ExcelJS from "exceljs";
export declare const updateUploadJobStatus: (jobId: number, uploadProgress: number, data?: object | undefined) => Promise<void>;
export declare const setJobError: (jobId: number, errorToUser: string, errorDetail?: Error | undefined) => Promise<void>;
export declare const downloadImage: (uri: string, filename: string) => Promise<void>;
export declare const uploadToS3: (jobId: number, userId: string, filename: string, exportType: string, data: ExcelJS.Buffer, done: (error: Error | null, url?: string) => void) => void;
