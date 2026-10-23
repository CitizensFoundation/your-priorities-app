import os from "node:os";
import type { Json, VmGpuTelemetrySnapshot, VmHostSystemSnapshot, VmHostVolumeSnapshot } from "../../contracts/index.js";
export type VmTelemetrySnapshot = {
    system: VmHostSystemSnapshot;
    telemetry: Record<string, Json>;
    volumes: VmHostVolumeSnapshot[];
};
export type MetricsReporterOptions = {
    hostname?: () => string;
    platform?: () => NodeJS.Platform;
    arch?: () => string;
    cpus?: () => os.CpuInfo[];
    loadavg?: () => number[];
    uptime?: () => number;
    totalmem?: () => number;
    freemem?: () => number;
    statfs?: (path: string) => Promise<{
        blocks: number;
        bsize: number;
        bavail: number;
    }>;
    gpuProbe?: () => Promise<string>;
};
export declare class MetricsReporter {
    readonly reportsCpuMemoryDisk = true;
    private readonly probes;
    constructor(options?: MetricsReporterOptions);
    collectSnapshot(input: {
        workspaceRoot: string;
        archiveRoot: string;
    }): Promise<VmTelemetrySnapshot>;
    private collectGpu;
    private collectVolumes;
    private collectVolume;
}
export declare function parseNvidiaSmiOutput(output: string): VmGpuTelemetrySnapshot;
