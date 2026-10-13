import { socketRequest } from "../runner/socketClient.js";
import { researchResponse } from "./researchFixture.js";
/** Paid providers are replaced by a local fixture gateway; this test never uses real credentials. */
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdtemp, mkdir, writeFile, readFile, rm } from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import path from "node:path";
import os from "node:os";
import { skillsFirstPackage, validatePackage } from "../packages.js";
import { loadVmAgentConfig } from "../vm/config.js";
import type { WorkflowVmRuntime } from "../vm/workflowRuntime.js";
import type { CodexAdapter } from "../vm/codex/codexAdapter.js";
import {
  workspace,
  run as runFixture,
  hostId,
  MemoryWorkflowStore,
} from "./memoryStore.js";
import { ModelGateway } from "../modelGateway.js";
import { BudgetService, type UsageReservation } from "../budget.js";
import { fixtureModel, fixtureModelsJson } from "./modelFixture.js";

const root = await mkdtemp(path.join(os.tmpdir(), "yp-live-container-"));
const state = workspace(),
  location = {
    groupId: 1,
    workspaceId: state.id,
    rootPath: path.join(root, state.id),
  };
const store = new MemoryWorkflowStore();
await store.create(state);
const seed = await skillsFirstPackage();
seed.graph.nodes.forEach((node) => {
  if (node.kind === "agent") {
    node.enabled = true;
    node.configuration.concurrency = 2;
    node.models = { default: fixtureModel.id };
  }
});
seed.graph.nodes.find(
  (node) => node.id === "compare",
)!.configuration.reference = [{ text: "Fixture reference" }];
seed.files["source/isolation.ts"] =
  `import {readFile} from "node:fs/promises";
import {Agent} from "./sdk.js";
export const run:Agent=async(context,input)=>{
  for(const name of ["OPENAI_API_KEY","ANTHROPIC_API_KEY","YP_LIVE_WORKFLOW_VM_AGENT_TOKEN"])if(process.env[name])throw new Error("credential leaked");
  for(const file of ["/var/run/docker.sock","/run-data/../codex-home/auth.json","/workspace/.workflow/control.sock"]){try{await readFile(file);throw new Error("private mount exposed");}catch(error){if((error as NodeJS.ErrnoException).code!=="ENOENT")throw error;}}
  try{await fetch("https://example.com",{signal:AbortSignal.timeout(1000)});throw new Error("outbound network exposed");}catch(error){if((error as Error).message==="outbound network exposed")throw error;}
  await context.artifact("isolation.json",JSON.stringify({networkBlocked:true,credentialsAbsent:true}),"application/json");
  return input;
};`;
seed.graph.nodes.push({
  id: "isolation",
  kind: "agent",
  label: "Isolation check",
  entrypoint: "source/isolation.ts",
  enabled: true,
  models: {},
  configuration: {},
  position: { x: 0, y: 0 },
});
seed.graph.edges.push({
  id: "export-isolation",
  source: "export",
  target: "isolation",
});
seed.files["graph.json"] = JSON.stringify(seed.graph);
const snapshot = validatePackage(seed.files);
const raw = Buffer.from(
  JSON.stringify([
    {
      id: "one",
      name: "Analyst",
      text: "Review public records. A degree is preferred.",
    },
    {
      id: "two",
      name: "Technician",
      text: "Maintain equipment. Technician I: A license is required. Technician II: A degree and a license are required.",
    },
  ]),
);
const asset: YpWorkflowAsset = {
  id: randomUUID(),
  name: "jobs.json",
  checksum: createHash("sha256").update(raw).digest("hex"),
  bytes: raw.length,
  version: 1,
  source: "upload",
  contentType: "application/json",
  createdAt: new Date().toISOString(),
};
const artifacts = new Map<string, string>();
const progressEvents: Record<string, any>[] = [];
const codexRequests: Record<string, any>[] = [];
let calls = 0,
  modelRequests = 0,
  connectorWrites = 0,
  searches = 0;
