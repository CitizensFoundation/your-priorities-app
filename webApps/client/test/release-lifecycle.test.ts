import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

const { scripts } = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const checks = [...scripts.prepack.matchAll(/npm run ([A-Za-z0-9:_-]+)/g)].map((match) => match[1]);

function lifecycle(command: "pack" | "publish", failStage = "") {
  const root = mkdtempSync(path.join(tmpdir(), "yrpri-release-lifecycle-"));
  const cwd = path.join(root, "package");
  const events = path.join(root, "events");
  mkdirSync(cwd);
  try {
    const fixtureScripts: Record<string, string> = {};
    for (const name of Object.keys(scripts)) {
      assert.match(name, /^[A-Za-z0-9:_-]+$/);
      fixtureScripts[name] = `node fixture-stage.mjs ${name}`;
    }
    fixtureScripts.prepack = scripts.prepack;
    fixtureScripts.postpack = "node fixture-stage.mjs postpack";
    if (scripts.publish) fixtureScripts.publish = scripts.publish;
    writeFileSync(path.join(cwd, "package.json"), JSON.stringify({
      name: "yrpri-release-lifecycle-fixture", version: "0.0.0", type: "module",
      files: ["fixture-stage.mjs"], scripts: fixtureScripts,
    }));
    writeFileSync(path.join(cwd, "fixture-stage.mjs"), `
      import { appendFileSync } from "node:fs";
      const stage = process.argv[2];
      appendFileSync(process.env.YRPRI_RELEASE_TEST_EVENTS, stage + "\\n");
      if (stage === process.env.YRPRI_RELEASE_TEST_FAIL_STAGE) process.exit(23);
    `);
    // Dry-run, offline mode and a loopback registry prevent any real upload.
    const result = spawnSync("npm", [command, `--prefix=${cwd}`, "--dry-run", "--offline",
      "--registry=http://127.0.0.1:9/", "--ignore-scripts=false"], {
      cwd, encoding: "utf8", timeout: 30_000,
      env: { ...process.env,
        npm_config_cache: path.join(root, "cache"),
        npm_config_loglevel: "error", npm_config_update_notifier: "false",
        YRPRI_RELEASE_TEST_EVENTS: events,
        YRPRI_RELEASE_TEST_FAIL_STAGE: failStage,
      },
    });
    if (result.error) throw result.error;
    return { status: result.status, output: result.stdout + result.stderr,
      events: existsSync(events) ? readFileSync(events, "utf8").trim().split("\n") : [],
    };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test("the manual release command is not registered as a publish lifecycle hook", () => {
  assert.equal(scripts.publish, undefined);
  assert.ok(scripts.publish_live);
  assert.ok(checks.includes("build:package"));
  assert.ok(checks.includes("test:aoi"));
});

for (const command of ["pack", "publish"] as const) {
  test(`${command} stops before packing if the build fails`, () => {
    const result = lifecycle(command, "build:package");
    assert.notEqual(result.status, 0, result.output);
    assert.deepEqual(result.events, ["build:package"]);
  });
}

test("publish stops before packing when a regression check fails", () => {
  const result = lifecycle("publish", "test:aoi");
  assert.notEqual(result.status, 0, result.output);
  assert.deepEqual(result.events, checks.slice(0, checks.indexOf("test:aoi") + 1));
});

test("publish runs release checks before packing and does not invoke publish_live afterward", () => {
  const result = lifecycle("publish");
  assert.equal(result.status, 0, result.output);
  assert.deepEqual(result.events, [...checks, "postpack"]);
});
