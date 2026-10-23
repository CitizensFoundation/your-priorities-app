import fs from "node:fs/promises";
import path from "node:path";
export async function collectContainerStorageSnapshot(input, options = {}) {
    const writableMounts = await Promise.all(input.writableMounts.map((mount) => collectWritableMount(mount, options)));
    const datasetMounts = (input.datasetMounts ?? []).map((mount) => ({ ...mount }));
    return {
        ...(writableMounts.length > 0 ? { writableMounts } : {}),
        ...(datasetMounts.length > 0 ? { datasetMounts } : {}),
    };
}
async function collectWritableMount(mount, options) {
    const snapshot = {
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
    }
    catch (error) {
        snapshot.error = isNotFoundError(error) ? "not_found" : "scan_failed";
    }
    try {
        const stats = await statfs(options, mount.hostPath);
        snapshot.totalBytes = stats.blocks * stats.bsize;
        snapshot.availableBytes = stats.bavail * stats.bsize;
    }
    catch {
        // Capacity is useful but best-effort; a usage result is still worth showing.
    }
    return snapshot;
}
export async function directoryUsageBytes(rootPath, options = {}) {
    return (await directoryUsageSnapshot(rootPath, options)).usedBytes;
}
export async function directoryUsageSnapshot(rootPath, options = {}) {
    const context = usageContext(options);
    const usedBytes = await visitUsagePath(rootPath, context);
    return {
        usedBytes,
        truncated: context.truncated,
        visitedEntries: context.visitedEntries,
    };
}
async function visitUsagePath(targetPath, context) {
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
function usageContext(options) {
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
function budgetExceeded(context) {
    return context.visitedEntries >= context.maxEntries || context.now() > context.deadlineMs;
}
async function lstat(options, targetPath) {
    return options.lstat ? options.lstat(targetPath) : fs.lstat(targetPath);
}
async function* directoryEntries(options, targetPath) {
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
async function statfs(options, targetPath) {
    return options.statfs ? options.statfs(targetPath) : fs.statfs(targetPath);
}
function safeSize(stats) {
    return Number.isFinite(stats.size) && stats.size > 0 ? stats.size : 0;
}
function isNotFoundError(error) {
    return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}
