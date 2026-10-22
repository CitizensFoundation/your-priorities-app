import { createHash } from "node:crypto";
import { constants as fsConstants, createReadStream, createWriteStream } from "node:fs";
import fs, { type FileHandle } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Transform, type Readable, type TransformCallback } from "node:stream";
import { pipeline } from "node:stream/promises";
import { pathToFileURL } from "node:url";
import { Storage } from "@google-cloud/storage";
import { normalizeSafeRelativePath } from "../../contracts/index.js";
import type {
  ArtifactCollectKnownArtifact,
  ArtifactCollectPayload,
  ArtifactCollectResponsePayload,
  CollectedArtifact,
} from "../../contracts/index.js";
import {
  DefaultArtifactCollectionMaxFileBytes,
  DefaultArtifactCollectionMaxFiles,
  DefaultArtifactCollectionMaxTotalBytes,
  DefaultArtifactUploadMaxBytes,
} from "./artifactLimits.js";

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

const DefaultObjectStoragePrefix = "artifacts";
const ArtifactIndexSchema = "yp-live-workflow.vm-agent.artifact-index.v1";
const ArtifactIndexVersion = 1;
const DefaultMaxArtifactIndexEntries = 100_000;
const IgnoredArtifactFileNames = new Set([".DS_Store"]);
const SourceCodeExtensions = new Set([
  ".py",
  ".r",
  ".rmd",
  ".qmd",
  ".sh",
  ".bash",
  ".jl",
  ".m",
  ".ts",
  ".js",
  ".sql",
  ".yaml",
  ".yml",
]);

type ArtifactFileCandidate = {
  cachedArtifact?: CollectedArtifact;
  identity: ArtifactIndexFileIdentity;
  localPath: string;
  relativePath: string;
  sizeBytes: number;
  skippedReason?: "max_file_size_exceeded";
  skippedRelativePath?: string;
};

type ArtifactFilePathCandidate = {
  identity: ArtifactIndexFileIdentity;
  localPath: string;
  relativePath: string;
  sizeBytes: number;
};

type ArtifactIndexContext = {
  entries: Map<string, ArtifactIndexEntry>;
  policyHash: string;
  rootRealPath: string;
  updates: ArtifactIndexEntry[];
};

type OpenArtifactFile = {
  handle: FileHandle;
  localPath: string;
  relativePath: string;
  sizeBytes: number;
};

type ArtifactSnapshot = {
  checksumSha256: string;
  cleanup: () => Promise<void>;
  path: string;
  sizeBytes: number;
};

type PreparedArtifact = {
  artifact: CollectedArtifact;
  cleanup: () => Promise<void>;
  openContentStream: () => Readable;
};

export class ArtifactCollectionLimitError extends Error {
  readonly code = "artifact_collection_limit_exceeded";

  constructor(message: string) {
    super(`artifact_collection_limit_exceeded: ${message}`);
    this.name = "ArtifactCollectionLimitError";
  }
}

export class ArtifactCollector {
  readonly defaultArtifactDirectoryName = "artifacts";

  private readonly allowedRootPath?: string;
  private readonly objectStorage?: ArtifactObjectStorageClient;
  private readonly objectStoragePrefix: string;
  private readonly uploadEnabled: boolean;
  private readonly maxFiles: number;
  private readonly maxFileBytes: number;
  private readonly maxTotalBytes: number;
  private readonly maxUploadBytes: number;
  private readonly logger: ArtifactCollectorLogger;
  private readonly now: () => Date;
  private readonly artifactIndex?: ArtifactIndexStore;
  private readonly objectStorageIdentity: string;

  constructor(options: ArtifactCollectorOptions = {}) {
    this.allowedRootPath = options.allowedRootPath ? path.resolve(options.allowedRootPath) : undefined;
    this.objectStorage = options.objectStorage;
    this.objectStorageIdentity = options.objectStorageIdentity ?? (options.objectStorage ? "object-storage" : "none");
    this.objectStoragePrefix = safeObjectPrefix(options.objectStoragePrefix ?? DefaultObjectStoragePrefix);
    this.uploadEnabled = options.uploadEnabled ?? Boolean(options.objectStorage);
    this.maxFiles = normalizePositiveInteger(
      options.maxFiles ?? DefaultArtifactCollectionMaxFiles,
      "Artifact collector maxFiles"
    );
    this.maxFileBytes = normalizePositiveInteger(
      options.maxFileBytes ?? DefaultArtifactCollectionMaxFileBytes,
      "Artifact collector maxFileBytes"
    );
    this.maxTotalBytes = normalizePositiveInteger(
      options.maxTotalBytes ?? DefaultArtifactCollectionMaxTotalBytes,
      "Artifact collector maxTotalBytes"
    );
    this.maxUploadBytes = normalizeMaxUploadBytes(options.maxUploadBytes);
    this.logger = options.logger ?? console;
    this.now = options.now ?? (() => new Date());
    this.artifactIndex = options.artifactIndex === false ? undefined : options.artifactIndex;
  }

  async collect(payload: ArtifactCollectPayload): Promise<ArtifactCollectResponsePayload> {
    const artifactsPath = path.resolve(payload.artifactsPath);
    const root = await this.safeArtifactRoot(artifactsPath);

    if (!root) {
      return this.response(payload, artifactsPath, []);
    }

    const include = (payload.includeGlobs ?? ["**"]).map(globToRegExp);
    const exclude = (payload.excludeGlobs ?? []).map(globToRegExp);
    const uploadEnabled = this.shouldUpload(payload);
    const knownArtifacts = knownArtifactMap(payload.knownArtifacts ?? []);
    const indexContext = await this.artifactIndexContext(payload, root.realPath, uploadEnabled);
    const candidates = await this.preflightArtifactCandidates(root, include, exclude, indexContext, uploadEnabled);
    const collected = await this.collectPreflightedArtifacts(
      payload,
      root.path,
      root.realPath,
      candidates,
      knownArtifacts,
      uploadEnabled,
      indexContext
    );
    await this.persistArtifactIndexUpdates(indexContext);

    return this.response(payload, artifactsPath, collected, uploadEnabled);
  }

