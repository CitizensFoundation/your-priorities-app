import { spawn } from "node:child_process";
import { lstatSync, realpathSync } from "node:fs";
import fs from "node:fs/promises";
import { platform as currentHostPlatform } from "node:os";
import path from "node:path";
import {
  normalizeSafeRelativePath,
  normalizeAgentRuntimeDockerPolicy,
  type AgentRuntimeDockerPolicy,
  type Json,
  type VmContainerDatasetMountSnapshot,
  type VmContainerStatsSnapshot,
  type VmPreviousArtifactMount,
  type VmReviewEvidenceMount,
  type VmSessionStartPayload,
  type WorkspacePreparedLayout,
} from "../../contracts/index.js";
import { collectContainerStorageSnapshot, type ContainerWritableMountSource } from "./containerStorage.js";
import { dockerStatsArgs, parseDockerStatsOutput } from "./containerStats.js";
import {
  BoundedFileLogSink,
  StdioCodexAppServerTransport,
  type CodexAppServerExit,
  type CodexAppServerLogSink,
  type CodexAppServerTransport,
  type CodexServerRequestMode,
  type JsonRpcError,
  type JsonRpcId,
  type JsonRpcMessage,
} from "../codex/appServerTransport.js";
import { DefaultCodexAppServerArgs } from "../codex/codexAppServerDefaults.js";
import { stringValue } from "../codex/jsonUtils.js";
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

export type DockerImagePolicyErrorCode =
  | "codex_container_image_missing"
  | "codex_container_image_invalid"
  | "codex_container_image_disallowed"
  | "codex_container_image_not_present";

export class DockerImagePolicyError extends Error {
  constructor(readonly code: DockerImagePolicyErrorCode, message: string) {
    super(message);
    this.name = "DockerImagePolicyError";
  }
}

export class DockerRuntimeUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DockerRuntimeUnavailableError";
  }
}

export class DockerAuxTerminalTargetError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DockerAuxTerminalTargetError";
  }
}

export class DockerPreviousArtifactMountValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DockerPreviousArtifactMountValidationError";
  }
}

export class DockerReviewEvidenceMountValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DockerReviewEvidenceMountValidationError";
  }
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

type SessionEvidenceMount = {
  source: string;
  target: string;
};

export type DockerAuxTerminalTarget = {
  runtime: "container";
  command: string;
  args: string[];
  displayCwd: string;
  shell: string;
};

export type DockerContainerLifecycleStatus =
  | "preflighting"
  | "starting"
  | "running"
  | "paused"
  | "stopping"
  | "stopped"
  | "archiving"
  | "archived"
  | "failed";

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
  docker: DockerRuntimeProbeResult & { checkedAt?: string | null };
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

export type DockerCodexAppServerTransportFactory = (
  options: DockerCodexAppServerTransportLaunchOptions
) => CodexAppServerTransport;

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

export const OfficialCodexAppServerImage = "yp-live-workflow/codex-runtime:1";

const ContainerWorkspacePath = "/workspace";
const ContainerCodexHomePath = "/codex-home";
const ContainerChatGptAuthBackupDir = `${ContainerCodexHomePath}/.yp-live-workflow/chatgpt-auth`;
const ContainerChatGptAuthBackupPath = `${ContainerChatGptAuthBackupDir}/auth.json`;
const ContainerArtifactsPath = "/artifacts";
const ContainerCachePath = "/cache";
const ContainerDatasetOutputPath = "/dataset-output";
const ContainerPreviousArtifactsPath = "/previous-artifacts";
const ContainerReviewExperimentsPath = "/review-sources/experiments";
const ContainerDatasetsPath = "/datasets";
const DefaultDockerBin = "docker";
const DefaultContainerRuntime = "sysbox-runc";
const DefaultNetworkMode = "bridge";
const DefaultProbeTimeoutMs = 2000;
const DefaultImageInspectTimeoutMs = 5000;
const DefaultImagePullTimeoutMs = 120000;
const DefaultContainerStopTimeoutMs = 5000;
// docker stats --no-stream samples twice to compute CPU%, so it takes ~2s.
const DefaultContainerStatsTimeoutMs = 10_000;
const DefaultContainerStorageStatsMaxEntriesPerMount = 2_000;
const DefaultContainerStorageStatsMaxElapsedMsPerMount = 250;
const DefaultAuthMaterialPrepareTimeoutMs = 2000;
const DefaultSensitiveHostPathPrepareTimeoutMs = 2000;
const DefaultDatasetOutputNormalizeTimeoutMs = 120_000;
const DefaultArtifactOutputNormalizeTimeoutMs = 120_000;
const DefaultAppServerStderrLogMaxBytes = 5 * 1024 * 1024;
const DefaultAuxTerminalShellProbeTimeoutMs = 2000;
const AppServerStderrLogRelativePath = "logs/codex-app-server.stderr.log";
const DefaultDockerRunUser = "0:0";
const DefaultDropAllCapabilities = false;
const DefaultNoNewPrivileges = false;
const DefaultMaxCodexSessions = 8;
const DefaultDockerGpuMode: DockerGpuMode = "docker_gpus";
const DefaultNvidiaDirectDevices = [
  "/dev/nvidia0",
  "/dev/nvidiactl",
  "/dev/nvidia-uvm",
  "/dev/nvidia-uvm-tools",
];
const DefaultNvidiaDirectLibraryMounts = [
  "/usr/lib/x86_64-linux-gnu/libcuda.so.1",
  "/usr/lib/x86_64-linux-gnu/libnvidia-ml.so.1",
];
const DefaultNvidiaDirectUtilityMounts = [
  "/usr/bin/nvidia-smi",
];
export type DockerRuntimeMode = "explicit_runtime" | "linux_sysbox" | "macos_privileged_dind" | "sysbox_default";
export type DockerGpuMode = "docker_gpus" | "nvidia_direct";
type DockerHostDefaults = {
  containerRuntime: string | null;
  dockerRuntimeMode: DockerRuntimeMode;
  privileged: boolean;
  forceNoGpus: boolean;
  hostPlatform: NodeJS.Platform;
};
export class DockerRuntimeManager {
  private readonly dockerBin: string;
  private readonly defaultImage?: string;
  private readonly containerLdLibraryPath?: string;
  private readonly gpuMode: DockerGpuMode;
  private readonly nvidiaDirectDevices: string[];
  private readonly nvidiaDirectLibraryMounts: string[];
  private readonly nvidiaDirectUtilityMounts: string[];
  private readonly defaultNetworkMode: string;
  private readonly cli: DockerCli;
  private readonly transportFactory: DockerCodexAppServerTransportFactory;
  private readonly probeTimeoutMs: number;
  private readonly imageInspectTimeoutMs: number;
  private readonly imagePullTimeoutMs: number;
  private readonly containerStopTimeoutMs: number;
  private readonly allowedImages: Set<string>;
  private readonly allowUnlistedImages: boolean;
  private readonly containerRuntime: string | null;
  private readonly dockerRuntimeMode: DockerRuntimeMode;
  private readonly privileged: boolean;
  private readonly forceNoGpus: boolean;
  private readonly hostPlatform: NodeJS.Platform;
  private readonly runUser: string | null;
  private readonly archiveRoot?: string;
  private readonly workspaceRootPath?: string;
  private readonly datasetsHotRootPath?: string;
  private readonly registryCredentials: DockerRegistryCredentials | null;
  private readonly appServerStderrLogMaxBytes: number;
  private readonly auxTerminalShellProbeTimeoutMs: number;
  private readonly dropAllCapabilities: boolean;
  private readonly noNewPrivileges: boolean;
  private readonly maxCodexSessions: number;
  private readonly now: () => Date;
  private readonly sessions = new Map<string, DockerContainerSession>();
  private readonly sensitiveHostPathsBySession = new Map<string, string[]>();
  private readonly evidenceMountsBySession = new Map<string, SessionEvidenceMount[]>();
  private lastProbe: (DockerRuntimeProbeResult & { checkedAt: string }) | null = null;
  private lastOrphanCleanup: DockerOrphanCleanupResult | null = null;

  constructor(options: DockerRuntimeManagerOptions = {}) {
    this.dockerBin = options.dockerBin ?? DefaultDockerBin;
    this.defaultImage = normalizeOptionalString(options.defaultImage);
    this.containerLdLibraryPath = normalizeOptionalString(options.containerLdLibraryPath);
    this.nvidiaDirectDevices = stringListOrDefault(options.nvidiaDirectDevices, DefaultNvidiaDirectDevices);
    this.nvidiaDirectLibraryMounts = stringListOrDefault(
      options.nvidiaDirectLibraryMounts,
      DefaultNvidiaDirectLibraryMounts
    );
    this.nvidiaDirectUtilityMounts = stringListOrDefault(
      options.nvidiaDirectUtilityMounts,
      DefaultNvidiaDirectUtilityMounts
    );
    this.defaultNetworkMode = normalizeOptionalString(options.defaultNetworkMode) ?? DefaultNetworkMode;
    this.cli = options.cli ?? new SpawnDockerCli(this.dockerBin);
    this.transportFactory =
      options.transportFactory ??
      ((launchOptions) =>
        new StdioCodexAppServerTransport({
          ...launchOptions,
          codexHomePath: ContainerCodexHomePath,
        }));
    this.probeTimeoutMs = options.probeTimeoutMs ?? DefaultProbeTimeoutMs;
    this.imageInspectTimeoutMs = options.imageInspectTimeoutMs ?? DefaultImageInspectTimeoutMs;
    this.imagePullTimeoutMs = options.imagePullTimeoutMs ?? DefaultImagePullTimeoutMs;
    this.containerStopTimeoutMs = options.containerStopTimeoutMs ?? DefaultContainerStopTimeoutMs;
    this.allowedImages = allowedImageSet(options.allowedImages, this.defaultImage);
    this.allowUnlistedImages = options.allowUnlistedImages ?? false;
    const hostDefaults = resolveDockerHostDefaults(
      options.hostPlatform ?? currentHostPlatform(),
      normalizeOptionalString(options.containerRuntime) ?? null
    );
    this.containerRuntime = hostDefaults.containerRuntime;
    this.dockerRuntimeMode = hostDefaults.dockerRuntimeMode;
    this.privileged = hostDefaults.privileged;
    this.forceNoGpus = hostDefaults.forceNoGpus;
    this.hostPlatform = hostDefaults.hostPlatform;
    this.gpuMode = dockerGpuMode(options.gpuMode, hostDefaults);
    this.runUser = options.runUser === undefined ? DefaultDockerRunUser : options.runUser;
    this.archiveRoot = normalizeOptionalString(options.archiveRoot);
    this.workspaceRootPath = normalizeOptionalPath(options.workspaceRootPath);
    this.datasetsHotRootPath = normalizeOptionalPath(options.datasetsHotRootPath);
    this.registryCredentials = registryCredentials(options.registryCredentials);
    this.appServerStderrLogMaxBytes = options.appServerStderrLogMaxBytes ?? DefaultAppServerStderrLogMaxBytes;
    this.auxTerminalShellProbeTimeoutMs = Math.max(
      100,
      options.auxTerminalShellProbeTimeoutMs ?? DefaultAuxTerminalShellProbeTimeoutMs
    );
    this.dropAllCapabilities = options.dropAllCapabilities ?? DefaultDropAllCapabilities;
    this.noNewPrivileges = options.noNewPrivileges ?? DefaultNoNewPrivileges;
    this.maxCodexSessions = positiveIntegerOrDefault(options.maxCodexSessions, DefaultMaxCodexSessions, "maxCodexSessions");
    this.now = options.now ?? (() => new Date());
  }

