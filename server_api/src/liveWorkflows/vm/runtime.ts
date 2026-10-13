import path from "node:path";
import { DurableOutbox } from "./durableOutbox.js";
import { WorkflowVmRuntime } from "./workflowRuntime.js";
import type { VmCodexAuthMaterialUpdatedPayload, VmContainerStatsSnapshot, VmSessionEventPayload } from "../contracts/index.js";
import { VmAgentApiClient, type FetchLike } from "./apiClient.js";
import { ArtifactCollector, createArtifactCollectorFromConfig } from "./artifacts/artifactCollector.js";
import { VmAgentBrokerClient } from "./brokerClient.js";
import { CodexAdapter } from "./codex/codexAdapter.js";
import type { VmCommandHandler, VmCommandRouter } from "./commands/vmCommandRouter.js";
import { loadVmAgentConfig, type VmAgentConfig } from "./config.js";
import {
  createVmAgentConsoleEventSink,
  type VmAgentConsoleEventSink,
} from "./consoleEvents.js";
import {
  createDefaultVmCommandRouter,
  startVmAgentControlServer,
  type VmAgentControlServer,
} from "./controlServer.js";
import { DatasetManager } from "./datasets/datasetManager.js";
import { DockerRuntimeManager } from "./docker/dockerRuntimeManager.js";
import { HostRegistrar, type VmAgentRuntimeCapabilities, type VmAgentSessionCapacity } from "./host/hostRegistrar.js";
import { MetricsReporter, type VmTelemetrySnapshot } from "./metrics/metricsReporter.js";
import { FileVmAgentStateStore, type VmAgentStateStore } from "./stateStore.js";
import { AuxTerminalBridge } from "./terminal/auxTerminalBridge.js";
import { WorkspaceManager } from "./workspace/workspaceManager.js";

export type VmAgentRuntimeStatus = {
  vmHostId: string;
  closed: boolean;
  lastHeartbeatAt?: string;
  lastTelemetryAt?: string;
};

export type VmAgentRuntime = VmAgentRuntimeStatus & {
  close(): Promise<void>;
  getStatus(): VmAgentRuntimeStatus;
  heartbeatNow(status?: string): Promise<void>;
  telemetryNow(): Promise<void>;
};

export type StartVmAgentOptions = {
  config?: VmAgentConfig;
  env?: NodeJS.ProcessEnv;
  fetchImpl?: FetchLike;
  stateStore?: VmAgentStateStore;
  metricsReporter?: MetricsReporter;
  workspaceManager?: WorkspaceManager;
  codexAdapter?: CodexAdapter;
  consoleEventSink?: VmAgentConsoleEventSink;
  datasetManager?: DatasetManager;
  artifactCollector?: ArtifactCollector;
  dockerRuntime?: DockerRuntimeManager;
  auxTerminalBridge?: AuxTerminalBridge;
  hostRegistrar?: HostRegistrar;
  commandHandlers?: VmCommandHandler[];
  commandRouter?: VmCommandRouter;
  shutdownDrainTimeoutMs?: number;
};

const DefaultShutdownDrainTimeoutMs = 5000;

export async function startVmAgent(options: StartVmAgentOptions = {}): Promise<VmAgentRuntime> {
  return VmAgentRuntimeController.start(options);
}

export class VmAgentRuntimeController implements VmAgentRuntime {
  vmHostId = "";
  closed = false;

  private readonly config: VmAgentConfig;
  private readonly stateStore: VmAgentStateStore;
  private readonly metricsReporter: MetricsReporter;
  private readonly workspaceManager: WorkspaceManager;
  private readonly codexAdapter: CodexAdapter;
  private readonly consoleEventSink?: VmAgentConsoleEventSink;
  private readonly datasetManager: DatasetManager;
  private readonly artifactCollector: ArtifactCollector;
  private readonly dockerRuntime: DockerRuntimeManager;
  private readonly auxTerminalBridge: AuxTerminalBridge;
  private readonly hostRegistrar: HostRegistrar;
  private readonly client: VmAgentApiClient;
  private readonly commandHandlers?: VmCommandHandler[];
  private readonly commandRouter: VmCommandRouter;
  private readonly shutdownDrainTimeoutMs: number;
  private outbox!: DurableOutbox;
  private workflowRuntime: WorkflowVmRuntime;
  private outboxTimer?: ReturnType<typeof setInterval>;
  private controlServer: VmAgentControlServer | undefined;
  private brokerClient: VmAgentBrokerClient | undefined;
  private lastHeartbeatAtValue: string | undefined;
  private lastTelemetryAtValue: string | undefined;
  private readonly loops: NonOverlappingLoop[] = [];
  private readonly loopAbortController = new AbortController();
  private runtimeCapabilities: VmAgentRuntimeCapabilities = {
    docker: false,
    codexAppServer: false,
    auxTerminal: false,
  };

