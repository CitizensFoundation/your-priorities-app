import { createHash } from "node:crypto";
import { constants as fsConstants, createReadStream } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Storage } from "@google-cloud/storage";
import type {
  Json,
  VmDatasetValidationAsset,
  VmDatasetValidationFile,
  VmSessionDatasetMount,
  VmSessionStartPayload,
} from "../../contracts/index.js";

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

type PreparedDatasetSource = {
  path: string;
  sourceUri: string;
};

type LocalHotLocationResolution = {
  location: PreparedDatasetSource | null;
  missingUris: string[];
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

type CacheMarker = {
  datasetVersionId: string;
  sourceUri: string;
  manifestChecksumSha256?: string | null;
  preparedAt: string;
};

const DefaultHotRoot = "/mnt/datasets-hot";
const DatasetManifestFileName = ".yp-live-workflow-dataset-manifest.json";
const DatasetCacheMarkerFileName = ".yp-live-workflow-dataset-cache.json";
const MaxMountedFiles = 500;

export class DatasetManager {
  private readonly hotRoot: string;
  private readonly trustedLocalRoots: string[];
  private readonly objectStorage: ObjectStorageClient;
  private readonly now: () => Date;
  private readonly promotions = new Map<string, Promise<PreparedDatasetSource | null>>();

  constructor(options: DatasetManagerOptions = {}) {
    this.hotRoot = path.resolve(options.hotRoot ?? DefaultHotRoot);
    this.trustedLocalRoots = (options.trustedLocalRoots ?? []).map((root) => path.resolve(root));
    this.objectStorage = options.objectStorage ?? new GcsObjectStorageClient();
    this.now = options.now ?? (() => new Date());
  }

  async prepareSessionMounts(payload: VmSessionStartPayload): Promise<DatasetMountPreparation> {
    const mounts: PreparedDatasetMount[] = [];

    for (const mount of payload.datasetMounts ?? []) {
      const prepared = await this.prepareMount(mount);

      if (prepared) {
        mounts.push(prepared);
      }
    }

    return {
      mounts,
      runtimeMetadata: {
        datasetMounts: mounts.map((mount) => ({
          datasetVersionId: mount.datasetVersionId,
          source: mount.source,
          target: mount.target,
          readOnly: mount.readOnly,
          sourceUri: mount.sourceUri,
          manifestChecksumSha256: mount.manifestChecksumSha256 ?? null,
        })),
      },
    };
  }

  async promoteWorkspaceDataset(input: DatasetPromotionInput): Promise<DatasetPromotionResult> {
    const sourcePath = path.resolve(input.sourcePath);
    const cachePath = this.cachePathFor(input.datasetVersionId);
    const mount: VmSessionDatasetMount = {
      datasetVersionId: input.datasetVersionId,
      name: "dataset",
      versionLabel: "version",
      containerPath: "/datasets/promoted/version",
      access: "read_only",
      required: true,
      locations: [{ kind: "local", tier: "cold", uri: sourcePath }],
      manifestChecksumSha256: input.manifestChecksumSha256 ?? null,
    };
    const existing = await this.verifiedCachePath(cachePath, mount);

    if (!existing) {
      await assertSafeDirectory(sourcePath);
      await assertNoSymlinks(sourcePath);
      await this.promoteLocation(sourcePath, cachePath, mount);
    }

    await assertSafeDirectory(cachePath);
    const datasetInventory = await directoryDatasetInventory(cachePath);

    return {
      hotPath: cachePath,
      uri: pathToFileURL(cachePath).href,
      sourcePath,
      sourceUri: pathToFileURL(sourcePath).href,
      sizeBytes: datasetInventory.sizeBytes,
      mountedFiles: datasetInventory.files,
      mountedFileCount: datasetInventory.totalFiles,
      mountedFilesTruncated: datasetInventory.truncated,
    };
  }

  async validateHotDataset(input: DatasetValidationInput): Promise<DatasetValidationResult> {
    const { sourcePath } = await this.assertHotDatasetOutputPath(input);
    await assertNoSymlinks(sourcePath);

    const datasetInventory = await directoryDatasetInventory(sourcePath);
    const missingExpectedFiles: string[] = [];
    const missingAssetFiles: string[] = [];
    const checksumFailures: string[] = [];
    const sizeMismatches: string[] = [];
    const requestedFiles = new Map<string, string | null>();

    for (const file of input.expectedFiles ?? []) {
      const relativePath = normalizeDatasetRelativePath(file);
      if (!relativePath || !(await isExistingFile(path.join(sourcePath, relativePath)))) {
        missingExpectedFiles.push(file);
      } else {
        requestedFiles.set(relativePath, null);
      }
    }

    for (const asset of input.assets ?? []) {
      const relativePath = normalizeDatasetRelativePath(asset.relativePath);
      if (!relativePath) {
        missingAssetFiles.push(asset.relativePath);
        continue;
      }

      const assetPath = path.join(sourcePath, relativePath);
      if (!isPathInside(sourcePath, assetPath) || !(await isExistingFile(assetPath))) {
        missingAssetFiles.push(asset.relativePath);
        continue;
      }

      const previousChecksum = requestedFiles.get(relativePath) ?? null;
      let verifiedChecksum: string | null = null;
      const declaredSize = nonNegativeIntegerValue(asset.sizeBytes);
      if (declaredSize !== null && (await fs.stat(assetPath)).size !== declaredSize) {
        sizeMismatches.push(asset.relativePath);
      }

      const checksum = typeof asset.checksumSha256 === "string" ? asset.checksumSha256.trim().toLowerCase() : "";
      if (checksum) {
        const actualChecksum = await sha256File(assetPath);
        if (actualChecksum !== checksum) {
          checksumFailures.push(asset.relativePath);
        } else {
          verifiedChecksum = actualChecksum;
        }
      }
      requestedFiles.set(relativePath, verifiedChecksum ?? previousChecksum);
    }

    return {
      sourcePath,
      uri: pathToFileURL(sourcePath).href,
      sizeBytes: datasetInventory.sizeBytes,
      mountedFiles: datasetInventory.files,
      mountedFileCount: datasetInventory.totalFiles,
      mountedFilesTruncated: datasetInventory.truncated,
      files: await Promise.all(
        [...requestedFiles.entries()].sort(([left], [right]) => left.localeCompare(right)).map(async ([relativePath, checksumSha256]) => {
          const filePath = path.join(sourcePath, relativePath);
          const stat = await fs.stat(filePath);
          return {
            relativePath,
            sizeBytes: stat.size,
            checksumSha256,
            ...fileFormatMetadata(relativePath),
          };
        })
      ),
      missingExpectedFiles,
      missingAssetFiles,
      checksumFailures,
      sizeMismatches,
    };
  }

  async normalizeHotDatasetOutput(input: DatasetOutputNormalizeInput): Promise<DatasetOutputNormalizeResult> {
    const { sourcePath } = await this.assertHotDatasetOutputPath(input);
    const counts = await chmodReadableTree(sourcePath);
    return { sourcePath, ...counts };
  }

  async assertHotDatasetOutputReadable(input: DatasetOutputNormalizeInput): Promise<DatasetOutputNormalizeResult> {
    const { sourcePath } = await this.assertHotDatasetOutputPath(input);
    const counts = await inspectReadableTree(sourcePath);
    return { sourcePath, ...counts };
  }

  async isTrustedLocalDatasetRoot(sourcePath: string): Promise<boolean> {
    const resolved = path.resolve(sourcePath);

    return (await isRealPathInside(this.hotRoot, resolved)) || await this.isTrustedLocalSource(resolved);
  }

  private async prepareMount(mount: VmSessionDatasetMount): Promise<PreparedDatasetMount | null> {
    if (mount.access !== "read_only") {
      throw new Error(`Dataset mounts must be read-only: ${mount.datasetVersionId}`);
    }

    const target = normalizeContainerDatasetPath(mount.containerPath);
    const cachePath = this.cachePathFor(mount.datasetVersionId);
    const cacheKey = promotionCacheKey(mount);
    const existingPromotion = this.promotions.get(cacheKey);

    let sourcePromise = existingPromotion;

    if (!sourcePromise) {
      sourcePromise = this.resolveOrPromoteSource(mount, cachePath).finally(() => {
        this.promotions.delete(cacheKey);
      });
      this.promotions.set(cacheKey, sourcePromise);
    }

    const source = await sourcePromise;
    return source ? preparedMount(mount, source.path, target, source.sourceUri) : null;
  }

  private async resolveOrPromoteSource(
    mount: VmSessionDatasetMount,
    cachePath: string
  ): Promise<PreparedDatasetSource | null> {
    const verifiedCache = await this.verifiedCachePath(cachePath, mount);

    if (verifiedCache) {
      return verifiedCache;
    }

    const localHot = await this.localHotLocation(mount);

    if (localHot.location) {
      await this.verifyManifestChecksum(localHot.location.path, mount);
      // Local hot locations are already registered dataset outputs, not VM-managed cache copies.
      // Cache markers are only required for promoted cachePathFor(datasetVersionId) directories.
      return localHot.location;
    }

    const location = this.promotionLocation(mount);

    if (!location) {
      if (mount.required) {
        if (localHot.missingUris.length > 0) {
          throw new Error(
            `Required dataset local hot location is missing or stale for ${mount.datasetVersionId}: ${localHot.missingUris.join(", ")}`
          );
        }

        throw new Error(`Required dataset has no promotable location: ${mount.datasetVersionId}`);
      }

      return null;
    }

    if (location.kind === "local") {
      const sourcePath = path.resolve(localPathFromUri(location.uri));

      if (!(await this.isTrustedLocalSource(sourcePath))) {
        if (mount.required) {
          throw new Error(`Local dataset source is outside the trusted dataset roots: ${location.uri}`);
        }

        return null;
      }
    }

    await this.promoteLocation(location.uri, cachePath, mount);
    return { path: cachePath, sourceUri: location.uri };
  }

  private async verifiedCachePath(
    cachePath: string,
    mount: VmSessionDatasetMount
  ): Promise<{ path: string; sourceUri: string } | null> {
    const stat = await lstatOrNull(cachePath);

    if (!stat) {
      return null;
    }

    if (!stat.isDirectory() || stat.isSymbolicLink()) {
      throw new Error(`Dataset hot cache path is not a safe directory: ${cachePath}`);
    }

    const marker = await readMarker(cachePath);

    if (
      marker?.datasetVersionId === mount.datasetVersionId &&
      (marker.manifestChecksumSha256 ?? null) === (mount.manifestChecksumSha256 ?? null)
    ) {
      return { path: cachePath, sourceUri: marker.sourceUri };
    }

    throw new Error(`Dataset hot cache path exists without a matching cache marker: ${cachePath}`);
  }

  private async localHotLocation(mount: VmSessionDatasetMount): Promise<LocalHotLocationResolution> {
    const missingUris: string[] = [];

    for (const location of mount.locations) {
      if (location.kind !== "local" || location.tier !== "hot") {
        continue;
      }

      const sourcePath = path.resolve(localPathFromUri(location.uri));
      const containment = await realPathContainment(this.hotRoot, sourcePath);

      if (containment === "outside") {
        throw new Error(`Local hot dataset location is outside the VM hot dataset root: ${location.uri}`);
      }

      if (containment === "missing_inside") {
        missingUris.push(location.uri);
        continue;
      }

      await assertSafeDirectory(sourcePath);
      return { location: { path: sourcePath, sourceUri: location.uri }, missingUris };
    }

    return { location: null, missingUris };
  }

  private promotionLocation(mount: VmSessionDatasetMount): { uri: string; kind: "gcs" | "local" } | null {
    const gcs = mount.locations.find((location) => location.kind === "gcs" && location.tier === "cold");

    if (gcs) {
      return { uri: gcs.uri, kind: "gcs" };
    }

    const local = mount.locations.find((location) => location.kind === "local" && location.tier !== "hot");
    return local ? { uri: local.uri, kind: "local" } : null;
  }

  private async isTrustedLocalSource(sourcePath: string): Promise<boolean> {
    for (const root of this.trustedLocalRoots) {
      if (await isRealPathInside(root, sourcePath)) {
        return true;
      }
    }

    return false;
  }

  private async promoteLocation(uri: string, cachePath: string, mount: VmSessionDatasetMount): Promise<void> {
    await fs.mkdir(this.hotRoot, { recursive: true });
    const tempPath = `${cachePath}.tmp-${process.pid}-${Date.now()}`;
    await fs.rm(tempPath, { recursive: true, force: true });

    try {
      if (uri.startsWith("gs://")) {
        await this.objectStorage.downloadPrefixToDirectory(uri, tempPath);
      } else {
        const sourcePath = path.resolve(localPathFromUri(uri));
        await assertSafeDirectory(sourcePath);
        await fs.cp(sourcePath, tempPath, { recursive: true, errorOnExist: true, force: false });
        await assertNoSymlinks(tempPath);
      }

      await this.verifyManifestChecksum(tempPath, mount);
      await this.writeCacheMarker(tempPath, mount, uri);
      await fs.rename(tempPath, cachePath);
    } catch (error) {
      await fs.rm(tempPath, { recursive: true, force: true });

      if ((error as NodeJS.ErrnoException).code === "EEXIST") {
        const verified = await this.verifiedCachePath(cachePath, mount);

        if (verified) {
          return;
        }
      }

      throw error;
    }
  }

  private async verifyManifestChecksum(targetPath: string, mount: VmSessionDatasetMount): Promise<void> {
    if (!mount.manifestChecksumSha256) {
      return;
    }

    const manifestPath = path.join(targetPath, DatasetManifestFileName);
    const content = await fs.readFile(manifestPath);
    const checksum = createHash("sha256").update(content).digest("hex");

    if (checksum !== mount.manifestChecksumSha256.toLowerCase()) {
      throw new Error(`Dataset manifest checksum mismatch for ${mount.datasetVersionId}`);
    }
  }

  private async writeCacheMarker(targetPath: string, mount: VmSessionDatasetMount, sourceUri: string): Promise<void> {
    const marker: CacheMarker = {
      datasetVersionId: mount.datasetVersionId,
      sourceUri,
      manifestChecksumSha256: mount.manifestChecksumSha256 ?? null,
      preparedAt: this.now().toISOString(),
    };

    await fs.writeFile(path.join(targetPath, DatasetCacheMarkerFileName), `${JSON.stringify(marker, null, 2)}\n`, {
      flag: "w",
    });
  }

  private cachePathFor(datasetVersionId: string): string {
    return path.join(this.hotRoot, safePathSegment(datasetVersionId));
  }

  private async assertHotDatasetOutputPath(input: DatasetOutputNormalizeInput): Promise<{ sourcePath: string; allowedSourceRootPath: string }> {
    const sourcePath = path.resolve(input.sourcePath);
    const allowedSourceRootPath = path.resolve(input.allowedSourceRootPath);

    if (!(await isRealPathInside(this.hotRoot, allowedSourceRootPath))) {
      throw new Error(`Dataset output root is outside the VM hot dataset root: ${allowedSourceRootPath}`);
    }

    if (!(await isRealPathInside(allowedSourceRootPath, sourcePath))) {
      throw new Error(`Dataset source path is outside the allowed dataset output root: ${sourcePath}`);
    }

    await assertSafeDirectory(sourcePath);
    return { sourcePath, allowedSourceRootPath };
  }
}

function normalizeDatasetRelativePath(value: string): string | null {
  const normalized = value.trim().replace(/\\/g, "/").replace(/^\.\/+/, "").replace(/^\/+/, "");
  if (!normalized || normalized === "." || normalized === ".." || normalized.includes("../")) {
    return null;
  }

  return normalized;
}

async function isExistingFile(targetPath: string): Promise<boolean> {
  try {
    return (await fs.stat(targetPath)).isFile();
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return false;
    }

    throw error;
  }
}

