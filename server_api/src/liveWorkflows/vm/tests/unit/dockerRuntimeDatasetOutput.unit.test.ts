import assert from "node:assert/strict";
import test from "node:test";
import type { VmSessionStartPayload } from "../../../contracts/index.js";
import {
  DockerRuntimeManager,
  OfficialCodexAppServerImage,
  type DockerCli,
  type DockerCliResult,
  type DockerCliRunOptions,
} from "../../docker/dockerRuntimeManager.js";

test("DockerRuntimeManager normalizes dataset output permissions inside a running container", async () => {
  const cli = new FakeDockerCli([dockerCliResult(0, "[]"), dockerCliResult(0)]);
  const runtime = new DockerRuntimeManager({ cli });

  await runtime.preflightSessionImage(sessionStartPayload());
  runtime.markSessionRunning("session-id");
  await runtime.normalizeDatasetOutputInContainer({
    sessionId: "session-id",
    containerPath: "/dataset-output/reference",
  });

  assert.deepEqual(cli.calls, [
    ["image", "inspect", OfficialCodexAppServerImage],
    ["exec", "yp-live-workflow-session-session-id", "chmod", "-R", "a+rX", "/dataset-output/reference"],
  ]);
  await assert.rejects(
    () => runtime.normalizeDatasetOutputInContainer({
      sessionId: "session-id",
      containerPath: "/dataset-output/../codex-home",
    }),
    /must stay under \/dataset-output/u
  );
});

test("DockerRuntimeManager normalizes artifact permissions inside a warm container", async () => {
  const cli = new FakeDockerCli([dockerCliResult(0, "[]"), dockerCliResult(0)]);
  const runtime = new DockerRuntimeManager({ cli });

  await runtime.preflightSessionImage(sessionStartPayload());
  runtime.markSessionPaused("session-id");

  assert.equal(await runtime.normalizeArtifactOutputInContainer({ sessionId: "session-id" }), true);
  assert.deepEqual(cli.calls, [
    ["image", "inspect", OfficialCodexAppServerImage],
    ["exec", "yp-live-workflow-session-session-id", "chmod", "-R", "a+rX", "/artifacts"],
  ]);
});

test("DockerRuntimeManager grants write access to one validated artifact directory", async () => {
  const cli = new FakeDockerCli([dockerCliResult(0, "[]"), dockerCliResult(0)]);
  const runtime = new DockerRuntimeManager({ cli });

  await runtime.preflightSessionImage(sessionStartPayload());
  runtime.markSessionRunning("session-id");

  assert.equal(await runtime.makeArtifactDirectoryWritableInContainer({
    sessionId: "session-id",
    containerPath: "/artifacts/reports/final",
  }), true);
  assert.deepEqual(cli.calls, [
    ["image", "inspect", OfficialCodexAppServerImage],
    ["exec", "yp-live-workflow-session-session-id", "chmod", "a+rwx", "/artifacts/reports/final"],
  ]);
  await assert.rejects(
    () => runtime.makeArtifactDirectoryWritableInContainer({
      sessionId: "session-id",
      containerPath: "/artifacts/../codex-home",
    }),
    /must stay under \/artifacts/u
  );
});

test("DockerRuntimeManager normalizes artifacts after a terminal event marks a live container failed", async () => {
  const cli = new FakeDockerCli([
    dockerCliResult(0, "[]"),
    dockerCliResult(0),
    dockerCliResult(0),
  ]);
  const runtime = new DockerRuntimeManager({ cli });

  await runtime.preflightSessionImage(sessionStartPayload());
  runtime.markSessionRunning("session-id");
  runtime.markSessionFailed("session-id", new Error("terminal Codex failure"));

  assert.equal(await runtime.normalizeArtifactOutputInContainer({ sessionId: "session-id" }), true);
  assert.equal(await runtime.makeArtifactDirectoryWritableInContainer({
    sessionId: "session-id",
    containerPath: "/artifacts/reports",
  }), true);
  assert.deepEqual(cli.calls, [
    ["image", "inspect", OfficialCodexAppServerImage],
    ["exec", "yp-live-workflow-session-session-id", "chmod", "-R", "a+rX", "/artifacts"],
    ["exec", "yp-live-workflow-session-session-id", "chmod", "a+rwx", "/artifacts/reports"],
  ]);
});

