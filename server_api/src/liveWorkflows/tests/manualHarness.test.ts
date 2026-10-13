import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, writeFile, rm, symlink } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  fixturePath,
  importManualKey,
  manualKeyName,
  manualConfigSchema,
  resolveManualConfig,
  readManualConfig,
  requireLiveOptIn,
  redactManualText,
} from "./manual/environment.js";
import {
  analysisNames,
  verifyDownload,
  verifySkillsFirstOutput,
  type ManualJob,
} from "./manual/verification.js";
import { skillsFirstPackage } from "../packages.js";
import { resolveAuthEnvironment } from "../vm/codex/codexAuth.js";
import { builtinProcessingModels } from "../modelCatalog.js";

test("manual credential import allows only the model key, does not evaluate shell syntax, and preserves an explicit key", async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), "yp-manual-env-test-"));
  try {
    const filename = path.join(temp, "test.env");
    await writeFile(
      filename,
      'export OPENAI_API_KEY="fixture-$(never-run-this)"\nDATABASE_URL=do-not-import\nNODE_OPTIONS=do-not-import\nYP_WORKFLOW_MANUAL_LIVE=1\n',
      { mode: 0o600 },
    );
    const env: NodeJS.ProcessEnv = {};
    await importManualKey(filename, env);
    assert.deepEqual(env, {
      [manualKeyName]: "fixture-$(never-run-this)",
    });
    await importManualKey("/missing/test-file", env);
    assert.equal(env[manualKeyName], "fixture-$(never-run-this)");
    await writeFile(
      filename,
      "PS_AGENT_OVERRIDE_OPENAI_API_KEY='alternate-fixture'",
    );
    const alternate: NodeJS.ProcessEnv = {};
    await importManualKey(filename, alternate);
    assert.deepEqual(alternate, { [manualKeyName]: "alternate-fixture" });
    await symlink(filename, path.join(temp, "link"));
    await assert.rejects(
      importManualKey(path.join(temp, "link"), {}),
      /regular file/,
    );
    await writeFile(filename, "DATABASE_URL=private-data");
    await assert.rejects(importManualKey(filename, {}), (error) => {
      assert.ok(error instanceof Error);
      assert.ok(!error.message.includes("private-data"));
      return /OPENAI_API_KEY/.test(error.message);
    });
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
});

test("manual paid runs require opt-in, a priced catalog model and a small cap", () => {
  assert.throws(() => requireLiveOptIn({}), /both --live/);
  assert.throws(
    () => requireLiveOptIn({ YP_WORKFLOW_MANUAL_LIVE: "true" }),
    /both --live/,
  );
  requireLiveOptIn({ YP_WORKFLOW_MANUAL_LIVE: "1" });
  const config = {
    codexModel: "fixture",
    trialBudgetMicros: 2_000_000,
    processingModel: "gpt-6-luna",
  };
  assert.ok(manualConfigSchema.safeParse(config).success);
  assert.ok(
    !manualConfigSchema.safeParse({
      ...config,
      trialBudgetMicros: 10_000_000,
    }).success,
  );
  assert.ok(
    !manualConfigSchema.safeParse({
      ...config,
      processingModel: {
        inputMicrosPerMillion: 0,
      },
    }).success,
  );
  assert.ok(
    !manualConfigSchema.safeParse({ ...config, codexModel: "SET_MODEL" })
      .success,
  );
  assert.throws(
    () =>
      resolveManualConfig(
        { ...config, processingModel: "unknown-model" },
        builtinProcessingModels(),
      ),
    /backend model catalog/,
  );
  assert.throws(
    () =>
      resolveManualConfig(
        config,
        builtinProcessingModels().map((model) => ({
          ...model,
          inputMicrosPerMillion: 0,
        })),
      ),
    /positive prices/,
  );
  assert.equal(
    redactManualText("error test-key-123 and sk-12345678", {
      [manualKeyName]: "test-key-123",
    }),
    "error [credential redacted] and [credential redacted]",
  );
});