  static async start(options: StartVmAgentOptions = {}): Promise<VmAgentRuntimeController> {
    const runtime = new VmAgentRuntimeController(options);
    await runtime.start();
    return runtime;
  }

  constructor(options: StartVmAgentOptions = {}) {
    this.config = options.config ?? loadVmAgentConfig(options.env);
    this.stateStore = options.stateStore ?? new FileVmAgentStateStore(this.config.statePath);
    this.metricsReporter = options.metricsReporter ?? new MetricsReporter();
    this.workspaceManager =
      options.workspaceManager ??
      new WorkspaceManager({
        allowedRootPath: this.config.workspaceRoot,
        allowedDatasetOutputRootPath: this.config.datasetsHotRoot,
      });
    this.consoleEventSink = options.consoleEventSink ?? (
      this.config.consoleEventsEnabled ? createVmAgentConsoleEventSink() : undefined
    );
    this.dockerRuntime =
      options.dockerRuntime ??
      new DockerRuntimeManager({
        dockerBin: this.config.dockerBin,
        defaultImage: this.config.codexContainerImage,
        containerLdLibraryPath: this.config.codexContainerLdLibraryPath,
        defaultNetworkMode: this.config.dockerNetworkMode,
        allowedImages: this.config.codexAllowedImages,
        runUser: this.config.dockerRunUser,
        dropAllCapabilities: this.config.dockerDropAllCapabilities,
        noNewPrivileges: this.config.dockerNoNewPrivileges,
        archiveRoot: this.config.archiveRoot,
        workspaceRootPath: this.config.workspaceRoot,
        datasetsHotRootPath: this.config.datasetsHotRoot,
        registryCredentials: registryCredentialsFromConfig(this.config),
        containerRuntime: this.config.dockerRuntime,
        gpuMode: this.config.dockerGpuMode,
        nvidiaDirectDevices: this.config.dockerNvidiaDirectDevices,
        nvidiaDirectLibraryMounts: this.config.dockerNvidiaDirectLibraryMounts,
        nvidiaDirectUtilityMounts: this.config.dockerNvidiaDirectUtilityMounts,
        maxCodexSessions: this.config.maxCodexSessions,
      });
    this.datasetManager =
      options.datasetManager ??
      new DatasetManager({
        hotRoot: this.config.datasetsHotRoot,
        trustedLocalRoots: this.config.datasetsLocalRoots,
      });
    this.artifactCollector = options.artifactCollector ?? createArtifactCollectorFromConfig(this.config);
    this.auxTerminalBridge =
      options.auxTerminalBridge ??
      new AuxTerminalBridge({
        enabled: this.config.auxTerminalEnabled,
        shell: this.config.auxTerminalShell,
        backlogBytes: this.config.auxTerminalBacklogBytes,
        allowedRootPath: this.config.workspaceRoot,
      });
    this.codexAdapter =
      options.codexAdapter ??
      new CodexAdapter({
        env: options.env,
        codexCommand: this.config.codexCommand,
        codexArgs: this.config.codexArgs,
        dockerRuntime: this.dockerRuntime,
        datasetManager: this.datasetManager,
        serverRequestMode: this.config.codexServerRequestMode,
        consoleEventSink: this.consoleEventSink,
        authMaterialUpdateSink: {
          publishCodexAuthMaterialUpdated: (payload) => this.publishCodexAuthMaterialUpdated(payload),
        },
      });
    this.hostRegistrar = options.hostRegistrar ?? new HostRegistrar();
    this.workflowRuntime = new WorkflowVmRuntime(this.config, this.codexAdapter);
    this.commandHandlers = [...this.workflowRuntime.handlers(), ...(options.commandHandlers ?? [])];
    this.commandRouter =
      options.commandRouter ??
      createDefaultVmCommandRouter(
        this.workspaceManager,
        this.codexAdapter,
        this.dockerRuntime,
        this.artifactCollector,
        this.auxTerminalBridge,
        {
          publishSessionEvent: (event) => this.publishSessionEvent(event),
        },
        this.commandHandlers,
        this.datasetManager,
        this.config.workspaceRoot
      );
    this.shutdownDrainTimeoutMs = options.shutdownDrainTimeoutMs ?? DefaultShutdownDrainTimeoutMs;
    this.client = new VmAgentApiClient({
      apiBaseUrl: this.config.apiBaseUrl,
      token: this.config.token,
      fetchImpl: options.fetchImpl,
    });
    this.outbox = new DurableOutbox(path.join(path.dirname(this.config.statePath), "event-outbox"), async item => {
      await this.client.sendEvent(item.type as "session.event" | "codex.auth.material.updated", item.data as object);
    });
    this.outboxTimer = setInterval(() => { void this.outbox.drain().catch(() => undefined); }, 2000);
    this.outboxTimer.unref();

  }

