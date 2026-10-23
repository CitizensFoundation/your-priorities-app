import assert from "node:assert/strict";
import test from "node:test";
import { NormalizedSessionEvents, } from "../../../contracts/index.js";
import { normalizeCodexNotification } from "../../codex/appServerEvents.js";
const sessionPayload = {
    commandId: "command-1",
    sessionId: "11111111-1111-4111-8111-111111111111",
    runId: "22222222-2222-4222-8222-222222222222",
    runStepId: "33333333-3333-4333-8333-333333333333",
    nodeId: "66666666-6666-4666-8666-666666666666",
    workspaceId: "44444444-4444-4444-8444-444444444444",
    vmHostId: "55555555-5555-4555-8555-555555555555",
    runtimeProfileId: "77777777-7777-4777-8777-777777777777",
    codexThreadId: "thread-existing",
    layout: {
        rootPath: "/workspace-root",
        workspacePath: "/workspace-root/workspace",
        codexHomePath: "/workspace-root/codex-home",
        artifactsPath: "/workspace-root/artifacts",
        cachePath: "/workspace-root/cache",
    },
    runtimeSnapshot: {},
    inputPayload: { prompt: "Run the analysis" },
};
const coverageCases = [
    {
        name: "thread start",
        expected: "thread.started",
        message: { method: "thread/started", params: { thread: { id: "thread-1" } } },
    },
    {
        name: "thread status change",
        expected: "thread.status.changed",
        message: { method: "thread/status/changed", params: { threadId: "thread-1", status: "running" } },
    },
    {
        name: "thread close",
        expected: "thread.closed",
        message: { method: "thread/closed", params: { threadId: "thread-1" } },
    },
    {
        name: "turn start",
        expected: "turn.started",
        message: { method: "turn/started", params: { turn: { id: "turn-1" }, threadId: "thread-1" } },
    },
    {
        name: "turn plan update",
        expected: "turn.plan.updated",
        message: { method: "turn/plan/updated", params: { threadId: "thread-1", turnId: "turn-1", plan: [] } },
    },
    {
        name: "turn diff update",
        expected: "turn.diff.updated",
        message: { method: "turn/diff/updated", params: { threadId: "thread-1", turnId: "turn-1", diff: "" } },
    },
    {
        name: "turn complete",
        expected: "turn.completed",
        message: { method: "turn/completed", params: { threadId: "thread-1", turnId: "turn-1" } },
    },
    {
        name: "session error",
        expected: "session.error",
        message: { method: "error", params: { message: "failed" } },
    },
    {
        name: "agent message delta",
        expected: "message.delta",
        message: { method: "item/agentMessage/delta", params: { threadId: "thread-1", turnId: "turn-1", delta: "hello" } },
    },
    {
        name: "command output delta",
        expected: "command.output.delta",
        message: {
            method: "item/commandExecution/outputDelta",
            params: { threadId: "thread-1", turnId: "turn-1", itemId: "item-1", delta: "stdout line\n" },
        },
    },
    {
        name: "command terminal input",
        expected: "command.terminal.input",
        message: {
            method: "item/commandExecution/terminalInteraction",
            params: { threadId: "thread-1", turnId: "turn-1", itemId: "item-1", stdin: "y\n" },
        },
    },
    {
        name: "file output delta",
        expected: "file.output.delta",
        message: {
            method: "item/fileChange/outputDelta",
            params: { threadId: "thread-1", turnId: "turn-1", itemId: "item-1", delta: "patch" },
        },
    },
    {
        name: "ordinary item start",
        expected: "item.started",
        message: {
            method: "item/started",
            params: { threadId: "thread-1", turnId: "turn-1", item: { id: "item-1", type: "commandExecution" } },
        },
    },
    {
        name: "ordinary item complete",
        expected: "item.completed",
        message: {
            method: "item/completed",
            params: { threadId: "thread-1", turnId: "turn-1", item: { id: "item-1", type: "commandExecution" } },
        },
    },
    {
        name: "agent message complete",
        expected: "message.completed",
        message: {
            method: "item/completed",
            params: {
                threadId: "thread-1",
                turnId: "turn-1",
                item: { id: "message-1", type: "agentMessage", text: "completed text" },
            },
        },
    },
    {
        name: "approval requested",
        expected: "approval.requested",
        message: {
            id: "approval-request-1",
            method: "item/commandExecution/requestApproval",
            params: { threadId: "thread-1", turnId: "turn-1", itemId: "item-1" },
        },
    },
    {
        name: "approval resolved",
        expected: "approval.resolved",
        message: {
            method: "serverRequest/resolved",
            params: { threadId: "thread-1", requestId: "approval-request-1", decision: "approved" },
        },
    },
    {
        name: "review entered",
        expected: "review.entered",
        message: {
            method: "item/started",
            params: { threadId: "thread-1", turnId: "turn-1", item: { id: "item-1", type: "enteredReviewMode" } },
        },
    },
    {
        name: "review exited",
        expected: "review.exited",
        message: {
            method: "item/completed",
            params: { threadId: "thread-1", turnId: "turn-1", item: { id: "item-1", type: "exitedReviewMode" } },
        },
    },
    {
        name: "token usage metrics",
        expected: "metrics.updated",
        message: {
            method: "thread/tokenUsage/updated",
            params: { threadId: "thread-1", tokenUsage: { input: 10, output: 2 } },
        },
    },
    {
        name: "quota metrics",
        expected: "quota.updated",
        message: {
            method: "account/rateLimits/updated",
            params: {
                rateLimits: {
                    limitId: "codex",
                    primary: { usedPercent: 76, windowDurationMins: 15, resetsAt: 1730947200 },
                },
            },
        },
    },
    {
        name: "usage routing switch",
        expected: "usage.routing.switched",
        message: {
            method: "yp-live-workflow/usageRouting/switched",
            params: { previousLane: "chatgpt_plan", activeLane: "openai_api", reason: "quota_limit_reached" },
        },
    },
    {
        name: "usage routing unavailable",
        expected: "usage.routing.unavailable",
        message: {
            method: "yp-live-workflow/usageRouting/unavailable",
            params: { lane: "openai_api", reason: "openai_api_quota_reached" },
        },
    },
    {
        name: "unknown raw trace",
        expected: "codex.raw",
        message: { method: "experimental/notification", params: { threadId: "thread-1" } },
    },
];
test("normalizeCodexNotification maps every normalized session event covered by A4", () => {
    const produced = new Set();
    for (const [index, testCase] of coverageCases.entries()) {
        const event = normalizeCodexNotification(sessionPayload, testCase.message, index);
        assert.equal(event?.seq, index, testCase.name);
        assert.equal(event?.eventType, testCase.expected, testCase.name);
        produced.add(testCase.expected);
    }
    assert.deepEqual(NormalizedSessionEvents.filter((eventType) => !produced.has(eventType)), []);
});
test("normalizeCodexNotification exposes command execution output deltas", () => {
    const event = normalizeCodexNotification(sessionPayload, {
        method: "item/commandExecution/outputDelta",
        params: {
            threadId: "thread-1",
            turnId: "turn-1",
            itemId: "item-1",
            delta: "stdout line\n",
        },
    }, 0, "event-stream-1");
    assert.equal(event?.seq, 0);
    assert.equal(event?.vmEventStreamId, "event-stream-1");
    assert.equal(event?.eventType, "command.output.delta");
    assert.equal(event?.codexThreadId, "thread-1");
    assert.equal(event?.codexTurnId, "turn-1");
    assert.equal(event?.itemId, "item-1");
    assert.deepEqual(event?.payload, {
        threadId: "thread-1",
        turnId: "turn-1",
        itemId: "item-1",
        delta: "stdout line\n",
    });
});
test("normalizeCodexNotification exposes command terminal interactions", () => {
    const event = normalizeCodexNotification(sessionPayload, {
        method: "item/commandExecution/terminalInteraction",
        params: {
            threadId: "thread-1",
            turnId: "turn-1",
            itemId: "item-1",
            processId: "process-1",
            stdin: "y\n",
        },
    }, 1);
    assert.equal(event?.seq, 1);
    assert.equal(event?.eventType, "command.terminal.input");
    assert.equal(event?.payload.stdin, "y\n");
    assert.equal(event?.rawPayload?.method, "item/commandExecution/terminalInteraction");
});
test("normalizeCodexNotification maps review mode item lifecycle events", () => {
    const entered = normalizeCodexNotification(sessionPayload, {
        method: "item/started",
        params: {
            threadId: "thread-1",
            turnId: "turn-1",
            item: { id: "item-review-1", type: "enteredReviewMode" },
        },
    }, 2);
    const ordinaryStarted = normalizeCodexNotification(sessionPayload, {
        method: "item/started",
        params: {
            threadId: "thread-1",
            turnId: "turn-1",
            item: { id: "item-command-1", type: "commandExecution" },
        },
    }, 3);
    const exited = normalizeCodexNotification(sessionPayload, {
        method: "item/completed",
        params: {
            threadId: "thread-1",
            turnId: "turn-1",
            item: { id: "item-review-1", type: "exitedReviewMode" },
        },
    }, 4);
    const ordinaryCompleted = normalizeCodexNotification(sessionPayload, {
        method: "item/completed",
        params: {
            threadId: "thread-1",
            turnId: "turn-1",
            item: { id: "item-command-1", type: "commandExecution" },
        },
    }, 5);
    assert.equal(entered?.eventType, "review.entered");
    assert.equal(entered?.itemId, "item-review-1");
    assert.deepEqual(entered?.payload, {
        threadId: "thread-1",
        turnId: "turn-1",
        item: { id: "item-review-1", type: "enteredReviewMode" },
    });
    assert.equal(ordinaryStarted?.eventType, "item.started");
    assert.equal(exited?.eventType, "review.exited");
    assert.equal(ordinaryCompleted?.eventType, "item.completed");
});
test("normalizeCodexNotification maps completed agent messages to readable payloads", () => {
    const event = normalizeCodexNotification(sessionPayload, {
        method: "item/completed",
        params: {
            threadId: "thread-1",
            turnId: "turn-1",
            item: { id: "message-1", type: "agentMessage", text: "Done." },
        },
    }, 6);
    assert.equal(event?.eventType, "message.completed");
    assert.equal(event?.itemId, "message-1");
    assert.deepEqual(event?.payload, {
        threadId: "thread-1",
        turnId: "turn-1",
        itemId: "message-1",
        itemType: "agentMessage",
        text: "Done.",
    });
    assert.equal(event?.rawPayload?.method, "item/completed");
});
test("normalizeCodexNotification exposes token usage metrics", () => {
    const event = normalizeCodexNotification(sessionPayload, {
        method: "thread/tokenUsage/updated",
        params: {
            threadId: "thread-1",
            tokenUsage: { input: 10, output: 2 },
        },
    }, 6);
    assert.equal(event?.seq, 6);
    assert.equal(event?.eventType, "metrics.updated");
    assert.equal(event?.codexThreadId, "thread-1");
    assert.deepEqual(event?.payload, {
        threadId: "thread-1",
        tokenUsage: { input: 10, output: 2 },
    });
});
test("normalizeCodexNotification exposes sanitized quota metrics", () => {
    const event = normalizeCodexNotification(sessionPayload, {
        method: "account/rateLimits/updated",
        params: {
            email: "scientist@example.com",
            accessToken: "secret",
            rateLimits: {
                limitId: "codex",
                limitName: "Codex",
                primary: { usedPercent: 91, windowDurationMins: 15, resetsAt: 1730947200 },
                rateLimitReachedType: "usage_limit",
                planType: "pro",
            },
        },
    }, 7);
    assert.equal(event?.eventType, "quota.updated");
    assert.deepEqual(event?.payload, {
        rateLimits: {
            limitId: "codex",
            limitName: "Codex",
            primary: { usedPercent: 91, windowDurationMins: 15, resetsAt: 1730947200 },
            rateLimitReachedType: "usage_limit",
            planType: "pro",
        },
    });
    assert.deepEqual(event?.rawPayload, {
        method: "account/rateLimits/updated",
        params: {
            rateLimits: {
                limitId: "codex",
                limitName: "Codex",
                primary: { usedPercent: 91, windowDurationMins: 15, resetsAt: 1730947200 },
                rateLimitReachedType: "usage_limit",
                planType: "pro",
            },
        },
    });
    assert.equal(JSON.stringify(event?.rawPayload).includes("accessToken"), false);
    assert.equal(JSON.stringify(event?.rawPayload).includes("scientist@example.com"), false);
});
test("normalizeCodexNotification compacts turn diff payloads", () => {
    const event = normalizeCodexNotification(sessionPayload, {
        method: "turn/diff/updated",
        params: {
            threadId: "thread-1",
            turnId: "turn-1",
            diff: [
                "diff --git a/one.ts b/one.ts",
                "index 1..2 100644",
                "diff --git a/two.ts b/two.ts",
                "index 1..2 100644",
            ].join("\n"),
        },
    }, 7);
    assert.equal(event?.eventType, "turn.diff.updated");
    assert.deepEqual(event?.payload, {
        diff: [
            "diff --git a/one.ts b/one.ts",
            "index 1..2 100644",
            "diff --git a/two.ts b/two.ts",
            "index 1..2 100644",
        ].join("\n"),
        filesChanged: 2,
    });
});
test("normalizeCodexNotification treats malformed turn diffs as raw trace events", () => {
    const event = normalizeCodexNotification(sessionPayload, {
        method: "turn/diff/updated",
        params: {
            threadId: "thread-1",
            turnId: "turn-1",
            filesChanged: 0,
        },
    }, 8);
    assert.equal(event?.eventType, "codex.raw");
    assert.deepEqual(event?.payload, { method: "turn/diff/updated" });
});
test("normalizeCodexNotification maps all approval request methods with stable request ids", () => {
    const methods = [
        "item/commandExecution/requestApproval",
        "item/fileChange/requestApproval",
        "item/permissions/requestApproval",
        "item/tool/requestUserInput",
    ];
    for (const [index, method] of methods.entries()) {
        const event = normalizeCodexNotification(sessionPayload, {
            id: `jsonrpc-${index}`,
            method,
            params: {
                threadId: "thread-1",
                turnId: "turn-1",
                itemId: "item-1",
            },
        }, 8 + index);
        assert.equal(event?.eventType, "approval.requested", method);
        assert.equal(event?.payload.requestId, `jsonrpc-${index}`, method);
    }
    const event = normalizeCodexNotification(sessionPayload, {
        id: "jsonrpc-fallback",
        method: "item/tool/requestUserInput",
        params: {
            threadId: "thread-1",
            requestId: "upstream-request-id",
        },
    }, 12);
    assert.equal(event?.payload.requestId, "upstream-request-id");
});
test("normalizeCodexNotification captures unsupported notifications as raw trace events", () => {
    const event = normalizeCodexNotification(sessionPayload, {
        id: "raw-request-1",
        method: "experimental/notification",
        params: {
            threadId: "thread-1",
            value: true,
        },
    }, 13);
    assert.equal(event?.seq, 13);
    assert.equal(event?.eventType, "codex.raw");
    assert.equal(event?.codexThreadId, "thread-1");
    assert.deepEqual(event?.payload, { method: "experimental/notification", requestId: "raw-request-1" });
    assert.deepEqual(event?.rawPayload, {
        id: "raw-request-1",
        method: "experimental/notification",
        params: {
            threadId: "thread-1",
            value: true,
        },
    });
});
test("normalizeCodexNotification suppresses sensitive raw account notifications", () => {
    for (const method of [
        "account/updated",
        "account/login/completed",
        "mcpServer/oauthLogin/completed",
    ]) {
        const event = normalizeCodexNotification(sessionPayload, {
            method,
            params: {
                email: "scientist@example.com",
                accessToken: "secret",
            },
        }, 14);
        assert.equal(event, null, method);
    }
});