  async probe(): Promise<DockerRuntimeProbeResult> {
    const result = await this.cli.run(["version", "--format", "{{.Server.Version}}"], {
      timeoutMs: this.probeTimeoutMs,
    });

    if (result.exitCode === 0) {
      const probe = { available: true, version: result.stdout.trim() || null, error: null };
      this.lastProbe = { ...probe, checkedAt: this.timestamp() };
      return probe;
    }

    const probe = {
      available: false,
      version: null,
      error: dockerFailureMessage(result),
    };
    this.lastProbe = { ...probe, checkedAt: this.timestamp() };
    return probe;
  }

  async ensureImage(image?: string): Promise<DockerImageEnsureResult> {
    const resolvedImage = this.resolveImage(image);
    await this.loginForImage(resolvedImage);
    const inspect = await this.cli.run(["image", "inspect", resolvedImage], {
      timeoutMs: this.imageInspectTimeoutMs,
    });

    if (inspect.exitCode === null || inspect.error) {
      throw new DockerRuntimeUnavailableError(`Docker image inspect failed for ${resolvedImage}: ${dockerFailureMessage(inspect)}`);
    }

    if (inspect.exitCode === 0) {
      return { image: resolvedImage, present: true, pulled: false };
    }

    if (isLocalOnlyImage(resolvedImage, this.defaultImage)) {
      throw new DockerImagePolicyError(
        "codex_container_image_not_present",
        `Local-only Codex container image is not present: ${resolvedImage}. Build it on this host before starting a session.`
      );
    }

    const pull = await this.cli.run(["pull", resolvedImage], {
      timeoutMs: this.imagePullTimeoutMs,
    });

    if (pull.exitCode === null || pull.error) {
      throw new DockerRuntimeUnavailableError(`Docker image pull failed for ${resolvedImage}: ${dockerFailureMessage(pull)}`);
    }

    if (pull.exitCode !== 0) {
      throw new Error(`Docker image pull failed for ${resolvedImage}: ${dockerFailureMessage(pull)}`);
    }

    return { image: resolvedImage, present: true, pulled: true };
  }

  private async loginForImage(image: string): Promise<void> {
    if (!this.registryCredentials || imageRegistry(image) !== this.registryCredentials.registry) {
      return;
    }

    const result = await this.cli.run(
      ["login", this.registryCredentials.registry, "-u", this.registryCredentials.username, "--password-stdin"],
      { timeoutMs: this.imageInspectTimeoutMs, stdin: `${this.registryCredentials.token}\n` }
    );

    if (result.exitCode !== 0 || result.error) {
      throw new DockerRuntimeUnavailableError(
        `Docker registry login failed for ${this.registryCredentials.registry}: ${dockerFailureMessage(result)}`
      );
    }
  }

  async preflightSessionImage(payload: VmSessionStartPayload): Promise<DockerImageEnsureResult> {
    this.assertSessionCapacity(payload.sessionId);
    const imageCandidate = stringValue(payload.runtimeSnapshot.containerImage) ?? this.defaultImage ?? "";
    const dockerPolicy = this.dockerPolicyFor(payload.runtimeSnapshot);
    const networkMode = networkModeFor(dockerPolicy, this.defaultNetworkMode);
    const securityHardening = dockerSecurityHardening(dockerPolicy, {
      dropAllCapabilities: this.dropAllCapabilities,
      noNewPrivileges: this.noNewPrivileges,
    });
    const now = this.timestamp();
    this.setSession(sessionFromPayload(payload, {
      containerImage: imageCandidate,
      containerRuntime: this.containerRuntime,
      dockerRuntimeMode: this.dockerRuntimeMode,
      privileged: this.privileged,
      networkMode,
      securityHardening,
      containerName: containerNameFor(payload.sessionId),
      status: "preflighting",
      datasetMounts: [],
      imagePreflightStatus: "pending",
      imagePreflightAt: now,
      lastObservedAt: now,
    }));

    try {
      assertInnerDockerCompatiblePolicy(dockerPolicy);
      const image = this.resolveImage(imageCandidate);
      this.updateSession(payload.sessionId, { containerImage: image });
      const result = await this.ensureImage(image);
      this.updateSession(payload.sessionId, {
        imagePreflightStatus: result.pulled ? "pulled" : "present",
        imagePreflightAt: this.timestamp(),
        imagePreflightError: null,
        error: null,
      });
      return result;
    } catch (error) {
      this.updateSession(payload.sessionId, {
        status: "failed",
        imagePreflightStatus: "failed",
        imagePreflightAt: this.timestamp(),
        imagePreflightError: errorMessage(error),
        stoppedAt: this.timestamp(),
        error: errorMessage(error),
      });
      throw error;
    }
  }

  createCodexAppServerTransport(input: DockerCodexAppServerLaunchInput): DockerCodexAppServerLaunch {
    this.assertSessionCapacity(input.payload.sessionId);
    const image = this.resolveImage(stringValue(input.payload.runtimeSnapshot.containerImage));
    const dockerPolicy = this.dockerPolicyFor(input.payload.runtimeSnapshot);
    assertInnerDockerCompatiblePolicy(dockerPolicy);
    const networkMode = networkModeFor(dockerPolicy, this.defaultNetworkMode);
    const nvidiaDirectGpu = nvidiaDirectGpuFor(
      dockerPolicy,
      this.gpuMode,
      this.nvidiaDirectDevices,
      this.nvidiaDirectLibraryMounts,
      this.nvidiaDirectUtilityMounts
    );
    const resourceArgs = dockerResourceArgs(dockerPolicy, this.gpuMode);
    const securityHardening = dockerSecurityHardening(dockerPolicy, {
      dropAllCapabilities: this.dropAllCapabilities,
      noNewPrivileges: this.noNewPrivileges,
    });
    const containerName = containerNameFor(input.payload.sessionId);
    const mounts = [
      ...dockerMounts(
        input.payload.layout,
        input.datasetMounts,
        input.payload.previousArtifactMounts,
        input.payload.reviewEvidenceMounts,
        this.workspaceRootPath,
        input.durableCodexSessionsPath,
        this.datasetsHotRootPath
      ),
      ...nvidiaDirectGpu.libraryMounts.map((libraryPath) => ({
        source: libraryPath,
        target: libraryPath,
        readOnly: true,
      })),
      ...nvidiaDirectGpu.utilityMounts.map((utilityPath) => ({
        source: utilityPath,
        target: utilityPath,
        readOnly: true,
      })),
    ];
    this.setSessionEvidenceMounts(input.payload.sessionId, mounts);
    const appServerStderrLog = appServerStderrLogFor(input.payload.layout.artifactsPath, this.appServerStderrLogMaxBytes);
    const startedAt = this.timestamp();
    this.setSensitiveHostPaths(input.payload.sessionId, input.sensitiveHostPaths);
    this.setSession({
      ...sessionFromPayload(input.payload, {
        containerImage: image,
        containerRuntime: this.containerRuntime,
        dockerRuntimeMode: this.dockerRuntimeMode,
        privileged: this.privileged,
        networkMode,
        securityHardening,
        containerName,
        status: "starting",
        datasetMounts: datasetMountSnapshots(input.datasetMounts ?? []),
        startedAt,
        lastObservedAt: startedAt,
      }),
      ...this.sessions.get(input.payload.sessionId),
      status: "starting",
      datasetMounts: datasetMountSnapshots(input.datasetMounts ?? []),
      startedAt,
      lastObservedAt: startedAt,
    });
    const args = [
      "run",
      ...containerRuntimeArgs(this.containerRuntime),
      ...privilegedArgs(this.privileged),
      "--rm",
      "-i",
      "--name",
      containerName,
      "--label",
      "yp-live-workflow.managed_by=yp-live-workflow-vm-agent",
      "--label",
      `yp-live-workflow.session_id=${input.payload.sessionId}`,
      "--label",
      `yp-live-workflow.workspace_id=${input.payload.workspaceId}`,
      "--label",
      `yp-live-workflow.vm_host_id=${input.payload.vmHostId}`,
      "--workdir",
      ContainerWorkspacePath,
      "--network",
      networkMode,
      ...dockerSecurityArgs(securityHardening),
      ...userArgs(this.runUser),
      ...nvidiaDirectGpu.devices.flatMap((devicePath) => ["--device", devicePath]),
      ...mounts.flatMap((mount) => [
        "--mount",
        dockerMountArg(mount),
      ]),
      "--env",
      `CODEX_HOME=${ContainerCodexHomePath}`,
      "--env",
      `HOME=${ContainerCodexHomePath}`,
      "--env",
      `ARTIFACTS_DIR=${ContainerArtifactsPath}`,
      "--env",
      "YP_LIVE_WORKFLOW_START_INNER_DOCKER=1",
      ...containerLdLibraryPathArgs(this.containerLdLibraryPath),
      ...envArgs(input.env, this.containerLdLibraryPath ? new Set(["LD_LIBRARY_PATH"]) : undefined),
      ...resourceArgs,
      image,
      "codex",
      ...DefaultCodexAppServerArgs,
    ];
    let innerTransport: CodexAppServerTransport;
    try {
      innerTransport = this.transportFactory({
        command: this.dockerBin,
        args,
        cwd: input.payload.layout.workspacePath,
        env: {
          ...process.env,
          ...input.env,
        },
        serverRequestMode: input.serverRequestMode,
        stderrLogSink: new BoundedFileLogSink(
          appServerStderrLog.path,
          appServerStderrLog.maxBytes,
          input.payload.layout.artifactsPath
        ),
      });
    } catch (error) {
      this.markSessionFailed(input.payload.sessionId, error);
      throw error;
    }

    const transport = new ManagedDockerCodexTransport(
      innerTransport,
      async () => {
        await this.stopSessionContainer(input.payload.sessionId);
      },
      (exit) => this.markSessionExited(input.payload.sessionId, exit)
    );

    return {
      transport,
      codexCwd: ContainerWorkspacePath,
      codexHomePath: ContainerCodexHomePath,
      networkMode,
      runtimeMetadata: {
        execution: "docker",
        containerImage: image,
        containerName,
        dockerRuntime: this.containerRuntime,
        dockerRuntimeMode: this.dockerRuntimeMode,
        dockerGpuMode: this.gpuMode,
        hostPlatform: this.hostPlatform,
        privileged: this.privileged,
        networkMode,
        mounts: mounts.map((mount) => ({
          source: mount.source,
          target: mount.target,
          readOnly: mount.readOnly,
        })),
        resourcePolicy: dockerPolicy as unknown as Json,
        dockerPolicy: dockerPolicy as unknown as Json,
        nvidiaDirectGpu: nvidiaDirectGpu.enabled
          ? {
            devices: nvidiaDirectGpu.devices,
            libraryMounts: nvidiaDirectGpu.libraryMounts,
            utilityMounts: nvidiaDirectGpu.utilityMounts,
          } as unknown as Json
          : null,
        securityHardening: securityHardening as unknown as Json,
        logs: {
          appServerStderr: appServerStderrLog as unknown as Json,
        },
        ...(input.runtimeMetadata ?? {}),
      },
    };
  }