test("manual Codex and agent selections default independently and get prices from the backend catalog", async () => {
  const models = builtinProcessingModels();
  const defaults = resolveManualConfig({}, models);
  assert.equal(defaults.codexModel, "gpt-6-luna");
  assert.equal(defaults.codexReasoningEffort, "max");
  assert.equal(defaults.processingReasoningEffort, "max");
  assert.equal(defaults.codexServiceTier, "regular");
  assert.equal(defaults.processingServiceTier, "regular");
  const fast = resolveManualConfig(
    { codexServiceTier: "fast", processingServiceTier: "fast" },
    models,
  );
  assert.equal(fast.processingModel.id, "gpt-6-luna");
  assert.equal(fast.processingModel.inferenceType, "priority");
  assert.equal(
    fast.processingModel.outputMicrosPerMillion,
    defaults.processingModel.outputMicrosPerMillion * 2,
  );
  assert.equal(
    fast.processingModel.standardPrices!.outputMicrosPerMillion,
    defaults.processingModel.outputMicrosPerMillion,
  );
  assert.equal(fast.codexReasoningEffort, "max");
  assert.equal(fast.processingReasoningEffort, "max");
  assert.equal(
    resolveManualConfig({ codexServiceTier: "fast" }).processingServiceTier,
    "regular",
  );
  assert.throws(() => resolveManualConfig({ codexServiceTier: "faster" }));
  assert.equal(
    resolveManualConfig({ codexReasoningEffort: "high" }, models)
      .processingReasoningEffort,
    "max",
  );
  assert.equal(
    resolveManualConfig({ processingReasoningEffort: "xhigh" }, models)
      .codexReasoningEffort,
    "max",
  );
  assert.throws(() =>
    resolveManualConfig({ processingReasoningEffort: "typo" }, models),
  );
  assert.equal(defaults.processingModel.id, "gpt-6-luna");
  assert.equal(defaults.processingModel.keyEnv, manualKeyName);
  assert.equal(
    defaults.processingModel.priceVersion,
    models.find((model) => model.id === "gpt-6-luna")!.priceVersion,
  );
  assert.equal(
    resolveManualConfig({ codexModel: "another-codex" }, models).processingModel
      .id,
    "gpt-6-luna",
  );
  const differentAgent = resolveManualConfig(
    { processingModel: "gpt-6-sol" },
    models,
  );
  assert.equal(differentAgent.codexModel, "gpt-6-luna");
  assert.equal(differentAgent.processingModel.id, "gpt-6-sol");
  assert.equal(
    differentAgent.processingModel.inputMicrosPerMillion,
    models.find((model) => model.id === "gpt-6-sol")!.inputMicrosPerMillion,
  );
  const config = await readManualConfig(
    new URL("manual/config.example.json", import.meta.url).pathname,
  );
  assert.deepEqual(config, defaults);
});

test("manual auth injection does not enable environment fallback in the product resolver", () => {
  assert.throws(
    () =>
      resolveAuthEnvironment(
        {
          provider: "openai",
          authMode: "env_api_key",
          secretRef: "OPENAI_API_KEY",
        },
        { OPENAI_API_KEY: "fixture" },
      ),
    /environment fallback is disabled/,
  );
});

test("Skills First manual fixture matches the default graph and verifier rejects incomplete or corrupted downloads", async () => {
  const jobs = JSON.parse(await readFile(fixturePath, "utf8")) as ManualJob[];
  assert.equal(jobs.length, 2);
  const seed = await skillsFirstPackage();
  assert.deepEqual(
    seed.graph.nodes
      .filter((node) => node.kind === "agent" && node.enabled)
      .map((node) => node.id),
    ["normalize", "levels", "analyze", "rewrite", "export"],
  );
  const output = jobs.map((job) => ({
    ...job,
    originalText: job.text,
    rewrittenText: job.text,
    status: "unknown",
    errors: [],
    analysis: Object.fromEntries(
      analysisNames.map((name) => [
        name,
        { status: "known", findings: {}, evidence: [job.text] },
      ]),
    ),
  }));
  assert.deepEqual(verifySkillsFirstOutput(jobs, output), {
    records: 2,
    unknown: 2,
  });
  assert.throws(
    () => verifySkillsFirstOutput(jobs, output.slice(1)),
    /Every single-level/,
  );
  const invalid = structuredClone(output);
  invalid[0].analysis.degrees.evidence = ["invented quotation"];
  assert.throws(
    () => verifySkillsFirstOutput(jobs, invalid),
    /unsupported quotation/,
  );
  const failed = structuredClone(output);
  (failed[0].errors as string[]).push("Model output failed validation");
  assert.throws(
    () => verifySkillsFirstOutput(jobs, failed),
    /Processing failed/,
  );
  const bytes = Buffer.from(JSON.stringify(output));
  const asset = {
    bytes: bytes.length,
    checksum: createHash("sha256").update(bytes).digest("hex"),
  };
  verifyDownload(asset, bytes);
  assert.throws(
    () => verifyDownload(asset, Buffer.from("corrupt")),
    /size differs/,
  );
  assert.throws(
    () => verifyDownload({ ...asset, checksum: "0".repeat(64) }, bytes),
    /bytes differ/,
  );
});
