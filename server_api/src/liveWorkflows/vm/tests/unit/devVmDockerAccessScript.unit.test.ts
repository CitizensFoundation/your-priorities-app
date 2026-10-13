import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { OfficialCodexAppServerImage } from "../../docker/dockerRuntimeManager.js";

const repoRoot = path.resolve(process.cwd(), "../..");
const scriptPath = path.join(repoRoot, "scripts/ensure-dev-vm-docker-access.mjs");

test("dev VM Docker preflight allows the built-in image when no allow-list is configured", async () => {
  const dockerBin = await fakeDockerBin();
  const result = runPreflight({
    YP_LIVE_WORKFLOW_DOCKER_BIN: dockerBin,
    YP_LIVE_WORKFLOW_CODEX_CONTAINER_IMAGE: undefined,
    YP_LIVE_WORKFLOW_CODEX_ALLOWED_IMAGES: undefined,
  });

  assert.equal(result.status, 0);
  assert.match(outputText(result.stdout), /Dev VM Docker access OK/u);
});

test("dev VM Docker preflight validates the built-in image against a configured allow-list", async () => {
  const dockerBin = await fakeDockerBin();
  const denied = runPreflight({
    YP_LIVE_WORKFLOW_DOCKER_BIN: dockerBin,
    YP_LIVE_WORKFLOW_CODEX_CONTAINER_IMAGE: undefined,
    YP_LIVE_WORKFLOW_CODEX_ALLOWED_IMAGES: "registry.example/codex:old",
  });

  assert.equal(denied.status, 1);
  assert.match(outputText(denied.stderr), /allow-list mismatch/u);
  assert.match(outputText(denied.stderr), new RegExp(escapeRegExp(OfficialCodexAppServerImage), "u"));

  const allowed = runPreflight({
    YP_LIVE_WORKFLOW_DOCKER_BIN: dockerBin,
    YP_LIVE_WORKFLOW_CODEX_CONTAINER_IMAGE: undefined,
    YP_LIVE_WORKFLOW_CODEX_ALLOWED_IMAGES: `registry.example/codex:old,${OfficialCodexAppServerImage}`,
  });

  assert.equal(allowed.status, 0);
  assert.match(outputText(allowed.stdout), /Dev VM Docker access OK/u);
});

async function fakeDockerBin(): Promise<string> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-fake-docker-"));
  const binPath = path.join(tempDir, "docker");
  await fs.writeFile(
    binPath,
    [
      "#!/usr/bin/env node",
      "if (process.argv[2] === 'version') {",
      "  process.stdout.write('25.0.0\\n');",
      "  process.exit(0);",
      "}",
      "process.stderr.write('unexpected docker command\\n');",
      "process.exit(1);",
      "",
    ].join("\n")
  );
  await fs.chmod(binPath, 0o755);
  return binPath;
}

function runPreflight(env: Record<string, string | undefined>): ReturnType<typeof spawnSync> {
  const mergedEnv = { ...process.env };
  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) {
      delete mergedEnv[key];
    } else {
      mergedEnv[key] = value;
    }
  }

  return spawnSync(process.execPath, [scriptPath], {
    cwd: repoRoot,
    env: mergedEnv,
    encoding: "utf8",
  });
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function outputText(value: string | Buffer): string {
  return typeof value === "string" ? value : value.toString("utf8");
}