  private dockerPolicyFor(runtimeSnapshot: Record<string, Json>): AgentRuntimeDockerPolicy {
    const policy = dockerPolicyFor(runtimeSnapshot);

    return this.forceNoGpus ? { ...policy, gpus: "none" } : policy;
  }

  markSessionRunning(sessionId: string): void {
    const now = this.timestamp();
    this.updateSession(sessionId, { status: "running", runningAt: now, lastObservedAt: now, error: null });
  }

  markSessionPaused(sessionId: string): void {
    const now = this.timestamp();
    this.updateSession(sessionId, { status: "paused", lastObservedAt: now, error: null });
  }

  beginSessionActivation(sessionId: string): { rollback: () => void } {
    const previousSession = this.sessions.get(sessionId);
    if (!previousSession) {
      return { rollback: () => undefined };
    }

    if (isTerminalOrClosingSessionStatus(previousSession.status)) {
      throw new DockerRuntimeUnavailableError(
        `Docker session cannot be activated from ${previousSession.status} state: ${sessionId}`
      );
    }

    this.assertSessionCapacity(sessionId);

    const shouldRollback = previousSession.status === "paused";
    const now = this.timestamp();
    this.updateSession(sessionId, { status: "running", runningAt: now, lastObservedAt: now, error: null });

    return {
      rollback: () => {
        const currentSession = this.sessions.get(sessionId);
        if (shouldRollback && currentSession?.status === "running") {
          this.sessions.set(sessionId, previousSession);
        }
      },
    };
  }

  markSessionFailed(sessionId: string, error: unknown): void {
    const now = this.timestamp();
    this.clearSessionEvidenceMounts(sessionId);
    this.updateSession(sessionId, {
      status: "failed",
      error: errorMessage(error),
      stoppedAt: now,
      lastObservedAt: now,
    });
  }

  async removeSessionContainerNameBeforeRelaunch(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);

    if (!session) {
      return;
    }

    const removed = await this.removeSessionContainerName(session);

