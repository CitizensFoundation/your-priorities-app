import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import test from "node:test";
import { promisify } from "node:util";
import { YP_LIVE_WORKFLOW_VM_PROTOCOL } from "../../../contracts/index.js";
import { WorkspaceFileReadCommandHandler } from "../../commands/workspaceFileReadCommandHandler.js";
const execFileAsync = promisify(execFile);
test("WorkspaceFileReadCommandHandler reads a safe workspace file", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-workspace-file-read-"));
    const workspacePath = path.join(root, "workspace");
    const content = "# Live research\n";
    await fs.mkdir(workspacePath, { recursive: true });
    await fs.writeFile(path.join(workspacePath, "RESEARCH_PLAN.md"), content, "utf8");
    const handler = new WorkspaceFileReadCommandHandler(fakeDockerRuntime(workspacePath));
    const response = await handler.handle(envelope({
        path: "RESEARCH_PLAN.md",
    }), { now: () => new Date("2026-05-21T00:00:00.000Z") });
    assert.equal(response.messageType, "workspace.file.ready");
    assert.equal(response.data?.content, content);
    assert.equal(response.data?.contentChecksumSha256, createHash("sha256").update(content).digest("hex"));
    assert.equal(response.data?.truncated, false);
});
test("WorkspaceFileReadCommandHandler normalizes accepted repeated and backslash separators", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-workspace-file-read-normalize-"));
    const workspacePath = path.join(root, "workspace");
    await fs.mkdir(path.join(workspacePath, "nested", "folder"), { recursive: true });
    await fs.writeFile(path.join(workspacePath, "nested", "folder", "result.md"), "normalized", "utf8");
    const handler = new WorkspaceFileReadCommandHandler(fakeDockerRuntime(workspacePath));
    const response = await handler.handle(envelope({
        path: "nested\\\\folder//result.md",
    }), { now: () => new Date("2026-05-21T00:00:00.000Z") });
    assert.equal(response.data?.content, "normalized");
});
test("WorkspaceFileReadCommandHandler rejects raw absolute workspace paths", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-workspace-file-read-absolute-"));
    const workspacePath = path.join(root, "workspace");
    await fs.mkdir(workspacePath, { recursive: true });
    const handler = new WorkspaceFileReadCommandHandler(fakeDockerRuntime(workspacePath));
    await assert.rejects(() => handler.handle(envelope({ path: "/RESEARCH_PLAN.md" }), { now: () => new Date() }), /safe relative path/u);
});
test("WorkspaceFileReadCommandHandler rejects symlink escapes", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-workspace-file-read-symlink-"));
    const outside = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-workspace-file-read-outside-"));
    const workspacePath = path.join(root, "workspace");
    await fs.mkdir(workspacePath, { recursive: true });
    await fs.writeFile(path.join(outside, "RESEARCH_PLAN.md"), "# Outside\n", "utf8");
    await fs.symlink(path.join(outside, "RESEARCH_PLAN.md"), path.join(workspacePath, "RESEARCH_PLAN.md"));
    const handler = new WorkspaceFileReadCommandHandler(fakeDockerRuntime(workspacePath));
    await assert.rejects(() => handler.handle(envelope({ path: "RESEARCH_PLAN.md" }), { now: () => new Date() }), /refuses symlinks/u);
});
test("WorkspaceFileReadCommandHandler truncates oversized files", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-workspace-file-read-truncate-"));
    const workspacePath = path.join(root, "workspace");
    await fs.mkdir(workspacePath, { recursive: true });
    await fs.writeFile(path.join(workspacePath, "RESEARCH_PLAN.md"), "abcdef", "utf8");
    const handler = new WorkspaceFileReadCommandHandler(fakeDockerRuntime(workspacePath));
    const response = await handler.handle(envelope({
        path: "RESEARCH_PLAN.md",
        maxBytes: 3,
    }), { now: () => new Date("2026-05-21T00:00:00.000Z") });
    assert.equal(response.data?.content, "abc");
    assert.equal(response.data?.sizeBytes, 6);
    assert.equal(response.data?.truncated, true);
});
test("WorkspaceFileReadCommandHandler truncates at a complete UTF-8 boundary", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-workspace-file-read-utf8-truncate-"));
    const workspacePath = path.join(root, "workspace");
    await fs.mkdir(workspacePath, { recursive: true });
    await fs.writeFile(path.join(workspacePath, "RESEARCH_PLAN.md"), "A€B", "utf8");
    const handler = new WorkspaceFileReadCommandHandler(fakeDockerRuntime(workspacePath));
    const response = await handler.handle(envelope({
        path: "RESEARCH_PLAN.md",
        maxBytes: 2,
    }), { now: () => new Date("2026-05-21T00:00:00.000Z") });
    assert.equal(response.data?.content, "A");
    assert.equal(response.data?.contentChecksumSha256, createHash("sha256").update(Buffer.from("A", "utf8")).digest("hex"));
    assert.equal(response.data?.truncated, true);
});
test("WorkspaceFileReadCommandHandler round-trips complete multibyte UTF-8 content", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-workspace-file-read-utf8-complete-"));
    const workspacePath = path.join(root, "workspace");
    const content = "\uFEFFÍslensk rannsókn — €";
    await fs.mkdir(workspacePath, { recursive: true });
    await fs.writeFile(path.join(workspacePath, "RESEARCH_PLAN.md"), content, "utf8");
    const handler = new WorkspaceFileReadCommandHandler(fakeDockerRuntime(workspacePath));
    const response = await handler.handle(envelope({
        path: "RESEARCH_PLAN.md",
    }), { now: () => new Date("2026-05-21T00:00:00.000Z") });
    assert.equal(response.data?.content, content);
    assert.equal(response.data?.contentChecksumSha256, createHash("sha256").update(Buffer.from(content, "utf8")).digest("hex"));
    assert.equal(response.data?.truncated, false);
});
test("WorkspaceFileReadCommandHandler rejects binary content reads but permits checksum-only reads", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-workspace-file-read-binary-"));
    const workspacePath = path.join(root, "workspace");
    const content = Buffer.from([0xff, 0xfe, 0xfd]);
    await fs.mkdir(workspacePath, { recursive: true });
    await fs.writeFile(path.join(workspacePath, "binary.dat"), content);
    const handler = new WorkspaceFileReadCommandHandler(fakeDockerRuntime(workspacePath));
    await assert.rejects(handler.handle(envelope({ path: "binary.dat" }), { now: () => new Date() }), /not valid UTF-8 text; use checksumOnly/u);
    const response = await handler.handle(envelope({
        checksumOnly: true,
        path: "binary.dat",
    }), { now: () => new Date("2026-05-21T00:00:00.000Z") });
    assert.equal(response.data?.content, "");
    assert.equal(response.data?.contentChecksumSha256, createHash("sha256").update(content).digest("hex"));
});
test("WorkspaceFileReadCommandHandler hashes the complete file without returning content", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-workspace-file-checksum-"));
    const workspacePath = path.join(root, "workspace");
    const content = "abcdef";
    await fs.mkdir(workspacePath, { recursive: true });
    await fs.writeFile(path.join(workspacePath, "RESEARCH_PLAN.md"), content, "utf8");
    const handler = new WorkspaceFileReadCommandHandler(fakeDockerRuntime(workspacePath));
    const response = await handler.handle(envelope({
        checksumOnly: true,
        path: "RESEARCH_PLAN.md",
        maxBytes: 1,
    }), { now: () => new Date("2026-05-21T00:00:00.000Z") });
    assert.equal(response.data?.checksumOnly, true);
    assert.equal(response.data?.content, "");
    assert.equal(response.data?.contentChecksumSha256, createHash("sha256").update(content).digest("hex"));
    assert.equal(response.data?.sizeBytes, content.length);
    assert.equal(response.data?.truncated, false);
});
test("WorkspaceFileReadCommandHandler verifies a mounted review evidence file", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-review-evidence-read-"));
    const workspacePath = path.join(root, "review", "workspace");
    const evidenceRoot = path.join(root, "source", "artifacts");
    const content = "# Evidence\n";
    await fs.mkdir(workspacePath, { recursive: true });
    await fs.mkdir(evidenceRoot, { recursive: true });
    await fs.writeFile(path.join(evidenceRoot, "paper.md"), content, "utf8");
    const handler = new WorkspaceFileReadCommandHandler(fakeDockerRuntime(workspacePath, evidenceRoot));
    const response = await handler.handle(envelope({
        checksumOnly: true,
        path: "/review-sources/experiments/e01/artifacts/paper.md",
        scope: "review_evidence",
    }), { now: () => new Date("2026-05-21T00:00:00.000Z") });
    assert.equal(response.data?.scope, "review_evidence");
    assert.equal(response.data?.path, "/review-sources/experiments/e01/artifacts/paper.md");
    assert.equal(response.data?.contentChecksumSha256, createHash("sha256").update(content).digest("hex"));
});
test("WorkspaceFileReadCommandHandler stats a mounted evidence directory without reading it", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-review-evidence-stat-"));
    const workspacePath = path.join(root, "review", "workspace");
    const evidenceRoot = path.join(root, "source", "artifacts");
    await fs.mkdir(workspacePath, { recursive: true });
    await fs.mkdir(evidenceRoot, { recursive: true });
    const handler = new WorkspaceFileReadCommandHandler(fakeDockerRuntime(workspacePath, evidenceRoot));
    const response = await handler.handle(envelope({
        path: "/review-sources/experiments/e01/artifacts",
        scope: "review_evidence",
        statOnly: true,
    }), { now: () => new Date("2026-05-21T00:00:00.000Z") });
    assert.equal(response.data?.statOnly, true);
    assert.equal(response.data?.entryType, "directory");
    assert.equal(response.data?.content, "");
});
test("WorkspaceFileReadCommandHandler rejects FIFOs without waiting for a writer", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-workspace-file-read-fifo-"));
    const workspacePath = path.join(root, "workspace");
    const fifoPath = path.join(workspacePath, "RESEARCH_PLAN.md");
    await fs.mkdir(workspacePath, { recursive: true });
    await execFileAsync("mkfifo", [fifoPath]);
    const handler = new WorkspaceFileReadCommandHandler(fakeDockerRuntime(workspacePath));
    let settled = false;
    const read = handler
        .handle(envelope({ path: "RESEARCH_PLAN.md" }), { now: () => new Date() })
        .then(() => ({ error: null }), (error) => ({ error }))
        .finally(() => {
        settled = true;
    });
    await delay(100);
    const settledBeforeWriter = settled;
    if (!settledBeforeWriter) {
        await fs.open(fifoPath, "w").then((handle) => handle.close()).catch(() => undefined);
    }
    const result = await read;
    assert.equal(settledBeforeWriter, true);
    assert.match(String(result.error), /not a regular file/u);
});
function fakeDockerRuntime(workspacePath, evidenceRoot) {
    return {
        getSession: () => ({
            sessionId: "33333333-3333-4333-8333-333333333333",
            workspaceId: "55555555-5555-4555-8555-555555555555",
            layout: {
                rootPath: path.dirname(workspacePath),
                workspacePath,
                codexHomePath: path.join(path.dirname(workspacePath), "codex-home"),
                artifactsPath: path.join(path.dirname(workspacePath), "artifacts"),
                cachePath: path.join(path.dirname(workspacePath), "cache"),
            },
        }),
        resolveSessionEvidenceFile: (_sessionId, containerPath) => ({
            rootPath: evidenceRoot,
            relativePath: containerPath.endsWith("/artifacts") ? "" : path.posix.basename(containerPath),
        }),
    };
}
function envelope(overrides) {
    return {
        protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
        messageType: "workspace.file.read",
        commandId: "workspace-file-read-command-1",
        ts: "2026-05-21T00:00:00.000Z",
        data: {
            commandId: "workspace-file-read-command-1",
            sessionId: "33333333-3333-4333-8333-333333333333",
            workspaceId: "55555555-5555-4555-8555-555555555555",
            path: overrides.path,
            ...(overrides.scope ? { scope: overrides.scope } : {}),
            ...(overrides.maxBytes ? { maxBytes: overrides.maxBytes } : {}),
            ...(overrides.checksumOnly ? { checksumOnly: true } : {}),
            ...(overrides.statOnly ? { statOnly: true } : {}),
        },
    };
}
