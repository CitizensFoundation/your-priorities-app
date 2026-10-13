import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import type { Request, Response } from "express";
import type { UsageReservation } from "../budget.js";
import { ManualCheckpointGate } from "./manual/checkpointGate.js";
import { verifyResumeLedger } from "./manual/headlessBulk.js";
import { chat } from "./manual/headlessScenarios.js";
import type { ManualHarness } from "./manual/harness.js";
import {
  selectHeadlessCases,
  headlessCaseBudget,
} from "./manual/headlessCases.js";
import {
  selectedAgents,
  skillsFirstPackage,
  validatePackage,
} from "../packages.js";
import {
  exportRows,
  verifyAdaptedResults,
} from "./manual/headlessVerification.js";

test("headless follow-up waits beyond the whole event history, not only its first page", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "yp-headless-chat-"));
  let started = false;
  const harness = {
    request: async (route: string) => {
      if (route === "") return { workspace: { nextEvent: 700 } };
      if (route === "/chat") {
        started = true;
        return {};
      }
      assert.equal(route, "/events?after=700");
      assert.equal(started, true);
      return {
        events: [
          {
            seq: 701,
            type: "session.event",
            data: {
              eventType: "message.completed",
              payload: { text: "Fresh summary" },
            },
          },
          {
            seq: 702,
            type: "session.event",
            data: {
              eventType: "turn.completed",
              payload: { turn: { status: "completed" } },
            },
          },
        ],
      };
    },
  } as unknown as ManualHarness;
  try {
    await chat(harness, "Check current status", directory, 2);
    assert.match(
      await readFile(path.join(directory, "chat-2.txt"), "utf8"),
      /Fresh summary/,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("headless suite divides one allowance across explicit cases and rejects misspelled cases", () => {
  const cases = selectHeadlessCases("all");
  assert.equal(cases.length, 5);
  assert.deepEqual(selectHeadlessCases("adapt-format"), ["adapt-format"]);
  assert.deepEqual(selectHeadlessCases("approved-bulk"), ["approved-bulk"]);
  assert.throws(() => selectHeadlessCases("adpat-format"), /Choose --case/);
  assert.equal(headlessCaseBudget(2_000_000, cases.length), 400_000);
  assert.ok(
    headlessCaseBudget(100_001, cases.length) * cases.length <= 100_001,
  );
  assert.throws(() => headlessCaseBudget(0, cases.length));
});

test("Skills First graph documents early dependencies and targeted analysis excludes later paid stages", async () => {
  const seed = await skillsFirstPackage();
  assert.deepEqual(selectedAgents(seed.graph, "analyze"), [
    "normalize",
    "levels",
    "analyze",
  ]);
  const description = seed.graph.nodes.find(
    (node) => node.id === "analyze",
  )!.description;
  assert.match(description!, /evidence requires degrees/);
  assert.match(
    description!,
    /consistency requires degrees, evidence, mandatory, licenses and barriers/,
  );
  assert.equal(
    validatePackage(seed.files).graph.nodes.find(
      (node) => node.id === "analyze",
    )!.description,
    description,
  );
  // Codex may append an upstream adapter to the array; approvals still follow its dependency edges.
  seed.graph.nodes.push({
    id: "adapter",
    kind: "agent",
    label: "Adapter",
    entrypoint: "source/adapter.ts",
    enabled: true,
    models: {},
    configuration: {},
    position: { x: 0, y: 0 },
  });
  for (const edge of seed.graph.edges)
    if (edge.target === "normalize") edge.target = "adapter";
  seed.graph.edges.push({
    id: "adapter-normalize",
    source: "adapter",
    target: "normalize",
  });
  assert.deepEqual(selectedAgents(seed.graph, "analyze"), [
    "adapter",
    "normalize",
    "levels",
    "analyze",
  ]);
});

test("format acceptance rejects lost qualifications, altered IDs and skipped dependency analysis", async () => {
  const raw = JSON.parse(
    await readFile(
      new URL("manual/fixtures/recruitment-export.json", import.meta.url),
      "utf8",
    ),
  );
  const input = exportRows.parse(raw);
  const rows = input.map((item, index) => {
    const text = [
      ...item.vacancy_card.day_to_day,
      ...item.vacancy_card.entry_rules,
      ...item.vacancy_card.nice_to_have,
    ].join("\n\n");
    return {
      id: `asset:${index + 1}`,
      name: item.vacancy_card.display_heading,
      text,
      originalText: text,
      status: "unknown",
      errors: [],
      analysis: Object.fromEntries(
        ["degrees", "evidence"].map((name) => [
          name,
          { status: "known", findings: {}, evidence: [text] },
        ]),
      ),
    };
  });
  assert.deepEqual(verifyAdaptedResults(raw, "asset", rows), {
    records: 2,
    tasks: ["degrees", "evidence"],
  });
  assert.deepEqual(verifyAdaptedResults(raw, "asset", [rows[1]], ["asset:2"]), {
    records: 1,
    tasks: ["degrees", "evidence"],
  });
  assert.throws(
    () => verifyAdaptedResults(raw, "asset", [rows[0]], ["asset:2"]),
    /record ID/,
  );
  const lost = structuredClone(rows);
  lost[0].text = input[0].vacancy_card.day_to_day.join("\n");
  assert.throws(
    () => verifyAdaptedResults(raw, "asset", lost),
    /lost source passage/,
  );
  const renamed = structuredClone(rows);
  renamed[0].id = "changed";
  assert.throws(
    () => verifyAdaptedResults(raw, "asset", renamed),
    /preserve.*record ID/,
  );
  const missing = structuredClone(rows);
  delete missing[0].analysis.degrees;
  assert.throws(
    () => verifyAdaptedResults(raw, "asset", missing),
    /degree prerequisite/,
  );
  const quote = structuredClone(rows);
  quote[0].analysis.evidence.evidence = ["Invented requirement"];
  assert.throws(
    () => verifyAdaptedResults(raw, "asset", quote),
    /Unsupported evidence/,
  );
});

test("manual interruption holds only the armed run's durable checkpoint and releases during cleanup", () => {
  const gate = new ManualCheckpointGate();
  let forwarded = 0,
    status: number | undefined,
    responses = 0;
  const response = {
    destroyed: false,
    status(value: number) {
      status = value;
      return this;
    },
    json() {
      responses++;
    },
  } as unknown as Response;
  const send = (runId: string, nodeId: string, complete = true) =>
    gate.middleware(
      {
        method: "POST",
        path: `/api/live-workflows/vm/groups/1/runs/${runId}/progress`,
        body: { nodeId, complete },
      } as Request,
      response,
      () => {
        forwarded++;
      },
    );
  gate.arm("bulk", "levels");
  assert.throws(() => gate.arm("other", "levels"));
  send("trial", "levels");
  send("bulk", "normalize");
  send("bulk", "levels", false);
  assert.equal(forwarded, 3);
  assert.equal(gate.atCheckpoint("bulk", "levels"), false);
  send("bulk", "levels");
  assert.equal(forwarded, 3);
  assert.equal(responses, 0);
  assert.equal(gate.atCheckpoint("bulk", "levels"), true);
  assert.equal(gate.atCheckpoint("trial", "levels"), false);
  gate.release();
  assert.equal(status, 409);
  assert.equal(responses, 1);
  send("bulk", "levels");
  assert.equal(forwarded, 4);
  gate.release();
  assert.equal(responses, 1);
});

test("bulk acceptance rejects repeated paid work and missing per-record analyses", () => {
  const before = ["a", "b"].map((recordId) => ({
    id: `${recordId}-levels`,
    recordId,
    nodeId: "levels",
    status: "settled",
    actualMicros: 100,
  })) as UsageReservation[];
  const after = [
    ...before,
    ...["a", "b"].flatMap((recordId) =>
      ["degrees", "evidence"].map((task) => ({
        id: `${recordId}-${task}`,
        recordId,
        nodeId: "analyze",
        status: "settled",
        actualMicros: 100,
      })),
    ),
  ] as UsageReservation[];
  verifyResumeLedger(before, after, 2);
  assert.throws(
    () =>
      verifyResumeLedger(
        before,
        [...after, { ...before[0], id: "repeated" }],
        2,
      ),
    /repeated completed paid work/,
  );
  const changed = structuredClone(after);
  changed[0].actualMicros = 200;
  assert.throws(
    () => verifyResumeLedger(before, changed, 2),
    /changed or repeated/,
  );
  const lost = structuredClone(after);
  lost.at(-1)!.recordId = "a";
  assert.throws(() => verifyResumeLedger(before, lost, 2));
});