    if (!removed) {
      throw new DockerRuntimeUnavailableError(
        `Docker session container could not be removed before relaunch: ${sessionId}`
      );
    }
  }

  listSessions(): DockerContainerSession[] {
    return Array.from(this.sessions.values()).map((session) => ({
      ...session,
      layout: { ...session.layout },
      datasetMounts: session.datasetMounts.map((mount) => ({ ...mount })),
    }));
  }

  /**
   * CPU/memory usage for the running session containers, for telemetry. A
   * stats failure (e.g. a container that exited mid-call) reports no stats
   * rather than failing the telemetry tick; the next tick retries.
   */
  async collectContainerStats(options: { timeoutMs?: number } = {}): Promise<VmContainerStatsSnapshot[]> {
    const sessions = this.listSessions()
      .filter((session) => session.status === "running");
    const targets = sessions.map((session) => ({
      containerName: session.containerName,
      sessionId: session.sessionId,
      runId: session.runId,
    }));

    if (targets.length === 0) {
      return [];
    }

    const result = await this.cli.run(
      dockerStatsArgs(targets.map((target) => target.containerName)),
      { timeoutMs: options.timeoutMs ?? DefaultContainerStatsTimeoutMs }
    );

    if (result.exitCode !== 0 || result.timedOut) {
      return [];
    }

    const storageByContainerName = new Map<string, Awaited<ReturnType<typeof collectContainerStorageSnapshot>>>();
    await Promise.all(sessions.map(async (session) => {
      storageByContainerName.set(
        session.containerName,
        await collectContainerStorageSnapshot({
          writableMounts: writableStorageMountsForLayout(session.layout),
          datasetMounts: session.datasetMounts,
        }, {
          maxEntries: DefaultContainerStorageStatsMaxEntriesPerMount,
          maxElapsedMs: DefaultContainerStorageStatsMaxElapsedMsPerMount,
        })
      );
    }));

    return parseDockerStatsOutput(result.stdout, targets).map((snapshot) => {
      const storage = storageByContainerName.get(snapshot.containerName);
      return storage ? { ...snapshot, storage } : snapshot;
    });
  }

  getSession(sessionId: string): DockerContainerSession | null {
    const session = this.sessions.get(sessionId);
    return session
      ? {
        ...session,
        layout: { ...session.layout },
        datasetMounts: session.datasetMounts.map((mount) => ({ ...mount })),
      }
      : null;
  }

  resolveSessionEvidenceFile(sessionId: string, containerPath: string): {
    relativePath: string;
    rootPath: string;
  } {
    const session = this.sessions.get(sessionId);
    if (!session || ["stopping", "stopped", "archiving", "archived", "failed"].includes(session.status)) {
      throw new DockerReviewEvidenceMountValidationError(
        `Review evidence is unavailable for inactive session: ${sessionId}`
      );
    }
    const normalizedPath = path.posix.normalize(containerPath);
    if (normalizedPath !== containerPath || !path.posix.isAbsolute(containerPath)) {
      throw new DockerReviewEvidenceMountValidationError(`Review evidence file path is invalid: ${containerPath}`);
    }
    const mount = (this.evidenceMountsBySession.get(sessionId) ?? [])
      .filter((candidate) => candidate.target === containerPath || isPosixPathInside(candidate.target, containerPath))
      .sort((left, right) => right.target.length - left.target.length)[0];
    if (!mount) {
      throw new DockerReviewEvidenceMountValidationError(
        `Review evidence file path is outside the mounted evidence: ${containerPath}`
      );
    }
    const relativePath = path.posix.relative(mount.target, containerPath);
    if (!relativePath) return { relativePath: "", rootPath: mount.source };
    const normalizedRelativePath = normalizeSafeRelativePath(relativePath);
    if (!normalizedRelativePath) {
      throw new DockerReviewEvidenceMountValidationError(`Review evidence file path must name a file: ${containerPath}`);
    }
    return { relativePath: normalizedRelativePath, rootPath: mount.source };
  }

  async prepareSessionCodexHomeAuthMaterialForHostRead(sessionId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);

    if (!session || ["stopped", "archived", "failed"].includes(session.status)) {
      return false;
    }

    const result = await this.cli.run(
      [
        "exec",
        session.containerName,
        "sh",
        "-c",
        '[ ! -e /codex-home/auth.json ] || chmod a+r /codex-home/auth.json',
      ],
      { timeoutMs: DefaultAuthMaterialPrepareTimeoutMs }
    );

    if (result.exitCode !== 0 || result.error) {
      throw new DockerRuntimeUnavailableError(
        `Docker could not prepare Codex auth material for host read: ${dockerFailureMessage(result)}`
      );
    }

    return true;
  }

  async backupSessionChatGptAuthMaterial(sessionId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);

    if (!session || ["stopped", "archived", "failed"].includes(session.status)) {
      return false;
    }

    const result = await this.cli.run(
      [
        "exec",
        session.containerName,
        "sh",
        "-c",
        [
          `if [ ! -f ${ContainerCodexHomePath}/auth.json ]; then exit 17; fi`,
          "umask 077",
          `mkdir -p ${ContainerChatGptAuthBackupDir}`,
          `cp -f ${ContainerCodexHomePath}/auth.json ${ContainerChatGptAuthBackupPath}`,
          `chmod 700 ${ContainerCodexHomePath}/.yp-live-workflow ${ContainerChatGptAuthBackupDir} 2>/dev/null || true`,
          `chmod 600 ${ContainerChatGptAuthBackupPath}`,
        ].join("; "),
      ],
      { timeoutMs: DefaultAuthMaterialPrepareTimeoutMs }
    );

    if (result.exitCode === 17 && !result.error) {
      return false;
    }

    if (result.exitCode !== 0 || result.error) {
      throw new DockerRuntimeUnavailableError(
        `Docker could not back up Codex ChatGPT auth material: ${dockerFailureMessage(result)}`
      );
    }

    return true;
  }

  async restoreSessionChatGptAuthMaterialBackup(sessionId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);

    if (!session || ["stopped", "archived", "failed"].includes(session.status)) {
      return false;
    }

    const result = await this.cli.run(
      [
        "exec",
        session.containerName,
        "sh",
        "-c",
        [
          `if [ ! -f ${ContainerChatGptAuthBackupPath} ]; then exit 17; fi`,
          "umask 077",
          `cp -f ${ContainerChatGptAuthBackupPath} ${ContainerCodexHomePath}/auth.json`,
          `chmod 600 ${ContainerCodexHomePath}/auth.json`,
        ].join("; "),
      ],
      { timeoutMs: DefaultAuthMaterialPrepareTimeoutMs }
    );

    if (result.exitCode === 17 && !result.error) {
      return false;
    }

    if (result.exitCode !== 0 || result.error) {
      throw new DockerRuntimeUnavailableError(
        `Docker could not restore Codex ChatGPT auth material backup: ${dockerFailureMessage(result)}`
      );
    }

    return true;
  }

  async normalizeDatasetOutputInContainer(input: {
    sessionId: string;
    containerPath: string;
    timeoutMs?: number;
  }): Promise<void> {
    const containerPath = normalizeContainerDatasetOutputPath(input.containerPath);
    const session = this.sessions.get(input.sessionId);

    if (!session) {
      throw new DockerRuntimeUnavailableError(`VM agent session was not found: ${input.sessionId}`);
    }

    if (session.status !== "running") {
      throw new DockerRuntimeUnavailableError(
        `Docker session must be running before normalizing dataset output: ${input.sessionId}`
      );
    }

    const result = await this.cli.run(
      ["exec", session.containerName, "chmod", "-R", "a+rX", containerPath],
      { timeoutMs: input.timeoutMs ?? DefaultDatasetOutputNormalizeTimeoutMs }
    );

    if (result.exitCode !== 0 || result.error) {
      throw new DockerRuntimeUnavailableError(
        `Docker dataset output permission normalization failed: ${dockerFailureMessage(result)}`
      );
    }
  }

  async normalizeArtifactOutputInContainer(input: {
    sessionId: string;
    timeoutMs?: number;
  }): Promise<boolean> {
    const session = this.sessions.get(input.sessionId);

    if (!session || !["running", "paused", "failed"].includes(session.status)) {
      return false;
    }

    const result = await this.cli.run(
      ["exec", session.containerName, "chmod", "-R", "a+rX", ContainerArtifactsPath],
      { timeoutMs: input.timeoutMs ?? DefaultArtifactOutputNormalizeTimeoutMs }
    );

    if (result.exitCode !== 0 || result.error) {
      throw new DockerRuntimeUnavailableError(
        `Docker artifact output permission normalization failed: ${dockerFailureMessage(result)}`
      );
    }

    return true;
  }

  async makeArtifactDirectoryWritableInContainer(input: {
    sessionId: string;
    containerPath: string;
    timeoutMs?: number;
  }): Promise<boolean> {
    const containerPath = normalizeContainerArtifactOutputPath(input.containerPath);
    const session = this.sessions.get(input.sessionId);

    if (!session || !["running", "paused", "failed"].includes(session.status)) {
      return false;
    }

    const result = await this.cli.run(
      ["exec", session.containerName, "chmod", "a+rwx", containerPath],
      { timeoutMs: input.timeoutMs ?? DefaultArtifactOutputNormalizeTimeoutMs }
    );

    if (result.exitCode !== 0 || result.error) {
      throw new DockerRuntimeUnavailableError(
        `Docker artifact directory permission normalization failed: ${dockerFailureMessage(result)}`
      );
    }

    return true;
  }

  async terminateSession(sessionId: string): Promise<DockerContainerSession | null> {
    if (!this.sessions.has(sessionId)) {
      return null;
    }

    await this.stopSessionContainer(sessionId);
    await this.cleanupSensitiveHostPaths(sessionId);
    return this.getSession(sessionId);
  }

  async archiveSession(sessionId: string): Promise<DockerContainerSession | null> {
    const session = this.sessions.get(sessionId);

    if (!session) {
      return null;
    }

    if (session.status === "archived") {
      this.clearSessionEvidenceMounts(sessionId);
      return this.getSession(sessionId);
    }

    if (!this.archiveRoot) {
      this.markSessionFailed(sessionId, new Error("VM agent archive root is not configured"));
      throw new Error("VM agent archive root is not configured");
    }

    if (
      session.status === "running" ||
      session.status === "starting" ||
      session.status === "preflighting" ||
      session.status === "paused"
    ) {
      const stopped = await this.stopSessionContainer(sessionId);

      if (!stopped) {
        const failedSession = this.sessions.get(sessionId);
        throw new Error(failedSession?.error ?? "Docker session container could not be stopped before archive");
      }
    }

    await this.cleanupSensitiveHostPaths(sessionId);

    const archivePath = path.join(this.archiveRoot, safePathSegment(session.workspaceId), safePathSegment(session.sessionId));
    this.updateSession(sessionId, {
      status: "archiving",
      archivePath,
      lastObservedAt: this.timestamp(),
    });

    try {
      await fs.mkdir(path.dirname(archivePath), { recursive: true });
      await fs.cp(session.rootPath, archivePath, {
        recursive: true,
        errorOnExist: true,
        force: false,
      });
      const now = this.timestamp();
      this.updateSession(sessionId, {
        status: "archived",
        archivedAt: now,
        archivePath,
        lastObservedAt: now,
        error: null,
      });
      this.clearSessionEvidenceMounts(sessionId);
      return this.getSession(sessionId);
    } catch (error) {
      this.markSessionFailed(sessionId, error);
      throw error;
    }
  }

  async createAuxTerminalTarget(
    session: DockerContainerSession,
    options: { preferredShell?: string } = {}
  ): Promise<DockerAuxTerminalTarget> {
    if (session.status !== "running") {
      throw new DockerAuxTerminalTargetError(
        `Docker session must be running before opening an aux terminal: ${session.sessionId}`
      );
    }

    const shell = await this.resolveAuxTerminalShell(session, options.preferredShell);

    return {
      runtime: "container",
      command: this.dockerBin,
      args: [
        "exec",
        "-i",
        "-t",
        "--workdir",
        ContainerWorkspacePath,
        "--env",
        "TERM=xterm-256color",
        "--env",
        `YP_LIVE_WORKFLOW_SESSION_ID=${session.sessionId}`,
        "--env",
        `YP_LIVE_WORKFLOW_WORKSPACE_ROOT=${ContainerWorkspacePath}`,
        session.containerName,
        shell,
      ],
      displayCwd: ContainerWorkspacePath,
      shell,
    };
  }

  async cleanupOrphans(): Promise<DockerOrphanCleanupResult> {
    const { scannedAt, containers } = await this.scanOrphanContainers("cleanup");
    const containersToStop = containers.filter((container) => container.classification !== "active");

    for (const container of containersToStop) {
      await this.cli.run(["stop", container.containerName], { timeoutMs: this.containerStopTimeoutMs });
      container.stopped = true;
    }

    const cleanup = {
      mode: "cleanup" as const,
      scannedAt,
      stopped: containersToStop.length,
      containerNames: containersToStop.map((container) => container.containerName),
      containers,
      error: null,
    };
    this.lastOrphanCleanup = cleanup;
    return cleanup;
  }

  async scanOrphans(): Promise<DockerOrphanCleanupResult> {
    const { scannedAt, containers } = await this.scanOrphanContainers("scan");
    const scan = {
      mode: "scan" as const,
      scannedAt,
      stopped: 0,
      containerNames: [],
      containers,
      error: null,
    };
    this.lastOrphanCleanup = scan;
    return scan;
  }

  getStatus(): DockerRuntimeStatus {
    return {
      docker: this.lastProbe ?? { available: false, version: null, error: "Docker has not been probed", checkedAt: null },
      activeCodexSessions: this.activeSessionCount(),
      sessionCountsByStatus: this.sessionCountsByStatus(),
      sessions: this.listSessions(),
      orphanCleanup: this.lastOrphanCleanup ? cloneOrphanCleanup(this.lastOrphanCleanup) : null,
    };
  }

  private async stopSessionContainer(sessionId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);

    if (!session || session.status === "stopped" || session.status === "archived") {
      this.clearSessionEvidenceMounts(sessionId);
      return true;
    }

    this.updateSession(sessionId, { status: "stopping", lastObservedAt: this.timestamp() });
    await this.prepareSessionCodexHomeForHostCleanup(session).catch(() => undefined);
    const result = await this.cli.run(["stop", session.containerName], {
      timeoutMs: this.containerStopTimeoutMs,
    });

    if (result.exitCode !== 0 && !isNoSuchContainerFailure(result)) {
      this.markSessionFailed(sessionId, new Error(dockerFailureMessage(result)));
      return false;
    }

    const removed = await this.removeSessionContainerName(session);
    if (!removed) {
      return false;
    }

    this.updateSession(sessionId, {
      status: "stopped",
      stoppedAt: this.timestamp(),
      lastObservedAt: this.timestamp(),
      error: null,
    });
    this.clearSessionEvidenceMounts(sessionId);
    return true;
  }

  private async removeSessionContainerName(session: DockerContainerSession): Promise<boolean> {
    const result = await this.cli.run(["rm", "-f", session.containerName], {
      timeoutMs: this.containerStopTimeoutMs,
    });

    if (result.exitCode === 0 || isNoSuchContainerFailure(result)) {
      return true;
    }

    this.markSessionFailed(session.sessionId, new Error(dockerFailureMessage(result)));
    return false;
  }

  private async resolveAuxTerminalShell(
    session: DockerContainerSession,
    preferredShell?: string
  ): Promise<string> {
    const candidates = uniqueShellCandidates([
      normalizeOptionalString(preferredShell),
      "/bin/bash",
      "/bin/sh",
    ]);
    const failures: string[] = [];

    for (const shell of candidates) {
      const result = await this.cli.run(["exec", session.containerName, "test", "-x", shell], {
        timeoutMs: this.auxTerminalShellProbeTimeoutMs,
      });

      if (result.exitCode === 0 && !result.error) {
        return shell;
      }

      failures.push(`${shell}: ${dockerFailureMessage(result)}`);
    }

    throw new DockerAuxTerminalTargetError(
      `No executable aux terminal shell found in Codex container for session ${session.sessionId}: ${failures.join("; ")}`
    );
  }

  markSessionExited(sessionId: string, exit: CodexAppServerExit): void {
    const session = this.sessions.get(sessionId);

    if (!session) {
      return;
    }
    if (session.status === "stopped" || session.status === "archived" || session.status === "stopping") {
      this.clearSessionEvidenceMounts(sessionId);
      return;
    }

    this.clearSessionEvidenceMounts(sessionId);
    this.updateSession(sessionId, {
      status: "failed",
      exitCode: exit.exitCode,
      signal: exit.signal,
      stoppedAt: this.timestamp(),
      lastObservedAt: this.timestamp(),
      error: exit.error ?? `Codex app-server exited (${exit.signal ?? exit.exitCode ?? "unknown"})`,
    });
  }

  private async scanOrphanContainers(mode: DockerOrphanCleanupResult["mode"]): Promise<{
    scannedAt: string;
    containers: DockerOrphanContainerRecord[];
  }> {
    const scannedAt = this.timestamp();
    const result = await this.cli.run([
      "ps",
      "-a",
      "--filter",
      "label=yp-live-workflow.managed_by=yp-live-workflow-vm-agent",
      "--format",
      "{{.Names}}\t{{.Label \"yp-live-workflow.session_id\"}}\t{{.State}}",
    ]);

    if (result.exitCode !== 0) {
      const cleanup = {
        mode,
        scannedAt,
        stopped: 0,
        containerNames: [],
        containers: [],
        error: `Docker orphan scan failed: ${dockerFailureMessage(result)}`,
      };
      this.lastOrphanCleanup = cleanup;
      throw new Error(cleanup.error);
    }

    return {
      scannedAt,
      containers: result.stdout
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => orphanRecordForLine(line, this.sessions)),
    };
  }

  private updateSession(sessionId: string, patch: Partial<DockerContainerSession>): void {
    const session = this.sessions.get(sessionId);

    if (!session) {
      return;
    }

    this.sessions.set(sessionId, { ...session, ...patch });
  }

  private setSession(session: DockerContainerSession): void {
    this.sessions.set(session.sessionId, session);
  }

  private setSensitiveHostPaths(sessionId: string, paths: string[] | undefined): void {
    const normalizedPaths = (paths ?? [])
      .map((hostPath) => path.resolve(hostPath))
      .filter((hostPath) => hostPath.length > 1);

    if (normalizedPaths.length === 0) {
      this.sensitiveHostPathsBySession.delete(sessionId);
      return;
    }

    this.sensitiveHostPathsBySession.set(sessionId, normalizedPaths);
  }

  private setSessionEvidenceMounts(
    sessionId: string,
    mounts: Array<{ source: string; target: string }>
  ): void {
    const evidenceMounts = mounts
      .filter((mount) =>
        mount.target.startsWith(`${ContainerReviewExperimentsPath}/`) ||
        mount.target.startsWith(`${ContainerDatasetsPath}/`)
      )
      .map((mount) => ({ source: path.resolve(mount.source), target: path.posix.normalize(mount.target) }));
    if (evidenceMounts.length === 0) {
      this.evidenceMountsBySession.delete(sessionId);
      return;
    }
    this.evidenceMountsBySession.set(sessionId, evidenceMounts);
  }

  private clearSessionEvidenceMounts(sessionId: string): void {
    this.evidenceMountsBySession.delete(sessionId);
  }

  private async cleanupSensitiveHostPaths(sessionId: string): Promise<void> {
    const paths = this.sensitiveHostPathsBySession.get(sessionId) ?? [];
    if (paths.length === 0) {
      this.sensitiveHostPathsBySession.delete(sessionId);
      return;
    }

    await Promise.all(paths.map((hostPath) => removeSensitiveHostPath(hostPath)));
    this.sensitiveHostPathsBySession.delete(sessionId);
  }

  private async prepareSessionCodexHomeForHostCleanup(session: DockerContainerSession): Promise<void> {
    // Sysbox creates private tmp directories in the ordinary Codex home too.
    // The host needs directory traversal to remove them after the container
    // stops. Keep file permissions intact; the host parent stays private.
    await this.cli.run(
      [
        "exec",
        session.containerName,
        "sh",
        "-c",
        [
          "[ ! -d /codex-home ] || chmod u+rwx /codex-home",
          "[ ! -d /codex-home ] || find /codex-home -xdev -type d -exec chmod a+rwx {} +",
        ].join("; "),
      ],
      { timeoutMs: DefaultSensitiveHostPathPrepareTimeoutMs }
    );
  }

  private sessionCountsByStatus(): Record<string, number> {
    const counts: Record<string, number> = {};

    for (const session of this.sessions.values()) {
      counts[session.status] = (counts[session.status] ?? 0) + 1;
    }

    return counts;
  }

  private assertSessionCapacity(sessionId: string): void {
    const activeSessions = this.activeSessionCount(sessionId);

    if (activeSessions >= this.maxCodexSessions) {
      throw new DockerRuntimeUnavailableError(
        `VM host Codex session capacity is full (${String(activeSessions)}/${String(this.maxCodexSessions)})`
      );
    }
  }

  private activeSessionCount(excludeSessionId?: string): number {
    let count = 0;

    for (const session of this.sessions.values()) {
      if (excludeSessionId && session.sessionId === excludeSessionId) {
        continue;
      }

      if (isCapacityConsumingSessionStatus(session.status)) {
        count += 1;
      }
    }

    count += this.activeOrphanCount(excludeSessionId);

    return count;
  }

  private activeOrphanCount(excludeSessionId?: string): number {
    let count = 0;

    for (const orphan of this.lastOrphanCleanup?.containers ?? []) {
      const sessionId = orphan.sessionId ?? undefined;

      if (orphan.stopped) {
        continue;
      }

      if (excludeSessionId && sessionId === excludeSessionId) {
        continue;
      }

      if (sessionId && this.sessions.has(sessionId)) {
        continue;
      }

      if (isBusyDockerContainerState(orphan.dockerState)) {
        count += 1;
      }
    }

    return count;
  }

  private timestamp(): string {
    return this.now().toISOString();
  }

  resolveImage(image?: string | null): string {
    const resolvedImage = normalizeOptionalString(image) ?? this.defaultImage;

    if (!resolvedImage) {
      throw new DockerImagePolicyError("codex_container_image_missing", "Codex container image is not configured");
    }

    if (!isValidImageReference(resolvedImage)) {
      throw new DockerImagePolicyError("codex_container_image_invalid", `Codex container image is invalid: ${resolvedImage}`);
    }

    if (!this.allowUnlistedImages && !this.allowedImages.has(resolvedImage)) {
      throw new DockerImagePolicyError("codex_container_image_disallowed", `Codex container image is not allowed: ${resolvedImage}`);
    }

    return resolvedImage;
  }
}