  private async preflightArtifactCandidates(
    root: { path: string; realPath: string },
    include: RegExp[],
    exclude: RegExp[],
    indexContext: ArtifactIndexContext | null,
    uploadEnabled: boolean
  ): Promise<ArtifactFileCandidate[]> {
    const candidates: ArtifactFileCandidate[] = [];
    let matchedFiles = 0;
    let matchedBytes = 0;

    for await (const candidate of this.walkArtifacts(root.path, root.path, include, exclude)) {
      matchedFiles += 1;
      this.assertCollectionFileCountWithinLimit(matchedFiles, candidate.relativePath);

      const cachedArtifact = await this.recheckedCachedArtifactForCandidate(
        candidate,
        indexContext,
        uploadEnabled
      );
      if (cachedArtifact) {
        matchedBytes += Number(cachedArtifact.sizeBytes);
        this.assertCollectionTotalBytesWithinLimit(matchedBytes, cachedArtifact.relativePath);
        candidates.push({
          ...candidate,
          cachedArtifact,
          sizeBytes: Number(cachedArtifact.sizeBytes),
        });
        continue;
      }

      if (candidate.sizeBytes > this.maxFileBytes) {
        candidates.push({
          ...candidate,
          skippedReason: "max_file_size_exceeded",
          skippedRelativePath: skippedArtifactRelativePath(candidate.relativePath),
        });
        continue;
      }

      const opened = await this.openArtifactFile(root.realPath, candidate.localPath, candidate.relativePath);

      try {
        matchedBytes += opened.sizeBytes;
        this.assertCollectionTotalBytesWithinLimit(matchedBytes, candidate.relativePath);
        candidates.push({
          ...candidate,
          sizeBytes: opened.sizeBytes,
        });
      } finally {
        await opened.handle.close();
      }
    }

    return candidates;
  }

  private async collectPreflightedArtifacts(
    payload: ArtifactCollectPayload,
    rootPath: string,
    rootRealPath: string,
    candidates: ArtifactFileCandidate[],
    knownArtifacts: Map<string, ArtifactCollectKnownArtifact>,
    uploadEnabled: boolean,
    indexContext: ArtifactIndexContext | null
  ): Promise<CollectedArtifact[]> {
    const collected: CollectedArtifact[] = [];
    const uploadedObjectUris: string[] = [];
    let collectedBytes = 0;

    try {
      for (const candidate of candidates) {
        if (candidate.cachedArtifact) {
          const artifact = this.cachedCollectedArtifact(candidate, candidate.cachedArtifact, knownArtifacts, uploadEnabled);
          collectedBytes = this.addCollectedArtifactBytes(collectedBytes, artifact);
          collected.push(artifact);
          this.queueArtifactIndexUpdate(candidate, artifact, indexContext);
          continue;
        }

        if (candidate.skippedReason === "max_file_size_exceeded") {
          const skippedRelativePath = candidate.skippedRelativePath ?? skippedArtifactRelativePath(candidate.relativePath);
          const prepared = await this.skippedArtifactManifestForCandidate(candidate, skippedRelativePath, {
            durableRootPath: uploadEnabled ? undefined : rootPath,
            durableRootRealPath: uploadEnabled ? undefined : rootRealPath,
          });

          try {
            const knownArtifact = knownArtifacts.get(artifactIdentityKey(prepared.artifact));
            collectedBytes = this.addCollectedArtifactBytes(collectedBytes, prepared.artifact);

            if (knownArtifact && shouldReuseKnownArtifact(knownArtifact, uploadEnabled)) {
              const artifact = {
                ...prepared.artifact,
                artifactId: knownArtifact.artifactId ?? null,
                objectUri: knownArtifact.objectUri ?? null,
                metadata: {
                  ...(prepared.artifact.metadata ?? {}),
                  manifestUploadSkipped: true,
                  manifestUploadSkippedReason: "known_artifact",
                },
              };
              collected.push(artifact);
              this.queueArtifactIndexUpdate(candidate, artifact, indexContext);
              continue;
            }

            const objectUri = uploadEnabled ? await this.uploadArtifact(payload, prepared) : null;
            if (objectUri) {
              uploadedObjectUris.push(objectUri);
            }
            const artifact = {
              ...prepared.artifact,
              objectUri,
            };
            collected.push(artifact);
            this.queueArtifactIndexUpdate(candidate, artifact, indexContext);
          } finally {
            await prepared.cleanup();
          }
          continue;
        }

        const opened = await this.openArtifactFile(rootRealPath, candidate.localPath, candidate.relativePath);
        let prepared: PreparedArtifact | null = null;

        try {
          if (!uploadEnabled || this.openFileExceedsMaxUploadSize(opened)) {
            const artifact = await this.artifactReferenceForOpenFile(opened);
            const knownArtifact = knownArtifacts.get(artifactIdentityKey(artifact));
            collectedBytes = this.addCollectedArtifactBytes(collectedBytes, artifact);

            if (knownArtifact && shouldReuseKnownArtifact(knownArtifact, uploadEnabled)) {
              const collectedArtifact = {
                ...artifact,
                artifactId: knownArtifact.artifactId ?? null,
                objectUri: knownArtifact.objectUri ?? null,
                metadata: {
                  ...(artifact.metadata ?? {}),
                  uploadSkipped: true,
                  uploadSkippedReason: "known_artifact",
                },
              };
              collected.push(collectedArtifact);
              this.queueArtifactIndexUpdate(candidate, collectedArtifact, indexContext);
              continue;
            }

            if (!uploadEnabled) {
              const collectedArtifact = {
                ...artifact,
                objectUri: null,
              };
              collected.push(collectedArtifact);
              this.queueArtifactIndexUpdate(candidate, collectedArtifact, indexContext);
              continue;
            }

            this.logger.error("Artifact upload skipped because file exceeds maximum artifact upload size", {
              event: "artifact_upload_size_exceeded",
              runId: payload.runId,
              runStepId: payload.runStepId,
              sessionId: payload.sessionId,
              workspaceId: payload.workspaceId,
              vmHostId: payload.vmHostId,
              relativePath: artifact.relativePath,
              localPath: artifact.localPath,
              sizeBytes: artifact.sizeBytes,
              maxUploadBytes: this.maxUploadBytes,
            });
            const collectedArtifact = {
              ...artifact,
              objectUri: null,
              metadata: {
                ...(artifact.metadata ?? {}),
                uploadSkipped: true,
                uploadSkippedReason: "max_upload_size_exceeded",
                maxUploadBytes: this.maxUploadBytes,
              },
            };
            collected.push(collectedArtifact);
            this.queueArtifactIndexUpdate(candidate, collectedArtifact, indexContext);
            continue;
          }

          prepared = await this.artifactForOpenFile(opened);
          const knownArtifact = knownArtifacts.get(artifactIdentityKey(prepared.artifact));
          collectedBytes = this.addCollectedArtifactBytes(collectedBytes, prepared.artifact);

          if (knownArtifact && shouldReuseKnownArtifact(knownArtifact, uploadEnabled)) {
            const artifact = {
              ...prepared.artifact,
              artifactId: knownArtifact.artifactId ?? null,
              objectUri: knownArtifact.objectUri ?? null,
              metadata: {
                ...(prepared.artifact.metadata ?? {}),
                uploadSkipped: true,
                uploadSkippedReason: "known_artifact",
              },
            };
            collected.push(artifact);
            this.queueArtifactIndexUpdate(candidate, artifact, indexContext);
            continue;
          }

          if (uploadEnabled && this.exceedsMaxUploadSize(prepared.artifact)) {
            this.logger.error("Artifact upload skipped because file exceeds maximum artifact upload size", {
              event: "artifact_upload_size_exceeded",
              runId: payload.runId,
              runStepId: payload.runStepId,
              sessionId: payload.sessionId,
              workspaceId: payload.workspaceId,
              vmHostId: payload.vmHostId,
              relativePath: prepared.artifact.relativePath,
              localPath: prepared.artifact.localPath,
              sizeBytes: prepared.artifact.sizeBytes,
              maxUploadBytes: this.maxUploadBytes,
            });
            const artifact = {
              ...prepared.artifact,
              objectUri: null,
              metadata: {
                ...(prepared.artifact.metadata ?? {}),
                uploadSkipped: true,
                uploadSkippedReason: "max_upload_size_exceeded",
                maxUploadBytes: this.maxUploadBytes,
              },
            };
            collected.push(artifact);
            this.queueArtifactIndexUpdate(candidate, artifact, indexContext);
            continue;
          }

          const objectUri = uploadEnabled ? await this.uploadArtifact(payload, prepared) : null;
          if (objectUri) {
            uploadedObjectUris.push(objectUri);
          }
          const artifact = {
            ...prepared.artifact,
            objectUri,
          };
          collected.push(artifact);
          this.queueArtifactIndexUpdate(candidate, artifact, indexContext);
        } finally {
          if (prepared) {
            await prepared.cleanup();
          }
          await opened.handle.close();
        }
      }
    } catch (error) {
      await this.cleanupUploadedObjects(uploadedObjectUris, payload);
      throw error;
    }

    return collected;
  }

