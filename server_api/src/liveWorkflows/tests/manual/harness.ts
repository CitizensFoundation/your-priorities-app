import express, { type RequestHandler } from "express";
import {
  importedBrowserKey,
  browserKeyImportButton,
  offlineBrowserKey,
} from "./browserKeyImport.js";
import { createServer } from "node:http";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { pathToFileURL } from "node:url";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { DataTypes, Sequelize } from "sequelize";
import { WebSocketServer } from "ws";
import { LiveWorkflowsController } from "../../controller.js";
import { migrateLiveWorkflows } from "../../migrate.js";
import { SequelizeWorkflowStore } from "../../store.js";
import { WorkflowService } from "../../workflowService.js";
import { AssetService } from "../../assets.js";
import { HostDirectory, SecretBox } from "../../secrets.js";
import {
  ModelGateway,
  validateProviderEnvironment,
} from "../../modelGateway.js";
import type { ConnectorService } from "../../connectors.js";
import { ForbiddenError } from "../../services/errors.js";
import { VmBrokerRegistry } from "../../services/vmBrokerRegistry.js";
import { VmAgentBrokerClient } from "../../vm/brokerClient.js";
import { createDefaultVmCommandRouter } from "../../vm/controlServer.js";
import { WorkspaceManager } from "../../vm/workspace/workspaceManager.js";
import { CodexAdapter } from "../../vm/codex/codexAdapter.js";
import { DockerRuntimeManager } from "../../vm/docker/dockerRuntimeManager.js";
import { ArtifactCollector } from "../../vm/artifacts/artifactCollector.js";
import { AuxTerminalBridge } from "../../vm/terminal/auxTerminalBridge.js";
import { loadVmAgentConfig } from "../../vm/config.js";
import type { WorkflowVmRuntime } from "../../vm/workflowRuntime.js";
import { YP_LIVE_WORKFLOW_VM_PROTOCOL } from "../../contracts/index.js";
import { apiRoot, manualKeyName, type ManualConfig } from "./environment.js";
import {
  OfflineCodexTransport,
  offlineProcessing,
} from "./offlineProviders.js";
import { ManualGreetingAdapter } from "./greetingAdapter.js";
import { ManualOperatorAdapter } from "./operatorAdapter.js";
import { ManualCodexUsage } from "./codexUsage.js";
import { ManualCheckpointGate } from "./checkpointGate.js";
import { BrowserBatchCheckpoint } from "./browserBatchCheckpoint.js";
import type { GroupCreationFixture } from "./groupCreationFixture.js";

const execute = promisify(execFile);
const codexImage = "yp-live-workflow/codex-runtime:1";
const processingImage = "yp-live-workflow/processing-runtime:1";
const postgresImage = "postgres:16-alpine";
export const actor = { userId: 10, admin: true };

async function docker(args: string[]) {
  try {
    return (
      await execute("docker", args, {
        timeout: 60_000,
        maxBuffer: 1024 * 1024,
      })
    ).stdout.trim();
  } catch {
    throw new Error(
      `Manual harness Docker ${args[0]} failed. Check daemon access, installed images, and Sysbox; the harness never builds or pulls images.`,
    );
  }
}

export async function waitFor<T>(
  label: string,
  check: () => Promise<T | undefined | false>,
  timeoutMs = 60_000,
  signal?: AbortSignal,
): Promise<T> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    signal?.throwIfAborted();
    const result = await check();
    if (result) return result;
    await sleep(250, undefined, { signal });
  }
  throw new Error(`Timed out waiting for ${label}`);
}