async function sha256File(targetPath: string): Promise<string> {
  const hash = createHash("sha256");
  await new Promise<void>((resolve, reject) => {
    const stream = createReadStream(targetPath);
    stream.on("data", (chunk) => {
      hash.update(chunk);
    });
    stream.once("error", reject);
    stream.once("end", resolve);
  });
  return hash.digest("hex");
}

function fileFormatMetadata(relativePath: string): { format?: string; compression?: string } {
  const basename = path.basename(relativePath).toLowerCase();
  const compression = basename.endsWith(".gz")
    ? "gzip"
    : basename.endsWith(".zip")
      ? "zip"
      : basename.endsWith(".tar")
        ? "tar"
        : basename.endsWith(".tgz")
          ? "gzip"
          : undefined;
  const withoutCompression = basename.endsWith(".tar.gz")
    ? basename.slice(0, -".tar.gz".length)
    : basename.endsWith(".tgz")
      ? basename.slice(0, -".tgz".length)
      : compression && basename.includes(".")
        ? basename.slice(0, basename.lastIndexOf("."))
        : basename;
  const extension = withoutCompression.includes(".")
    ? withoutCompression.slice(withoutCompression.lastIndexOf(".") + 1)
    : "";
  const format = extension || (basename.endsWith(".tar.gz") || basename.endsWith(".tgz") ? "tar" : undefined);

  return {
    ...(format ? { format } : {}),
    ...(compression ? { compression } : {}),
  };
}

function nonNegativeIntegerValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isInteger(value) && value >= 0) {
    return value;
  }

  if (typeof value === "string" && /^\d+$/u.test(value)) {
    return Number.parseInt(value, 10);
  }

  return null;
}

export class GcsObjectStorageClient implements ObjectStorageClient {
  private readonly storage: Storage;

  constructor(storage: Storage = new Storage()) {
    this.storage = storage;
  }

  async downloadPrefixToDirectory(uri: string, targetPath: string): Promise<ObjectStorageDownloadResult> {
    const parsed = parseGcsUri(uri);
    const prefix = parsed.prefix.length > 0 && !parsed.prefix.endsWith("/") ? `${parsed.prefix}/` : parsed.prefix;
    const [files] = await this.storage.bucket(parsed.bucket).getFiles({ prefix });
    let objectCount = 0;
    let totalBytes = 0;

    await fs.mkdir(targetPath, { recursive: true });

    for (const file of files) {
      const relativePath = file.name.slice(prefix.length).replace(/^\/+/, "");

      if (!relativePath) {
        continue;
      }

      const destination = path.join(targetPath, relativePath);

      if (!isPathInside(targetPath, destination)) {
        throw new Error(`GCS object path escapes target directory: ${file.name}`);
      }

      await fs.mkdir(path.dirname(destination), { recursive: true });
      await file.download({ destination });
      objectCount += 1;
      totalBytes += Number(file.metadata.size ?? 0);
    }

    return { objectCount, totalBytes };
  }
}