  private async artifactIndexContext(
    payload: ArtifactCollectPayload,
    rootRealPath: string,
    uploadEnabled: boolean
  ): Promise<ArtifactIndexContext | null> {
    if (!this.artifactIndex) {
      return null;
    }

    const entries = new Map<string, ArtifactIndexEntry>();
    const policyHash = artifactIndexPolicyHash({
      maxFileBytes: this.maxFileBytes,
      maxUploadBytes: this.maxUploadBytes,
      objectStorageIdentity: this.objectStorageIdentity,
      objectStoragePrefix: this.objectStoragePrefix,
      uploadEnabled,
    });

    let indexEntries: ArtifactIndexEntry[];
    try {
      indexEntries = await this.artifactIndex.readEntries();
    } catch (error) {
      this.logArtifactIndexError("Artifact index read failed", error);
      return null;
    }

    for (const entry of indexEntries) {
      if (entry.rootRealPath === rootRealPath && entry.policyHash === policyHash) {
        entries.set(entry.key, entry);
      }
    }

    return {
      entries,
      policyHash,
      rootRealPath,
      updates: [],
    };
  }

  private async persistArtifactIndexUpdates(indexContext: ArtifactIndexContext | null): Promise<void> {
    if (!this.artifactIndex || !indexContext || indexContext.updates.length === 0) {
      return;
    }

    try {
      await this.artifactIndex.mergeEntries(indexContext.updates);
    } catch (error) {
      this.logArtifactIndexError("Artifact index write failed", error);
    }
  }

  private logArtifactIndexError(message: string, error: unknown): void {
    this.logger.error(message, {
      event: "artifact_index_failed",
      message: error instanceof Error ? error.message : String(error),
    });
  }

  private async recheckedCachedArtifactForCandidate(
    candidate: ArtifactFilePathCandidate,
    indexContext: ArtifactIndexContext | null,
    uploadEnabled: boolean
  ): Promise<CollectedArtifact | null> {
    const cachedArtifact = this.cachedArtifactForCandidate(candidate, indexContext, uploadEnabled);
    if (!cachedArtifact) {
      return null;
    }

    return await recheckArtifactFileIdentity(candidate.localPath, candidate.identity) ? cachedArtifact : null;
  }

  private cachedArtifactForCandidate(
    candidate: ArtifactFilePathCandidate,
    indexContext: ArtifactIndexContext | null,
    uploadEnabled: boolean
  ): CollectedArtifact | null {
    if (!indexContext) {
      return null;
    }

    const entry = indexContext.entries.get(artifactIndexKey(indexContext.rootRealPath, candidate.relativePath));
    if (!entry || !sameArtifactIndexIdentity(entry.identity, candidate.identity)) {
      return null;
    }

    const artifact = entry.artifact;
    const expectedRelativePath =
      candidate.sizeBytes > this.maxFileBytes
        ? skippedArtifactRelativePath(candidate.relativePath)
        : candidate.relativePath;

    if (artifact.relativePath !== expectedRelativePath) {
      return null;
    }

    if (uploadEnabled && !artifact.objectUri && candidate.sizeBytes <= this.maxUploadBytes) {
      return null;
    }

    if (uploadEnabled && candidate.sizeBytes > this.maxFileBytes && !artifact.objectUri) {
      return null;
    }

    return artifact;
  }

  private cachedCollectedArtifact(
    candidate: ArtifactFileCandidate,
    artifact: CollectedArtifact,
    knownArtifacts: Map<string, ArtifactCollectKnownArtifact>,
    uploadEnabled: boolean
  ): CollectedArtifact {
    const knownArtifact = knownArtifacts.get(artifactIdentityKey(artifact));
    const reusableKnownArtifact = knownArtifact && shouldReuseKnownArtifact(knownArtifact, uploadEnabled)
      ? knownArtifact
      : null;
    const metadata: Record<string, string | number | boolean> = {
      ...(artifact.metadata ?? {}),
      artifactIndexHit: true,
      uploadSkipped: true,
      uploadSkippedReason: "artifact_index",
    };

    if (candidate.skippedReason === "max_file_size_exceeded" || artifact.metadata?.skippedArtifact === true) {
      metadata.manifestUploadSkipped = true;
      metadata.manifestUploadSkippedReason = "artifact_index";
    }

    return {
      ...artifact,
      artifactId: reusableKnownArtifact?.artifactId ?? artifact.artifactId,
      collectedAt: this.now().toISOString(),
      localPath: artifact.metadata?.skippedArtifact === true ? artifact.localPath : candidate.localPath,
      localUri: artifact.metadata?.skippedArtifact === true ? artifact.localUri : pathToFileURL(candidate.localPath).toString(),
      objectUri: reusableKnownArtifact?.objectUri ?? artifact.objectUri ?? null,
      metadata,
    };
  }

