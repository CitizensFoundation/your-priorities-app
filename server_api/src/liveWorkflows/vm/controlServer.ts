import http, { type IncomingMessage, type ServerResponse } from "node:http";
import { timingSafeEqual } from "node:crypto";
import { ArtifactCollector } from "./artifacts/artifactCollector.js";
import { CodexAdapter, CodexSessionNotActiveError } from "./codex/codexAdapter.js";
import { ArtifactCollectCommandHandler } from "./commands/artifactCollectCommandHandler.js";
import {
  AuxTerminalCloseCommandHandler,
  AuxTerminalInputCommandHandler,
  AuxTerminalOpenCommandHandler,
  AuxTerminalResizeCommandHandler,
} from "./commands/auxTerminalCommandHandlers.js";
import { RuntimeEnsureImageCommandHandler, VmCommandValidationError } from "./commands/runtimeEnsureImageCommandHandler.js";
import {
  CodexAuthLoginCancelCommandHandler,
  CodexAuthLoginCompleteCommandHandler,
  CodexAuthLoginStartCommandHandler,
} from "./commands/codexAuthCommandHandlers.js";
import { DatasetPromoteCommandHandler } from "./commands/datasetPromoteCommandHandler.js";
import { DatasetOutputNormalizeCommandHandler } from "./commands/datasetOutputNormalizeCommandHandler.js";
import { DatasetValidateCommandHandler } from "./commands/datasetValidateCommandHandler.js";
import { DatasetFilePreviewCommandHandler } from "./commands/datasetFilePreviewCommandHandler.js";
import {
  SessionApprovalRespondCommandHandler,
  SessionInjectItemsCommandHandler,
  SessionInterruptCommandHandler,
  SessionPauseCommandHandler,
  SessionResumeCommandHandler,
  SessionReviewStartCommandHandler,
  SessionTerminateCommandHandler,
  SessionThreadForkCommandHandler,
  SessionTurnStartCommandHandler,
  SessionTurnSteerCommandHandler,
  WorkspaceArchiveCommandHandler,
} from "./commands/sessionControlCommandHandlers.js";
import { SessionStartCommandHandler, type VmSessionEventSink } from "./commands/sessionStartCommandHandler.js";
import { VmCommandDeduplicationError, VmCommandRouter, type VmCommandHandler } from "./commands/vmCommandRouter.js";
import { WorkspaceFileReadCommandHandler } from "./commands/workspaceFileReadCommandHandler.js";
import { WorkspacePrepareCommandHandler } from "./commands/workspacePrepareCommandHandler.js";
import { DatasetManager } from "./datasets/datasetManager.js";
import {
  DockerImagePolicyError,
  DockerRuntimeManager,
  DockerRuntimeUnavailableError,
} from "./docker/dockerRuntimeManager.js";
import { MetricsReporter } from "./metrics/metricsReporter.js";
import { AuxTerminalBridge, AuxTerminalError } from "./terminal/auxTerminalBridge.js";
import type { WorkspaceManager } from "./workspace/workspaceManager.js";

export type VmAgentControlServer = {
  baseUrl: string;
  close(): Promise<void>;
};

export type StartVmAgentControlServerOptions = {
  host: string;
  port: number;
  token: string;
  baseUrl?: string;
  workspaceManager: WorkspaceManager;
  workspaceRoot?: string;
  datasetsHotRoot?: string;
  codexAdapter?: CodexAdapter;
  datasetManager?: DatasetManager;
  artifactCollector?: ArtifactCollector;
  dockerRuntime?: DockerRuntimeManager;
  auxTerminalBridge?: AuxTerminalBridge;
  archiveRoot?: string;
  metricsReporter?: MetricsReporter;
  sessionEventSink?: VmSessionEventSink;
  commandHandlers?: VmCommandHandler[];
  commandRouter?: VmCommandRouter;
  now?: () => Date;
};

const DefaultMaxCommandRequestBytes = 5 * 1024 * 1024;
const MaxArtifactCollectRequestBytes = 16 * 1024 * 1024;
const MaxDatasetValidateRequestBytes = 16 * 1024 * 1024;

