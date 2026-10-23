import { type Json, type VmContainerDatasetMountSnapshot, type VmContainerStatsSnapshot, type VmSessionStartPayload, type WorkspacePreparedLayout } from "../../contracts/index.js";
import { type CodexAppServerExit, type CodexAppServerLogSink, type CodexAppServerTransport, type CodexServerRequestMode } from "../codex/appServerTransport.js";
import type { PreparedDatasetMount } from "../datasets/datasetManager.js";
export type DockerCliResult = {
    exitCode: number | null;
    signal: NodeJS.Signals | null;
    stdout: string;
    stderr: string;
    timedOut: boolean;
    error?: Error;
};
export type DockerCliRunOptions = {
    timeoutMs?: number;
    stdin?: string;
};
export interface DockerCli {
    run(args: string[], options?: DockerCliRunOptions): Promise<DockerCliResult>;
}
export type DockerRuntimeProbeResult = {
    available: boolean;
    version?: string | null;
    error?: string | null;
};
export type DockerImageEnsureResult = {
    image: string;
    present: true;
    pulled: boolean;
};
export type DockerImagePolicyErrorCode = "codex_container_image_missing" | "codex_container_image_invalid" | "codex_container_image_disallowed" | "codex_container_image_not_present";
export declare class DockerImagePolicyError extends Error {
    readonly code: DockerImagePolicyErrorCode;
    constructor(code: DockerImagePolicyErrorCode, message: string);
}
export declare class DockerRuntimeUnavailableError extends Error {
    constructor(message: string);
}
export declare class DockerAuxTerminalTargetError extends Error {
    constructor(message: string);
}
export declare class DockerPreviousArtifactMountValidationError extends Error {
    constructor(message: string);
}
export declare class DockerReviewEvidenceMountValidationError extends Error {
    constructor(message: string);
}
export type DockerImagePreflightStatus = "pending" | "present" | "pulled" | "failed";
export type DockerContainerSession = {
    sessionId: string;
    commandId: string;
    runId: string;
    runStepId: string;
    nodeId: string;
    workspaceId: string;
    vmHostId: string;
    containerName: string;
    containerImage: string;
    containerRuntime: string | null;
    dockerRuntimeMode: DockerRuntimeMode;
    privileged: boolean;
    networkMode: string;
    securityHardening: DockerSecurityHardening;
    status: DockerContainerLifecycleStatus;
    rootPath: string;
    layout: WorkspacePreparedLayout;
    archivePath?: string | null;
    datasetMounts: VmContainerDatasetMountSnapshot[];
    imagePreflightStatus: DockerImagePreflightStatus;
    imagePreflightAt?: string | null;
    imagePreflightError?: string | null;
    startedAt?: string | null;
    runningAt?: string | null;
    stoppedAt?: string | null;
    archivedAt?: string | null;
    lastObservedAt: string;
    exitCode?: number | null;
    signal?: string | null;
    error?: string | null;
};
export type DockerAuxTerminalTarget = {
    runtime: "container";
    command: string;
    args: string[];
    displayCwd: string;
    shell: string;
};
export type DockerContainerLifecycleStatus = "preflighting" | "starting" | "running" | "paused" | "stopping" | "stopped" | "archiving" | "archived" | "failed";
export type DockerOrphanContainerClassification = "active" | "stale" | "unknown";
export type DockerOrphanContainerRecord = {
    containerName: string;
    sessionId?: string | null;
    dockerState?: string | null;
    classification: DockerOrphanContainerClassification;
    stopped: boolean;
};
export type DockerOrphanCleanupResult = {
    mode: "scan" | "cleanup";
    scannedAt: string;
    stopped: number;
    containerNames: string[];
    containers: DockerOrphanContainerRecord[];
    error?: string | null;
};
export type DockerRuntimeStatus = {
    docker: DockerRuntimeProbeResult & {
        checkedAt?: string | null;
    };
    activeCodexSessions: number;
    sessionCountsByStatus: Record<string, number>;
    sessions: DockerContainerSession[];
    orphanCleanup: DockerOrphanCleanupResult | null;
};
export type DockerSecurityHardening = {
    capDrop: "ALL" | null;
    noNewPrivileges: boolean;
    init: true;
    pidsLimit: number;
    nofileSoft: number;
    nofileHard: number;
    readOnlyRootFilesystem: boolean;
};
export type DockerCodexAppServerTransportLaunchOptions = {
    command: string;
    args: string[];
    cwd: string;
    env: NodeJS.ProcessEnv;
    serverRequestMode?: CodexServerRequestMode;
    stderrLogSink?: CodexAppServerLogSink;
};
export type DockerCodexAppServerTransportFactory = (options: DockerCodexAppServerTransportLaunchOptions) => CodexAppServerTransport;
export type DockerCodexAppServerLaunchInput = {
    payload: VmSessionStartPayload;
    env: NodeJS.ProcessEnv;
    serverRequestMode?: CodexServerRequestMode;
    datasetMounts?: PreparedDatasetMount[];
    sensitiveHostPaths?: string[];
    durableCodexSessionsPath?: string;
    runtimeMetadata?: Record<string, Json>;
};
export type DockerCodexAppServerLaunch = {
    transport: CodexAppServerTransport;
    codexCwd: string;
    codexHomePath: string;
    networkMode?: string | null;
    runtimeMetadata: Record<string, Json>;
};
export type DockerRuntimeManagerOptions = {
    dockerBin?: string;
    defaultImage?: string;
    containerLdLibraryPath?: string;
    gpuMode?: DockerGpuMode;
    nvidiaDirectDevices?: string[];
    nvidiaDirectLibraryMounts?: string[];
    nvidiaDirectUtilityMounts?: string[];
    defaultNetworkMode?: string;
    cli?: DockerCli;
    transportFactory?: DockerCodexAppServerTransportFactory;
    probeTimeoutMs?: number;
    imageInspectTimeoutMs?: number;
    imagePullTimeoutMs?: number;
    containerStopTimeoutMs?: number;
    allowedImages?: string[];
    allowUnlistedImages?: boolean;
    containerRuntime?: string;
    hostPlatform?: NodeJS.Platform;
    runUser?: string | null;
    archiveRoot?: string;
    workspaceRootPath?: string;
    datasetsHotRootPath?: string;
    registryCredentials?: DockerRegistryCredentials | null;
    appServerStderrLogMaxBytes?: number;
    auxTerminalShellProbeTimeoutMs?: number;
    dropAllCapabilities?: boolean;
    noNewPrivileges?: boolean;
    maxCodexSessions?: number;
    now?: () => Date;
};
export type DockerRegistryCredentials = {
    registry: string;
    username: string;
    token: string;
};
export declare const OfficialCodexAppServerImage = "yp-live-workflow/codex-runtime:1";
export type DockerRuntimeMode = "explicit_runtime" | "linux_sysbox" | "macos_privileged_dind" | "sysbox_default";
export type DockerGpuMode = "docker_gpus" | "nvidia_direct";
export declare class DockerRuntimeManager {
    private readonly dockerBin;
    private readonly defaultImage?;
    private readonly containerLdLibraryPath?;
    private readonly gpuMode;
    private readonly nvidiaDirectDevices;
    private readonly nvidiaDirectLibraryMounts;
    private readonly nvidiaDirectUtilityMounts;
    private readonly defaultNetworkMode;
    private readonly cli;
    private readonly transportFactory;
    private readonly probeTimeoutMs;
    private readonly imageInspectTimeoutMs;
    private readonly imagePullTimeoutMs;
    private readonly containerStopTimeoutMs;
    private readonly allowedImages;
    private readonly allowUnlistedImages;
    private readonly containerRuntime;
    private readonly dockerRuntimeMode;
    private readonly privileged;
    private readonly forceNoGpus;
    private readonly hostPlatform;
    private readonly runUser;
    private readonly archiveRoot?;
    private readonly workspaceRootPath?;
    private readonly datasetsHotRootPath?;
    private readonly registryCredentials;
    private readonly appServerStderrLogMaxBytes;
    private readonly auxTerminalShellProbeTimeoutMs;
    private readonly dropAllCapabilities;
    private readonly noNewPrivileges;
    private readonly maxCodexSessions;
    private readonly now;
    private readonly sessions;
    private readonly sensitiveHostPathsBySession;
    private readonly evidenceMountsBySession;
    private lastProbe;
    private lastOrphanCleanup;
    constructor(options?: DockerRuntimeManagerOptions);
    probe(): Promise<DockerRuntimeProbeResult>;
    ensureImage(image?: string): Promise<DockerImageEnsureResult>;
    private loginForImage;
    preflightSessionImage(payload: VmSessionStartPayload): Promise<DockerImageEnsureResult>;
    createCodexAppServerTransport(input: DockerCodexAppServerLaunchInput): DockerCodexAppServerLaunch;
    private dockerPolicyFor;
    markSessionRunning(sessionId: string): void;
    markSessionPaused(sessionId: string): void;
    beginSessionActivation(sessionId: string): {
        rollback: () => void;
    };
    markSessionFailed(sessionId: string, error: unknown): void;
    removeSessionContainerNameBeforeRelaunch(sessionId: string): Promise<void>;
    listSessions(): DockerContainerSession[];
    /**
     * CPU/memory usage for the running session containers, for telemetry. A
     * stats failure (e.g. a container that exited mid-call) reports no stats
     * rather than failing the telemetry tick; the next tick retries.
     */
    collectContainerStats(options?: {
        timeoutMs?: number;
    }): Promise<VmContainerStatsSnapshot[]>;
    getSession(sessionId: string): DockerContainerSession | null;
    resolveSessionEvidenceFile(sessionId: string, containerPath: string): {
        relativePath: string;
        rootPath: string;
    };
    prepareSessionCodexHomeAuthMaterialForHostRead(sessionId: string): Promise<boolean>;
    backupSessionChatGptAuthMaterial(sessionId: string): Promise<boolean>;
    restoreSessionChatGptAuthMaterialBackup(sessionId: string): Promise<boolean>;
    normalizeDatasetOutputInContainer(input: {
        sessionId: string;
        containerPath: string;
        timeoutMs?: number;
    }): Promise<void>;
    normalizeArtifactOutputInContainer(input: {
        sessionId: string;
        timeoutMs?: number;
    }): Promise<boolean>;
    makeArtifactDirectoryWritableInContainer(input: {
        sessionId: string;
        containerPath: string;
        timeoutMs?: number;
    }): Promise<boolean>;
    terminateSession(sessionId: string): Promise<DockerContainerSession | null>;
    archiveSession(sessionId: string): Promise<DockerContainerSession | null>;
    createAuxTerminalTarget(session: DockerContainerSession, options?: {
        preferredShell?: string;
    }): Promise<DockerAuxTerminalTarget>;
    cleanupOrphans(): Promise<DockerOrphanCleanupResult>;
    scanOrphans(): Promise<DockerOrphanCleanupResult>;
    getStatus(): DockerRuntimeStatus;
    private stopSessionContainer;
    private removeSessionContainerName;
    private resolveAuxTerminalShell;
    markSessionExited(sessionId: string, exit: CodexAppServerExit): void;
    private scanOrphanContainers;
    private updateSession;
    private setSession;
    private setSensitiveHostPaths;
    private setSessionEvidenceMounts;
    private clearSessionEvidenceMounts;
    private cleanupSensitiveHostPaths;
    private prepareSessionCodexHomeForHostCleanup;
    private sessionCountsByStatus;
    private assertSessionCapacity;
    private activeSessionCount;
    private activeOrphanCount;
    private timestamp;
    resolveImage(image?: string | null): string;
}
export declare class SpawnDockerCli implements DockerCli {
    private readonly dockerBin;
    constructor(dockerBin?: string);
    run(args: string[], options?: DockerCliRunOptions): Promise<DockerCliResult>;
}
export declare function runUserForHostIdentity(uid: number, gid: number): string | null;