  private queueArtifactIndexUpdate(
    candidate: ArtifactFileCandidate,
    artifact: CollectedArtifact,
    indexContext: ArtifactIndexContext | null
  ): void {
    if (!indexContext) {
      return;
    }

    indexContext.updates.push({
      artifact: artifactIndexArtifactSnapshot(artifact),
      identity: candidate.identity,
      key: artifactIndexKey(indexContext.rootRealPath, candidate.relativePath),
      policyHash: indexContext.policyHash,
      rootRealPath: indexContext.rootRealPath,
      updatedAt: this.now().toISOString(),
    });
  }

  private async safeArtifactRoot(artifactsPath: string): Promise<{ path: string; realPath: string } | null> {
    const stat = await lstatOrNull(artifactsPath);

    if (!stat) {
      return null;
    }

    if (!stat.isDirectory() || stat.isSymbolicLink()) {
      throw new Error(`Artifact path is not a safe directory: ${artifactsPath}`);
    }

    if (this.allowedRootPath && !(await isRealPathInside(this.allowedRootPath, artifactsPath))) {
      throw new Error(`Artifact path is outside the trusted VM workspace root: ${artifactsPath}`);
    }

    return {
      path: artifactsPath,
      realPath: await fs.realpath(artifactsPath),
    };
  }

  private async *walkArtifacts(
    rootPath: string,
    currentPath: string,
    include: RegExp[],
    exclude: RegExp[]
  ): AsyncGenerator<ArtifactFilePathCandidate> {
    const entries = (await fs.readdir(currentPath, { withFileTypes: true }))
      .sort((left, right) => left.name.localeCompare(right.name));

    for (const entry of entries) {
      const entryPath = path.join(currentPath, entry.name);
      const relativePath = normalizeSafeRelativePath(path.relative(rootPath, entryPath));

      if (entry.isSymbolicLink()) {
        throw new Error(`Artifact collection refuses symlinks: ${entryPath}`);
      }

      if (!relativePath || !isPathInside(rootPath, entryPath)) {
        throw new Error(`Artifact path escapes the artifact root: ${entryPath}`);
      }

      const entryStat = await fs.lstat(entryPath);
      if (entryStat.isSymbolicLink()) {
        throw new Error(`Artifact collection refuses symlinks: ${entryPath}`);
      }

      if (entryStat.isDirectory()) {
        yield* this.walkArtifacts(rootPath, entryPath, include, exclude);
        continue;
      }

      if (!entryStat.isFile() || shouldIgnoreArtifact(relativePath) || !matchesGlobs(relativePath, include, exclude)) {
        continue;
      }

      yield {
        identity: artifactIndexIdentity(entryStat),
        localPath: entryPath,
        relativePath,
        sizeBytes: entryStat.size,
      };
    }
  }

  private async openArtifactFile(rootRealPath: string, localPath: string, relativePath: string): Promise<OpenArtifactFile> {
    const handle = await openNoFollow(localPath);

    try {
      const [stat, handleRealPath] = await Promise.all([
        handle.stat(),
        realpathOpenFileHandle(handle),
      ]);

      if (!stat.isFile()) {
        throw new Error(`Artifact path is not a regular file: ${localPath}`);
      }

      const verifiedRealPath = handleRealPath ?? await verifiedOpenPathRealPath(handle, stat, localPath);

      if (!isPathInside(rootRealPath, verifiedRealPath)) {
        throw new Error(`Artifact path escapes the artifact root: ${localPath}`);
      }

      return {
        handle,
        localPath,
        relativePath,
        sizeBytes: stat.size,
      };
    } catch (error) {
      await handle.close();
      throw error;
    }
  }

  private async artifactReferenceForOpenFile(opened: OpenArtifactFile): Promise<CollectedArtifact> {
    return this.artifactMetadataForOpenFile(opened, await sha256FileHandle(opened.handle), opened.sizeBytes);
  }

  private async artifactForOpenFile(opened: OpenArtifactFile): Promise<PreparedArtifact> {
    const snapshot = await snapshotOpenArtifactFile(opened);

    return {
      artifact: this.artifactMetadataForOpenFile(opened, snapshot.checksumSha256, snapshot.sizeBytes),
      cleanup: snapshot.cleanup,
      openContentStream: () => createReadStream(snapshot.path),
    };
  }

  private artifactMetadataForOpenFile(opened: OpenArtifactFile, checksumSha256: string, sizeBytes: number): CollectedArtifact {
    const contentType = contentTypeFor(opened.relativePath);

    return {
      relativePath: opened.relativePath,
      localPath: opened.localPath,
      localUri: pathToFileURL(opened.localPath).toString(),
      objectUri: null,
      kind: artifactKindFor(opened.relativePath, contentType),
      contentType,
      sizeBytes,
      checksumSha256,
      collectedAt: this.now().toISOString(),
    };
  }

  private async skippedArtifactManifestForCandidate(
    candidate: ArtifactFileCandidate,
    skippedRelativePath: string,
    options: { durableRootPath?: string; durableRootRealPath?: string } = {}
  ): Promise<PreparedArtifact> {
    const collectedAt = this.now().toISOString();
    const manifest = {
      schema: "yp-live-workflow.skipped-artifact.v1",
      reason: "max_file_size_exceeded",
      relativePath: candidate.relativePath,
      localPath: candidate.localPath,
      sizeBytes: candidate.sizeBytes,
      limitBytes: this.maxFileBytes,
      collectionPolicy: "workspace archives retain the original artifact; object storage stores this manifest only",
    };
    const content = `${JSON.stringify(manifest, null, 2)}\n`;
    const sizeBytes = Buffer.byteLength(content);
    const checksumSha256 = createHash("sha256").update(content).digest("hex");
    const contentType = contentTypeFor(skippedRelativePath);
    const preparedManifest = options.durableRootPath && options.durableRootRealPath
      ? await this.durableSkippedArtifactManifest(
        options.durableRootPath,
        options.durableRootRealPath,
        skippedRelativePath,
        content
      )
      : await this.temporarySkippedArtifactManifest(content);

    return {
      artifact: {
        relativePath: skippedRelativePath,
        localPath: preparedManifest.path,
        localUri: pathToFileURL(preparedManifest.path).toString(),
        objectUri: null,
        kind: artifactKindFor(skippedRelativePath, contentType),
        contentType,
        sizeBytes,
        checksumSha256,
        collectedAt,
        metadata: this.skippedArtifactMetadata(candidate, {
          skippedManifestDurable: preparedManifest.durable,
        }),
      },
      cleanup: preparedManifest.cleanup,
      openContentStream: () => createReadStream(preparedManifest.path),
    };
  }