export class SpawnDockerCli implements DockerCli {
  constructor(private readonly dockerBin = DefaultDockerBin) {}

  run(args: string[], options: DockerCliRunOptions = {}): Promise<DockerCliResult> {
    return new Promise<DockerCliResult>((resolve) => {
      const child = spawn(this.dockerBin, args, {
        stdio: ["pipe", "pipe", "pipe"],
      });
      let stdout = "";
      let stderr = "";
      let timedOut = false;
      let settled = false;
      let timer: ReturnType<typeof setTimeout> | undefined;

      const settle = (result: DockerCliResult) => {
        if (settled) {
          return;
        }

        settled = true;
        if (timer) {
          clearTimeout(timer);
        }
        resolve(result);
      };

      child.stdout.setEncoding("utf8");
      child.stderr.setEncoding("utf8");
      child.stdout.on("data", (chunk: string) => {
        stdout += chunk;
      });
      child.stderr.on("data", (chunk: string) => {
        stderr += chunk;
      });
      child.once("error", (error) => {
        settle({ exitCode: null, signal: null, stdout, stderr, timedOut, error });
      });
      child.once("close", (exitCode, signal) => {
        settle({ exitCode, signal, stdout, stderr, timedOut });
      });
      if (options.stdin !== undefined) {
        child.stdin.write(options.stdin);
      }
      child.stdin.end();

      if (options.timeoutMs && options.timeoutMs > 0) {
        timer = setTimeout(() => {
          timedOut = true;
          child.kill("SIGTERM");
        }, options.timeoutMs);
      }
    });
  }
}

class ManagedDockerCodexTransport implements CodexAppServerTransport {
  private closing = false;
  private readonly exitHandlers = new Set<(exit: CodexAppServerExit) => void>();

  constructor(
    private readonly inner: CodexAppServerTransport,
    private readonly closeContainer: () => Promise<void>,
    private readonly onUnexpectedExit: (exit: CodexAppServerExit) => void
  ) {
    this.inner.onExit?.((exit) => {
      if (!this.closing) {
        this.onUnexpectedExit(exit);
        for (const handler of this.exitHandlers) {
          handler(exit);
        }
      }
    });
  }

  request(method: string, params?: unknown): Promise<unknown> {
    return this.inner.request(method, params);
  }

  notify(method: string, params?: unknown): void {
    this.inner.notify(method, params);
  }

  onNotification(handler: (message: JsonRpcMessage) => void): void {
    this.inner.onNotification(handler);
  }

  onStderr(handler: (chunk: string) => void): void {
    this.inner.onStderr?.(handler);
  }

  onExit(handler: (exit: CodexAppServerExit) => void): void {
    this.exitHandlers.add(handler);
  }

  respondToServerRequest(id: JsonRpcId, result?: unknown): void {
    this.inner.respondToServerRequest(id, result);
  }

  rejectServerRequest(id: JsonRpcId, error: JsonRpcError): void {
    this.inner.rejectServerRequest(id, error);
  }

  async close(): Promise<void> {
    this.closing = true;
    try {
      await this.closeContainer().catch(() => undefined);
    } finally {
      await this.inner.close();
    }
  }
}

