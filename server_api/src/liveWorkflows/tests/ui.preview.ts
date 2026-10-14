/** Standalone browser fixture. No application database, accounts, or provider credentials. */
import { randomUUID } from "node:crypto";
import { Readable } from "node:stream";
import { ResultService } from "../results.js";
import { AssetService } from "../assets.js";
import { resultChunks } from "../runner/resultChunks.js";
import { MemoryWorkflowStore } from "./memoryStore.js";
import { createServer } from "node:http";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { workspace, run as runFixture } from "./memoryStore.js";
import { skillsFirstPackage } from "../packages.js";
import { packageManifest } from "../runner/packageContract.js";
import { assistantSettings, workflowModelDefaults } from "../modelDefaults.js";

const temp = await mkdtemp(path.join(os.tmpdir(), "yp-live-ui-"));
const entry = fileURLToPath(
  new URL(
    "../../../../webApps/client/src/live-workflows/yp-live-workflow.ts",
    import.meta.url,
  ),
);
await build({
  entryPoints: [entry],
  bundle: true,
  outfile: path.join(temp, "ui.js"),
  format: "esm",
  platform: "browser",
  target: "es2021",
  tsconfig: fileURLToPath(
    new URL("../../../../webApps/client/tsconfig.json", import.meta.url),
  ),
});
const seed = await skillsFirstPackage(),
  state = workspace();
state.graph = seed.graph;
state.config.budgetMicros = 500_000_000;
const initialConfig = structuredClone(state.config);
let assistantSession: NonNullable<YpWorkflowSnapshot["assistantSession"]> = {
  active: false,
};
for (const node of state.graph.nodes)
  if (node.kind === "agent") node.models = { default: "fixture-model" };
const initialGraph = structuredClone(state.graph);
const run = {
  ...runFixture(state),
  inputCount: 5,
  nodeIds: ["normalize", "levels", "analyze"],
  budgetMicros: 5_000_000,
  spentMicros: 120_000,
  nodeCosts: {
    analyze: { spentMicros: 120_000, reservedMicros: 80_000, requests: 4 },
  },
  nodeStates: {
    levels: { status: "completed", processed: 5, total: 5 },
    normalize: {
      status: "completed",
      processed: 5,
      total: 5,
      message: "Normalized 5 job descriptions",
      updatedAt: new Date(Date.now() - 2000).toISOString(),
    },
    analyze: {
      status: "running",
      processed: 2,
      total: 5,
      message: "Checking degrees for Technician 2",
      updatedAt: new Date(Date.now() - 1000).toISOString(),
    },
  },
  agentMessages: [
    {
      nodeId: "normalize",
      message: "Normalized 5 job descriptions",
      at: new Date(Date.now() - 2000).toISOString(),
    },
    {
      nodeId: "analyze",
      message: "Checking degrees for Technician 2",
      at: new Date(Date.now() - 1000).toISOString(),
    },
  ],
  childStates: {
    degrees: {
      nodeId: "analyze",
      label: "degrees",
      processed: 1,
      total: 1,
    },
  },
  edgeStates: {
    "flow-1": { records: 5, at: new Date().toISOString() },
    "flow-levels": { records: 5, at: new Date().toISOString() },
  },
} as YpWorkflowRun;
const initialNodeStates = structuredClone(run.nodeStates);
const initialMessages = structuredClone(run.agentMessages);
state.activeRunId = run.id;
state.spentMicros = run.spentMicros;
state.reservedMicros = 80_000;
const model: YpWorkflowModel = {
  id: "fixture-model",
  label: "Fixture processing model",
  provider: "openai",
  reasoning: true,
  reasoningEffort: "max",
  inputMicrosPerMillion: 1_000_000,
  outputMicrosPerMillion: 1_000_000,
  maxOutputTokens: 2048,
  contextTokens: 200000,
  priceVersion: "fixture",
};
const alternativeModel: YpWorkflowModel = {
  ...model,
  id: "fixture-alternative",
  label: "Alternative processing model",
  reasoningEffort: "high",
  inputMicrosPerMillion: 3_000_000,
  outputMicrosPerMillion: 9_000_000,
};
run.modelCatalog = [structuredClone(model)];
const comparison = {
  ...structuredClone(run),
  id: "77777777-7777-4777-8777-777777777777",
  status: "completed" as const,
  createdAt: "2026-10-01T10:00:00Z",
  spentMicros: 200_000,
};
comparison.graph.nodes.find((node) => node.id === "analyze")!.models = {
  default: "fixture-previous-model",
};
comparison.modelCatalog = [
  ...comparison.modelCatalog!,
  {
    ...model,
    id: "fixture-previous-model",
    label: "Previous processing model",
    reasoningEffort: "xhigh",
    priceVersion: "previous",
  },
];
let addedAssets: YpWorkflowAsset[] = [],
  member = false;