  private async temporarySkippedArtifactManifest(content: string): Promise<{
    cleanup: () => Promise<void>;
    durable: boolean;
    path: string;
  }> {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-skipped-artifact-"));
    const manifestPath = path.join(tempDir, "manifest.json");

    try {
      await fs.writeFile(manifestPath, content, { flag: "wx" });
    } catch (error) {
      await fs.rm(tempDir, { force: true, recursive: true }).catch(() => undefined);
      throw error;
    }

    return {
      cleanup: async () => {
        await fs.rm(tempDir, { force: true, recursive: true });
      },
      durable: false,
      path: manifestPath,
    };
  }

  private async durableSkippedArtifactManifest(
    rootPath: string,
    rootRealPath: string,
    skippedRelativePath: string,
    content: string
  ): Promise<{
    cleanup: () => Promise<void>;
    durable: boolean;
    path: string;
  }> {
    const normalizedRelativePath = normalizeSafeRelativePath(skippedRelativePath);
    if (!normalizedRelativePath) {
      throw new Error(`Artifact path escapes the artifact root: ${skippedRelativePath}`);
    }

    const manifestPath = path.join(rootPath, normalizedRelativePath);
    if (!isPathInside(rootPath, manifestPath)) {
      throw new Error(`Artifact path escapes the artifact root: ${manifestPath}`);
    }

    const parentPath = path.dirname(manifestPath);
    await assertSafeDurableManifestParent(rootRealPath, parentPath);

    const tempPath = path.join(
      parentPath,
      `.yp-live-workflow-skipped-artifact-${process.pid}-${Date.now()}-${path.basename(manifestPath)}.tmp`
    );

    try {
      await fs.writeFile(tempPath, content, { flag: "wx" });
      await assertSafeDurableManifestParent(rootRealPath, parentPath);
      await fs.rename(tempPath, manifestPath);
    } catch (error) {
      await fs.rm(tempPath, { force: true }).catch(() => undefined);
      throw error;
    }

    return {
      cleanup: async () => undefined,
      durable: true,
      path: manifestPath,
    };
  }

  private skippedArtifactMetadata(
    candidate: ArtifactFileCandidate,
    extra: Record<string, string | number | boolean> = {}
  ): Record<string, string | number | boolean> {
    return {
      skippedArtifact: true,
      skippedArtifactSchema: "yp-live-workflow.skipped-artifact.v1",
      skippedOriginalRelativePath: candidate.relativePath,
      skippedOriginalLocalPath: candidate.localPath,
      skippedOriginalSizeBytes: candidate.sizeBytes,
      skippedOriginalLimitBytes: this.maxFileBytes,
      uploadSkippedOriginal: true,
      uploadSkippedReason: "max_file_size_exceeded",
      ...extra,
    };
  }

  private async uploadArtifact(payload: ArtifactCollectPayload, prepared: PreparedArtifact): Promise<string | null> {
    const artifact = prepared.artifact;
    if (!this.objectStorage) {
      return null;
    }

    const relativeDirectory = path.posix.dirname(artifact.relativePath);
    const objectKey = contentAddressedArtifactObjectKey({
      artifactClass: "vm-collected",
      checksumSha256: artifact.checksumSha256,
      context: [
        payload.runId,
        payload.runStepId,
        payload.sessionId,
        relativeDirectory === "." ? "root" : relativeDirectory,
      ].join("-"),
      filename: path.posix.basename(artifact.relativePath),
      prefix: this.objectStoragePrefix,
    });
    const result = await this.objectStorage.putFile({
      localPath: artifact.localPath,
      openContentStream: prepared.openContentStream,
      objectKey,
      contentType: artifact.contentType,
      metadata: {
        runId: payload.runId,
        runStepId: payload.runStepId,
        sessionId: payload.sessionId,
        workspaceId: payload.workspaceId,
        vmHostId: payload.vmHostId,
        relativePath: artifact.relativePath,
        checksumSha256: artifact.checksumSha256,
      },
      sizeBytes: Number(artifact.sizeBytes),
    });

    return result.uri;
  }

