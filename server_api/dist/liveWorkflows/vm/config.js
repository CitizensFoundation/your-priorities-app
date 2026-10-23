import os from "node:os";
import path from "node:path";
import { ArtifactCollectionMaxFilesEnv, ArtifactCollectionMaxFileBytesEnv, ArtifactCollectionMaxTotalBytesEnv, DefaultArtifactCollectionMaxFileBytes, ArtifactUploadMaxBytesEnv, DefaultArtifactCollectionMaxFiles, DefaultArtifactCollectionMaxTotalBytes, DefaultArtifactUploadMaxBytes, } from "./artifacts/artifactLimits.js";
import { DefaultCodexAppServerArgs } from "./codex/codexAppServerDefaults.js";
import { defaultCodexCommand } from "./codex/codexBinary.js";
import { OfficialCodexAppServerImage } from "./docker/dockerRuntimeManager.js";
export function loadVmAgentConfig(env = process.env) {
    const apiBaseUrl = requiredEnv(env, "YP_LIVE_WORKFLOW_API_BASE_URL");
    const controlBaseUrl = optionalEnv(env, "YP_LIVE_WORKFLOW_VM_AGENT_CONTROL_BASE_URL");
    const controlHost = optionalEnv(env, "YP_LIVE_WORKFLOW_VM_AGENT_CONTROL_HOST") ?? hostFromControlBaseUrl(controlBaseUrl) ?? "127.0.0.1";
    const controlPort = optionalPositiveIntegerEnv(env, "YP_LIVE_WORKFLOW_VM_AGENT_CONTROL_PORT") ?? portFromControlBaseUrl(controlBaseUrl);
    const artifactBucket = optionalEnv(env, "YP_LIVE_WORKFLOW_ARTIFACT_BUCKET");
    const codexHostMode = optionalBooleanEnv(env, "YP_LIVE_WORKFLOW_CODEX_HOST_MODE") ?? false;
    return {
        apiBaseUrl,
        token: requiredEnv(env, "YP_LIVE_WORKFLOW_VM_AGENT_TOKEN"),
        brokerEnabled: optionalBooleanEnv(env, "YP_LIVE_WORKFLOW_VM_AGENT_BROKER_ENABLED") ?? true,
        brokerWsUrl: optionalEnv(env, "YP_LIVE_WORKFLOW_VM_AGENT_BROKER_WS_URL") ?? brokerWsUrlFromApiBaseUrl(apiBaseUrl),
        brokerReconnectMinMs: positiveIntegerEnv(env, "YP_LIVE_WORKFLOW_VM_AGENT_BROKER_RECONNECT_MIN_MS", 1000),
        brokerReconnectMaxMs: positiveIntegerEnv(env, "YP_LIVE_WORKFLOW_VM_AGENT_BROKER_RECONNECT_MAX_MS", 30000),
        vmHostId: optionalEnv(env, "YP_LIVE_WORKFLOW_VM_HOST_ID"),
        statePath: optionalEnv(env, "YP_LIVE_WORKFLOW_VM_AGENT_STATE_PATH") ??
            path.join(os.homedir(), ".yp-live-workflow", "vm-agent-state.json"),
        name: optionalEnv(env, "YP_LIVE_WORKFLOW_VM_NAME") ?? os.hostname(),
        workspaceRoot: optionalEnv(env, "YP_LIVE_WORKFLOW_VM_WORKSPACE_ROOT") ?? "/mnt/experiments",
        archiveRoot: optionalEnv(env, "YP_LIVE_WORKFLOW_VM_ARCHIVE_ROOT") ?? "/mnt/archive",
        datasetsHotRoot: optionalEnv(env, "YP_LIVE_WORKFLOW_VM_DATASETS_HOT_ROOT") ?? "/mnt/datasets-hot",
        datasetsLocalRoots: optionalCommaSeparatedEnv(env, "YP_LIVE_WORKFLOW_VM_DATASETS_LOCAL_ROOTS") ?? [],
        artifactBucket,
        artifactPrefix: optionalEnv(env, "YP_LIVE_WORKFLOW_ARTIFACT_PREFIX") ?? "artifacts",
        artifactUploadMaxBytes: positiveIntegerEnv(env, ArtifactUploadMaxBytesEnv, DefaultArtifactUploadMaxBytes),
        artifactUploadEnabled: optionalBooleanEnv(env, "YP_LIVE_WORKFLOW_ARTIFACT_UPLOAD_ENABLED") ?? (artifactBucket ? true : undefined),
        artifactCollectionMaxFiles: positiveIntegerEnv(env, ArtifactCollectionMaxFilesEnv, DefaultArtifactCollectionMaxFiles),
        artifactCollectionMaxFileBytes: positiveIntegerEnv(env, ArtifactCollectionMaxFileBytesEnv, DefaultArtifactCollectionMaxFileBytes),
        artifactCollectionMaxTotalBytes: positiveIntegerEnv(env, ArtifactCollectionMaxTotalBytesEnv, DefaultArtifactCollectionMaxTotalBytes),
        controlHost,
        controlPort,
        controlBaseUrl: controlBaseUrl ?? (controlPort !== undefined ? `http://${controlHost}:${controlPort}` : undefined),
        heartbeatIntervalMs: positiveIntegerEnv(env, "YP_LIVE_WORKFLOW_VM_HEARTBEAT_INTERVAL_MS", 15000),
        telemetryIntervalMs: positiveIntegerEnv(env, "YP_LIVE_WORKFLOW_VM_TELEMETRY_INTERVAL_MS", 15000),
        maxCodexSessions: positiveIntegerEnv(env, "YP_LIVE_WORKFLOW_VM_MAX_CODEX_SESSIONS", 8),
        consoleEventsEnabled: optionalBooleanEnv(env, "YP_LIVE_WORKFLOW_VM_CONSOLE_EVENTS") ?? false,
        dockerBin: optionalEnv(env, "YP_LIVE_WORKFLOW_DOCKER_BIN") ?? "docker",
        dockerRunUser: optionalEnv(env, "YP_LIVE_WORKFLOW_DOCKER_RUN_USER") ?? "0:0",
        dockerDropAllCapabilities: optionalBooleanEnv(env, "YP_LIVE_WORKFLOW_DOCKER_DROP_ALL_CAPABILITIES") ?? false,
        dockerNoNewPrivileges: optionalBooleanEnv(env, "YP_LIVE_WORKFLOW_DOCKER_NO_NEW_PRIVILEGES") ?? false,
        dockerRuntime: optionalEnv(env, "YP_LIVE_WORKFLOW_DOCKER_RUNTIME") ?? "sysbox-runc",
        dockerGpuMode: optionalDockerGpuModeEnv(env, "YP_LIVE_WORKFLOW_DOCKER_GPU_MODE"),
        dockerNvidiaDirectDevices: optionalCommaSeparatedEnv(env, "YP_LIVE_WORKFLOW_DOCKER_NVIDIA_DIRECT_DEVICES"),
        dockerNvidiaDirectLibraryMounts: optionalCommaSeparatedEnv(env, "YP_LIVE_WORKFLOW_DOCKER_NVIDIA_DIRECT_LIBRARY_MOUNTS"),
        dockerNvidiaDirectUtilityMounts: optionalCommaSeparatedEnv(env, "YP_LIVE_WORKFLOW_DOCKER_NVIDIA_DIRECT_UTILITY_MOUNTS"),
        codexContainerImage: optionalEnv(env, "YP_LIVE_WORKFLOW_CODEX_CONTAINER_IMAGE") ?? OfficialCodexAppServerImage,
        codexContainerLdLibraryPath: optionalEnv(env, "YP_LIVE_WORKFLOW_CODEX_CONTAINER_LD_LIBRARY_PATH"),
        codexAllowedImages: optionalCommaSeparatedEnv(env, "YP_LIVE_WORKFLOW_CODEX_ALLOWED_IMAGES"),
        codexCommand: optionalEnv(env, "YP_LIVE_WORKFLOW_CODEX_COMMAND") ?? (codexHostMode ? defaultCodexCommand() : undefined),
        codexArgs: optionalCommaSeparatedEnv(env, "YP_LIVE_WORKFLOW_CODEX_ARGS")
            ?? (codexHostMode ? [...DefaultCodexAppServerArgs] : undefined),
        codexServerRequestMode: optionalCodexServerRequestModeEnv(env, "YP_LIVE_WORKFLOW_CODEX_SERVER_REQUEST_MODE") ?? "defer",
        ghcrUsername: optionalEnv(env, "YP_LIVE_WORKFLOW_GHCR_USERNAME"),
        ghcrToken: optionalEnv(env, "YP_LIVE_WORKFLOW_GHCR_TOKEN"),
        dockerNetworkMode: optionalEnv(env, "YP_LIVE_WORKFLOW_DOCKER_NETWORK_MODE") ?? "bridge",
        auxTerminalEnabled: optionalBooleanEnv(env, "YP_LIVE_WORKFLOW_VM_AUX_TERMINAL_ENABLED") ?? false,
        auxTerminalShell: optionalEnv(env, "YP_LIVE_WORKFLOW_VM_AUX_TERMINAL_SHELL"),
        auxTerminalBacklogBytes: positiveIntegerEnv(env, "YP_LIVE_WORKFLOW_VM_AUX_TERMINAL_BACKLOG_BYTES", 262144),
    };
}
function requiredEnv(env, name) {
    const value = optionalEnv(env, name);
    if (!value) {
        throw new Error(`${name} is required`);
    }
    return value;
}
function optionalEnv(env, name) {
    const value = env[name]?.trim();
    return value ? value : undefined;
}
function optionalCommaSeparatedEnv(env, name) {
    const value = optionalEnv(env, name);
    if (!value) {
        return undefined;
    }
    const entries = value
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean);
    return entries.length > 0 ? entries : undefined;
}
function optionalBooleanEnv(env, name) {
    const value = optionalEnv(env, name);
    if (!value) {
        return undefined;
    }
    if (["1", "true", "yes", "on"].includes(value.toLowerCase())) {
        return true;
    }
    if (["0", "false", "no", "off"].includes(value.toLowerCase())) {
        return false;
    }
    throw new Error(`${name} must be a boolean`);
}
function optionalDockerGpuModeEnv(env, name) {
    const value = optionalEnv(env, name);
    if (!value) {
        return undefined;
    }
    if (value === "docker_gpus" || value === "nvidia_direct") {
        return value;
    }
    throw new Error(`${name} must be docker_gpus or nvidia_direct`);
}
function optionalCodexServerRequestModeEnv(env, name) {
    const value = optionalEnv(env, name);
    if (!value) {
        return undefined;
    }
    if (value === "defer" || value === "reject") {
        return value;
    }
    throw new Error(`${name} must be defer or reject`);
}
function positiveIntegerEnv(env, name, fallback) {
    const value = optionalEnv(env, name);
    if (!value) {
        return fallback;
    }
    const parsed = Number.parseInt(value, 10);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new Error(`${name} must be a positive integer`);
    }
    return parsed;
}
function optionalPositiveIntegerEnv(env, name) {
    const value = optionalEnv(env, name);
    if (!value) {
        return undefined;
    }
    const parsed = Number.parseInt(value, 10);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new Error(`${name} must be a positive integer`);
    }
    return parsed;
}
function hostFromControlBaseUrl(value) {
    if (!value) {
        return undefined;
    }
    return parseHttpControlUrl(value).hostname;
}
function portFromControlBaseUrl(value) {
    if (!value) {
        return undefined;
    }
    const url = parseHttpControlUrl(value);
    if (!url.port) {
        throw new Error("YP_LIVE_WORKFLOW_VM_AGENT_CONTROL_BASE_URL must include a port or set YP_LIVE_WORKFLOW_VM_AGENT_CONTROL_PORT");
    }
    return Number.parseInt(url.port, 10);
}
function parseHttpControlUrl(value) {
    const url = new URL(value);
    if (url.protocol !== "http:") {
        throw new Error("YP_LIVE_WORKFLOW_VM_AGENT_CONTROL_BASE_URL must use http");
    }
    return url;
}
function brokerWsUrlFromApiBaseUrl(value) {
    const url = new URL(value);
    if (url.protocol === "http:") {
        url.protocol = "ws:";
    }
    else if (url.protocol === "https:") {
        url.protocol = "wss:";
    }
    else {
        throw new Error("YP_LIVE_WORKFLOW_API_BASE_URL must use http or https");
    }
    url.pathname = "/api/live-workflows/vm/ws";
    url.search = "";
    url.hash = "";
    return url.toString();
}