  get lastHeartbeatAt(): string | undefined {
    return this.lastHeartbeatAtValue;
  }

  get lastTelemetryAt(): string | undefined {
    return this.lastTelemetryAtValue;
  }

  async close(): Promise<void> {
    if (this.closed) {
      return;
    }

    this.closed = true;
    clearInterval(this.outboxTimer);
    await this.workflowRuntime.close();
    this.loopAbortController.abort();

    for (const loop of this.loops) {
      loop.stop();
    }

    await drainLoopsWithTimeout(this.loops, this.shutdownDrainTimeoutMs);

    try {
      await this.brokerClient?.close();
    } catch {
      // The offline heartbeat below is the authoritative shutdown signal.
    }

    try {
      await this.sendHeartbeat("offline", { allowClosed: true });
    } catch {
      // Shutdown should not hang or fail because the control plane is unavailable.
    }

    await this.controlServer?.close();
  }

  getStatus(): VmAgentRuntimeStatus {
    return {
      vmHostId: this.vmHostId,
      closed: this.closed,
      lastHeartbeatAt: this.lastHeartbeatAt,
      lastTelemetryAt: this.lastTelemetryAt,
    };
  }

  async heartbeatNow(status = "available"): Promise<void> {
    if (this.closed) {
      throw new Error("VM agent runtime is closed");
    }

    await this.sendHeartbeat(status);
  }

  async telemetryNow(): Promise<void> {
    if (this.closed) {
      throw new Error("VM agent runtime is closed");
    }

    await this.sendTelemetry();
  }

  private async start(): Promise<void> {
    try {
      this.controlServer = await this.maybeStartControlServer();
      this.runtimeCapabilities = await this.detectRuntimeCapabilities();
      await this.cleanupOrphanContainers();
      const savedState = this.config.vmHostId ? {} : await this.stateStore.read();
      const initialVmHostId = this.config.vmHostId ?? savedState.vmHostId;
      const initialSnapshot = await this.metricsReporter.collectSnapshot(this.config);
      this.rememberGpuCapability(initialSnapshot);
      const registerAck = await this.client.sendEvent(
        "vm.register",
        this.hostRegistrar.createRegistrationPayload({
          config: this.config,
          snapshot: initialSnapshot,
          ...(initialVmHostId ? { vmHostId: initialVmHostId } : {}),
          controlBaseUrl: this.controlServer?.baseUrl,
          runtimeCapabilities: this.runtimeCapabilities,
          sessionCapacity: this.sessionCapacitySnapshot(),
        })
      );
      this.vmHostId = registerAck.vmHostId;
      await this.workflowRuntime.recover();
      this.consoleEventSink?.({
        source: "vm",
        event: "registered",
        fields: {
          host: this.vmHostId,
          docker: this.runtimeCapabilities.docker,
          codex: this.runtimeCapabilities.codexAppServer,
        },
      });

      if (!this.config.vmHostId) {
        await this.stateStore.write({ vmHostId: this.vmHostId });
      }

      this.maybeStartBrokerClient();
      await this.sendHeartbeat("available");
      await this.sendTelemetry();
      this.loops.push(
        createNonOverlappingLoop(this.config.heartbeatIntervalMs, () =>
          this.sendHeartbeat("available", { signal: this.loopAbortController.signal })
        )
      );
      this.loops.push(
        createNonOverlappingLoop(this.config.telemetryIntervalMs, () =>
          this.sendTelemetry({ signal: this.loopAbortController.signal })
        )
      );
    } catch (error) {
      await this.brokerClient?.close().catch(() => undefined);
      await this.controlServer?.close().catch(() => undefined);
      throw error;
    }
  }