function sessionFromPayload(
  payload: VmSessionStartPayload,
  values: {
    containerImage: string;
    containerRuntime: string | null;
    dockerRuntimeMode: DockerRuntimeMode;
    privileged: boolean;
    networkMode: string;
    securityHardening: DockerSecurityHardening;
    containerName: string;
    status: DockerContainerLifecycleStatus;
    datasetMounts: VmContainerDatasetMountSnapshot[];
    imagePreflightStatus?: DockerImagePreflightStatus;
    imagePreflightAt?: string | null;
    startedAt?: string | null;
    lastObservedAt: string;
  }
): DockerContainerSession {
  return {
    sessionId: payload.sessionId,
    commandId: payload.commandId,
    runId: payload.runId,
    runStepId: payload.runStepId,
    nodeId: payload.nodeId,
    workspaceId: payload.workspaceId,
    vmHostId: payload.vmHostId,
    containerName: values.containerName,
    containerImage: values.containerImage,
    containerRuntime: values.containerRuntime,
    dockerRuntimeMode: values.dockerRuntimeMode,
    privileged: values.privileged,
    networkMode: values.networkMode,
    securityHardening: values.securityHardening,
    status: values.status,
    rootPath: payload.layout.rootPath,
    layout: { ...payload.layout },
    archivePath: null,
    datasetMounts: values.datasetMounts.map((mount) => ({ ...mount })),
    imagePreflightStatus: values.imagePreflightStatus ?? "pending",
    imagePreflightAt: values.imagePreflightAt ?? null,
    imagePreflightError: null,
    startedAt: values.startedAt ?? null,
    runningAt: null,
    stoppedAt: null,
    archivedAt: null,
    lastObservedAt: values.lastObservedAt,
    exitCode: null,
    signal: null,
    error: null,
  };
}

function orphanRecordForLine(
  line: string,
  sessions: Map<string, DockerContainerSession>
): DockerOrphanContainerRecord {
  const [containerName = "", sessionId = "", dockerState = ""] = line.split("\t");
  const normalizedSessionId = sessionId.trim() || null;
  const session = normalizedSessionId ? sessions.get(normalizedSessionId) : undefined;
  const normalizedDockerState = dockerState.trim().toLowerCase() || null;
  const active =
    (session && isProtectedTrackedSessionStatus(session.status)) ||
    (!session && isBusyDockerContainerState(normalizedDockerState));

  return {
    containerName: containerName.trim(),
    sessionId: normalizedSessionId,
    dockerState: normalizedDockerState,
    classification: active ? "active" : normalizedSessionId ? "stale" : "unknown",
    stopped: false,
  };
}

function isCapacityConsumingSessionStatus(status: DockerContainerLifecycleStatus): boolean {
  return !["paused", "stopped", "archived", "failed"].includes(status);
}

function isProtectedTrackedSessionStatus(status: DockerContainerLifecycleStatus): boolean {
  return !["stopped", "archived", "failed"].includes(status);
}

function isTerminalOrClosingSessionStatus(status: DockerContainerLifecycleStatus): boolean {
  return status === "failed" ||
    status === "stopped" ||
    status === "archived" ||
    status === "stopping" ||
    status === "archiving";
}

function isBusyDockerContainerState(state: string | null | undefined): boolean {
  return state === "running" || state === "restarting";
}

function cloneOrphanCleanup(cleanup: DockerOrphanCleanupResult): DockerOrphanCleanupResult {
  return {
    ...cleanup,
    containerNames: [...cleanup.containerNames],
    containers: cleanup.containers.map((container) => ({ ...container })),
  };
}

function safePathSegment(value: string): string {
  return value.replace(/[^A-Za-z0-9_.-]+/g, "-").replace(/^-+/, "").slice(0, 80) || "unknown";
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Docker session failed";
}

async function removeSensitiveHostPath(hostPath: string): Promise<void> {
  try {
    await fs.rm(hostPath, { recursive: true, force: true });
  } catch (error) {
    console.error("Failed to remove sensitive Codex host path", {
      path: hostPath,
      error: errorMessage(error),
    });
    throw error;
  }
}

function dockerMounts(
  layout: WorkspacePreparedLayout,
  datasetMounts: PreparedDatasetMount[] = [],
  previousArtifactMounts: VmPreviousArtifactMount[] = [],
  reviewEvidenceMounts: VmReviewEvidenceMount[] = [],
  workspaceRootPath?: string,
  durableCodexSessionsPath?: string,
  datasetsHotRootPath?: string
): Array<{ source: string; target: string; readOnly: boolean }> {
  return [
    { source: layout.workspacePath, target: ContainerWorkspacePath, readOnly: false },
    { source: layout.codexHomePath, target: ContainerCodexHomePath, readOnly: false },
    ...(durableCodexSessionsPath
      ? [{ source: durableCodexSessionsPath, target: `${ContainerCodexHomePath}/sessions`, readOnly: false }]
      : []),
    { source: layout.artifactsPath, target: ContainerArtifactsPath, readOnly: false },
    { source: layout.cachePath, target: ContainerCachePath, readOnly: false },
    ...(layout.datasetOutputPath
      ? [{ source: layout.datasetOutputPath, target: ContainerDatasetOutputPath, readOnly: false }]
      : []),
    ...datasetMounts.map((mount) => ({
      source: mount.source,
      target: mount.target,
      readOnly: true,
    })),
    ...previousArtifactDockerMounts(layout, previousArtifactMounts, workspaceRootPath),
    ...reviewEvidenceDockerMounts(layout, reviewEvidenceMounts, workspaceRootPath, datasetsHotRootPath),
  ];
}

function reviewEvidenceDockerMounts(
  layout: WorkspacePreparedLayout,
  mounts: VmReviewEvidenceMount[],
  workspaceRootPath?: string,
  datasetsHotRootPath?: string
): Array<{ source: string; target: string; readOnly: boolean }> {
  if (mounts.length === 0) return [];
  if (!workspaceRootPath) {
    throw new DockerReviewEvidenceMountValidationError(
      "Review evidence mounts require the VM agent trusted workspace root"
    );
  }

  const trustedRoot = path.resolve(workspaceRootPath);
  const currentRoot = path.resolve(layout.rootPath);
  const realTrustedRoot = realpathOrNull(trustedRoot);
  const realCurrentRoot = realpathOrNull(currentRoot);
  const trustedDatasetsHotRoot = datasetsHotRootPath ? path.resolve(datasetsHotRootPath) : null;
  const realTrustedDatasetsHotRoot = trustedDatasetsHotRoot ? realpathOrNull(trustedDatasetsHotRoot) : null;
  validateCurrentExperimentRootUnderWorkspaceRoot(
    currentRoot,
    realCurrentRoot,
    trustedRoot,
    realTrustedRoot
  );

  const seenSources = new Set<string>();
  const seenTargets = new Set<string>();
  return mounts.flatMap((mount, index) => {
    if (mount.readOnly !== true) {
      throw reviewEvidenceMountValidationError(index, "readOnly must be true");
    }
    if (!path.isAbsolute(mount.sourcePath)) {
      throw reviewEvidenceMountValidationError(index, "sourcePath must be absolute");
    }
    const source = path.resolve(mount.sourcePath);
    const isDatasetOutput = mount.evidenceType === "dataset-output";
    if (!isDatasetOutput && path.basename(source) !== mount.evidenceType) {
      throw reviewEvidenceMountValidationError(index, "sourcePath basename must match evidenceType");
    }
    const sourceWorkspaceRoot = path.dirname(source);
    if (!isDatasetOutput && sourceWorkspaceRoot === currentRoot) {
      throw reviewEvidenceMountValidationError(index, "sourcePath cannot target the review workspace itself");
    }
    if (!isDatasetOutput && !isPathInside(trustedRoot, source)) {
      throw reviewEvidenceMountValidationError(index, "sourcePath must stay inside the VM workspace root");
    }
    if (isDatasetOutput && !trustedDatasetsHotRoot) {
      throw reviewEvidenceMountValidationError(index, "dataset-output evidence requires the VM hot dataset root");
    }
    if (isDatasetOutput && !isPathInside(trustedDatasetsHotRoot!, source)) {
      throw reviewEvidenceMountValidationError(index, "dataset-output sourcePath must stay inside the VM hot dataset root");
    }

    const realSource = realpathOrNull(source);
    if (!realSource) {
      throw reviewEvidenceMountValidationError(index, "sourcePath must exist");
    }
    const sourceStat = lstatSync(source);
    if (!sourceStat.isDirectory() || sourceStat.isSymbolicLink()) {
      throw reviewEvidenceMountValidationError(index, "sourcePath must be a real directory");
    }
    if (!isDatasetOutput && path.basename(realSource) !== mount.evidenceType) {
      throw reviewEvidenceMountValidationError(index, "sourcePath real basename must match evidenceType");
    }
    if (!isDatasetOutput && realTrustedRoot && !isPathInside(realTrustedRoot, realSource)) {
      throw reviewEvidenceMountValidationError(index, "sourcePath real path must stay inside the VM workspace root");
    }
    if (isDatasetOutput && realTrustedDatasetsHotRoot && !isPathInside(realTrustedDatasetsHotRoot, realSource)) {
      throw reviewEvidenceMountValidationError(index, "dataset-output real sourcePath must stay inside the VM hot dataset root");
    }
    if (!isDatasetOutput && realCurrentRoot && path.dirname(realSource) === realCurrentRoot) {
      throw reviewEvidenceMountValidationError(index, "sourcePath real path cannot target the review workspace itself");
    }
    const forbiddenRelativePaths = mount.forbiddenRelativePaths ?? [];
    const sensitiveFilesToMask: string[] = [];
    if (forbiddenRelativePaths.length > 0 && mount.evidenceType !== "workspace") {
      throw reviewEvidenceMountValidationError(index, "forbiddenRelativePaths are only valid for workspace evidence");
    }
    for (const relativePath of forbiddenRelativePaths) {
      const normalizedRelativePath = normalizeSafeRelativePath(relativePath);
      if (!normalizedRelativePath) {
        throw reviewEvidenceMountValidationError(index, "forbiddenRelativePaths must contain safe relative paths");
      }
      const candidate = path.resolve(source, ...normalizedRelativePath.split("/"));
      if (!isPathInside(source, candidate)) {
        throw reviewEvidenceMountValidationError(index, "forbiddenRelativePaths must remain inside sourcePath");
      }
      if (pathExistsNoFollow(candidate)) {
        const stat = lstatSync(candidate);
        if (!stat.isFile() || stat.isSymbolicLink()) {
          throw reviewEvidenceMountValidationError(
            index,
            `sensitive path must be a regular file before it can be masked: ${relativePath}`
          );
        }
        sensitiveFilesToMask.push(normalizedRelativePath);
      }
    }

    if (!path.posix.isAbsolute(mount.containerPath)) {
      throw reviewEvidenceMountValidationError(index, "containerPath must be absolute");
    }
    const target = path.posix.normalize(mount.containerPath);
    if (
      target !== mount.containerPath ||
      !isPosixPathInside(ContainerReviewExperimentsPath, target) ||
      path.posix.basename(target) !== mount.evidenceType
    ) {
      throw reviewEvidenceMountValidationError(
        index,
        `containerPath must be normalized under ${ContainerReviewExperimentsPath} and end in evidenceType`
      );
    }
    if (seenSources.has(source) || seenTargets.has(target)) {
      throw reviewEvidenceMountValidationError(index, "sourcePath and containerPath must be unique");
    }
    seenSources.add(source);
    seenTargets.add(target);
    return [
      { source, target, readOnly: true },
      ...sensitiveFilesToMask.map((relativePath) => ({
        source: "/dev/null",
        target: path.posix.join(target, relativePath),
        readOnly: true,
      })),
    ];
  });
}

