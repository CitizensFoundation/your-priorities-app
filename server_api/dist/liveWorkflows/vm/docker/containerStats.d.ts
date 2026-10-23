import type { VmContainerStatsSnapshot } from "../../contracts/index.js";
export type DockerStatsTarget = {
    containerName: string;
    sessionId?: string | null;
    runId?: string | null;
};
export declare function dockerStatsArgs(containerNames: string[]): string[];
/**
 * Parses `docker stats --no-stream --format '{{json .}}'` output (one JSON
 * object per line) into telemetry snapshots, keeping only the requested
 * containers and tagging each with its session/run.
 */
export declare function parseDockerStatsOutput(stdout: string, targets: DockerStatsTarget[]): VmContainerStatsSnapshot[];
export declare function parseByteSize(value: string): number | null;