let finished!: (event: Record<string, unknown>) => void;
let completion = new Promise<Record<string, unknown>>((resolve) => {
  finished = resolve;
});
const server = createServer(async (req, res) => {
  try {
    assert.equal(req.headers.authorization, "Bearer fixture-host-token");
    if (req.url?.endsWith(`/assets/${asset.id}`)) {
      res.end(raw);
      return;
    }
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString() || "{}");
    let result: unknown = { ok: true };
    if (req.url?.includes("/codex/")) {
      codexRequests.push({ route: req.url, body });
      result = { ok: true };
    } else if (req.url?.endsWith("/progress")) {
      progressEvents.push(body);
      if (body.sample)
        await store.transact(1, async (tx) => {
          const run = (await tx.get<YpWorkflowRun>("run", body.runId))!;
          run.sample = body.sample;
          await tx.put("run", run.id, run);
        });
    } else if (req.url?.endsWith("/status"))
      result = {
        status: (
          await store.transact(1, (tx) =>
            tx.get<YpWorkflowRun>("run", body.runId),
          )
        )?.status,
      };
    else if (req.url?.endsWith("/model")) {
      modelRequests++;
      let content: unknown;
      if (body.nodeId === "levels")
        content =
          body.role === "review"
            ? {
                allLevelsCovered: true,
                sharedRequirementsPreserved: true,
                noCrossLevelRequirements: true,
                issues: [],
              }
            : body.input.job.name === "Technician"
              ? {
                  isMultiLevel: true,
                  sharedQuotes: ["Maintain equipment."],
                  levels: [
                    {
                      name: "Technician I",
                      evidenceQuotes: [
                        "Technician I: A license is required.",
                      ],
                    },
                    {
                      name: "Technician II",
                      evidenceQuotes: [
                        "Technician II: A degree and a license are required.",
                      ],
                    },
                  ],
                }
              : { isMultiLevel: false, sharedQuotes: [], levels: [] };
      else if (body.nodeId === "analyze")
        content = {
          status: "known",
          findings: {},
          evidence: [body.input.text],
        };
      else if (["licenses", "education"].includes(body.nodeId))
        content = researchResponse(body.system, body.input);
      else if (body.nodeId === "rewrite")
        content =
          body.role === "review"
            ? {
                allChecksPassed: true,
                checks: [
                  "dutyPreservation",
                  "legalRequirements",
                  "inclusiveLanguage",
                  "readability",
                  "factualAccuracy",
                ].map((name) => ({
                  name,
                  passed: true,
                  reason: "fixture",
                })),
              }
            : { text: body.input.text, changes: [] };
      else
        content = {
          status: "known",
          agreements: [],
          disagreements: [],
          missingEvidence: [],
          metrics: {},
        };
      const gateway = new ModelGateway(
        store,
        fixtureModelsJson,
        async () => {
          calls++;
          return {
            content: JSON.stringify(content),
            tokensIn: 100,
            tokensOut: 20,
          };
        },
      );
      result = await gateway.call(1, body);
    } else if (req.url?.endsWith("/connector")) {
      if (body.operation === "write") connectorWrites++;
      const budget = new BudgetService(store);
      const reservation = await budget.reserve(1, {
        id: body.id,
        runId: body.runId,
        nodeId: body.nodeId,
        recordId: body.recordId,
        maximumMicros: 100,
        request: body,
        description: "fixture search",
      });
      if (reservation.cached) result = reservation.reservation.result;
      else {
        searches++;
        result =
          body.operation === "scrape"
            ? {
                requestId: body.id,
                retrievedAt: "2026-10-01T00:00:00Z",
                markdown: "A license is required.",
                truncated: false,
                coverage: { parsedPages: 1, totalPages: 1 },
                creditsUsed: 1,
              }
            : {
                requestId: body.id,
                retrievedAt: new Date().toISOString(),
                pages: [
                  {
                    url: "https://example.gov/requirements",
                    markdown: "A license is required.",
                  },
                ],
                creditsUsed: 1,
              };
        await budget.settle(1, body.id, 100, result as YpWorkflowJson);
      }
    } else if (req.url?.endsWith("/artifact"))
      artifacts.set(body.name, body.content);
    else if (
      req.url?.endsWith("/events") &&
      ["run.completed", "run.failed"].includes(body.type)
    )
      finished(body);
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify(result));
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: String(error) }));
  }
});
await new Promise<void>((resolve) =>
  server.listen(0, "127.0.0.1", resolve),
);
const address = server.address();
assert.ok(address && typeof address !== "string");
const { WorkflowVmRuntime: Runtime } = (await import(
  new URL(
    "../../../live-workflow-runtime/build/vm/workflowRuntime.js",
    import.meta.url,
  ).href
)) as { WorkflowVmRuntime: typeof WorkflowVmRuntime };
const runtime = new Runtime(
  loadVmAgentConfig({
    YP_LIVE_WORKFLOW_API_BASE_URL: `http://127.0.0.1:${address.port}`,
    YP_LIVE_WORKFLOW_VM_AGENT_TOKEN: "fixture-host-token",
    YP_LIVE_WORKFLOW_VM_WORKSPACE_ROOT: root,
    YP_LIVE_WORKFLOW_VM_HOST_ID: hostId,
    YP_LIVE_WORKFLOW_VM_AGENT_STATE_PATH: path.join(root, "state.json"),
  }),
  {} as CodexAdapter,
);
const command = async (
  operation: string,
  data: Record<string, unknown> = {},
) => {
  const handler = runtime
    .handlers()
    .find((h) => h.path === `/commands/workflow.${operation}`)!;
  return (await handler.handle(
    {
      commandId: randomUUID(),
      data: { ...location, ...data },
    },
    { now: () => new Date() },
  )) as { data: Record<string, unknown> };
};
const deadline = async (promise: Promise<Record<string, unknown>>) => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error("Container test timed out")),
          90_000,
        );
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
};
try {
  for (const [name, content] of Object.entries(snapshot.files)) {
    const target = path.join(location.rootPath, "workspace/package", name);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, content);
  }
  await command("attach");
  const controlSocket = path.join(
    location.rootPath,
    "workspace/.workflow/control.sock",
  );
  assert.ok(
    (
      await readFile(
        path.join(
          location.rootPath,
          "workspace/.workflow/cliArguments.js",
        ),
        "utf8",
      )
    ).includes("propose-connection"),
  );
  await socketRequest(controlSocket, "/groups", { search: "jobs" });
  await socketRequest(controlSocket, "/trial", {
    sampleCount: 3,
    targetNodeId: "levels",
  });
  assert.deepEqual(
    codexRequests.map((request) => request.route),
    [
      "/api/live-workflows/vm/groups/1/codex/groups",
      "/api/live-workflows/vm/groups/1/codex/trial",
    ],
  );
  assert.deepEqual(codexRequests[1].body, {
    sampleCount: 3,
    targetNodeId: "levels",
  });
  await assert.rejects(
    socketRequest(controlSocket, "/bulk", {}),
    /bulk spending/,
  );
  const validated = await command("snapshot");
  assert.equal(validated.data.hash, snapshot.hash);
  const inputs = await command("inputs", { assets: [asset] });
  assert.equal(inputs.data.inputCount, 2);
  assert.equal((inputs.data.preview as unknown[]).length, 2);
  const run: YpWorkflowRun = {
    ...runFixture(),
    mode: "trial",
    graph: snapshot.graph,
    nodeIds: snapshot.graph.nodes
      .filter((n) => n.kind === "agent" && n.enabled)
      .map((n) => n.id),
    sourceHash: snapshot.hash,
    runtimeImage: String(validated.data.runtimeImage),
    inputCount: 2,
    concurrency: 2,
  };
  await store.transact(1, async (tx) => {
    await tx.put("run", run.id, run);
    await tx.put(
      "run-models",
      run.id,
      new ModelGateway(store, fixtureModelsJson).catalog(),
    );
  });
  await command("run", { run, files: snapshot.files, assets: [asset] });
  const event = await deadline(completion);
  assert.equal(event.type, "run.completed", JSON.stringify(event));
  assert.equal(connectorWrites, 0);
  assert.ok(calls >= 24);
  assert.ok(artifacts.has("skills-first.json"));
  assert.ok(artifacts.has("skills-first.csv"));
  assert.ok(artifacts.has("skills-first.md"));
  const exported = JSON.parse(artifacts.get("skills-first.json")!);
  assert.equal(
    exported.length,
    3,
    JSON.stringify(
      exported.map((row: any) => ({
        id: row.id,
        name: row.name,
        errors: row.errors,
      })),
    ),
  );
  assert.equal(
    exported.filter((row: any) => row.parentId === `${asset.id}:two`)
      .length,
    2,
  );
  assert.ok(
    exported.every(
      (row: any) => row.errors.length === 0 && row.status === "complete",
    ),
  );
  assert.ok(
    progressEvents.some(
      (e) =>
        e.nodeId === "levels" &&
        e.complete &&
        e.total === 2 &&
        e.outputCount === 3,
    ),
  );
  assert.ok(
    progressEvents.some(
      (e) => e.nodeId === "analyze" && e.complete && e.total === 3,
    ),
  );
  assert.deepEqual(JSON.parse(artifacts.get("isolation.json")!), {
    networkBlocked: true,
    credentialsAbsent: true,
  });
  const firstLedger = await store.transact(1, async (tx) => ({
    run: await tx.get<YpWorkflowRun>("run", run.id),
    state: tx.state,
    usage: await tx.list<UsageReservation>("usage"),
  }));
  assert.equal(
    firstLedger.state.spentMicros,
    calls * 360 + searches * 100,
  );
  assert.equal(
    firstLedger.state.trialSpentMicros,
    calls * 360 + searches * 100,
  );
  assert.equal(firstLedger.state.reservedMicros, 0);
  assert.equal(firstLedger.usage.length, calls + searches);
  assert.equal(Object.keys(firstLedger.run!.recordCosts ?? {}).length, 2);
  assert.equal(
    Object.values(firstLedger.run!.recordCosts ?? {}).reduce(
      (sum, cost) => sum + cost,
      0,
    ),
    firstLedger.run!.spentMicros,
  );
  assert.ok([...artifacts.keys()].includes("results-0.json"));
  assert.ok(firstLedger.usage.every((item) => item.status === "settled"));
  const before = calls;
  const searchesBefore = searches;
  const requestsBefore = modelRequests;
  // Simulate lost local checkpoints and completion acknowledgement. The server
  // ledger must replay paid responses even when this stage has to execute again.
  for (const nodeId of ["levels", "analyze", "licenses", "education"])
    await rm(
      path.join(
        root,
        ".processing",
        state.id,
        run.id,
        "output/checkpoints",
        nodeId,
      ),
      { recursive: true },
    );
  completion = new Promise((resolve) => {
    finished = resolve;
  });
  await command("control", { runId: run.id, operation: "resume" });
  assert.equal((await deadline(completion)).type, "run.completed");
  assert.ok(
    modelRequests > requestsBefore,
    "the missing stage checkpoint must repeat gateway requests",
  );
  assert.equal(
    calls,
    before,
    "persisted usage must prevent repeat provider calls",
  );
  assert.equal(
    await store.transact(1, async (tx) => tx.state.spentMicros),
    firstLedger.state.spentMicros,
  );
  assert.equal(
    await store.transact(1, async (tx) => tx.state.reservedMicros),
    0,
  );
  assert.equal(
    searches,
    searchesBefore,
    "cached research must preserve timestamp and paid search identity",
  );
  await command("remove-input", { assetId: asset.id });
  await assert.rejects(
    readFile(path.join(location.rootPath, "workspace/data", asset.id)),
    /ENOENT/,
  );
  const storage = await command("storage");
  assert.ok(Number(storage.data.availableBytes) > 0);
  const instructions = path.join(location.rootPath, "workspace/AGENTS.md");
  await writeFile(path.join(root, "protected.txt"), "do not overwrite");
  const { symlink } = await import("node:fs/promises");
  await rm(instructions, { force: true });
  await symlink(path.join(root, "protected.txt"), instructions);
  await writeFile(
    path.join(location.rootPath, "workspace/package/source/analysis.ts"),
    "unsaved broken draft",
  );
  const restored = await command("restore", { files: snapshot.files });
  assert.equal(restored.data.hash, snapshot.hash);
  assert.equal(
    await readFile(path.join(root, "protected.txt"), "utf8"),
    "do not overwrite",
  );
  assert.equal(
    await readFile(instructions, "utf8"),
    snapshot.files["AGENTS.md"],
  );
  assert.equal(
    await readFile(
      path.join(
        location.rootPath,
        "workspace",
        String(restored.data.backup),
        "source/analysis.ts",
      ),
      "utf8",
    ),
    "unsaved broken draft",
  );
  const marker = path.join(
    root,
    ".processing",
    state.id,
    run.id,
    "active.json",
  );
  await writeFile(marker, "{}");
  await assert.rejects(
    command("prune", { runIds: [run.id] }),
    /active execution marker/,
  );
  await rm(marker);
  assert.equal(
    (await command("prune", { runIds: [run.id] })).data.removed,
    1,
  );
  await assert.rejects(
    readFile(
      path.join(root, ".processing", state.id, run.id, "data/run.json"),
    ),
    /ENOENT/,
  );
  const previousFloor = process.env.YP_LIVE_WORKFLOW_MIN_FREE_BYTES;
  process.env.YP_LIVE_WORKFLOW_MIN_FREE_BYTES = String(
    Number.MAX_SAFE_INTEGER,
  );
  try {
    await assert.rejects(
      command("inputs", { assets: [asset] }),
      /insufficient free disk/,
    );
  } finally {
    if (previousFloor === undefined)
      delete process.env.YP_LIVE_WORKFLOW_MIN_FREE_BYTES;
    else process.env.YP_LIVE_WORKFLOW_MIN_FREE_BYTES = previousFloor;
  }
  console.log(
    `Container smoke passed: ${run.nodeIds.length} stages, ${calls} fixture model calls, settled trial accounting, no duplicate charges after checkpoint loss, no external writes, blocked network, private mounts.`,
  );
} finally {
  await runtime.close();
  await new Promise<void>((resolve) => server.close(() => resolve()));
  await rm(root, { recursive: true, force: true });
}
