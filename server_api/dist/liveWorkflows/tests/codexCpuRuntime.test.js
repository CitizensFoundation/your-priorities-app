import test from "node:test";
import assert from "node:assert/strict";
import { DockerRuntimeManager, OfficialCodexAppServerImage, } from "../vm/docker/dockerRuntimeManager.js";
test("default Codex launch keeps Sysbox and inner Docker without requesting GPU devices", () => {
    let args = [];
    const runtime = new DockerRuntimeManager({
        hostPlatform: "linux",
        containerRuntime: "sysbox-runc",
        transportFactory: (options) => {
            args = options.args ?? [];
            throw new Error("captured without launch");
        },
    });
    const root = "/tmp/yp-cpu-launch-fixture";
    const payload = {
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
        runtimeSnapshot: { containerImage: OfficialCodexAppServerImage },
        inputPayload: {},
        auth: { provider: "openai", authMode: "codex_chatgpt" },
    };
    assert.throws(() => runtime.createCodexAppServerTransport({ payload, env: {} }), /captured without launch/);
    assert.equal(args[args.indexOf("--runtime") + 1], "sysbox-runc");
    assert.ok(args.includes("YP_LIVE_WORKFLOW_START_INNER_DOCKER=1"));
    assert.ok(!args.includes("--gpus"));
    assert.ok(!args.includes("--device"));
    assert.ok(!args.some((arg) => arg.includes("nvidia") || arg.includes("cuda")));
    assert.ok(!args.includes("--privileged"));
});