  private async sendHeartbeat(
    status: string,
    options: { allowClosed?: boolean; signal?: AbortSignal } = {}
  ): Promise<void> {
    if (shouldSuppressSend(this.closed, options)) {
      return;
    }

    await this.client.sendEvent(
      "vm.heartbeat",
      this.hostRegistrar.createHeartbeatPayload({
        config: this.config,
        vmHostId: this.vmHostId,
        status,
        controlBaseUrl: this.controlServer?.baseUrl,
        runtimeCapabilities: this.runtimeCapabilities,
        sessionCapacity: this.sessionCapacitySnapshot(),
      }),
      { signal: options.signal }
    );

    if (shouldSuppressSend(this.closed, options)) {
      return;
    }

    this.lastHeartbeatAtValue = new Date().toISOString();
  }

  private async sendTelemetry(options: { allowClosed?: boolean; signal?: AbortSignal } = {}): Promise<void> {
    if (shouldSuppressSend(this.closed, options)) {
      return;
    }

    const snapshot = await this.metricsReporter.collectSnapshot(this.config);
    this.rememberGpuCapability(snapshot);
    const containers = await this.collectContainerStatsSafely();

    if (shouldSuppressSend(this.closed, options)) {
      return;
    }

    await this.client.sendEvent(
      "vm.telemetry",
      this.hostRegistrar.createTelemetryPayload({
        config: this.config,
        vmHostId: this.vmHostId,
        snapshot,
        containers,
        controlBaseUrl: this.controlServer?.baseUrl,
        runtimeCapabilities: this.runtimeCapabilities,
        sessionCapacity: this.sessionCapacitySnapshot(),
      }),
      { signal: options.signal }
    );

    if (shouldSuppressSend(this.closed, options)) {
      return;
    }

    this.lastTelemetryAtValue = new Date().toISOString();
  }

  private rememberGpuCapability(snapshot: VmTelemetrySnapshot): void {
    const gpu = snapshot.telemetry.gpu;
    const available = typeof gpu === "object" && gpu !== null && !Array.isArray(gpu) && gpu.available === true;
    this.runtimeCapabilities = { ...this.runtimeCapabilities, gpu: available };
  }

  /** Container stats are best-effort: a failure must not skip the telemetry tick. */
  private async collectContainerStatsSafely(): Promise<VmContainerStatsSnapshot[]> {
    try {
      return await this.dockerRuntime.collectContainerStats();
    } catch {
      return [];
    }
  }

  private async maybeStartControlServer(): Promise<VmAgentControlServer | undefined> {
    if (this.config.controlPort === undefined) {
      return undefined;
    }

    return startVmAgentControlServer({
      host: this.config.controlHost,
      port: this.config.controlPort,
      token: this.config.token,
      baseUrl: this.config.controlBaseUrl,
      workspaceManager: this.workspaceManager,
      workspaceRoot: this.config.workspaceRoot,
      datasetsHotRoot: this.config.datasetsHotRoot,
      codexAdapter: this.codexAdapter,
      datasetManager: this.datasetManager,
      artifactCollector: this.artifactCollector,
      dockerRuntime: this.dockerRuntime,
      auxTerminalBridge: this.auxTerminalBridge,
      archiveRoot: this.config.archiveRoot,
      metricsReporter: this.metricsReporter,
      sessionEventSink: {
        publishSessionEvent: async (event) => {
          await this.publishSessionEvent(event);
        },
      },
      commandHandlers: this.commandHandlers,
      commandRouter: this.commandRouter,
    });
  }

