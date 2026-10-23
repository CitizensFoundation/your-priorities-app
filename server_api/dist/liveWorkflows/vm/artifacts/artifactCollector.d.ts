import { type Readable } from "node:stream";
import { Storage } from "@google-cloud/storage";
import type { ArtifactCollectPayload, ArtifactCollectResponsePayload, CollectedArtifact } from "../../contracts/index.js";
export type ArtifactObjectStoragePutInput = {
    localPath: string;
    openContentStream: () => Readable;
    objectKey: string;
    contentType?: string | null;
    metadata?: Record<string, string>;
    sizeBytes: number;
};
export type ArtifactObjectStoragePutResult = {
    uri: string;
};
export interface ArtifactObjectStorageClient {
    deleteObject(objectUri: string): Promise<void>;
    putFile(input: ArtifactObjectStoragePutInput): Promise<ArtifactObjectStoragePutResult>;
}
export type ArtifactCollectorLogger = {
    error(message: string, metadata?: Record<string, unknown>): void;
};
export type ArtifactCollectorOptions = {
    allowedRootPath?: string;
    artifactIndex?: ArtifactIndexStore | false;
    logger?: ArtifactCollectorLogger;
    maxFiles?: number;
    maxFileBytes?: number;
    maxTotalBytes?: number;
    maxUploadBytes?: number;
    objectStorage?: ArtifactObjectStorageClient;
    objectStorageIdentity?: string;
    objectStoragePrefix?: string;
    uploadEnabled?: boolean;
    now?: () => Date;
};
export type ArtifactIndexFileIdentity = {
    dev: string;
    ino: string;
    mtimeMs: number;
    sizeBytes: number;
};
export type ArtifactIndexEntry = {
    artifact: CollectedArtifact;
    identity: ArtifactIndexFileIdentity;
    key: string;
    policyHash: string;
    rootRealPath: string;
    updatedAt: string;
};
export interface ArtifactIndexStore {
    mergeEntries(entries: ArtifactIndexEntry[]): Promise<void>;
    readEntries(): Promise<ArtifactIndexEntry[]>;
}
export declare class ArtifactCollectionLimitError extends Error {
    readonly code = "artifact_collection_limit_exceeded";
    constructor(message: string);
}
export declare class ArtifactCollector {
    readonly defaultArtifactDirectoryName = "artifacts";
    private readonly allowedRootPath?;
    private readonly objectStorage?;
    private readonly objectStoragePrefix;
    private readonly uploadEnabled;
    private readonly maxFiles;
    private readonly maxFileBytes;
    private readonly maxTotalBytes;
    private readonly maxUploadBytes;
    private readonly logger;
    private readonly now;
    private readonly artifactIndex?;
    private readonly objectStorageIdentity;
    constructor(options?: ArtifactCollectorOptions);
    collect(payload: ArtifactCollectPayload): Promise<ArtifactCollectResponsePayload>;
    private preflightArtifactCandidates;
    private collectPreflightedArtifacts;
    private artifactIndexContext;
    private persistArtifactIndexUpdates;
    private logArtifactIndexError;
    private recheckedCachedArtifactForCandidate;
    private cachedArtifactForCandidate;
    private cachedCollectedArtifact;
    private queueArtifactIndexUpdate;
    private safeArtifactRoot;
    private walkArtifacts;
    private openArtifactFile;
    private artifactReferenceForOpenFile;
    private artifactForOpenFile;
    private artifactMetadataForOpenFile;
    private skippedArtifactManifestForCandidate;
    private temporarySkippedArtifactManifest;
    private durableSkippedArtifactManifest;
    private skippedArtifactMetadata;
    private uploadArtifact;
    private cleanupUploadedObjects;
    private response;
    private shouldUpload;
    private exceedsMaxUploadSize;
    private openFileExceedsMaxUploadSize;
    private assertCollectionFileCountWithinLimit;
    private assertCollectionTotalBytesWithinLimit;
    private addCollectedArtifactBytes;
}
export declare class GcsArtifactObjectStorageClient implements ArtifactObjectStorageClient {
    private readonly bucketName;
    private readonly storage;
    constructor(bucketName: string, storage?: Storage);
    putFile(input: ArtifactObjectStoragePutInput): Promise<ArtifactObjectStoragePutResult>;
    deleteObject(objectUri: string): Promise<void>;
}
export declare class InMemoryArtifactIndexStore implements ArtifactIndexStore {
    private readonly entries;
    readEntries(): Promise<ArtifactIndexEntry[]>;
    mergeEntries(entries: ArtifactIndexEntry[]): Promise<void>;
}
export declare class FileArtifactIndexStore implements ArtifactIndexStore {
    private readonly indexPath;
    private readonly maxEntries;
    private pendingWrite;
    constructor(indexPath: string, maxEntries?: number);
    readEntries(): Promise<ArtifactIndexEntry[]>;
    mergeEntries(entries: ArtifactIndexEntry[]): Promise<void>;
    private readEntriesUnlocked;
}
export declare function createArtifactCollectorFromConfig(config: {
    workspaceRoot: string;
    artifactBucket?: string;
    artifactIndexPath?: string;
    artifactPrefix?: string;
    artifactUploadMaxBytes?: number;
    artifactUploadEnabled?: boolean;
    artifactCollectionMaxFiles?: number;
    artifactCollectionMaxFileBytes?: number;
    artifactCollectionMaxTotalBytes?: number;
    statePath?: string;
}): ArtifactCollector;