export async function startManualHarness(
  config: ManualConfig,
  mode: "offline" | "api-key" | "chatgpt",
  options: {
    headless?: boolean;
    codex?: "greeting" | "operator";
    offlineTurn?: (workspace: string) => Promise<string>;
    usageDirectory?: string;
    port?: number;
    browserLogin?: boolean;
    browserBatch?: boolean;
    groupCreation?: boolean;
    offlineProcessingDelayMs?: number;
    processingConcurrency?: number;
    observeBrowserRequest?: RequestHandler;
    manualPage?: { instructions: string; fixture: string; filename: string };
  } = {},
) {
  if (options.groupCreation)
    assert.ok(
      options.browserLogin && !options.headless && options.codex !== "operator",
    );
  const processingConcurrency = options.processingConcurrency ?? 1;
  assert.ok(
    Number.isInteger(processingConcurrency) &&
      processingConcurrency >= 1 &&
      processingConcurrency <= 8,
  );
  const processingModels = [
    config.processingModel,
    ...(config.comparisonProcessingModel
      ? [config.comparisonProcessingModel]
      : []),
  ];
  if (mode !== "offline")
    processingModels.forEach((model) => validateProviderEnvironment(model));
  // Ignore deployment URLs and DB credentials. This harness always owns its local database.
  for (const image of [
    postgresImage,
    processingImage,
    ...(mode === "offline" ? [] : [codexImage]),
  ])
    await docker(["image", "inspect", image, "--format", "{{.Id}}"]);
  if (mode !== "offline") {
    const runtimes = JSON.parse(
      await docker(["info", "--format", "{{json .Runtimes}}"]),
    );
    if (!runtimes["sysbox-runc"])
      throw new Error("Live Codex manual tests require sysbox-runc");
  }
  const temp = await mkdtemp(path.join(os.tmpdir(), "yp-skills-first-manual-"));
  const codexUsage = new ManualCodexUsage(config, mode, options.usageDirectory);
  await codexUsage.flush();
  const databaseContainer = `yp-manual-pg-${randomUUID()}`;
  const server = createServer();
  const checkpointGate = new ManualCheckpointGate();
  const sockets = new WebSocketServer({ noServer: true });
  let database: Sequelize | undefined,
    controller: LiveWorkflowsController | undefined;
  let groupCreation: GroupCreationFixture | undefined;
  let vm: WorkflowVmRuntime | undefined,
    codex: CodexAdapter | undefined,
    broker: VmAgentBrokerClient | undefined;
  const previousEnvironment = new Map<string, string | undefined>();
  const setEnv = (key: string, value: string) => {
    previousEnvironment.set(key, process.env[key]);
    process.env[key] = value;
  };
  let closed = false,
    databaseStarted = false;
  const close = async () => {
    if (closed) return;
    closed = true;
    checkpointGate.release();
    // Keep the API alive while the VM drains acknowledged status events.
    const failures: string[] = [];
    for (const [name, stop] of [
      ["processing VM", () => vm?.close()],
      ["Codex", () => codex?.closeAll()],
      ["Codex usage report", () => codexUsage.flush()],
      ["broker", () => broker?.close()],
    ] as const)
      try {
        await stop();
      } catch {
        failures.push(name);
      }
    controller?.close();
    for (const socket of sockets.clients) socket.terminate();
    await new Promise<void>((resolve) => sockets.close(() => resolve()));
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
    try {
      await database?.close();
    } catch {
      failures.push("database connection");
    }
    groupCreation?.close();
    try {
      if (databaseStarted)
        await docker(["rm", "--force", "--volumes", databaseContainer]);
    } catch {
      failures.push("database container");
    }
    try {
      await rm(temp, { recursive: true, force: true });
    } catch {
      failures.push(`temporary workspace ${temp}`);
    }
    for (const [key, value] of previousEnvironment)
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    if (failures.length)
      throw new Error(`Manual cleanup needs attention: ${failures.join(", ")}`);
  };

  try {
    const password = randomBytes(24).toString("hex");
    await docker([
      "run",
      "--detach",
      "--rm",
      "--runtime=runc",
      "--name",
      databaseContainer,
      "--publish",
      "127.0.0.1::5432",
      "--env",
      "POSTGRES_DB=yp_live_workflow_manual",
      "--env",
      `POSTGRES_PASSWORD=${password}`,
      postgresImage,
    ]);
    databaseStarted = true;
    const port = JSON.parse(
      await docker([
        "inspect",
        "--format",
        "{{json .NetworkSettings.Ports}}",
        databaseContainer,
      ]),
    )["5432/tcp"][0].HostPort;
    database = new Sequelize(
      `postgres://postgres:${password}@127.0.0.1:${port}/yp_live_workflow_manual`,
      {
        logging: false,
        pool: { min: 0, max: 5 },
        retry: { max: 0 },
      },
    );
    await waitFor("disposable Postgres", async () => {
      try {
        await database!.authenticate();
        return true;
      } catch {
        return false;
      }
    });
    if (options.groupCreation) {
      // The legacy authorization logger includes this unrelated setting; do not
      // import or expose any development account's master key in a manual test.
      setEnv("PS_TEMP_AGENTS_FABRIC_GROUP_API_KEY", "");
      setEnv("S3_BUCKET", "unused-manual-browser-test");
      const { groupCreationFixture } =
        await import("./groupCreationFixture.js");
      groupCreation = await groupCreationFixture(database, actor.userId);
    } else {
      await database.getQueryInterface().createTable("groups", {
        id: { type: DataTypes.INTEGER, primaryKey: true },
      });
      await database
        .getQueryInterface()
        .bulkInsert("groups", [{ id: 1 }, { id: 2 }]);
    }
    await migrateLiveWorkflows(database);
    const store = new SequelizeWorkflowStore(database);
    const secrets = new SecretBox(randomBytes(32).toString("base64"));
    const rootPath = path.join(temp, "workspaces");
    await mkdir(rootPath, { mode: 0o700 });
    const host = {
      id: randomUUID(),
      name: "Manual local VM",
      token: randomBytes(32).toString("hex"),
      rootPath,
      image: codexImage,
    };
    const registry = new VmBrokerRegistry();
    const models = new ModelGateway(
      store,
      JSON.stringify(processingModels),
      mode === "offline"
        ? async (...args) => {
            if (options.offlineProcessingDelayMs)
              await sleep(options.offlineProcessingDelayMs);
            return offlineProcessing(...args);
          }
        : undefined,
    );
    // The upload-only case has no external connections. Unexpected connector use fails closed.
    const connectors = new Proxy(
      {},
      {
        get: (_target, name) => {
          if (name === "snapshotBindings" || name === "list")
            return async () => [];
          return async () => {
            throw new Error(
              "External connectors are not enabled in the upload-only manual test",
            );
          };
        },
      },
    ) as ConnectorService;
    const service = new WorkflowService(
      store,
      registry,
      new HostDirectory(JSON.stringify([host])),
      secrets,
      models,
      connectors,
    );
    const assets = new AssetService(store, path.join(temp, "assets"));
    controller = new LiveWorkflowsController({
      service,
      assets,
      groupAccess:
        groupCreation?.groupAccess ??
        (async (groupId, userId) => {
          if (groupId !== 1 || userId !== actor.userId)
            throw new ForbiddenError();
          return actor;
        }),
      groupChoices:
        groupCreation?.groupChoices ??
        (async () => [{ id: 1, name: "Skills First manual test" }]),
    });
    await controller.ready;
    const ui = path.join(temp, "ui.js");
    if (!options.headless)
      await (
        await import("esbuild")
      ).build({
        entryPoints: [
          path.resolve(
            apiRoot,
            options.groupCreation
              ? "../webApps/client/src/live-workflows/test/group-creation-manual.ts"
              : "../webApps/client/src/live-workflows/yp-live-workflow.ts",
          ),
        ],
        bundle: true,
        outfile: ui,
        format: "esm",
        platform: "browser",
        target: "es2021",
        tsconfig: path.resolve(apiRoot, "../webApps/client/tsconfig.json"),
      });
    const app = express();
    app.use((req, res, next) => {
      if (req.hostname !== "127.0.0.1") {
        res.sendStatus(403);
        return;
      }
      req.user = { id: actor.userId };
      res.setHeader("Cache-Control", "no-store");
      next();
    });
    app.use((req, res, next) =>
      req.method === "POST" && /\/assets$/.test(req.path)
        ? next()
        : express.json({ limit: "32mb" })(req, res, next),
    );
    if (options.groupCreation) app.use(express.urlencoded({ extended: false }));
    // Record only capability names/statuses: never request bodies, credentials or provider payloads.
    const codexCalls: { operation: string; status: number }[] = [];
    const processingCalls: {
      runId: string;
      nodeId: string;
      id: string;
      status: number;
    }[] = [];
    const browserBatch = options.browserBatch
      ? new BrowserBatchCheckpoint(
          store,
          checkpointGate,
          (id, node) => checkpoint(id, node),
          processingCalls,
        )
      : undefined;
    app.use((req, res, next) => {
      const processing =
        /^\/api\/live-workflows\/vm\/groups\/(\d+)\/runs\/([^/]+)\/model$/.exec(
          req.path,
        );
      if (
        processing &&
        Number(processing[1]) === (groupCreation?.groupId() ?? 1)
      )
        res.once("finish", () =>
          processingCalls.push({
            runId: processing[2],
            nodeId: String(req.body?.nodeId),
            id: String(req.body?.id),
            status: res.statusCode,
          }),
        );
      const match =
        /^\/api\/live-workflows\/vm\/groups\/(\d+)\/codex\/([a-z-]+)$/.exec(
          req.path,
        );
      if (match && Number(match[1]) === (groupCreation?.groupId() ?? 1))
        res.once("finish", () =>
          codexCalls.push({ operation: match[2], status: res.statusCode }),
        );
      next();
    });
    app.use(checkpointGate.middleware);
    if (browserBatch) {
      app.use(browserBatch.middleware);
      app.get("/manual/checkpoint", (_req, res) =>
        res.json(browserBatch.status()),
      );
    }
    if (options.browserLogin)
      app.use(
        importedBrowserKey(
          () =>
            mode === "offline" ? offlineBrowserKey : process.env[manualKeyName],
          () => process.env.YP_LIVE_WORKFLOW_PUBLIC_ORIGIN,
          options.groupCreation ? () => groupCreation?.groupId() : undefined,
        ),
      );
    if (options.observeBrowserRequest) app.use(options.observeBrowserRequest);
    groupCreation?.mount(app);
    app.use(controller.path, controller.router);
    if (!options.headless) {
      app.get("/favicon.ico", (_req, res) => res.sendStatus(204));
      app.get("/ui.js", (_req, res) => res.sendFile(ui));
      if (options.manualPage)
        app.get("/manual/fixture", (_req, res) =>
          res.download(
            options.manualPage!.fixture,
            options.manualPage!.filename,
          ),
        );
      if (options.groupCreation) {
        app.get("/locales/en/translation.json", (_req, res) =>
          res.sendFile(
            path.resolve(
              apiRoot,
              "../webApps/client/locales/en/translation.json",
            ),
          ),
        );
        app.get(
          [
            "/",
            "/admin/group/new/:communityId",
            "/admin/group/:groupId",
            "/group/:groupId",
          ],
          (_req, res) =>
            res
              .type("html")
              .send(
                `<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Live workflow group creation test</title><style>body{margin:24px;font-family:system-ui;background:#f6f8fc;color:#17213b}main{max-width:1440px;margin:auto}a{color:#234cb5}</style><main><h1>Live workflow group creation</h1><p>${mode === "offline" ? "Offline rehearsal: scripted Codex response, no provider calls." : "Live test: one API-key Codex greeting. Processing is disabled."} Signed in as a disposable test administrator.</p><div id="manual-app"></div></main><script type="module" src="/ui.js"></script></html>`,
              ),
        );
      } else
        app.get("/", (_req, res) =>
          res
            .type("html")
            .send(
              `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Skills First manual test</title><style>body{margin:24px;font-family:system-ui}pre{white-space:pre-wrap}summary{cursor:pointer}</style><h1>Skills First manual test</h1><p>${mode === "offline" ? "Offline rehearsal — fixture model responses." : mode === "api-key" ? "Isolated test — Codex uses API-key authentication. This does not test ChatGPT sign-in." : "Real ChatGPT sign-in and API-backed processing."} Total processing cap: $${config.trialBudgetMicros / 1e6}. Codex cost is separate. No external connectors.</p>${options.manualPage?.instructions ?? ""}${options.browserLogin ? browserKeyImportButton : ""}<yp-live-workflow groupid="1"></yp-live-workflow><script type="module" src="/ui.js"></script>`,
            ),
        );
    }
    server.on("request", app);
    server.on("upgrade", (request, socket, head) => {
      if (request.url !== "/api/live-workflows/vm/ws") {
        socket.destroy();
        return;
      }
      sockets.handleUpgrade(request, socket, head, (ws) =>
        controller!.acceptVmConnection(ws, request),
      );
    });
    await new Promise<void>((resolve, reject) => {
      server.once("error", reject);
      server.listen(options.port ?? 0, "127.0.0.1", resolve);
    });
    const baseUrl = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
    setEnv("YP_LIVE_WORKFLOW_PUBLIC_ORIGIN", baseUrl);
    setEnv("YP_LIVE_WORKFLOW_PROCESSING_IMAGE", processingImage);
    setEnv(
      "YP_LIVE_WORKFLOW_PACKAGE_ROOT",
      path.join(apiRoot, "workflow-packages"),
    );
    const vmConfig = loadVmAgentConfig({
      YP_LIVE_WORKFLOW_API_BASE_URL: baseUrl,
      YP_LIVE_WORKFLOW_VM_AGENT_TOKEN: host.token,
      YP_LIVE_WORKFLOW_VM_WORKSPACE_ROOT: rootPath,
      YP_LIVE_WORKFLOW_VM_AGENT_STATE_PATH: path.join(temp, "vm-state.json"),
      YP_LIVE_WORKFLOW_VM_ARCHIVE_ROOT: path.join(temp, "archive"),
      YP_LIVE_WORKFLOW_VM_DATASETS_HOT_ROOT: path.join(temp, "datasets"),
    });
    const dockerRuntime = new DockerRuntimeManager({
      defaultImage: codexImage,
      allowedImages: [codexImage],
      defaultNetworkMode: "bridge",
      containerRuntime: "sysbox-runc",
      runUser: "0:0",
      archiveRoot: vmConfig.archiveRoot,
      workspaceRootPath: rootPath,
      maxCodexSessions: 1,
    });
    const Adapter =
      options.codex === "operator"
        ? ManualOperatorAdapter
        : ManualGreetingAdapter;
    codex = new Adapter(
      {
        env: {},
        dockerRuntime,
        ...(mode === "offline"
          ? {
              transportFactory: (launch) =>
                new OfflineCodexTransport(
                  options.offlineTurn
                    ? () => options.offlineTurn!(launch.cwd)
                    : undefined,
                ),
            }
          : {}),
        // Headless cases retain the original test injection. Interactive browser
        // sessions exercise the production credential resolver and login controller.
        ...(mode !== "chatgpt" && !options.browserLogin
          ? {
              resolveAuth: () => ({
                env: {},
                provider: "openai",
                authMode: "env_api_key",
                secretRef: null,
                apiFallback: false,
                apiKey:
                  mode === "offline"
                    ? "offline-fixture"
                    : process.env[manualKeyName],
              }),
            }
          : {}),
        authMaterialUpdateSink: {
          publishCodexAuthMaterialUpdated: async (payload) =>
            service.ingestAuth(host.id, payload),
        },
      },
      config.codexServiceTier,
    );
    // The VM copies compiled CLI modules into the workspace, as in the container smoke test.
    const { WorkflowVmRuntime: Runtime } = (await import(
      pathToFileURL(
        path.join(apiRoot, "live-workflow-runtime/build/vm/workflowRuntime.js"),
      ).href
    )) as { WorkflowVmRuntime: typeof WorkflowVmRuntime };
    vm = new Runtime(vmConfig, codex);
    const router = createDefaultVmCommandRouter(
      new WorkspaceManager({ allowedRootPath: rootPath }),
      codex,
      dockerRuntime,
      new ArtifactCollector({
        allowedRootPath: rootPath,
        uploadEnabled: false,
      }),
      new AuxTerminalBridge({ enabled: false, allowedRootPath: rootPath }),
      {
        publishSessionEvent: async (data) => {
          await codexUsage.record(data);
          const response = await fetch(
            `${baseUrl}/api/live-workflows/vm/events`,
            {
              method: "POST",
              headers: {
                authorization: `Bearer ${host.token}`,
                "content-type": "application/json",
              },
              body: JSON.stringify({
                protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
                messageType: "session.event",
                data,
              }),
              signal: AbortSignal.timeout(15_000),
            },
          );
          if (!response.ok) throw new Error("Manual VM event delivery failed");
        },
      },
      vm.handlers(),
      undefined,
      rootPath,
    );
    broker = new VmAgentBrokerClient({
      wsUrl: `${baseUrl.replace("http:", "ws:")}/api/live-workflows/vm/ws`,
      vmHostId: host.id,
      token: host.token,
      capabilities: { codexAppServer: true },
      commandRouter: router,
      reconnectMinMs: 100,
      reconnectMaxMs: 500,
    });
    broker.start();
    await waitFor("VM broker", async () => broker!.isConnected());

    const request = async <T>(
      route: string,
      method = "GET",
      body?: unknown,
    ): Promise<T> => {
      const groupId = groupCreation ? groupCreation.groupId() : 1;
      if (!groupId)
        throw new Error("Create the group through the browser first");
      const response = await fetch(
        `${baseUrl}/api/live-workflows/groups/${groupId}${route}`,
        {
          method,
          headers: { origin: baseUrl, "content-type": "application/json" },
          body: body === undefined ? undefined : JSON.stringify(body),
          signal: AbortSignal.timeout(300_000),
        },
      );
      if (!response.ok) {
        const error = (await response.json()) as { error?: string };
        throw new Error(
          `Manual API ${route} (${response.status}): ${error.error ?? "request failed"}`,
        );
      }
      return (await response.json()) as T;
    };
    if (!options.groupCreation) {
      await request("", "POST", {
        packageId: "skills-first",
        hostId: host.id,
        codexModel: config.codexModel,
        codexReasoningEffort: config.codexReasoningEffort,
        codexServiceTier: config.codexServiceTier,
        operatorIds: [actor.userId],
        budgetMicros: config.trialBudgetMicros,
        trialBudgetMicros: config.trialBudgetMicros,
        quotaBytes: 16 * 1024 ** 2,
        concurrency: processingConcurrency,
      });
      await request("/operator", "POST", { takeover: false });
      const state = (await request<YpWorkflowSnapshot>("")).workspace;
      const cliLoads = await execute(
        process.execPath,
        [
          path.join(rootPath, state.id, "workspace/.workflow/cli.js"),
          "invalid-command",
        ],
        { timeout: 15_000, env: { PATH: process.env.PATH } },
      ).then(
        () => false,
        (error: { code?: number; stderr?: string }) =>
          error.code === 1 &&
          Boolean(error.stderr?.includes("Usage: yp-workflow")) &&
          !error.stderr?.includes("ERR_MODULE_NOT_FOUND"),
      );
      if (!cliLoads)
        throw new Error(
          "The materialized workflow CLI cannot load; rebuild the runtime before starting a paid Codex session",
        );
      for (const node of state.graph.nodes)
        if (node.kind === "agent") {
          node.configuration.concurrency = processingConcurrency;
          node.models = { default: config.processingModel.id };
          node.reasoningEffort = config.processingReasoningEffort;
        }
      await request("/graph", "PUT", {
        graph: state.graph,
        revision: state.revision,
      });
      if (mode !== "chatgpt" && !options.browserLogin) {
        const id = randomUUID();
        await store.transact(1, (tx) =>
          tx.put("account", String(actor.userId), {
            id,
            userId: actor.userId,
            hostId: host.id,
            // No real key in the account fixture or its serialized material.
            sealed: secrets.seal(
              { format: "codex_home_files_v1", files: [] },
              `account:${actor.userId}:${id}`,
            ),
          }),
        );
      }
    }
    const checkpoint = async (runId: string, nodeId: string) => {
      const snapshot = await request<YpWorkflowSnapshot>("");
      const run = snapshot.runs.find((item) => item.id === runId);
      assert.ok(run && run.mode === "bulk" && run.nodeIds.includes(nodeId));
      const bytes = await readFile(
        path.join(
          rootPath,
          ".processing",
          snapshot.workspace.id,
          runId,
          "output",
          "checkpoints",
          nodeId,
          `${createHash("sha256").update("__node_output").digest("hex")}.json`,
        ),
      );
      const rows: unknown = JSON.parse(bytes.toString());
      assert.ok(Array.isArray(rows));
      assert.equal(rows.length, run.inputCount);
      return {
        checksum: createHash("sha256").update(bytes).digest("hex"),
        records: rows.length,
      };
    };
    const interruptAtCheckpoint = async (
      runId: string,
      nodeId: string,
      signal?: AbortSignal,
    ) => {
      await waitFor(
        "durable bulk checkpoint",
        async () => {
          if (checkpointGate.atCheckpoint(runId, nodeId)) return true;
          const run = (await request<YpWorkflowSnapshot>("")).runs.find(
            (item) => item.id === runId,
          );
          if (
            run &&
            ["paused", "failed", "cancelled", "completed"].includes(run.status)
          )
            throw new Error(
              `Bulk stopped before the interruption: ${run.status}: ${run.error ?? ""}`,
            );
          return false;
        },
        2_700_000,
        signal,
      );
      const saved = await checkpoint(runId, nodeId);
      const snapshot = await request<YpWorkflowSnapshot>("");
      const run = snapshot.runs.find((item) => item.id === runId)!;
      assert.equal(run.status, "running");
      assert.equal(
        run.reservedMicros,
        0,
        "Never inject failure during an unsettled paid call",
      );
      const container = `yp-workflow-run-${run.id}`;
      const containerId = await docker([
        "inspect",
        "--format",
        "{{.Id}}",
        container,
      ]);
      try {
        // This run belongs to this disposable harness. Do not stop any other container.
        await docker(["kill", "--signal", "KILL", container]);
      } finally {
        checkpointGate.release();
      }
      return {
        ...saved,
        containerId,
        executionId: run.executionId,
        spentMicros: run.spentMicros,
      };
    };
    return {
      baseUrl,
      request,
      service,
      assets,
      codexCalls,
      codexUsage,
      processingCalls,
      browserBatch,
      groupCreation,
      close,
      checkpoint,
      armCheckpoint: (runId: string, nodeId: string) =>
        checkpointGate.arm(runId, nodeId),
      interruptAtCheckpoint,
    };
  } catch (error) {
    try {
      await close();
    } catch (cleanup) {
      throw new AggregateError(
        [error, cleanup],
        "Manual startup and cleanup failed",
      );
    }
    throw error;
  }
}

export type ManualHarness = Awaited<ReturnType<typeof startManualHarness>>;