function preparedMount(
  mount: VmSessionDatasetMount,
  source: string,
  target: string,
  sourceUri: string
): PreparedDatasetMount {
  return {
    source,
    target,
    readOnly: true,
    datasetVersionId: mount.datasetVersionId,
    name: mount.name,
    versionLabel: mount.versionLabel,
    sizeBytes: mount.sizeBytes ?? null,
    sourceUri,
    manifestChecksumSha256: mount.manifestChecksumSha256 ?? null,
  };
}

function promotionCacheKey(mount: VmSessionDatasetMount): string {
  return JSON.stringify({
    datasetVersionId: mount.datasetVersionId,
    manifestChecksumSha256: mount.manifestChecksumSha256 ?? null,
    required: mount.required,
    locations: mount.locations.map((location) => ({
      kind: location.kind,
      tier: location.tier,
      uri: location.uri,
      storageClass: location.storageClass ?? null,
    })),
  });
}

function normalizeContainerDatasetPath(value: string): string {
  const normalized = path.posix.normalize(value);

  if (!normalized.startsWith("/datasets/") || normalized.includes("/../")) {
    throw new Error(`Dataset container path must stay under /datasets: ${value}`);
  }

  return normalized;
}

function safePathSegment(value: string): string {
  return value.replace(/[^A-Za-z0-9_.-]+/g, "-").replace(/^-+/, "").slice(0, 120) || "dataset";
}