function previousArtifactDockerMounts(
  layout: WorkspacePreparedLayout,
  previousArtifactMounts: VmPreviousArtifactMount[],
  workspaceRootPath?: string
): Array<{ source: string; target: string; readOnly: boolean }> {
  const currentExperimentRoot = path.resolve(layout.rootPath);
  const currentExperimentParent = path.dirname(currentExperimentRoot);
  const trustedWorkspaceRootPath = workspaceRootPath ? path.resolve(workspaceRootPath) : null;
  const realCurrentExperimentRoot = realpathOrNull(currentExperimentRoot);
  const realCurrentExperimentParent = realpathOrNull(currentExperimentParent);
  const realTrustedWorkspaceRootPath = trustedWorkspaceRootPath ? realpathOrNull(trustedWorkspaceRootPath) : null;

  if (previousArtifactMounts.length > 0 && trustedWorkspaceRootPath) {
    validateCurrentExperimentRootUnderWorkspaceRoot(
      currentExperimentRoot,
      realCurrentExperimentRoot,
      trustedWorkspaceRootPath,
      realTrustedWorkspaceRootPath
    );
  }

  return previousArtifactMounts.map((mount, index) => {
    if (mount.readOnly !== true) {
      throw previousArtifactMountValidationError(index, "readOnly must be true");
    }

    const source = validatePreviousArtifactSourcePath(mount.sourcePath, {
      currentExperimentRoot,
      currentExperimentParent,
      trustedWorkspaceRootPath,
      realCurrentExperimentRoot,
      realCurrentExperimentParent,
      realTrustedWorkspaceRootPath,
    }, index);
    const target = validatePreviousArtifactContainerPath(mount.containerPath, index);

    return { source, target, readOnly: true };
  });
}

function validateCurrentExperimentRootUnderWorkspaceRoot(
  currentExperimentRoot: string,
  realCurrentExperimentRoot: string | null,
  trustedWorkspaceRootPath: string,
  realTrustedWorkspaceRootPath: string | null
): void {
  if (!isPathInside(trustedWorkspaceRootPath, currentExperimentRoot)) {
    throw new DockerPreviousArtifactMountValidationError(
      "Current experiment root must stay inside the VM workspace root when previous artifacts are mounted"
    );
  }

  if (
    realCurrentExperimentRoot &&
    realTrustedWorkspaceRootPath &&
    !isPathInside(realTrustedWorkspaceRootPath, realCurrentExperimentRoot)
  ) {
    throw new DockerPreviousArtifactMountValidationError(
      "Current experiment real path must stay inside the VM workspace root when previous artifacts are mounted"
    );
  }
}

function validatePreviousArtifactSourcePath(
  sourcePath: string,
  context: {
    currentExperimentRoot: string;
    currentExperimentParent: string;
    trustedWorkspaceRootPath: string | null;
    realCurrentExperimentRoot: string | null;
    realCurrentExperimentParent: string | null;
    realTrustedWorkspaceRootPath: string | null;
  },
  index: number
): string {
  if (!path.isAbsolute(sourcePath)) {
    throw previousArtifactMountValidationError(index, "sourcePath must be absolute");
  }

  const resolvedSourcePath = path.resolve(sourcePath);
  if (path.basename(resolvedSourcePath) !== "artifacts") {
    throw previousArtifactMountValidationError(index, "sourcePath must target an artifacts directory");
  }

  const sourceExperimentRoot = path.dirname(resolvedSourcePath);
  const sourceExperimentParent = path.dirname(sourceExperimentRoot);
  if (sourceExperimentRoot === context.currentExperimentRoot) {
    throw previousArtifactMountValidationError(index, "sourcePath cannot target the current experiment artifacts");
  }

  if (context.trustedWorkspaceRootPath) {
    if (!isPathInside(context.trustedWorkspaceRootPath, resolvedSourcePath)) {
      throw previousArtifactMountValidationError(index, "sourcePath must stay inside the VM workspace root");
    }
  } else if (sourceExperimentParent !== context.currentExperimentParent) {
    throw previousArtifactMountValidationError(
      index,
      "sourcePath must be the artifacts directory of a sibling experiment in the same group workspace"
    );
  }

  const realSourcePath = realpathOrNull(resolvedSourcePath);
  if (realSourcePath) {
    const realSourceExperimentRoot = path.dirname(realSourcePath);
    const realSourceExperimentParent = path.dirname(realSourceExperimentRoot);

    if (path.basename(realSourcePath) !== "artifacts") {
      throw previousArtifactMountValidationError(
        index,
        "sourcePath real path must remain an artifacts directory"
      );
    }

    if (context.realTrustedWorkspaceRootPath) {
      if (!isPathInside(context.realTrustedWorkspaceRootPath, realSourcePath)) {
        throw previousArtifactMountValidationError(
          index,
          "sourcePath real path must remain inside the VM workspace root"
        );
      }
    } else {
      const realCurrentExperimentParent = context.realCurrentExperimentParent ?? context.currentExperimentParent;
      if (realSourceExperimentParent !== realCurrentExperimentParent) {
        throw previousArtifactMountValidationError(
          index,
          "sourcePath real path must remain inside the same group workspace"
        );
      }
    }

    if (
      context.realCurrentExperimentRoot
        ? realSourceExperimentRoot === context.realCurrentExperimentRoot
        : realSourceExperimentRoot === context.currentExperimentRoot
    ) {
      throw previousArtifactMountValidationError(
        index,
        "sourcePath cannot target the current experiment artifacts"
      );
    }
  }

  return resolvedSourcePath;
}

function validatePreviousArtifactContainerPath(containerPath: string, index: number): string {
  if (!path.posix.isAbsolute(containerPath)) {
    throw previousArtifactMountValidationError(index, "containerPath must be absolute");
  }

  const normalizedContainerPath = path.posix.normalize(containerPath);
  if (normalizedContainerPath !== containerPath) {
    throw previousArtifactMountValidationError(index, "containerPath must be normalized");
  }

  if (!isPosixPathInside(ContainerPreviousArtifactsPath, normalizedContainerPath)) {
    throw previousArtifactMountValidationError(index, `containerPath must be under ${ContainerPreviousArtifactsPath}`);
  }

  return normalizedContainerPath;
}

function isPosixPathInside(basePath: string, targetPath: string): boolean {
  const relative = path.posix.relative(basePath, targetPath);

  return relative !== "" && !relative.startsWith("..") && !path.posix.isAbsolute(relative);
}

function realpathOrNull(filePath: string): string | null {
  try {
    return realpathSync(filePath);
  } catch {
    return null;
  }
}

function previousArtifactMountValidationError(index: number, message: string): DockerPreviousArtifactMountValidationError {
  return new DockerPreviousArtifactMountValidationError(`Invalid previous artifact mount at index ${index}: ${message}`);
}

function reviewEvidenceMountValidationError(index: number, message: string): DockerReviewEvidenceMountValidationError {
  return new DockerReviewEvidenceMountValidationError(`Invalid review evidence mount at index ${index}: ${message}`);
}

function writableStorageMountsForLayout(layout: WorkspacePreparedLayout): ContainerWritableMountSource[] {
  return [
    { hostPath: layout.workspacePath, containerPath: ContainerWorkspacePath, role: "workspace" },
    { hostPath: layout.artifactsPath, containerPath: ContainerArtifactsPath, role: "artifacts" },
    { hostPath: layout.cachePath, containerPath: ContainerCachePath, role: "cache" },
    { hostPath: layout.codexHomePath, containerPath: ContainerCodexHomePath, role: "codex-home" },
    ...(layout.datasetOutputPath
      ? [{ hostPath: layout.datasetOutputPath, containerPath: ContainerDatasetOutputPath, role: "dataset-output" }]
      : []),
  ];
}

function datasetMountSnapshots(mounts: PreparedDatasetMount[]): VmContainerDatasetMountSnapshot[] {
  return mounts.map((mount) => ({
    containerPath: mount.target,
    datasetVersionId: mount.datasetVersionId,
    name: mount.name,
    versionLabel: mount.versionLabel,
    readOnly: true,
    sizeBytes: mount.sizeBytes ?? null,
  }));
}

function appServerStderrLogFor(artifactsPath: string, maxBytes: number): { path: string; relativePath: string; maxBytes: number } {
  return {
    path: path.join(artifactsPath, AppServerStderrLogRelativePath),
    relativePath: AppServerStderrLogRelativePath,
    maxBytes,
  };
}

function dockerMountArg(mount: { source: string; target: string; readOnly: boolean }): string {
  return `type=bind,source=${mount.source},target=${mount.target}${mount.readOnly ? ",readonly" : ""}`;
}

function envArgs(env: NodeJS.ProcessEnv, excludedKeys: Set<string> | undefined = undefined): string[] {
  const args: string[] = [];

  for (const [key, value] of Object.entries(env)) {
    if (value !== undefined && !excludedKeys?.has(key)) {
      args.push("--env", key);
    }
  }

  return args;
}

