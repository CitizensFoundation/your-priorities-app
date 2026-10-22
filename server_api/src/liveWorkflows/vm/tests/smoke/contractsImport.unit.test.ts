import assert from "node:assert/strict";
import test from "node:test";
import { YP_LIVE_WORKFLOW_VM_PROTOCOL } from "../../../contracts/index.js";
import { VmAgentSkeleton } from "../../agent/vmAgentSkeleton.js";

test("VM agent skeleton imports shared protocol contracts", () => {
  const agent = new VmAgentSkeleton();

  assert.equal(agent.protocol, YP_LIVE_WORKFLOW_VM_PROTOCOL);
  assert.deepEqual(agent.workspaces.describeLayout("/mnt/experiments/example"), {
    rootPath: "/mnt/experiments/example",
    workspacePath: "/mnt/experiments/example/workspace",
    codexHomePath: "/mnt/experiments/example/codex-home",
    artifactsPath: "/mnt/experiments/example/artifacts",
    cachePath: "/mnt/experiments/example/cache",
  });
  assert.equal(agent.createRuntimeOptions().workspaceManager, agent.workspaces);
  assert.equal(agent.createRuntimeOptions().hostRegistrar, agent.host);
});
