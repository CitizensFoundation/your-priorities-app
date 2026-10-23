import type { VmContainerDatasetMountSnapshot, VmContainerStorageSnapshot } from "../../contracts/index.js";
export type ContainerWritableMountSource = {
    hostPath: string;
    containerPath: string;
    role: string;
};
export type ContainerStorageProbeOptions = {
    lstat?: (targetPath: string) => Promise<FsStatLike>;
    readdir?: (targetPath: string) => Promise<FsDirentLike[]>;
    statfs?: (targetPath: string) => Promise<{
        blocks: number;
        bsize: number;
        bavail: number;
    }>;
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
export declare function collectContainerStorageSnapshot(input: {
    writableMounts: ContainerWritableMountSource[];
    datasetMounts?: VmContainerDatasetMountSnapshot[];
}, options?: ContainerStorageProbeOptions): Promise<VmContainerStorageSnapshot>;
export declare function directoryUsageBytes(rootPath: string, options?: ContainerStorageProbeOptions): Promise<number>;
export declare function directoryUsageSnapshot(rootPath: string, options?: ContainerStorageProbeOptions): Promise<DirectoryUsageSnapshot>;
export {};
