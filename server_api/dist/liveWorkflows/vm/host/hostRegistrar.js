const DisabledRuntimeCapabilities = {
    docker: false,
    codexAppServer: false,
};
export class HostRegistrar {
    constructor() {
        this.supportsWorkspacePreparation = true;
    }
    createRegistrationPayload(input) {
        return {
            ...(input.vmHostId ? { vmHostId: input.vmHostId } : {}),
            name: input.config.name,
            capabilities: this.capabilities(input.controlBaseUrl, input.runtimeCapabilities),
            metadata: this.metadata(input.config, input.controlBaseUrl, input.runtimeCapabilities, input.sessionCapacity),
            volumes: input.snapshot.volumes,
            system: input.snapshot.system,
        };
    }
    createHeartbeatPayload(input) {
        return {
            vmHostId: input.vmHostId,
            status: input.status,
            capabilities: this.capabilities(input.controlBaseUrl, input.runtimeCapabilities),
            metadata: this.metadata(input.config, input.controlBaseUrl, input.runtimeCapabilities, input.sessionCapacity),
        };
    }
    createTelemetryPayload(input) {
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
    capabilities(controlBaseUrl, runtimeCapabilities = DisabledRuntimeCapabilities) {
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
    metadata(config, controlBaseUrl = config.controlBaseUrl, runtimeCapabilities = DisabledRuntimeCapabilities, sessionCapacity = defaultSessionCapacity(config)) {
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
function defaultSessionCapacity(config) {
    return {
        maxCodexSessions: config.maxCodexSessions,
        activeCodexSessions: 0,
        sessionCountsByStatus: {},
    };
}
