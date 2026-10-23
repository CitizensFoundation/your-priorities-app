import { Storage } from "@google-cloud/storage";
import type { Json, VmDatasetValidationAsset, VmDatasetValidationFile, VmSessionStartPayload } from "../../contracts/index.js";
export type PreparedDatasetMount = {
    source: string;
    target: string;
    readOnly: true;
    datasetVersionId: string;
    name: string;
    versionLabel: string;
    sizeBytes?: number | null;
    sourceUri: string;
    manifestChecksumSha256?: string | null;
};
export type DatasetMountPreparation = {
    mounts: PreparedDatasetMount[];
    runtimeMetadata: Record<string, Json>;
};
export type DatasetPromotionInput = {
    datasetVersionId: string;
    sourcePath: string;
    manifestChecksumSha256?: string | null;
};
export type DatasetPromotionResult = {
    hotPath: string;
    uri: string;
    sourcePath: string;
    sourceUri: string;
    sizeBytes: number;
    mountedFiles: string[];
    mountedFileCount: number;
    mountedFilesTruncated: boolean;
};
export type DatasetValidationInput = {
    sourcePath: string;
    allowedSourceRootPath: string;
    expectedFiles?: string[];
    assets?: VmDatasetValidationAsset[];
};
export type DatasetOutputNormalizeInput = {
    sourcePath: string;
    allowedSourceRootPath: string;
};
export type DatasetOutputNormalizeResult = {
    sourcePath: string;
    fileCount: number;
    directoryCount: number;
};
export type DatasetValidationResult = {
    sourcePath: string;
    uri: string;
    sizeBytes: number;
    mountedFiles: string[];
    mountedFileCount: number;
    mountedFilesTruncated: boolean;
    files: VmDatasetValidationFile[];
    missingExpectedFiles: string[];
    missingAssetFiles: string[];
    checksumFailures: string[];
    sizeMismatches: string[];
};
export type ObjectStorageDownloadResult = {
    objectCount: number;
    totalBytes?: number;
};
export interface ObjectStorageClient {
    downloadPrefixToDirectory(uri: string, targetPath: string): Promise<ObjectStorageDownloadResult>;
}
export type DatasetManagerOptions = {
    hotRoot?: string;
    trustedLocalRoots?: string[];
    objectStorage?: ObjectStorageClient;
    now?: () => Date;
};
export declare class DatasetManager {
    private readonly hotRoot;
    private readonly trustedLocalRoots;
    private readonly objectStorage;
    private readonly now;
    private readonly promotions;
    constructor(options?: DatasetManagerOptions);
    prepareSessionMounts(payload: VmSessionStartPayload): Promise<DatasetMountPreparation>;
    promoteWorkspaceDataset(input: DatasetPromotionInput): Promise<DatasetPromotionResult>;
    validateHotDataset(input: DatasetValidationInput): Promise<DatasetValidationResult>;
    normalizeHotDatasetOutput(input: DatasetOutputNormalizeInput): Promise<DatasetOutputNormalizeResult>;
    assertHotDatasetOutputReadable(input: DatasetOutputNormalizeInput): Promise<DatasetOutputNormalizeResult>;
    isTrustedLocalDatasetRoot(sourcePath: string): Promise<boolean>;
    private prepareMount;
    private resolveOrPromoteSource;
    private verifiedCachePath;
    private localHotLocation;
    private promotionLocation;
    private isTrustedLocalSource;
    private promoteLocation;
    private verifyManifestChecksum;
    private writeCacheMarker;
    private cachePathFor;
    private assertHotDatasetOutputPath;
}
export declare class GcsObjectStorageClient implements ObjectStorageClient {
    private readonly storage;
    constructor(storage?: Storage);
    downloadPrefixToDirectory(uri: string, targetPath: string): Promise<ObjectStorageDownloadResult>;
}