  private async cleanupUploadedObjects(objectUris: string[], payload: ArtifactCollectPayload): Promise<void> {
    if (!this.objectStorage || objectUris.length === 0) {
      return;
    }

    for (const objectUri of [...objectUris].reverse()) {
      try {
        await this.objectStorage.deleteObject(objectUri);
      } catch (error) {
        this.logger.error("Artifact upload cleanup failed", {
          event: "artifact_upload_cleanup_failed",
          runId: payload.runId,
          runStepId: payload.runStepId,
          sessionId: payload.sessionId,
          workspaceId: payload.workspaceId,
          vmHostId: payload.vmHostId,
          objectUri,
          message: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  private response(
    payload: ArtifactCollectPayload,
    artifactsPath: string,
    artifacts: CollectedArtifact[],
    uploadEnabled = this.shouldUpload(payload)
  ): ArtifactCollectResponsePayload {
    return {
      commandId: payload.commandId,
      sessionId: payload.sessionId,
      runId: payload.runId,
      runStepId: payload.runStepId,
      workspaceId: payload.workspaceId,
      vmHostId: payload.vmHostId,
      artifactsPath,
      uploadEnabled,
      collectedAt: this.now().toISOString(),
      artifacts: dedupeArtifacts(artifacts),
    };
  }

  private shouldUpload(payload: ArtifactCollectPayload): boolean {
    return this.uploadEnabled && payload.upload !== false && Boolean(this.objectStorage);
  }

  private exceedsMaxUploadSize(artifact: CollectedArtifact): boolean {
    return Number(artifact.sizeBytes) > this.maxUploadBytes;
  }

  private openFileExceedsMaxUploadSize(opened: OpenArtifactFile): boolean {
    return opened.sizeBytes > this.maxUploadBytes;
  }

  private assertCollectionFileCountWithinLimit(fileCount: number, relativePath: string): void {
    if (fileCount > this.maxFiles) {
      throw new ArtifactCollectionLimitError(
        `artifact collection matched ${fileCount} files, exceeding max ${this.maxFiles}; latest path ${relativePath}`
      );
    }
  }

  private assertCollectionTotalBytesWithinLimit(totalBytes: number, relativePath: string): void {
    if (totalBytes > this.maxTotalBytes) {
      throw new ArtifactCollectionLimitError(
        `artifact collection matched ${totalBytes} bytes, exceeding max ${this.maxTotalBytes}; latest path ${relativePath}`
      );
    }
  }

  private addCollectedArtifactBytes(
    currentBytes: number,
    artifact: Pick<CollectedArtifact, "relativePath" | "sizeBytes">
  ): number {
    const nextBytes = currentBytes + Number(artifact.sizeBytes);
    this.assertCollectionTotalBytesWithinLimit(nextBytes, artifact.relativePath);
    return nextBytes;
  }
}

export class GcsArtifactObjectStorageClient implements ArtifactObjectStorageClient {
  private readonly storage: Storage;

  constructor(
    private readonly bucketName: string,
    storage: Storage = new Storage()
  ) {
    this.storage = storage;
  }

  async putFile(input: ArtifactObjectStoragePutInput): Promise<ArtifactObjectStoragePutResult> {
    await pipeline(
      input.openContentStream(),
      this.storage.bucket(this.bucketName).file(input.objectKey).createWriteStream({
        metadata: {
          contentType: input.contentType ?? undefined,
          metadata: input.metadata,
        },
      })
    );

    return { uri: `gs://${this.bucketName}/${input.objectKey}` };
  }

  async deleteObject(objectUri: string): Promise<void> {
    const parsed = parseGcsUri(objectUri);
    if (parsed.bucket !== this.bucketName) {
      throw new Error(`Artifact object URI bucket does not match configured bucket: ${objectUri}`);
    }

    try {
      await this.storage.bucket(parsed.bucket).file(parsed.objectKey).delete();
    } catch (error) {
      if (String((error as { code?: unknown }).code) !== "404") {
        throw error;
      }
    }
  }
}

export class InMemoryArtifactIndexStore implements ArtifactIndexStore {
  private readonly entries = new Map<string, ArtifactIndexEntry>();

  async readEntries(): Promise<ArtifactIndexEntry[]> {
    return Array.from(this.entries.values());
  }

  async mergeEntries(entries: ArtifactIndexEntry[]): Promise<void> {
    for (const entry of entries) {
      this.entries.set(entry.key, entry);
    }
  }
}

export class FileArtifactIndexStore implements ArtifactIndexStore {
  private pendingWrite: Promise<void> = Promise.resolve();

  constructor(
    private readonly indexPath: string,
    private readonly maxEntries = DefaultMaxArtifactIndexEntries
  ) {}

  async readEntries(): Promise<ArtifactIndexEntry[]> {
    await this.pendingWrite.catch(() => undefined);
    return this.readEntriesUnlocked();
  }

  async mergeEntries(entries: ArtifactIndexEntry[]): Promise<void> {
    if (entries.length === 0) {
      return;
    }

    const write = this.pendingWrite
      .catch(() => undefined)
      .then(async () => {
        const merged = new Map<string, ArtifactIndexEntry>();

        for (const entry of await this.readEntriesUnlocked()) {
          merged.set(entry.key, entry);
        }

        for (const entry of entries) {
          merged.set(entry.key, entry);
        }

        const content = {
          schema: ArtifactIndexSchema,
          entries: Array.from(merged.values())
            .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
            .slice(0, this.maxEntries),
        };
        const tempPath = `${this.indexPath}.${process.pid}.${Date.now()}.tmp`;
        await fs.mkdir(path.dirname(this.indexPath), { recursive: true });
        await fs.writeFile(tempPath, `${JSON.stringify(content, null, 2)}\n`, { flag: "wx" });
        await fs.rename(tempPath, this.indexPath);
      });

    this.pendingWrite = write;
    await write;
  }

  private async readEntriesUnlocked(): Promise<ArtifactIndexEntry[]> {
    let parsed: unknown;
    let content: string;

    try {
      content = await fs.readFile(this.indexPath, "utf8");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return [];
      }

      throw error;
    }

    try {
      parsed = JSON.parse(content);
    } catch {
      return [];
    }

    if (!parsed || typeof parsed !== "object") {
      return [];
    }

    const record = parsed as { entries?: unknown; schema?: unknown };
    if (record.schema !== ArtifactIndexSchema || !Array.isArray(record.entries)) {
      return [];
    }

    return record.entries.filter(isArtifactIndexEntry);
  }
}

export function createArtifactCollectorFromConfig(config: {
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
}): ArtifactCollector {
  const bucket = config.artifactBucket?.trim();
  const objectStorage = bucket ? new GcsArtifactObjectStorageClient(bucket) : undefined;

  return new ArtifactCollector({
    allowedRootPath: config.workspaceRoot,
    artifactIndex: artifactIndexStoreFromConfig(config),
    objectStorage,
    objectStorageIdentity: bucket ? `gcs:${bucket}` : undefined,
    objectStoragePrefix: config.artifactPrefix,
    maxFiles: config.artifactCollectionMaxFiles,
    maxFileBytes: config.artifactCollectionMaxFileBytes,
    maxTotalBytes: config.artifactCollectionMaxTotalBytes,
    maxUploadBytes: config.artifactUploadMaxBytes,
    uploadEnabled: config.artifactUploadEnabled ?? Boolean(objectStorage),
  });
}

async function openNoFollow(localPath: string): Promise<FileHandle> {
  try {
    return await fs.open(localPath, fsConstants.O_RDONLY | fsConstants.O_NOFOLLOW);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ELOOP") {
      throw new Error(`Artifact collection refuses symlinks: ${localPath}`);
    }

    throw error;
  }
}

async function recheckArtifactFileIdentity(
  localPath: string,
  expectedIdentity: ArtifactIndexFileIdentity
): Promise<boolean> {
  const handle = await openNoFollow(localPath);

  try {
    const stat = await handle.stat();
    return stat.isFile() && sameArtifactIndexIdentity(artifactIndexIdentity(stat), expectedIdentity);
  } finally {
    await handle.close();
  }
}

async function realpathOpenFileHandle(handle: FileHandle): Promise<string | null> {
  return realpathOrNull(`/proc/self/fd/${handle.fd}`);
}

async function verifiedOpenPathRealPath(
  handle: FileHandle,
  handleStat: Awaited<ReturnType<FileHandle["stat"]>>,
  localPath: string
): Promise<string> {
  await assertCurrentPathMatchesHandle(handleStat, localPath);
  const realPath = await fs.realpath(localPath);
  await assertCurrentPathMatchesHandle(handleStat, localPath);
  return realPath;
}

async function assertCurrentPathMatchesHandle(
  handleStat: Awaited<ReturnType<FileHandle["stat"]>>,
  localPath: string
): Promise<void> {
  const currentStat = await fs.lstat(localPath);

  if (currentStat.isSymbolicLink()) {
    throw new Error(`Artifact collection refuses symlinks: ${localPath}`);
  }

  if (!currentStat.isFile()) {
    throw new Error(`Artifact path is not a regular file: ${localPath}`);
  }

  if (!sameFileIdentity(handleStat, currentStat)) {
    throw new Error(`Artifact path changed while collecting: ${localPath}`);
  }
}

function sameFileIdentity(
  left: { dev: number | bigint; ino: number | bigint },
  right: { dev: number | bigint; ino: number | bigint }
): boolean {
  return left.dev === right.dev && left.ino === right.ino;
}

async function sha256FileHandle(handle: FileHandle): Promise<string> {
  const hash = createHash("sha256");
  const buffer = Buffer.allocUnsafe(1024 * 1024);
  let position = 0;

  for (;;) {
    const { bytesRead } = await handle.read(buffer, 0, buffer.length, position);

    if (bytesRead === 0) {
      break;
    }

    hash.update(bytesRead === buffer.length ? buffer : buffer.subarray(0, bytesRead));
    position += bytesRead;
  }

  return hash.digest("hex");
}

async function snapshotOpenArtifactFile(opened: OpenArtifactFile): Promise<ArtifactSnapshot> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-artifact-snapshot-"));
  const snapshotPath = path.join(tempDir, "content");
  const hasher = new HashingByteCounter();

  try {
    await pipeline(
      opened.handle.createReadStream({ autoClose: false, start: 0 }),
      hasher,
      createWriteStream(snapshotPath, { flags: "wx" })
    );

    return {
      checksumSha256: hasher.digest(),
      cleanup: async () => {
        await fs.rm(tempDir, { force: true, recursive: true });
      },
      path: snapshotPath,
      sizeBytes: hasher.bytes,
    };
  } catch (error) {
    await fs.rm(tempDir, { force: true, recursive: true }).catch(() => undefined);
    throw error;
  }
}

class HashingByteCounter extends Transform {
  readonly hash = createHash("sha256");
  bytes = 0;

  _transform(chunk: Buffer | string, encoding: BufferEncoding, callback: TransformCallback): void {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding);
    this.bytes += buffer.length;
    this.hash.update(buffer);
    callback(null, chunk);
  }

  digest(): string {
    return this.hash.digest("hex");
  }
}

function normalizeMaxUploadBytes(value: number | undefined): number {
  const maxUploadBytes = value ?? DefaultArtifactUploadMaxBytes;

  return normalizePositiveInteger(maxUploadBytes, "Artifact collector maxUploadBytes");
}

function normalizePositiveInteger(value: number, label: string): number {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${label} must be a positive safe integer`);
  }

  return value;
}

async function lstatOrNull(targetPath: string) {
  try {
    return await fs.lstat(targetPath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

async function assertSafeDurableManifestParent(rootRealPath: string, parentPath: string): Promise<void> {
  const stat = await fs.lstat(parentPath);
  if (!stat.isDirectory() || stat.isSymbolicLink()) {
    throw new Error(`Artifact skipped-manifest parent is not a safe directory: ${parentPath}`);
  }

  const parentRealPath = await fs.realpath(parentPath);
  if (!isPathInside(rootRealPath, parentRealPath)) {
    throw new Error(`Artifact skipped-manifest parent escapes the artifact root: ${parentPath}`);
  }
}

async function isRealPathInside(basePath: string, targetPath: string): Promise<boolean> {
  const [baseRealPath, targetRealPath] = await Promise.all([
    realpathOrNull(basePath),
    realpathOrNull(targetPath),
  ]);

  return Boolean(baseRealPath && targetRealPath && isPathInside(baseRealPath, targetRealPath));
}

async function realpathOrNull(targetPath: string): Promise<string | null> {
  try {
    return await fs.realpath(targetPath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

function dedupeArtifacts(artifacts: CollectedArtifact[]): CollectedArtifact[] {
  const seen = new Set<string>();
  const deduped: CollectedArtifact[] = [];

  for (const artifact of artifacts) {
    const key = artifactIdentityKey(artifact);

    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(artifact);
    }
  }

  return deduped;
}

function knownArtifactMap(artifacts: ArtifactCollectKnownArtifact[]): Map<string, ArtifactCollectKnownArtifact> {
  const known = new Map<string, ArtifactCollectKnownArtifact>();

  for (const artifact of artifacts) {
    known.set(artifactIdentityKey(artifact), artifact);
  }

  return known;
}

function artifactIdentityKey(artifact: Pick<ArtifactCollectKnownArtifact, "relativePath" | "checksumSha256">): string {
  return `${artifact.relativePath}:${artifact.checksumSha256}`;
}

function shouldReuseKnownArtifact(artifact: ArtifactCollectKnownArtifact, uploadEnabled: boolean): boolean {
  return !uploadEnabled || Boolean(artifact.objectUri);
}

function artifactIndexStoreFromConfig(config: { artifactIndexPath?: string; statePath?: string }): ArtifactIndexStore | undefined {
  const indexPath = config.artifactIndexPath ?? (
    config.statePath ? path.join(path.dirname(config.statePath), "vm-agent-artifact-index.json") : undefined
  );

  return indexPath ? new FileArtifactIndexStore(indexPath) : undefined;
}

function artifactIndexPolicyHash(input: {
  maxFileBytes: number;
  maxUploadBytes: number;
  objectStorageIdentity: string;
  objectStoragePrefix: string;
  uploadEnabled: boolean;
}): string {
  return createHash("sha256")
    .update(JSON.stringify({
      version: ArtifactIndexVersion,
      maxFileBytes: input.maxFileBytes,
      maxUploadBytes: input.maxUploadBytes,
      objectStorageIdentity: input.objectStorageIdentity,
      objectStoragePrefix: input.objectStoragePrefix,
      uploadEnabled: input.uploadEnabled,
    }))
    .digest("hex");
}

function artifactIndexKey(rootRealPath: string, relativePath: string): string {
  return createHash("sha256")
    .update(`${rootRealPath}\0${relativePath}`)
    .digest("hex");
}

function artifactIndexIdentity(stat: { dev: number | bigint; ino: number | bigint; mtimeMs: number; size: number }): ArtifactIndexFileIdentity {
  return {
    dev: String(stat.dev),
    ino: String(stat.ino),
    mtimeMs: stat.mtimeMs,
    sizeBytes: stat.size,
  };
}

function sameArtifactIndexIdentity(left: ArtifactIndexFileIdentity, right: ArtifactIndexFileIdentity): boolean {
  return (
    left.dev === right.dev &&
    left.ino === right.ino &&
    left.mtimeMs === right.mtimeMs &&
    left.sizeBytes === right.sizeBytes
  );
}

function artifactIndexArtifactSnapshot(artifact: CollectedArtifact): CollectedArtifact {
  const snapshot: CollectedArtifact = {
    ...artifact,
    metadata: artifact.metadata ? { ...artifact.metadata } : undefined,
  };
  delete snapshot.artifactId;
  return snapshot;
}

function isArtifactIndexEntry(value: unknown): value is ArtifactIndexEntry {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as ArtifactIndexEntry;
  return (
    typeof record.key === "string" &&
    typeof record.policyHash === "string" &&
    typeof record.rootRealPath === "string" &&
    typeof record.updatedAt === "string" &&
    isArtifactIndexFileIdentity(record.identity) &&
    isCollectedArtifactIndexValue(record.artifact)
  );
}

function isArtifactIndexFileIdentity(value: unknown): value is ArtifactIndexFileIdentity {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as ArtifactIndexFileIdentity;
  return (
    typeof record.dev === "string" &&
    typeof record.ino === "string" &&
    typeof record.mtimeMs === "number" &&
    typeof record.sizeBytes === "number"
  );
}

function isCollectedArtifactIndexValue(value: unknown): value is CollectedArtifact {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as CollectedArtifact;
  return (
    typeof record.relativePath === "string" &&
    typeof record.localPath === "string" &&
    typeof record.localUri === "string" &&
    typeof record.kind === "string" &&
    typeof record.sizeBytes === "number" &&
    typeof record.checksumSha256 === "string" &&
    typeof record.collectedAt === "string"
  );
}

function shouldIgnoreArtifact(relativePath: string): boolean {
  const name = path.posix.basename(relativePath);
  return IgnoredArtifactFileNames.has(name) || name.startsWith(".yp-live-workflow-") || name.endsWith(".skipped-artifact.json");
}

function skippedArtifactRelativePath(relativePath: string): string {
  return `${relativePath}.skipped-artifact.json`;
}

function matchesGlobs(relativePath: string, include: RegExp[], exclude: RegExp[]): boolean {
  return include.some((glob) => glob.test(relativePath)) && !exclude.some((glob) => glob.test(relativePath));
}

function globToRegExp(glob: string): RegExp {
  const normalized = normalizeRelativePath(glob);
  const escaped = normalized.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  const pattern = escaped.replace(/\*\*/g, "\0").replace(/\*/g, "[^/]*").replace(/\0/g, ".*");
  return new RegExp(`^${pattern}$`);
}

function contentTypeFor(relativePath: string): string {
  switch (path.posix.extname(relativePath).toLowerCase()) {
    case ".txt":
    case ".log":
      return "text/plain";
    case ".py":
      return "text/x-python";
    case ".r":
      return "text/x-r";
    case ".rmd":
      return "text/x-r-markdown";
    case ".qmd":
      return "text/x-quarto-markdown";
    case ".sh":
    case ".bash":
      return "text/x-shellscript";
    case ".jl":
      return "text/x-julia";
    case ".m":
      return "text/x-octave";
    case ".ts":
      return "text/typescript";
    case ".js":
      return "text/javascript";
    case ".sql":
      return "text/x-sql";
    case ".yaml":
    case ".yml":
      return "application/yaml";
    case ".md":
      return "text/markdown";
    case ".json":
      return "application/json";
    case ".jsonl":
      return "application/x-ndjson";
    case ".csv":
      return "text/csv";
    case ".tsv":
      return "text/tab-separated-values";
    case ".sha256":
      return "text/plain";
    case ".parquet":
      return "application/vnd.apache.parquet";
    case ".html":
      return "text/html";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".svg":
      return "image/svg+xml";
    case ".pdf":
      return "application/pdf";
    case ".ipynb":
      return "application/x-ipynb+json";
    case ".zip":
      return "application/zip";
    case ".gz":
      return "application/gzip";
    default:
      return "application/octet-stream";
  }
}

function artifactKindFor(relativePath: string, contentType: string): string {
  const lower = relativePath.toLowerCase();
  const extension = path.posix.extname(lower);

  if (extension === ".log" || lower.includes("/logs/")) {
    return "log";
  }

  if (extension === ".csv" || extension === ".tsv" || extension === ".parquet") {
    return "table";
  }

  if (contentType.startsWith("image/")) {
    return "image";
  }

  if (extension === ".ipynb") {
    return "notebook";
  }

  if (isSourceCodeExtension(extension)) {
    return "source_code";
  }

  if (extension === ".md" || extension === ".html" || extension === ".pdf") {
    return "report";
  }

  if (extension === ".zip" || extension === ".gz") {
    return "archive";
  }

  return extension ? "data" : "other";
}

function isSourceCodeExtension(extension: string): boolean {
  return SourceCodeExtensions.has(extension);
}

function normalizeRelativePath(value: string): string {
  return value.replace(/\\/g, "/").replace(/^\/+/, "");
}

function safeObjectPrefix(value: string): string {
  return normalizeRelativePath(value).replace(/\/+$/, "") || DefaultObjectStoragePrefix;
}

function parseGcsUri(objectUri: string): { bucket: string; objectKey: string } {
  if (!objectUri.startsWith("gs://")) {
    throw new Error(`Artifact object URI must start with gs://: ${objectUri}`);
  }