const connector: YpWorkflowConnector = {
  id: "pilot",
  label: "Pilot jobs",
  kind: "your-priorities",
  resourceId: "12",
  writeEnabled: false,
  settings: {},
};
let connected = false,
  proposalStatus: YpWorkflowConnectionProposal["status"] = "pending";
const snapshot = (): YpWorkflowSnapshot => ({
  workspace: state,
  assistantName: packageManifest(seed.files).assistantName,
  runs: [run, comparison],
  assets: [
    ...addedAssets,
    {
      id: "66666666-6666-4666-8666-666666666666",
      name: "jobs.csv",
      version: 1,
      checksum: "a".repeat(64),
      bytes: 1234,
      source: "upload",
      contentType: "text/csv",
      createdAt: new Date().toISOString(),
    },
  ],
  connectors: connected ? [connector] : [],
  connectionProposals: [
    {
      id: "proposal-1",
      binding: connector,
      purpose: "Import pilot descriptions",
      baseBindingHash: null,
      proposedBy: 10,
      createdAt: "2026-10-01",
      status: proposalStatus,
    },
  ],
  models: [model, alternativeModel],
  hosts: [{ id: state.config.hostId, name: "Fixture VM", connected: true }],
  permissions: member
    ? { userId: 20, admin: false, operate: false }
    : { userId: 10, admin: true, operate: true },
  chatgptConnected: true,
  codexAuthMode: "chatgpt",
  assistantSession,
});
const resultStore = new MemoryWorkflowStore();
await resultStore.create(state);
const resultAssets = new AssetService(resultStore, path.join(temp, "assets"));
const resultService = new ResultService(resultStore, resultAssets);
const { canonicalJob } = await import(
  new URL(
    "../../../workflow-packages/skills-first/source/memory.ts",
    import.meta.url,
  ).href
);
const resultRows = Array.from({ length: 25 }, (_, i) =>
  canonicalJob({
    id: `job-${i}`,
    name: `Technician ${i}`,
    text: "Original description",
    titleCode: `00${i}`,
    source: "UI fixture",
    jurisdiction: "Fixture jurisdiction",
    citations: [],
    analysis: {
      mandatory: {
        status: "unknown",
        findings: { isDegreeMandatory: false },
        evidence: [],
      },
    },
    rewrittenText: "Proposed skills-based wording",
    status: i === 1 ? "unknown" : "complete",
    errors: i === 2 ? ["Unsupported evidence"] : [],
    ...(i < 2
      ? {
          parentId: "parent-one",
          parentName: "Technician series",
          level: { name: i === 0 ? "Junior" : "Senior", index: i, count: 2 },
        }
      : {}),
  }),
);
for (const r of [run, comparison]) {
  await resultStore.transact(1, (tx) => tx.put("run", r.id, r));
  const rows =
    r === run
      ? resultRows
      : resultRows.map((row) => ({
          ...row,
          rewrittenText: "Alternative model wording",
        }));
  for (const [part, content] of resultChunks(rows).entries())
    await resultAssets.upload(1, Readable.from(content), {
      name: `${r.id}-${part}.json`,
      length: Buffer.byteLength(content),
      contentType: "application/json",
      source: "artifact",
      resultSet: {
        runId: r.id,
        nodeId: "analyze",
        part,
        count: JSON.parse(content).length,
      },
    });
}
const streams = new Set<import("node:http").ServerResponse>();
const history: YpWorkflowEvent[] = [];
const emit = (type: string, data: Record<string, YpWorkflowJson>) => {
  state.nextEvent++;
  history.push({
    seq: history.length + 1,
    key: `fixture:${history.length}`,
    type,
    data,
    at: new Date().toISOString(),
  });
};
emit("chat.user", {
  text: "Review these job descriptions and propose a small trial.",
  userId: 10,
});
emit("session.event", {
  sessionId: "fixture",
  eventType: "message.completed",
  itemId: "welcome",
  payload: {
    text: "I found **five job descriptions**. Your first trial is underway.\n\n1. Normalize the source records\n2. Verify job levels\n3. **Analyze requirements** and check the evidence\n\nYou can follow each agent’s progress in the graph.",
  },
});
const requests: { url: string; body: unknown }[] = [];
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", "http://localhost");
    if (url.pathname === "/") {
      res.setHeader("content-type", "text/html");
      res.end(
        `<!doctype html><meta name="viewport" content="width=device-width, initial-scale=1"><title>Live workflow fixture</title><style>body{margin:24px;background:#faf9fc;font-family:system-ui;color:#24202b}</style><yp-live-workflow groupid="1"></yp-live-workflow><script>window.appUser = ${JSON.stringify({ user: { id: 10, name: "Alex Morgan", UserProfileImages: [{ formats: JSON.stringify(["/fixture-avatar.svg"]) }] } })}</script><script type="module" src="/ui.js"></script>`,
      );
      return;
    }
    if (url.pathname === "/ui.js") {
      res.setHeader("content-type", "text/javascript");
      res.end(await readFile(path.join(temp, "ui.js")));
      return;
    }
    if (url.pathname === "/fixture-avatar.svg") {
      res.setHeader("content-type", "image/svg+xml");
      res.end(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#d7e6e0"/><circle cx="32" cy="25" r="12" fill="#698b7e"/><path d="M9 64v-9a23 23 0 0 1 46 0v9" fill="#698b7e"/></svg>',
      );
      return;
    }
    if (url.pathname.endsWith("/stream")) {
      res.writeHead(200, {
        "content-type": "text/event-stream",
        "cache-control": "no-cache",
      });
      streams.add(res);
      let cursor = Number(
        req.headers["last-event-id"] ?? url.searchParams.get("after") ?? 0,
      );
      const tick = () => {
        for (const event of history.filter((e) => e.seq > cursor)) {
          res.write(`id: ${event.seq}\ndata: ${JSON.stringify(event)}\n\n`);
          cursor = event.seq;
        }
      };
      tick();
      const timer = setInterval(tick, 100);
      req.on("close", () => {
        clearInterval(timer);
        streams.delete(res);
      });
      return;
    }
    let result: unknown = snapshot();
    if (req.method !== "GET") {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const raw = Buffer.concat(chunks);
      const body =
        req.headers["content-type"] === "application/octet-stream"
          ? {
              name: decodeURIComponent(String(req.headers["x-file-name"])),
              bytes: raw.length,
            }
          : JSON.parse(raw.toString() || "{}");
      requests.push({ url: url.pathname, body });
      result = { ok: true };
      if (url.pathname === "/__fixture/reset") {
        run.status = "running";
        run.mode = "bulk";
        run.id = "33333333-3333-4333-8333-333333333333";
        run.nodeStates = structuredClone(initialNodeStates);
        run.agentMessages = structuredClone(initialMessages);
        state.activeRunId = run.id;
        state.graph = structuredClone(initialGraph);
        state.revision = 1;
        state.config = structuredClone(initialConfig);
        assistantSession = { active: false };
        run.graph = structuredClone(initialGraph);
        addedAssets = [];
        connected = false;
        member = false;
        proposalStatus = "pending";
        history.splice(2);
        requests.length = 0;
      }
      if (url.pathname === "/__fixture/complete") {
        run.status = "completed";
        run.nodeStates.analyze = {
          status: "completed",
          processed: 5,
          total: 5,
          message: "Completed · 5/5 records processed",
          updatedAt: new Date().toISOString(),
        };
        state.activeRunId = null;
        emit("run.completed", { runId: run.id });
      }
      if (url.pathname === "/__fixture/agent-message") {
        const at = new Date().toISOString();
        run.nodeStates.analyze = {
          ...run.nodeStates.analyze,
          message: body.message,
          updatedAt: at,
        };
        run.agentMessages = [
          ...(run.agentMessages ?? []),
          { nodeId: "analyze", message: body.message, at },
        ].slice(-50);
        emit("node.progress", {
          runId: run.id,
          nodeId: "analyze",
          message: body.message,
        });
      }
      if (url.pathname === "/__fixture/member") member = true;
      if (url.pathname === "/__fixture/assistant-active") {
        assistantSession = {
          active: true,
          turnSettings: assistantSettings(state.config),
        };
        emit("session.event", { eventType: "turn.started", payload: {} });
      }
      if (url.pathname === "/__fixture/assistant-complete") {
        assistantSession.active = false;
        emit("session.event", { eventType: "turn.completed", payload: {} });
      }
      if (url.pathname === "/__fixture/assistant-settings") {
        Object.assign(state.config, body);
        emit("assistant.settings.updated", {
          settings: { ...assistantSettings(state.config) },
        });
      }
      if (url.pathname === "/__fixture/draft-change") {
        state.revision++;
        emit("graph.updated", { revision: state.revision });
      }
      if (url.pathname === "/__fixture/chat-message")
        emit("session.event", {
          sessionId: "fixture",
          itemId: "formatted-message",
          eventType: "message.completed",
          payload: { text: body.text },
        });
      if (url.pathname === "/__fixture/late-message") {
        for (const [eventType, payload] of [
          ["message.delta", { delta: "The trial " }],
          ["message.completed", { text: "The trial is ready for review." }],
          ["message.delta", { delta: "is ready for review." }],
        ] as const)
          emit("session.event", {
            sessionId: "fixture",
            itemId: "late-message",
            eventType,
            payload,
          });
      }
      if (url.pathname === "/__fixture/reconnect") {
        emit("session.event", {
          eventType: "message.completed",
          itemId: "reconnected-message",
          payload: { text: "Reconnected fixture update" },
        });
        for (const stream of streams) stream.end();
      }
      if (url.pathname.endsWith("/proposal-1/approve")) {
        connected = true;
        proposalStatus = "approved";
      }
      if (url.pathname.endsWith("/pilot/check"))
        result = { ok: true, records: 5 };
      if (
        url.pathname.endsWith("/assets") ||
        url.pathname.endsWith("/pilot/import")
      ) {
        const asset: YpWorkflowAsset = {
          id: randomUUID(),
          name: body.name ?? "pilot-import.json",
          bytes: body.bytes ?? 100,
          version: 1,
          checksum: "b".repeat(64),
          source: body.name ? "upload" : "connector",
          contentType: "application/json",
          createdAt: new Date().toISOString(),
        };
        addedAssets.push(asset);
        result = asset;
      }
      if (url.pathname.endsWith("/runs")) {
        run.mode = body.mode;
        run.status = body.mode === "trial" ? "trial" : "awaiting_approval";
        run.inputCount = body.sampleCount;
        run.assetIds = body.assetIds;
        run.estimate = {
          fingerprint: "fixture",
          trialRunId: comparison.id,
          sampleCount: 5,
          populationCount: 25,
          expectedMicros: 200_000,
          upperMicros: 400_000,
          notes: ["Fixture estimate; no paid calls."],
        };
        result = run;
      }
      if (url.pathname.endsWith("/start")) {
        run.status = "running";
        state.activeRunId = run.id;
        if (body.budgetMicros) run.budgetMicros = body.budgetMicros;
      }
      if (url.pathname.endsWith("/chat")) {
        if (!body.steer)
          assistantSession.turnSettings = assistantSettings(state.config);
        assistantSession.active = true;
        emit("chat.user", {
          text: body.text,
          userId: 10,
          steer: Boolean(body.steer),
          assistantSettings: { ...assistantSession.turnSettings! },
        });
        emit("session.event", {
          sessionId: "fixture",
          eventType: "approval.requested",
          payload: {
            requestId: "question-1",
            method: "item/tool/requestUserInput",
            questions: [
              {
                id: "jurisdiction",
                header: "Jurisdiction",
                question: "Which jurisdiction should this trial use?",
                options: [
                  {
                    label: "New Jersey",
                    description: "Use the package default.",
                  },
                  {
                    label: "Other state",
                    description: "Use another jurisdiction.",
                  },
                ],
              },
            ],
          },
        });
      }
      if (url.pathname.endsWith("/session/approval"))
        emit("session.event", {
          eventType: "approval.resolved",
          payload: { requestId: body.requestId },
        });
      if (url.pathname.endsWith("/graph")) {
        if (body.revision !== state.revision) {
          res.writeHead(409, { "content-type": "application/json" });
          res.end(
            JSON.stringify({ error: "Graph changed; reload before saving" }),
          );
          return;
        }
        state.graph = body.graph;
        state.revision++;
        emit("graph.updated", { revision: state.revision });
      }
      if (url.pathname.endsWith("/configuration")) {
        const { expectedAssistantSettings, ...config } = body;
        if (
          expectedAssistantSettings &&
          JSON.stringify(expectedAssistantSettings) !==
            JSON.stringify(assistantSettings(state.config))
        ) {
          res.writeHead(409, { "content-type": "application/json" });
          res.end(
            JSON.stringify({
              error:
                "Assistant settings changed; reload saved settings before saving",
            }),
          );
          return;
        }
        state.config = config;
        state.revision++;
      }
      if (url.pathname === "/api/live-workflows/groups/1/assistant-settings") {
        if (
          member ||
          JSON.stringify(body.expected) !==
            JSON.stringify(assistantSettings(state.config))
        ) {
          res.writeHead(member ? 403 : 409, {
            "content-type": "application/json",
          });
          res.end(
            JSON.stringify({
              error: member
                ? "Forbidden"
                : "Assistant settings changed; reload before saving",
            }),
          );
          return;
        }
        state.config.codexModel = body.settings.model;
        state.config.codexReasoningEffort = body.settings.reasoningEffort;
        state.config.codexServiceTier = body.settings.serviceTier;
        result = assistantSettings(state.config);
        emit("assistant.settings.updated", {
          settings: { ...assistantSettings(state.config) },
        });
      }
      if (url.pathname.endsWith("/pause")) run.status = "paused";
      if (url.pathname.endsWith("/resume")) {
        run.status = "running";
        run.budgetMicros = body.budgetMicros;
        run.nodeBudgets = body.nodeBudgets;
      }
    } else if (url.pathname === "/__fixture")
      result = { requests, snapshot: snapshot() };
    else if (url.pathname.endsWith("/results"))
      result = await resultService.page(
        1,
        url.pathname.split("/").at(-2)!,
        Object.fromEntries(url.searchParams),
      );
    else if (url.pathname.endsWith("/catalog"))
      result = {
        packages: [
          { id: "skills-first", name: "Skills First", version: "1.0.0" },
        ],
        hosts: snapshot().hosts,
        models: [model],
        modelDefaults: workflowModelDefaults,
      };
    else if (url.pathname.endsWith("/codex-models"))
      result = {
        data: {
          models: [
            {
              id: "test-codex",
              displayName: "Current assistant",
              supportedReasoningEfforts: [
                { reasoningEffort: "high", description: "High effort" },
                { reasoningEffort: "max", description: "Maximum effort" },
              ],
            },
            {
              id: "fixture-codex",
              displayName: "Alternative assistant",
              defaultReasoningEffort: "medium",
              supportedReasoningEfforts: [
                { reasoningEffort: "medium", description: "Medium effort" },
                { reasoningEffort: "high", description: "High effort" },
              ],
            },
          ],
        },
      };
    else if (url.pathname.endsWith("/preview"))
      result = {
        inputCount: 5,
        preview: [
          {
            id: "one",
            name: "Technician",
            text: "A degree is preferred. Maintain equipment.",
            rewrittenText: "Maintain equipment. Demonstrate relevant skills.",
            status: "complete",
            errors: [],
            citations: [
              {
                url: "https://example.gov",
                quote: "Relevant skills",
                retrievedAt: "2026-10-01",
              },
            ],
          },
        ],
      };
    else if (url.pathname.endsWith("/connection-groups"))
      result = [{ id: 12, name: "Skills First pilot group" }];
    else if (url.pathname.endsWith("/revisions"))
      result = {
        currentHash: seed.hash,
        revisions: [
          {
            hash: seed.hash,
            at: "2026-10-01T12:00:00.000Z",
            version: "1.0.0",
            agents: 8,
          },
        ],
      };
    else if (url.pathname.includes("/revisions/"))
      result = { hash: seed.hash, files: seed.files };
    else if (url.pathname.endsWith("/storage"))
      result = {
        availableBytes: 5 * 1024 ** 3,
        minimumFreeBytes: 1024 ** 3,
        eligibleRuns: 2,
        removed: 0,
      };
    else if (url.pathname.endsWith("/usage"))
      result = [
        {
          id: "request-1",
          runId: run.id,
          description: "Fixture model request",
          status: "settled",
          maximumMicros: 100000,
          actualMicros: 12000,
        },
      ];
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify(result));
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: String(error) }));
  }
});
server.listen(54822, "127.0.0.1", () =>
  console.log("Live workflow fixture: http://127.0.0.1:54822"),
);
process.on("SIGTERM", () => {
  server.closeAllConnections();
  server.close(() => {
    void rm(temp, { recursive: true, force: true }).then(() => process.exit(0));
  });
});