function localPathFromUri(uri: string): string {
  return uri.startsWith("file://") ? fileURLToPath(uri) : uri;
}

function parseGcsUri(uri: string): { bucket: string; prefix: string } {
  if (!uri.startsWith("gs://")) {
    throw new Error(`GCS URI must start with gs://: ${uri}`);
  }

  const withoutScheme = uri.slice("gs://".length);
  const slashIndex = withoutScheme.indexOf("/");
  const bucket = slashIndex === -1 ? withoutScheme : withoutScheme.slice(0, slashIndex);
  const prefix = slashIndex === -1 ? "" : withoutScheme.slice(slashIndex + 1).replace(/^\/+/, "");

  if (!bucket) {
    throw new Error(`GCS URI must include a bucket: ${uri}`);
  }

  return { bucket, prefix };
}

async function readMarker(cachePath: string): Promise<CacheMarker | null> {
  try {
    const content = await fs.readFile(path.join(cachePath, DatasetCacheMarkerFileName), "utf8");
    const parsed = JSON.parse(content) as Partial<CacheMarker>;

    if (typeof parsed.datasetVersionId === "string" && typeof parsed.sourceUri === "string") {
      return {
        datasetVersionId: parsed.datasetVersionId,
        sourceUri: parsed.sourceUri,
        manifestChecksumSha256:
          typeof parsed.manifestChecksumSha256 === "string" ? parsed.manifestChecksumSha256 : null,
        preparedAt: typeof parsed.preparedAt === "string" ? parsed.preparedAt : "",
      };
    }

    return null;
  } catch {
    return null;
  }
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

async function assertSafeDirectory(targetPath: string): Promise<void> {
  const stat = await fs.lstat(targetPath);

  if (!stat.isDirectory() || stat.isSymbolicLink()) {
    throw new Error(`Dataset source is not a safe directory: ${targetPath}`);
  }
}

async function assertNoSymlinks(rootPath: string): Promise<void> {
  const entries = await fs.readdir(rootPath, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(rootPath, entry.name);

    if (entry.isSymbolicLink()) {
      throw new Error(`Dataset promotion contains a symlink: ${entryPath}`);
    }

    if (entry.isDirectory()) {
      await assertNoSymlinks(entryPath);
    }
  }
}

async function chmodReadableTree(rootPath: string): Promise<{ fileCount: number; directoryCount: number }> {
  let fileCount = 0;
  let directoryCount = 0;

  async function visit(currentPath: string): Promise<void> {
    const stats = await fs.lstat(currentPath);

    if (stats.isSymbolicLink()) {
      throw new Error(`Dataset output contains a symlink: ${currentPath}`);
    }

    if (stats.isDirectory()) {
      directoryCount += 1;
      await chmodIfNeeded(currentPath, stats.mode | 0o555);

      const entries = await fs.readdir(currentPath, { withFileTypes: true });
      entries.sort((left, right) => left.name.localeCompare(right.name));
      for (const entry of entries) {
        await visit(path.join(currentPath, entry.name));
      }
      return;
    }

    if (stats.isFile()) {
      fileCount += 1;
      const executableBits = stats.mode & 0o111 ? 0o111 : 0;
      await chmodIfNeeded(currentPath, stats.mode | 0o444 | executableBits);
      return;
    }

    throw new Error(`Dataset output contains an unsupported path type: ${currentPath}`);
  }

  await visit(rootPath);
  return { fileCount, directoryCount };
}

async function inspectReadableTree(rootPath: string): Promise<{ fileCount: number; directoryCount: number }> {
  let fileCount = 0;
  let directoryCount = 0;

  async function visit(currentPath: string): Promise<void> {
    const stats = await fs.lstat(currentPath);

    if (stats.isSymbolicLink()) {
      throw new Error(`Dataset output contains a symlink: ${currentPath}`);
    }

    if (stats.isDirectory()) {
      directoryCount += 1;
      await fs.access(currentPath, fsConstants.R_OK | fsConstants.X_OK);
      const entries = await fs.readdir(currentPath, { withFileTypes: true });
      entries.sort((left, right) => left.name.localeCompare(right.name));
      for (const entry of entries) {
        await visit(path.join(currentPath, entry.name));
      }
      return;
    }

    if (stats.isFile()) {
      fileCount += 1;
      await fs.access(currentPath, fsConstants.R_OK);
      return;
    }

    throw new Error(`Dataset output contains an unsupported path type: ${currentPath}`);
  }

  await visit(rootPath);
  return { fileCount, directoryCount };
}

async function chmodIfNeeded(targetPath: string, mode: number): Promise<void> {
  const normalizedMode = mode & 0o7777;
  const currentMode = (await fs.lstat(targetPath)).mode & 0o7777;
  if (currentMode !== normalizedMode) {
    await fs.chmod(targetPath, normalizedMode);
  }
}

async function directoryDatasetInventory(rootPath: string): Promise<{
  files: string[];
  sizeBytes: number;
  totalFiles: number;
  truncated: boolean;
}> {
  const files: string[] = [];
  let sizeBytes = 0;
  let totalFiles = 0;

  async function visit(currentPath: string, includeInInventory: boolean): Promise<void> {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name));

    for (const entry of entries) {
      const entryPath = path.join(currentPath, entry.name);
      const entryIncludedInInventory = includeInInventory && !entry.name.startsWith(".yp-live-workflow-");

      if (entry.isSymbolicLink()) {
        throw new Error(`Dataset promotion contains a symlink: ${entryPath}`);
      }

      if (entry.isDirectory()) {
        await visit(entryPath, entryIncludedInInventory);
        continue;
      }

      if (entry.isFile()) {
        sizeBytes += (await fs.stat(entryPath)).size;
      }

      if (entryIncludedInInventory && entry.isFile()) {
        totalFiles += 1;
        if (files.length < MaxMountedFiles) {
          files.push(path.relative(rootPath, entryPath).replace(/\\/g, "/"));
        }
      }
    }
  }

  await visit(rootPath, true);
  return {
    files,
    sizeBytes,
    totalFiles,
    truncated: totalFiles > files.length,
  };
}