  const withoutScheme = objectUri.slice("gs://".length);
  const slashIndex = withoutScheme.indexOf("/");
  const bucket = slashIndex === -1 ? withoutScheme : withoutScheme.slice(0, slashIndex);
  const objectKey = slashIndex === -1 ? "" : withoutScheme.slice(slashIndex + 1).replace(/^\/+/u, "");

  if (!bucket || !objectKey) {
    throw new Error(`Artifact object URI must include a bucket and object key: ${objectUri}`);
  }

  return { bucket, objectKey };
}

function contentAddressedArtifactObjectKey(input: {
  artifactClass: "vm-collected";
  checksumSha256: string;
  context: string;
  filename: string;
  prefix: string;
}): string {
  const checksum = normalizedSha256(input.checksumSha256);
  return path.posix.join(
    safeObjectPrefix(input.prefix),
    input.artifactClass,
    checksum.slice(0, 2),
    checksum,
    safePathSegment(input.context),
    safeObjectFilename(input.filename)
  );
}

function safePathSegment(value: string): string {
  return value.replace(/[^A-Za-z0-9_.-]+/g, "-").replace(/^-+/, "").slice(0, 120) || "unknown";
}

function safeObjectFilename(value: string): string {
  return path.posix.basename(value.replace(/\\/g, "/"))
    .replace(/[^A-Za-z0-9_. -]+/g, "_")
    .replace(/^\.+/g, "")
    .slice(0, 180) || "artifact.bin";
}

function normalizedSha256(value: string): string {
  const normalized = value.toLowerCase();
  if (!/^[a-f0-9]{64}$/.test(normalized)) {
    throw new Error("Artifact object key requires a SHA-256 checksum");
  }
  return normalized;
}

function isPathInside(basePath: string, targetPath: string): boolean {
  const relative = path.relative(path.resolve(basePath), path.resolve(targetPath));
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}
