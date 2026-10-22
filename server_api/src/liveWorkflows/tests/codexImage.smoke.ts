/** Disposable, networkless verification. Never mount a real CODEX_HOME. */
import assert from "node:assert/strict";
import { spawn, execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";
import { inspectRuntimeContract } from "../vm/readiness.js";

const execute = promisify(execFile);
const image =
  process.env.YP_WORKFLOW_TEST_CODEX_IMAGE ??
  "yp-live-workflow/codex-runtime:1";
const docker = async (args: string[]) =>
  (
    await execute("docker", args, {
      timeout: 90_000,
      maxBuffer: 2 * 1024 ** 2,
    })
  ).stdout;
const versions = JSON.parse(
  await readFile(
    new URL(
      "../../../live-workflow-runtime/docker/versions.json",
      import.meta.url,
    ),
    "utf8",
  ),
);
const info = JSON.parse(await docker(["info", "--format", "{{json .}}"]));
const inspected = JSON.parse(await docker(["image", "inspect", image]));
const processing = JSON.parse(
  await docker(["image", "inspect", "yp-live-workflow/processing-runtime:1"]),
);
const checks = inspectRuntimeContract(
  info,
  inspected[0],
  processing[0],
  versions,
);
assert.ok(
  checks.every((c) => c.ok),
  JSON.stringify(checks),
);
assert.equal(
  (
    await docker([
      "run",
      "--rm",
      "--runtime=runc",
      "--network=none",
      "--env",
      "YP_LIVE_WORKFLOW_START_INNER_DOCKER=0",
      image,
      "codex",
      "--version",
    ])
  ).trim(),
  `codex-cli ${versions.codexVersion}`,
);
await docker([
  "run",
  "--rm",
  "--runtime=runc",
  "--network=none",
  "--env",
  "YP_LIVE_WORKFLOW_START_INNER_DOCKER=0",
  "--mount",
  `type=bind,src=${fileURLToPath(new URL("../../../workflow-packages/skills-first", import.meta.url))},dst=/workspace/package,readonly`,
  image,
  "tsc",
  "--noEmit",
  "--project",
  "/workspace/package/tsconfig.json",
]);
console.log(
  "Codex development image: complete Skills First package typechecks without network access or dependency installation",
);

async function handshake(runtime: string, innerDocker: boolean) {
  const name = `yp-codex-smoke-${randomUUID()}`;
  const child = spawn(
    "docker",
    [
      "run",
      "--rm",
      "-i",
      `--name=${name}`,
      `--runtime=${runtime}`,
      "--network=none",
      "--tmpfs",
      "/codex-home:rw,mode=0700",
      "--env",
      `YP_LIVE_WORKFLOW_START_INNER_DOCKER=${innerDocker ? 1 : 0}`,
      image,
      "codex",
      "app-server",
      "--listen",
      "stdio://",
    ],
    { stdio: ["pipe", "pipe", "pipe"] },
  );
  const pending = new Map<
    number,
    { resolve: (value: any) => void; reject: (error: Error) => void }
  >();
  const lines = createInterface({ input: child.stdout });
  lines.on("line", (line) => {
    try {
      const response = JSON.parse(line);
      const callback = pending.get(response.id);
      if (!callback) return;
      pending.delete(response.id);
      if (response.error)
        callback.reject(new Error(JSON.stringify(response.error)));
      else callback.resolve(response.result);
    } catch {
      /* Ignore non-protocol startup logs. */
    }
  });
  let stderr = "";
  child.stderr.on(
    "data",
    (chunk) => (stderr = (stderr + chunk.toString()).slice(-8000)),
  );
  const fail = (error: Error) => {
    for (const callback of pending.values()) callback.reject(error);
    pending.clear();
  };
  child.on("error", fail);
  child.on("exit", (code) =>
    fail(new Error(`Container exited (${code}): ${stderr}`)),
  );
  const timer = setTimeout(
    () => fail(new Error(`Offline ${runtime} handshake timed out: ${stderr}`)),
    75_000,
  );
  const request = (id: number, method: string, params: unknown) =>
    new Promise<any>((resolve, reject) => {
      pending.set(id, { resolve, reject });
      child.stdin.write(JSON.stringify({ id, method, params }) + "\n");
    });
  try {
    const init = await request(1, "initialize", {
      clientInfo: {
        name: "yp_workflow_offline_smoke",
        title: "Offline workflow test",
        version: "1.0.0",
      },
      capabilities: { experimentalApi: true },
    });
    assert.ok(init);
    child.stdin.write(JSON.stringify({ method: "initialized" }) + "\n");
    const account = await request(2, "account/read", {
      refreshToken: false,
    });
    assert.equal(
      account.account,
      null,
      "Fresh temporary Codex home must have no connected account",
    );
    if (innerDocker)
      assert.ok(
        (
          await docker([
            "exec",
            name,
            "docker",
            "info",
            "--format",
            "{{.ServerVersion}}",
          ])
        ).trim(),
      );
    console.log(
      `${runtime}: initialized pinned app-server with no account${innerDocker ? "; inner Docker ready" : ""}`,
    );
  } finally {
    clearTimeout(timer);
    lines.close();
    await docker(["rm", "-f", name]).catch(() => undefined);
    child.kill();
  }
}
await handshake("runc", false);
await handshake("sysbox-runc", true);
console.log(
  JSON.stringify({
    image: inspected[0].Id,
    bytes: inspected[0].Size,
    checks,
  }),
);
