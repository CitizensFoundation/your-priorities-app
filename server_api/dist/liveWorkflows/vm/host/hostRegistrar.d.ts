import type { Json, VmContainerStatsSnapshot, VmHeartbeatPayload, VmRegisterPayload, VmTelemetryPayload } from "../../contracts/index.js";
import type { VmAgentConfig } from "../config.js";
import type { VmTelemetrySnapshot } from "../metrics/metricsReporter.js";
export type VmAgentRuntimeCapabilities = {
    docker: boolean;
    codexAppServer: boolean;
    gpu?: boolean;
    auxTerminal?: boolean;
    dockerVersion?: string | null;
};
export type VmAgentSessionCapacity = {
    maxCodexSessions: number;
    activeCodexSessions: number;
    sessionCountsByStatus: Record<string, number>;
};
export declare class HostRegistrar {
    readonly supportsWorkspacePreparation = true;
    createRegistrationPayload(input: {
        config: VmAgentConfig;
        snapshot: VmTelemetrySnapshot;
        vmHostId?: string;
        controlBaseUrl?: string;
        runtimeCapabilities?: VmAgentRuntimeCapabilities;
        sessionCapacity?: VmAgentSessionCapacity;
    }): VmRegisterPayload;
    createHeartbeatPayload(input: {
        config: VmAgentConfig;
        vmHostId: string;
        status: string;
        controlBaseUrl?: string;
        runtimeCapabilities?: VmAgentRuntimeCapabilities;
        sessionCapacity?: VmAgentSessionCapacity;
    }): VmHeartbeatPayload;
    createTelemetryPayload(input: {
        config: VmAgentConfig;
        vmHostId: string;
        snapshot: VmTelemetrySnapshot;
        containers?: VmContainerStatsSnapshot[];
        controlBaseUrl?: string;
        runtimeCapabilities?: VmAgentRuntimeCapabilities;
        sessionCapacity?: VmAgentSessionCapacity;
    }): VmTelemetryPayload;
    capabilities(controlBaseUrl?: string, runtimeCapabilities?: VmAgentRuntimeCapabilities): Record<string, Json>;
    metadata(config: VmAgentConfig, controlBaseUrl?: string | undefined, runtimeCapabilities?: VmAgentRuntimeCapabilities, sessionCapacity?: VmAgentSessionCapacity): Record<string, Json>;
}