test("DockerRuntimeManager skips artifact normalization when the session container is unavailable", async () => {
  const cli = new FakeDockerCli([dockerCliResult(0, "[]")]);
  const runtime = new DockerRuntimeManager({ cli });

  await runtime.preflightSessionImage(sessionStartPayload());

  assert.equal(await runtime.normalizeArtifactOutputInContainer({ sessionId: "session-id" }), false);
  assert.equal(await runtime.normalizeArtifactOutputInContainer({ sessionId: "missing-session" }), false);
  assert.deepEqual(cli.calls, [["image", "inspect", OfficialCodexAppServerImage]]);
});

test("stopping a session makes Sysbox-created Codex home directories removable even without a separate auth root", async () => {
  const cli = new FakeDockerCli([dockerCliResult(0, "[]")]);
  const runtime = new DockerRuntimeManager({ cli });
  await runtime.preflightSessionImage(sessionStartPayload());
  runtime.markSessionRunning("session-id");
  const stopped = await runtime.terminateSession("session-id");
  assert.equal(stopped?.status, "stopped");
  const prepare = cli.calls.findIndex((call) => call[0] === "exec");
  const stop = cli.calls.findIndex((call) => call[0] === "stop");
  assert.ok(prepare >= 0 && prepare < stop);
  const script = cli.calls[prepare].at(-1)!;
  assert.match(script, /find \/codex-home -xdev -type d -exec chmod a\+rwx \{\} \+/u);
  assert.ok(!script.includes("chmod -R"), "Credential file permissions must stay intact");
  assert.ok(!script.includes("/workspace"), "Cleanup must stay inside the private Codex home");
});

function sessionStartPayload(): VmSessionStartPayload {
  return {
    commandId: "session-command-1",
    sessionId: "session-id",
    runId: "run-id",
    runStepId: "run-step-id",
    nodeId: "node-id",
    workspaceId: "workspace-id",
    vmHostId: "vm-host-id",
    runtimeProfileId: "runtime-profile-id",
    authProfileId: "auth-profile-id",
    layout: {
      rootPath: "/workspace/root",
      workspacePath: "/workspace/root/workspace",
      codexHomePath: "/workspace/root/codex-home",
      artifactsPath: "/workspace/root/artifacts",
      cachePath: "/workspace/root/cache",
      datasetOutputPath: "/workspace/root/dataset-output",
    },
    runtimeSnapshot: {
      containerImage: OfficialCodexAppServerImage,
      modelDefaults: { model: "gpt-test" },
      codexConfig: { approvalPolicy: "on-request" },
    },
    inputPayload: { objective: "Start codex" },
    auth: {
      provider: "openai",
      authMode: "codex_chatgpt_with_api_fallback",
      secretRef: "OPENAI_API_KEY",
      metadata: {
        openAiApiKeyMaterial: { apiKey: "test-key" },
      },
    },
  };
}

class FakeDockerCli implements DockerCli {
  readonly calls: string[][] = [];
  readonly runOptions: DockerCliRunOptions[] = [];

  constructor(private readonly results: DockerCliResult[] = []) {}

  async run(args: string[], options: DockerCliRunOptions = {}): Promise<DockerCliResult> {
    this.calls.push(args);
    this.runOptions.push(options);
    return this.results.shift() ?? dockerCliResult(0);
  }
}

function dockerCliResult(exitCode: number, stdout = "", stderr = ""): DockerCliResult {
  return {
    exitCode,
    signal: null,
    stdout,
    stderr,
    timedOut: false,
  };
}