export async function startVmAgentControlServer(
  options: StartVmAgentControlServerOptions
): Promise<VmAgentControlServer> {
  const now = options.now ?? (() => new Date());
  const dockerRuntime = options.dockerRuntime ?? new DockerRuntimeManager({
    archiveRoot: options.archiveRoot,
    workspaceRootPath: options.workspaceRoot,
    datasetsHotRootPath: options.datasetsHotRoot,
    dropAllCapabilities: false,
    runUser: "0:0",
  });
  const artifactCollector = options.artifactCollector ?? new ArtifactCollector({ allowedRootPath: options.workspaceRoot });
  const auxTerminalBridge = options.auxTerminalBridge ?? new AuxTerminalBridge({ allowedRootPath: options.workspaceRoot });
  const codexAdapter =
    options.codexAdapter ?? new CodexAdapter({ dockerRuntime, datasetManager: options.datasetManager });
  const metricsReporter = options.metricsReporter ?? new MetricsReporter();
  const router =
    options.commandRouter ??
    createDefaultVmCommandRouter(
      options.workspaceManager,
      codexAdapter,
      dockerRuntime,
      artifactCollector,
      auxTerminalBridge,
      options.sessionEventSink,
      options.commandHandlers,
      options.datasetManager,
      options.workspaceRoot
    );
  const server = http.createServer(async (req, res) => {
    try {
      await handleRequest(req, res, options, router, now, dockerRuntime, codexAdapter, metricsReporter, auxTerminalBridge);
    } catch (error) {
      const status = controlServerErrorStatus(error);
      const errorMessage = error instanceof Error ? error.message : "Unexpected VM agent control server error";
      console.error("VM agent command failed", {
        method: req.method,
        path: requestPath(req.url),
        status,
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
      });
      writeJson(res, status, {
        ok: false,
        error: errorMessage,
      });
    }
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(options.port, options.host, () => {
      server.off("error", reject);
      resolve();
    });
  });

  const address = server.address();
  const boundPort = typeof address === "object" && address ? address.port : options.port;
  const baseUrl = options.baseUrl ?? `http://${options.host}:${boundPort}`;

  return {
    baseUrl,
    async close() {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
      await auxTerminalBridge.closeAll();
      await codexAdapter.closeAll();
    },
  };
}

async function handleRequest(
  req: IncomingMessage,
  res: ServerResponse,
  options: StartVmAgentControlServerOptions,
  router: VmCommandRouter,
  now: () => Date,
  dockerRuntime: DockerRuntimeManager,
  codexAdapter: CodexAdapter,
  metricsReporter: MetricsReporter,
  auxTerminalBridge: AuxTerminalBridge
): Promise<void> {
  const path = requestPath(req.url);

  if (!isAuthorized(req.headers.authorization, options.token)) {
    writeJson(res, 403, { ok: false, error: "VM agent command authorization failed" });
    return;
  }

  if (req.method === "GET" || req.method === "POST") {
    if (req.method === "POST" && path === "/commands/workspace.file.materialize") {
      const response = await handleWorkspaceFileMaterializeRequest(req, options.workspaceManager);
      writeJson(res, 200, response);
      return;
    }

    const response = await handleRuntimeControlRequest(
      req.method,
      path,
      options,
      now,
      dockerRuntime,
      codexAdapter,
      metricsReporter,
      auxTerminalBridge
    );

    if (response) {
      writeJson(res, response.statusCode, response.body);
      return;
    }
  }

  if (req.method !== "POST" || !router.has(path)) {
    writeJson(res, 404, { ok: false, error: "Unknown VM agent command endpoint" });
    return;
  }

  const response = await router.dispatch(path, JSON.parse(await readBody(req, maxRequestBytesForPath(path))), { now });

  writeJson(res, 200, response);
}

async function handleWorkspaceFileMaterializeRequest(
  req: IncomingMessage,
  workspaceManager: WorkspaceManager
): Promise<unknown> {
  const metadataHeader = req.headers["x-yp-live-workflow-workspace-file"];
  const metadataValue = Array.isArray(metadataHeader) ? metadataHeader[0] : metadataHeader;

  if (!metadataValue) {
    throw new VmCommandValidationError("Workspace file materialization metadata is required");
  }

  let payload: unknown;
  try {
    payload = JSON.parse(Buffer.from(metadataValue, "base64url").toString("utf8"));
  } catch {
    throw new VmCommandValidationError("Workspace file materialization metadata is invalid");
  }

  return await workspaceManager.materializeWorkspaceFile(payload as never, req);
}

