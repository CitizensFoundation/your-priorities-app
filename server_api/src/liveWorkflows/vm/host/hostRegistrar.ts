import type {
  Json,
  VmContainerStatsSnapshot,
  VmHeartbeatPayload,
  VmRegisterPayload,
  VmTelemetryPayload,
} from "../../contracts/index.js";
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

const DisabledRuntimeCapabilities: VmAgentRuntimeCapabilities = {
  docker: false,
  codexAppServer: false,
};

export class HostRegistrar {
  readonly supportsWorkspacePreparation = true;

  createRegistrationPayload(input: {
    config: VmAgentConfig;
    snapshot: VmTelemetrySnapshot;
    vmHostId?: string;
    controlBaseUrl?: string;
    runtimeCapabilities?: VmAgentRuntimeCapabilities;
    sessionCapacity?: VmAgentSessionCapacity;
  }): VmRegisterPayload {
    return {
      ...(input.vmHostId ? { vmHostId: input.vmHostId } : {}),
      name: input.config.name,
      capabilities: this.capabilities(input.controlBaseUrl, input.runtimeCapabilities),
      metadata: this.metadata(input.config, input.controlBaseUrl, input.runtimeCapabilities, input.sessionCapacity),
      volumes: input.snapshot.volumes,
      system: input.snapshot.system,
    };
  }

  createHeartbeatPayload(input: {
    config: VmAgentConfig;
    vmHostId: string;
    status: string;
    controlBaseUrl?: string;
    runtimeCapabilities?: VmAgentRuntimeCapabilities;
    sessionCapacity?: VmAgentSessionCapacity;
  }): VmHeartbeatPayload {
    return {
      vmHostId: input.vmHostId,
      status: input.status,
      capabilities: this.capabilities(input.controlBaseUrl, input.runtimeCapabilities),
      metadata: this.metadata(input.config, input.controlBaseUrl, input.runtimeCapabilities, input.sessionCapacity),
    };
  }

  createTelemetryPayload(input: {
    config: VmAgentConfig;
    vmHostId: string;
    snapshot: VmTelemetrySnapshot;
    containers?: VmContainerStatsSnapshot[];
    controlBaseUrl?: string;
    runtimeCapabilities?: VmAgentRuntimeCapabilities;
    sessionCapacity?: VmAgentSessionCapacity;
  }): VmTelemetryPayload {
    return {
      vmHostId: input.vmHostId,
      telemetry: input.snapshot.telemetry,
      volumes: input.snapshot.volumes,
      capabilities: this.capabilities(input.controlBaseUrl, input.runtimeCapabilities),
      metadata: this.metadata(input.config, input.controlBaseUrl, input.runtimeCapabilities, input.sessionCapacity),
      system: input.snapshot.system,
      ...(input.containers && input.containers.length > 0 ? { containers: input.containers } : {}),
    };
  }

  capabilities(
    controlBaseUrl?: string,
    runtimeCapabilities: VmAgentRuntimeCapabilities = DisabledRuntimeCapabilities
  ): Record<string, Json> {
    return {
      hostTelemetry: true,
      workspacePreparation: Boolean(controlBaseUrl),
      workspaceFileRead: Boolean(controlBaseUrl),
      docker: runtimeCapabilities.docker,
      codexAppServer: Boolean(controlBaseUrl) && runtimeCapabilities.codexAppServer,
      datasetHotCache: Boolean(controlBaseUrl) && runtimeCapabilities.codexAppServer,
      auxTerminal: Boolean(controlBaseUrl) && runtimeCapabilities.auxTerminal === true,
      artifactCollection: Boolean(controlBaseUrl) && runtimeCapabilities.codexAppServer,
      gpu: runtimeCapabilities.gpu === true,
    };
  }

  metadata(
    config: VmAgentConfig,
    controlBaseUrl = config.controlBaseUrl,
    runtimeCapabilities: VmAgentRuntimeCapabilities = DisabledRuntimeCapabilities,
    sessionCapacity: VmAgentSessionCapacity = defaultSessionCapacity(config)
  ): Record<string, Json> {
    const capacity = {
      maxCodexSessions: sessionCapacity.maxCodexSessions,
      activeCodexSessions: sessionCapacity.activeCodexSessions,
      availableCodexSessions: Math.max(0, sessionCapacity.maxCodexSessions - sessionCapacity.activeCodexSessions),
      sessionCountsByStatus: sessionCapacity.sessionCountsByStatus,
    };

    return {
      workspaceRoot: config.workspaceRoot,
      archiveRoot: config.archiveRoot,
      datasetsHotRoot: config.datasetsHotRoot,
      runtime: "yp-live-workflow-vm-agent",
      docker: {
        available: runtimeCapabilities.docker,
        version: runtimeCapabilities.dockerVersion ?? null,
        defaultContainerImage: config.codexContainerImage ?? null,
        allowedImages: config.codexAllowedImages ?? null,
      },
      ...(controlBaseUrl
        ? {
            vmAgent: {
              controlBaseUrl,
              workspaceRoot: config.workspaceRoot,
              archiveRoot: config.archiveRoot,
              datasetsHotRoot: config.datasetsHotRoot,
              capacity,
              docker: {
                available: runtimeCapabilities.docker,
                version: runtimeCapabilities.dockerVersion ?? null,
                defaultContainerImage: config.codexContainerImage ?? null,
                allowedImages: config.codexAllowedImages ?? null,
              },
            },
          }
        : {}),
    };
  }
}

function defaultSessionCapacity(config: VmAgentConfig): VmAgentSessionCapacity {
  return {
    maxCodexSessions: config.maxCodexSessions,
    activeCodexSessions: 0,
    sessionCountsByStatus: {},
  };
}
