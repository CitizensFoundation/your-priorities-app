import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile, rm, stat, } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { CodexAdapter } from "../vm/codex/codexAdapter.js";
import { OfflineCodexTransport } from "./manual/offlineProviders.js";
// The fake transport imitates app-server's credential file without calling OpenAI.
test("API-key sessions isolate and remove temporary credentials while retaining thread history", async (t) => {
    const root = await mkdtemp(path.join(os.tmpdir(), "yp-api-key-session-"));
    t.after(() => rm(root, { recursive: true, force: true }));
    const key = "sk-fake-session-test-key-only";
    let temporary = "";
    const adapter = new CodexAdapter({
        env: {},
        transportFactory: (launch) => {
            temporary = launch.codexHomePath;
            assert.ok(!JSON.stringify(launch.env).includes(key));
            const transport = new OfflineCodexTransport();
            const request = transport.request.bind(transport);
            transport.request = async (method) => {
                if (method === "account/login/start") {
                    await writeFile(path.join(temporary, "auth.json"), JSON.stringify({ OPENAI_API_KEY: key }), { mode: 0o600 });
                    await writeFile(path.join(temporary, "sessions", "history.jsonl"), "fake thread history");
                }
                return request(method);
            };
            return transport;
        },
    });
    t.after(() => adapter.closeAll());
    await mkdir(path.join(root, "workspace"));
    await adapter.startSession({
        commandId: "command",
        sessionId: "session",
        runId: "run",
        runStepId: "step",
        nodeId: "node",
        workspaceId: "workspace",
        vmHostId: "host",
        runtimeProfileId: "runtime",
        authProfileId: "auth",
        layout: {
            rootPath: root,
            workspacePath: `${root}/workspace`,
            codexHomePath: `${root}/codex-home`,
            artifactsPath: `${root}/artifacts`,
            cachePath: `${root}/cache`,
        },
        runtimeSnapshot: {},
        inputPayload: {},
        initialTurnMode: "deferred",
        auth: {
            provider: "openai",
            authMode: "openai_api_key",
            metadata: { openAiApiKeyMaterial: { apiKey: key } },
        },
    });
    assert.ok(!temporary.startsWith(`${root}/`));
    assert.ok((await readFile(path.join(temporary, "auth.json"), "utf8")).includes(key));
    await assert.rejects(stat(path.join(root, "codex-home/auth.json")), {
        code: "ENOENT",
    });
    assert.equal(await adapter.closeSession("session"), true);
    await assert.rejects(stat(temporary), { code: "ENOENT" });
    assert.equal(await readFile(path.join(root, "codex-home/sessions/history.jsonl"), "utf8"), "fake thread history");
});