async function handleRuntimeControlRequest(
  method: string,
  path: string,
  options: StartVmAgentControlServerOptions,
  now: () => Date,
  dockerRuntime: DockerRuntimeManager,
  codexAdapter: CodexAdapter,
  metricsReporter: MetricsReporter,
  auxTerminalBridge: AuxTerminalBridge
): Promise<{ statusCode: number; body: unknown } | null> {
  if (method === "GET" && path === "/healthz") {
    return {
      statusCode: 200,
      body: {
        ok: true,
        status: "healthy",
        ts: now().toISOString(),
        uptimeSeconds: process.uptime(),
      },
    };
  }

  if (method === "GET" && path === "/status") {
    return {
      statusCode: 200,
      body: {
        ok: true,
        ...dockerRuntime.getStatus(),
      },
    };
  }

  if (method === "GET" && path === "/metrics") {
    return {
      statusCode: 200,
      body: {
        ok: true,
        metrics: await metricsReporter.collectSnapshot({
          workspaceRoot: options.workspaceRoot ?? "/mnt/experiments",
          archiveRoot: options.archiveRoot ?? "/mnt/archive",
        }),
      },
    };
  }

  if (method === "GET" && path === "/workspaces") {
    return {
      statusCode: 200,
      body: {
        ok: true,
        workspaces: await options.workspaceManager.listWorkspaces(options.workspaceRoot),
      },
    };
  }

  if (method === "GET" && path === "/sessions") {
    return {
      statusCode: 200,
      body: {
        ok: true,
        sessions: dockerRuntime.listSessions(),
      },
    };
  }

  if (method === "POST" && path === "/containers/reap") {
    return {
      statusCode: 200,
      body: {
        ok: true,
        cleanup: await dockerRuntime.cleanupOrphans(),
      },
    };
  }

  const sessionMatch = /^\/sessions\/([^/]+)$/.exec(path);

  if (method === "GET" && sessionMatch) {
    const session = dockerRuntime.getSession(decodeURIComponent(sessionMatch[1] ?? ""));
    return session
      ? { statusCode: 200, body: { ok: true, session } }
      : { statusCode: 404, body: { ok: false, error: "VM agent session was not found" } };
  }

  const terminateMatch = /^\/sessions\/([^/]+)\/terminate$/.exec(path);

  if (method === "POST" && terminateMatch) {
    const sessionId = decodeURIComponent(terminateMatch[1] ?? "");
    auxTerminalBridge.closeSession(sessionId);
    let session = dockerRuntime.getSession(sessionId);
    try {
      await codexAdapter.closeSession(sessionId);
    } finally {
      session = await dockerRuntime.terminateSession(sessionId);
    }

    return session
      ? { statusCode: 200, body: { ok: true, session } }
      : { statusCode: 404, body: { ok: false, error: "VM agent session was not found" } };
  }

  const archiveMatch = /^\/sessions\/([^/]+)\/archive$/.exec(path);

  if (method === "POST" && archiveMatch) {
    const sessionId = decodeURIComponent(archiveMatch[1] ?? "");
    if (!dockerRuntime.getSession(sessionId)) {
      return { statusCode: 404, body: { ok: false, error: "VM agent session was not found" } };
    }

    auxTerminalBridge.closeSession(sessionId);
    await codexAdapter.closeSession(sessionId);
    const session = await dockerRuntime.archiveSession(sessionId);

    return session
      ? { statusCode: 200, body: { ok: true, session } }
      : { statusCode: 404, body: { ok: false, error: "VM agent session was not found" } };
  }

  const auxBacklogMatch = /^\/sessions\/([^/]+)\/aux-terminal\/([^/]+)\/backlog$/.exec(path);

  if (method === "GET" && auxBacklogMatch) {
    const sessionId = decodeURIComponent(auxBacklogMatch[1] ?? "");
    const terminalId = decodeURIComponent(auxBacklogMatch[2] ?? "");
    const backlog = auxTerminalBridge.backlog(sessionId, terminalId);

    return backlog
      ? { statusCode: 200, body: { ok: true, ...backlog } }
      : { statusCode: 404, body: { ok: false, error: "VM agent aux terminal was not found" } };
  }

  return null;
}

