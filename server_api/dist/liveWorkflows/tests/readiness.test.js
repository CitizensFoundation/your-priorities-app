import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { inspectRuntimeContract, readiness } from "../vm/readiness.js";
test("readiness catches missing Sysbox and image drift without printing secrets", async () => {
    const versions = JSON.parse(await readFile(new URL("../../../live-workflow-runtime/docker/versions.json", import.meta.url), "utf8"));
    const labels = Object.fromEntries(Object.entries({
        version: versions.codexVersion,
        "source-commit": versions.codexSourceCommit,
        "patch-revision": versions.codexPatchRevision,
        "bwrap-sha256": versions.codexBundledBwrapSha256,
        "resolved-cargo-lock-sha256": versions.codexResolvedCargoLockSha256,
    }).map(([key, value]) => [`ai.yp-live-workflow.codex.${key}`, value]));
    assert.ok(inspectRuntimeContract({ Runtimes: { runc: {}, "sysbox-runc": {} } }, { Config: { Labels: labels } }, { Id: `sha256:${"a".repeat(64)}` }, versions).every((c) => c.ok));
    assert.ok(inspectRuntimeContract({ Runtimes: { runc: {} } }, { Config: { Labels: {} } }, {}, versions).every((c) => !c.ok));
    const checks = await readiness("api", {
        YP_LIVE_WORKFLOW_AUTH_ENCRYPTION_KEY: "DO_NOT_PRINT_THIS_SECRET",
    });
    assert.ok(checks.some((c) => !c.ok));
    assert.ok(!JSON.stringify(checks).includes("DO_NOT_PRINT"));
});
