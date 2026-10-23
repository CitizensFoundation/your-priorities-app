import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { ManualCodexUsage } from "./manual/codexUsage.js";
import { resolveManualConfig } from "./manual/environment.js";
import { ManualOperatorAdapter } from "./manual/operatorAdapter.js";
import { ManualGreetingAdapter } from "./manual/greetingAdapter.js";
import { CodexAdapter } from "../vm/codex/codexAdapter.js";
import { threadParams, turnStartParams, } from "../vm/codex/appServerRequests.js";
const config = resolveManualConfig({ codexServiceTier: "fast" });
const tokens = {
    inputTokens: 1000,
    cachedInputTokens: 200,
    cacheWriteInputTokens: 100,
    outputTokens: 100,
    reasoningOutputTokens: 80,
    totalTokens: 1100,
};
const cumulative = (n) => Object.fromEntries(Object.entries(tokens).map(([key, value]) => [key, value * n]));
function event(seq, type, turn = "turn-1", payload = {}) {
    return {
        seq,
        eventType: type,
        codexThreadId: "thread",
        codexTurnId: turn,
        sessionId: "session",
        workspaceId: "workspace",
        vmHostId: "host",
        payload,
    };
}
function metric(seq, n, turn = "turn-1", model = "gpt-6-luna") {
    return event(seq, "metrics.updated", turn, {
        tokenUsage: { total: cumulative(n), last: tokens },
        billingContext: { model, serviceTier: "fast", lane: "openai_api" },
        privatePayloadMustNotPersist: "private sentinel",
    });
}
test("Codex usage persists across two turns, prices cache partitions, and never double-counts reasoning or replayed metrics", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "yp-codex-usage-"));
    try {
        const usage = new ManualCodexUsage(config, "api-key", directory);
        await usage.record(event(1, "turn.started"));
        await usage.record(metric(2, 1));
        await usage.record(metric(2, 1));
        await usage.record(metric(3, 1));
        await usage.record(event(4, "turn.completed"));
        await usage.record(event(5, "turn.started", "turn-2"));
        await usage.record(metric(6, 2, "turn-2"));
        await usage.record(event(7, "turn.completed", "turn-2"));
        const report = usage.report();
        assert.equal(report.usageComplete, true);
        assert.equal(report.responses, 2);
        assert.equal(report.turns, 2);
        assert.equal(report.estimatedCostMicros, 538); // Each response: 700*.2 + 200*.02 + 100*.25 + 100*1.
        assert.deepEqual(report.tokens, cumulative(2));
        assert.equal(report.appliedServiceTier, null); // The app-server event cannot establish the actual tier.
        const saved = await readFile(path.join(directory, "codex-usage.json"), "utf8");
        assert.deepEqual(JSON.parse(saved), report);
        assert.equal(saved.includes("private sentinel"), false);
    }
    finally {
        await rm(directory, { recursive: true, force: true });
    }
});
test("Codex usage survives an unfinished turn and missing prices are never reported as zero cost", async () => {
    const usage = new ManualCodexUsage(config, "api-key");
    await usage.record(event(1, "turn.started"));
    await usage.record(metric(2, 1));
    assert.equal(usage.report().usageComplete, false);
    assert.equal(usage.report().estimatedCostMicros, 269);
    const unpriced = new ManualCodexUsage(config, "api-key");
    await unpriced.record(metric(1, 1, "turn-1", "unknown-model"));
    await unpriced.record(event(2, "turn.completed"));
    assert.equal(unpriced.report().pricingComplete, false);
    assert.equal(unpriced.report().estimatedCostMicros, null);
    await usage.record(metric(3, 0));
    assert.equal(usage.report().usageComplete, false);
    assert.match(usage.report().issues.join(" "), /backwards/);
});
test("Codex long-context pricing uses each response input, not a thread's cumulative input", async () => {
    const usage = new ManualCodexUsage(config, "api-key");
    const large = {
        ...tokens,
        inputTokens: 300000,
        cachedInputTokens: 0,
        cacheWriteInputTokens: 0,
        totalTokens: 300100,
    };
    const first = metric(1, 1);
    first.payload.tokenUsage = { total: large, last: large };
    await usage.record(first);
    const second = metric(2, 2);
    second.payload.tokenUsage = {
        total: Object.fromEntries(Object.entries(large).map(([key, value]) => [
            key,
            value + tokens[key],
        ])),
        last: tokens,
    };
    await usage.record(second);
    await usage.record(event(3, "turn.completed"));
    assert.equal(usage.report().usageComplete, true);
    assert.deepEqual(usage.report().entries.map((entry) => entry.longContext), [true, false]);
    assert.equal(usage.report().estimatedCostMicros, 120150 + 269);
});
test("manual fast mode reaches Codex thread and turn settings without lowering max effort", async (t) => {
    const captured = [];
    t.mock.method(CodexAdapter.prototype, "startSession", async (payload) => {
        captured.push(payload);
        return {};
    });
    const payload = {
        runtimeSnapshot: {
            modelDefaults: { model: "gpt-6-luna", reasoningEffort: "max" },
        },
        layout: { workspacePath: "/tmp/manual-workspace" },
    };
    for (const Adapter of [ManualOperatorAdapter, ManualGreetingAdapter])
        await new Adapter({}, "fast").startSession(payload);
    for (const candidate of captured) {
        assert.equal(threadParams(candidate).serviceTier, "fast");
        const turn = turnStartParams(candidate, [], {
            model: "gpt-6-luna",
            effort: "max",
        });
        assert.equal(turn.serviceTier, "fast");
        assert.equal(turn.effort, "max");
    }
});