export function createDefaultVmCommandRouter(
  workspaceManager: WorkspaceManager,
  codexAdapter: CodexAdapter,
  dockerRuntime: DockerRuntimeManager,
  artifactCollector: ArtifactCollector,
  auxTerminalBridge: AuxTerminalBridge,
  sessionEventSink?: VmSessionEventSink,
  commandHandlers: VmCommandHandler[] = [],
  datasetManager?: DatasetManager,
  workspaceRoot?: string
): VmCommandRouter {
  return new VmCommandRouter([
    new WorkspacePrepareCommandHandler(workspaceManager),
    new WorkspaceFileReadCommandHandler(dockerRuntime),
    new CodexAuthLoginStartCommandHandler(codexAdapter, workspaceManager),
    new CodexAuthLoginCompleteCommandHandler(codexAdapter),
    new CodexAuthLoginCancelCommandHandler(codexAdapter),
    new SessionStartCommandHandler(codexAdapter, workspaceManager, sessionEventSink),
    new WorkspaceArchiveCommandHandler(codexAdapter, dockerRuntime, auxTerminalBridge),
    new SessionPauseCommandHandler(codexAdapter),
    new SessionResumeCommandHandler(codexAdapter),
    new SessionThreadForkCommandHandler(codexAdapter),
    new SessionTurnStartCommandHandler(codexAdapter),
    new SessionTurnSteerCommandHandler(codexAdapter),
    new SessionInjectItemsCommandHandler(codexAdapter),
    new SessionInterruptCommandHandler(codexAdapter),
    new SessionApprovalRespondCommandHandler(codexAdapter),
    new SessionReviewStartCommandHandler(codexAdapter),
    new SessionTerminateCommandHandler(codexAdapter, dockerRuntime, auxTerminalBridge),
    new RuntimeEnsureImageCommandHandler(dockerRuntime),
    new ArtifactCollectCommandHandler(artifactCollector, dockerRuntime),
    new AuxTerminalOpenCommandHandler(auxTerminalBridge, dockerRuntime),
    new AuxTerminalInputCommandHandler(auxTerminalBridge),
    new AuxTerminalResizeCommandHandler(auxTerminalBridge),
    new AuxTerminalCloseCommandHandler(auxTerminalBridge),
    ...(datasetManager && workspaceRoot ? [new DatasetPromoteCommandHandler(datasetManager, workspaceRoot)] : []),
    ...(datasetManager ? [new DatasetOutputNormalizeCommandHandler(datasetManager, dockerRuntime)] : []),
    ...(datasetManager ? [new DatasetValidateCommandHandler(datasetManager)] : []),
    ...(datasetManager ? [new DatasetFilePreviewCommandHandler(datasetManager)] : []),
    ...commandHandlers,
  ]);
}

function requestPath(url: string | undefined): string {
  if (!url) {
    return "";
  }

  return new URL(url, "http://vm-agent.local").pathname;
}

function maxRequestBytesForPath(path: string): number {
  if (path === "/commands/artifact.collect") {
    return MaxArtifactCollectRequestBytes;
  }

  if (path === "/commands/dataset.validate") {
    return MaxDatasetValidateRequestBytes;
  }

  return DefaultMaxCommandRequestBytes;
}

function readBody(req: IncomingMessage, maxBytes: number): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    let body = "";

    req.setEncoding("utf8");
    req.on("data", (chunk: string) => {
      body += chunk;

      if (Buffer.byteLength(body, "utf8") > maxBytes) {
        reject(new Error("VM agent command body is too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function writeJson(res: ServerResponse, statusCode: number, body: unknown): void {
  res.statusCode = statusCode;
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify(body));
}

function isAuthorized(header: string | string[] | undefined, token: string): boolean {
  if (typeof header !== "string") {
    return false;
  }

  const actual = Buffer.from(header);
  const expected = Buffer.from(`Bearer ${token}`);

  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function controlServerErrorStatus(error: unknown): number {
  if (
    error instanceof SyntaxError ||
    error instanceof VmCommandValidationError ||
    error instanceof VmCommandDeduplicationError ||
    error instanceof CodexSessionNotActiveError ||
    error instanceof DockerImagePolicyError ||
    (error instanceof Error && error.name === "ZodError")
  ) {
    return 400;
  }

  if (error instanceof DockerRuntimeUnavailableError) {
    return 503;
  }

  if (error instanceof AuxTerminalError) {
    return error.statusCode;
  }

  return 500;
}