async function isRealPathInside(basePath: string, targetPath: string): Promise<boolean> {
  const [baseRealPath, targetRealPath] = await Promise.all([
    realpathOrNull(basePath),
    realpathOrNull(targetPath),
  ]);

  return Boolean(baseRealPath && targetRealPath && isPathInside(baseRealPath, targetRealPath));
}

async function realPathContainment(
  basePath: string,
  targetPath: string
): Promise<"inside" | "missing_inside" | "outside"> {
  const baseRealPath = await realpathOrNull(basePath);

  if (!baseRealPath) {
    return "outside";
  }

  const targetRealPath = await realpathOrNull(targetPath);

  if (targetRealPath) {
    return isPathInside(baseRealPath, targetRealPath) ? "inside" : "outside";
  }

  const ancestor = await nearestExistingAncestor(targetPath);
  if (!ancestor || !isPathInside(path.resolve(basePath), path.resolve(targetPath))) {
    return "outside";
  }

  const ancestorRealPath = await realpathOrNull(ancestor);
  return ancestorRealPath && isPathInside(baseRealPath, ancestorRealPath) ? "missing_inside" : "outside";
}

async function nearestExistingAncestor(targetPath: string): Promise<string | null> {
  let currentPath = path.resolve(targetPath);

  while (true) {
    if (await lstatOrNull(currentPath)) {
      return currentPath;
    }

    const parentPath = path.dirname(currentPath);
    if (parentPath === currentPath) {
      return null;
    }

    currentPath = parentPath;
  }
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

function isPathInside(basePath: string, targetPath: string): boolean {
  const relative = path.relative(path.resolve(basePath), path.resolve(targetPath));
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}
