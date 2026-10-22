import fs from "node:fs/promises";
import path from "node:path";
import type {
  VmContainerDatasetMountSnapshot,
  VmContainerStorageSnapshot,
  VmContainerWritableMountSnapshot,
} from "../../contracts/index.js";

export type ContainerWritableMountSource = {
  hostPath: string;
  containerPath: string;
  role: string;
};

export type ContainerStorageProbeOptions = {
  lstat?: (targetPath: string) => Promise<FsStatLike>;
  readdir?: (targetPath: string) => Promise<FsDirentLike[]>;
  statfs?: (targetPath: string) => Promise<{ blocks: number; bsize: number; bavail: number }>;
  maxEntries?: number;
  maxElapsedMs?: number;
  now?: () => number;
};

type FsStatLike = {
  size: number;
  isDirectory(): boolean;
};

type FsDirentLike = {
  name: string;
};

export type DirectoryUsageSnapshot = {
  usedBytes: number;
  truncated: boolean;
  visitedEntries: number;
};

export async function collectContainerStorageSnapshot(
  input: {
    writableMounts: ContainerWritableMountSource[];
    datasetMounts?: VmContainerDatasetMountSnapshot[];
  },
  options: ContainerStorageProbeOptions = {}
): Promise<VmContainerStorageSnapshot> {
  const writableMounts = await Promise.all(
    input.writableMounts.map((mount) => collectWritableMount(mount, options))
  );
  const datasetMounts = (input.datasetMounts ?? []).map((mount) => ({ ...mount }));

  return {
    ...(writableMounts.length > 0 ? { writableMounts } : {}),
    ...(datasetMounts.length > 0 ? { datasetMounts } : {}),
  };
}

async function collectWritableMount(
  mount: ContainerWritableMountSource,
  options: ContainerStorageProbeOptions
): Promise<VmContainerWritableMountSnapshot> {
  const snapshot: VmContainerWritableMountSnapshot = {
    containerPath: mount.containerPath,
    role: mount.role,
    readOnly: false,
  };

  try {
    const usage = await directoryUsageSnapshot(mount.hostPath, options);
    snapshot.usedBytes = usage.usedBytes;
    if (usage.truncated) {
      snapshot.truncated = true;
      snapshot.error = "scan_limited";
    }
  } catch (error) {
    snapshot.error = isNotFoundError(error) ? "not_found" : "scan_failed";
  }

  try {
    const stats = await statfs(options, mount.hostPath);
    snapshot.totalBytes = stats.blocks * stats.bsize;
    snapshot.availableBytes = stats.bavail * stats.bsize;
  } catch {
    // Capacity is useful but best-effort; a usage result is still worth showing.
  }

  return snapshot;
}

export async function directoryUsageBytes(
  rootPath: string,
  options: ContainerStorageProbeOptions = {}
): Promise<number> {
  return (await directoryUsageSnapshot(rootPath, options)).usedBytes;
}

export async function directoryUsageSnapshot(
  rootPath: string,
  options: ContainerStorageProbeOptions = {}
): Promise<DirectoryUsageSnapshot> {
  const context = usageContext(options);
  const usedBytes = await visitUsagePath(rootPath, context);

  return {
    usedBytes,
    truncated: context.truncated,
    visitedEntries: context.visitedEntries,
  };
}

type DirectoryUsageContext = {
  options: ContainerStorageProbeOptions;
  deadlineMs: number;
  maxEntries: number;
  now: () => number;
  visitedEntries: number;
  truncated: boolean;
};

async function visitUsagePath(targetPath: string, context: DirectoryUsageContext): Promise<number> {
  if (budgetExceeded(context)) {
    context.truncated = true;
    return 0;
  }

  context.visitedEntries += 1;
  const stats = await lstat(context.options, targetPath);

  if (!stats.isDirectory()) {
    return safeSize(stats);
  }

  let total = 0;

  for await (const entry of directoryEntries(context.options, targetPath)) {
    if (budgetExceeded(context)) {
      context.truncated = true;
      break;
    }

    total += await visitUsagePath(path.join(targetPath, entry.name), context);
  }

  return total;
}

function usageContext(options: ContainerStorageProbeOptions): DirectoryUsageContext {
  const now = options.now ?? Date.now;
  const maxElapsedMs = options.maxElapsedMs !== undefined ? Math.max(1, options.maxElapsedMs) : undefined;

  return {
    options,
    deadlineMs: maxElapsedMs !== undefined ? now() + maxElapsedMs : Number.POSITIVE_INFINITY,
    maxEntries: options.maxEntries !== undefined ? Math.max(1, options.maxEntries) : Number.POSITIVE_INFINITY,
    now,
    visitedEntries: 0,
    truncated: false,
  };
}

function budgetExceeded(context: DirectoryUsageContext): boolean {
  return context.visitedEntries >= context.maxEntries || context.now() > context.deadlineMs;
}

async function lstat(options: ContainerStorageProbeOptions, targetPath: string): Promise<FsStatLike> {
  return options.lstat ? options.lstat(targetPath) : fs.lstat(targetPath);
}

async function* directoryEntries(
  options: ContainerStorageProbeOptions,
  targetPath: string
): AsyncGenerator<FsDirentLike> {
  if (options.readdir) {
    for (const entry of await options.readdir(targetPath)) {
      yield entry;
    }
    return;
  }

  const directory = await fs.opendir(targetPath);

  for await (const entry of directory) {
    yield entry;
  }
}

async function statfs(
  options: ContainerStorageProbeOptions,
  targetPath: string
): Promise<{ blocks: number; bsize: number; bavail: number }> {
  return options.statfs ? options.statfs(targetPath) : fs.statfs(targetPath);
}

function safeSize(stats: FsStatLike): number {
  return Number.isFinite(stats.size) && stats.size > 0 ? stats.size : 0;
}

function isNotFoundError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}