  private maybeStartBrokerClient(): void {
    if (!this.config.brokerEnabled || this.brokerClient) {
      return;
    }

    const controlBaseUrl = this.controlServer?.baseUrl;
    this.brokerClient = new VmAgentBrokerClient({
      wsUrl: this.config.brokerWsUrl,
      token: this.config.token,
      vmHostId: this.vmHostId,
      capabilities: this.hostRegistrar.capabilities(controlBaseUrl, this.runtimeCapabilities),
      metadata: this.hostRegistrar.metadata(
        this.config,
        controlBaseUrl,
        this.runtimeCapabilities,
        this.sessionCapacitySnapshot()
      ),
      commandRouter: this.commandRouter,
      reconnectMinMs: this.config.brokerReconnectMinMs,
      reconnectMaxMs: this.config.brokerReconnectMaxMs,
    });
    this.brokerClient.start();
  }

  private async publishSessionEvent(event: VmSessionEventPayload): Promise<void> {
    await this.outbox.enqueue("session.event", event, `${event.sessionId}:${event.vmEventStreamId}:${event.seq}`);
  }

  private async publishCodexAuthMaterialUpdated(payload: VmCodexAuthMaterialUpdatedPayload): Promise<void> {
    await this.outbox.enqueue("codex.auth.material.updated", payload, `${payload.authProfileId}:${payload.currentFingerprintSha256}`);
  }

  private async detectRuntimeCapabilities(): Promise<VmAgentRuntimeCapabilities> {
    const probe = await this.dockerRuntime.probe().catch((error) => ({
      available: false,
      version: null,
      error: error instanceof Error ? error.message : "Docker probe failed",
    }));

    return {
      docker: probe.available,
      codexAppServer: Boolean(this.controlServer?.baseUrl) && probe.available,
      auxTerminal: this.config.auxTerminalEnabled && probe.available && Boolean(this.controlServer?.baseUrl),
      dockerVersion: probe.version ?? null,
    };
  }

  private sessionCapacitySnapshot(): VmAgentSessionCapacity {
    const dockerStatus = this.dockerRuntime.getStatus();

    return {
      maxCodexSessions: this.config.maxCodexSessions,
      activeCodexSessions: dockerStatus.activeCodexSessions,
      sessionCountsByStatus: dockerStatus.sessionCountsByStatus,
    };
  }

  private async cleanupOrphanContainers(): Promise<void> {
    if (!this.runtimeCapabilities.docker) {
      return;
    }

    try {
      await this.dockerRuntime.scanOrphans();
    } catch (error) {
      console.error("LiveWorkflow VM agent Docker orphan scan failed", error);
    }
  }
}

function registryCredentialsFromConfig(config: VmAgentConfig) {
  if (!config.ghcrUsername || !config.ghcrToken) {
    return null;
  }

  return {
    registry: "ghcr.io",
    username: config.ghcrUsername,
    token: config.ghcrToken,
  };
}

type NonOverlappingLoop = {
  stop(): void;
  drain(): Promise<void>;
};

async function drainLoopsWithTimeout(loops: NonOverlappingLoop[], timeoutMs: number): Promise<void> {
  const drain = Promise.all(loops.map((loop) => loop.drain())).then(() => undefined);

  if (timeoutMs <= 0) {
    return;
  }

  let timer: ReturnType<typeof setTimeout> | undefined;
  await Promise.race([
    drain,
    new Promise<void>((resolve) => {
      timer = setTimeout(resolve, timeoutMs);
    }),
  ]);

  if (timer) {
    clearTimeout(timer);
  }
}

function createNonOverlappingLoop(intervalMs: number, task: () => Promise<void>): NonOverlappingLoop {
  let active: Promise<void> | undefined;
  const timer = setInterval(() => {
    if (active) {
      return;
    }

    active = task()
      .catch((error) => {
        if (isAbortError(error)) {
          return;
        }

        console.error("LiveWorkflow VM agent periodic task failed", error);
      })
      .finally(() => {
        active = undefined;
      });
  }, intervalMs);

  return {
    stop() {
      clearInterval(timer);
    },
    async drain() {
      await active;
    },
  };
}

function shouldSuppressSend(
  closed: boolean,
  options: { allowClosed?: boolean; signal?: AbortSignal }
): boolean {
  return options.signal?.aborted === true || (closed && options.allowClosed !== true);
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}