function containerLdLibraryPathArgs(ldLibraryPath: string | undefined): string[] {
  return ldLibraryPath ? ["--env", `LD_LIBRARY_PATH=${ldLibraryPath}`] : [];
}

function dockerGpuMode(value: DockerGpuMode | undefined, hostDefaults: DockerHostDefaults): DockerGpuMode {
  if (value) {
    return value;
  }

  return hostDefaults.hostPlatform === "linux" && hostDefaults.containerRuntime === DefaultContainerRuntime
    ? "nvidia_direct"
    : DefaultDockerGpuMode;
}

function stringListOrDefault(values: string[] | undefined, fallback: string[]): string[] {
  const normalized = values?.map((value) => value.trim()).filter(Boolean);

  return normalized && normalized.length > 0 ? normalized : [...fallback];
}

function userArgs(runUser: string | null): string[] {
  return runUser ? ["--user", runUser] : [];
}

function resolveDockerHostDefaults(hostPlatform: NodeJS.Platform, explicitRuntime: string | null): DockerHostDefaults {
  if (explicitRuntime) {
    return {
      containerRuntime: explicitRuntime,
      dockerRuntimeMode: "explicit_runtime",
      privileged: false,
      forceNoGpus: false,
      hostPlatform,
    };
  }

  if (hostPlatform === "darwin") {
    return {
      containerRuntime: null,
      dockerRuntimeMode: "macos_privileged_dind",
      privileged: true,
      forceNoGpus: true,
      hostPlatform,
    };
  }

  if (hostPlatform === "linux") {
    return {
      containerRuntime: DefaultContainerRuntime,
      dockerRuntimeMode: "linux_sysbox",
      privileged: false,
      forceNoGpus: false,
      hostPlatform,
    };
  }

  return {
    containerRuntime: DefaultContainerRuntime,
    dockerRuntimeMode: "sysbox_default",
    privileged: false,
    forceNoGpus: false,
    hostPlatform,
  };
}

function containerRuntimeArgs(containerRuntime: string | null): string[] {
  return containerRuntime ? ["--runtime", containerRuntime] : [];
}

function privilegedArgs(privileged: boolean): string[] {
  return privileged ? ["--privileged"] : [];
}

function dockerPolicyFor(runtimeSnapshot: Record<string, Json>): AgentRuntimeDockerPolicy {
  return normalizeAgentRuntimeDockerPolicy(runtimeSnapshot.dockerPolicy ?? runtimeSnapshot.resourcePolicy);
}

function assertInnerDockerCompatiblePolicy(dockerPolicy: AgentRuntimeDockerPolicy): void {
  if (dockerPolicy.readOnlyRootFilesystem) {
    throw new DockerRuntimeUnavailableError(
      "Docker-backed Codex sessions require a writable root filesystem because inner Docker writes to /var/lib/docker, /var/run, and /var/log; disable readOnlyRootFilesystem for this runtime profile."
    );
  }
}

function networkModeFor(dockerPolicy: AgentRuntimeDockerPolicy, fallback: string): string {
  if (dockerPolicy.network === "provider") {
    return fallback;
  }

  if (dockerPolicy.network === "none") {
    return "none";
  }

  return fallback;
}

export function runUserForHostIdentity(uid: number, gid: number): string | null {
  return uid === 0 ? null : `${uid}:${gid}`;
}

function nvidiaDirectGpuFor(
  dockerPolicy: AgentRuntimeDockerPolicy,
  gpuMode: DockerGpuMode,
  devices: string[],
  libraryMounts: string[],
  utilityMounts: string[]
): { devices: string[]; enabled: boolean; libraryMounts: string[]; utilityMounts: string[] } {
  if (dockerPolicy.gpus !== "all" || gpuMode !== "nvidia_direct") {
    return { devices: [], enabled: false, libraryMounts: [], utilityMounts: [] };
  }

  return { devices, enabled: true, libraryMounts, utilityMounts };
}

function dockerResourceArgs(dockerPolicy: AgentRuntimeDockerPolicy, gpuMode: DockerGpuMode): string[] {
  const args: string[] = [];

  if (dockerPolicy.gpus === "all" && gpuMode !== "nvidia_direct") {
    args.push("--gpus", "all");
  }

  if (dockerPolicy.memoryBytes) {
    args.push("--memory", `${dockerPolicy.memoryBytes}b`);
  }

  if (dockerPolicy.cpus) {
    args.push("--cpus", String(dockerPolicy.cpus));
  }

  return args;
}

function dockerSecurityHardening(
  dockerPolicy: AgentRuntimeDockerPolicy,
  options: { dropAllCapabilities: boolean; noNewPrivileges: boolean }
): DockerSecurityHardening {
  return {
    capDrop: options.dropAllCapabilities ? "ALL" : null,
    noNewPrivileges: options.noNewPrivileges,
    init: true,
    pidsLimit: dockerPolicy.pidsLimit,
    nofileSoft: dockerPolicy.nofileSoft,
    nofileHard: dockerPolicy.nofileHard,
    readOnlyRootFilesystem: dockerPolicy.readOnlyRootFilesystem,
  };
}

function dockerSecurityArgs(hardening: DockerSecurityHardening): string[] {
  const args = [
    "--init",
    "--pids-limit",
    String(hardening.pidsLimit),
    "--ulimit",
    `nofile=${hardening.nofileSoft}:${hardening.nofileHard}`,
  ];

  if (hardening.capDrop) {
    args.unshift("--cap-drop", hardening.capDrop);
  }

  if (hardening.noNewPrivileges) {
    args.unshift("--security-opt", "no-new-privileges");
  }

  if (hardening.readOnlyRootFilesystem) {
    args.push("--read-only", "--tmpfs", "/tmp");
  }

  return args;
}

function allowedImageSet(allowedImages: string[] | undefined, defaultImage: string | undefined): Set<string> {
  const images = allowedImages === undefined ? [OfficialCodexAppServerImage, defaultImage] : allowedImages;
  return new Set(images.map((image) => normalizeOptionalString(image)).filter((image): image is string => Boolean(image)));
}

function registryCredentials(credentials: DockerRegistryCredentials | null | undefined): DockerRegistryCredentials | null {
  const registry = normalizeOptionalString(credentials?.registry);
  const username = normalizeOptionalString(credentials?.username);
  const token = normalizeOptionalString(credentials?.token);

  return registry && username && token ? { registry, username, token } : null;
}

function imageRegistry(image: string): string | null {
  const first = image.split("/")[0] ?? "";

  return first.includes(".") || first.includes(":") || first === "localhost" ? first : null;
}

function isLocalOnlyImage(image: string, defaultImage: string | undefined): boolean {
  if (imageRegistry(image)) {
    return false;
  }

  const imageRepositoryName = imageRepository(image);
  const officialRepository = imageRepository(OfficialCodexAppServerImage);
  if (imageRepositoryName === officialRepository) {
    return true;
  }

  return Boolean(
    defaultImage &&
    !imageRegistry(defaultImage) &&
    imageRepositoryName === imageRepository(defaultImage)
  );
}

function imageRepository(image: string): string {
  const digestIndex = image.indexOf("@");
  const withoutDigest = digestIndex >= 0 ? image.slice(0, digestIndex) : image;
  const lastSlashIndex = withoutDigest.lastIndexOf("/");
  const tagIndex = withoutDigest.lastIndexOf(":");
  return tagIndex > lastSlashIndex ? withoutDigest.slice(0, tagIndex) : withoutDigest;
}

function isValidImageReference(value: string): boolean {
  return /^[A-Za-z0-9][A-Za-z0-9._:/@+-]*$/.test(value);
}

function isNoSuchContainerFailure(result: DockerCliResult): boolean {
  const output = `${result.stderr}\n${result.stdout}`.toLowerCase();
  return output.includes("no such container");
}

function uniqueShellCandidates(values: Array<string | undefined>): string[] {
  const candidates: string[] = [];
  const seen = new Set<string>();

  for (const value of values) {
    const normalized = normalizeOptionalString(value);

    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      candidates.push(normalized);
    }
  }

  return candidates;
}

function containerNameFor(sessionId: string): string {
  const suffix = sessionId
    .toLowerCase()
    .replace(/[^a-z0-9_.-]+/g, "-")
    .replace(/^[^a-z0-9]+/, "")
    .slice(0, 48);

  return `yp-live-workflow-session-${suffix || "session"}`;
}

function dockerFailureMessage(result: DockerCliResult): string {
  if (result.timedOut) {
    return "Docker command timed out";
  }

  if (result.error) {
    return result.error.message;
  }

  return result.stderr.trim() || result.stdout.trim() || `Docker exited with status ${result.exitCode ?? "unknown"}`;
}

function normalizeContainerDatasetOutputPath(value: string): string {
  const normalized = path.posix.normalize(value);

  if (normalized === ContainerDatasetOutputPath || normalized.startsWith(`${ContainerDatasetOutputPath}/`)) {
    return normalized;
  }

  throw new DockerRuntimeUnavailableError(`Dataset output normalization path must stay under ${ContainerDatasetOutputPath}`);
}

function normalizeContainerArtifactOutputPath(value: string): string {
  const normalized = path.posix.normalize(value);

  if (normalized === ContainerArtifactsPath || normalized.startsWith(`${ContainerArtifactsPath}/`)) {
    return normalized;
  }

  throw new DockerRuntimeUnavailableError(`Artifact output normalization path must stay under ${ContainerArtifactsPath}`);
}

function normalizeOptionalString(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeOptionalPath(value: string | null | undefined): string | undefined {
  const normalized = normalizeOptionalString(value);
  return normalized ? path.resolve(normalized) : undefined;
}

function positiveIntegerOrDefault(value: number | undefined, fallback: number, name: string): number {
  if (value === undefined) {
    return fallback;
  }

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }

  return value;
}

function isPathInside(basePath: string, targetPath: string): boolean {
  const relative = path.relative(basePath, targetPath);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function pathExistsNoFollow(filePath: string): boolean {
  try {
    lstatSync(filePath);
    return true;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT" || code === "ENOTDIR") return false;
    // Unknown inspection failures are treated as present so sensitive mounts fail closed.
    return true;
  }
}
