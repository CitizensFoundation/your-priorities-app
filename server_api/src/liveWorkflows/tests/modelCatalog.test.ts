import test from "node:test";
import assert from "node:assert/strict";
import { openAiGpt6Models } from "../../agents/managers/openAiGpt6Models.js";
import {
  builtinProcessingModels,
  processingModelDefinitions,
  processingModelSchema,
} from "../modelCatalog.js";
import { ModelGateway } from "../modelGateway.js";
import { MemoryWorkflowStore } from "./memoryStore.js";
import { fixtureModelsJson } from "./modelFixture.js";

test("workflow models use backend seeding prices and stay below its long-context price threshold", () => {
  const catalog = builtinProcessingModels("all");
  assert.equal(catalog.length, 12);
  assert.equal(builtinProcessingModels().length, 4);
  assert.equal(new Set(catalog.map((model) => model.id)).size, catalog.length);
  const seeded = openAiGpt6Models();
  assert.equal(seeded.length, 12); // Database seeding retains standard, priority and flex.
  for (const model of catalog) {
    const { configuration } = seeded.find(
      (entry) => entry.configuration.model === model.id,
    )!;
    assert.equal(model.inferenceType, configuration.inferenceType);
    assert.equal(
      model.apiModel ?? model.id,
      configuration.apiModel ?? configuration.model,
    );
    if (model.inferenceType) {
      const standard = catalog.find((entry) => entry.id === model.apiModel)!;
      assert.equal(
        model.standardPrices!.inputMicrosPerMillion,
        standard.inputMicrosPerMillion,
      );
      assert.equal(
        model.standardPrices!.outputMicrosPerMillion,
        standard.outputMicrosPerMillion,
      );
    }
    assert.equal(
      model.inputMicrosPerMillion,
      configuration.prices.costInTokensPerMillion! * 1e6,
    );
    assert.equal(
      model.outputMicrosPerMillion,
      configuration.prices.costOutTokensPerMillion! * 1e6,
    );
    assert.equal(
      model.cachedInputMicrosPerMillion,
      configuration.prices.costInCachedContextTokensPerMillion! * 1e6,
    );
    assert.equal(
      model.cacheWriteInputMicrosPerMillion,
      configuration.prices.costInTokensPerMillion! *
        configuration.prices.cacheWriteInputCostMultiplier! *
        1e6,
    );
    assert.ok(
      model.contextTokens < configuration.prices.longContextTokenThreshold!,
    );
    assert.ok(model.maxOutputTokens <= configuration.maxTokensOut);
    assert.equal(model.reasoning, true);
    assert.equal(model.reasoningEffort, "max");
    assert.equal(model.maxOutputTokens, 65536);
  }
  const gateway = new ModelGateway(
    new MemoryWorkflowStore(),
    JSON.stringify(catalog),
  );
  assert.ok(gateway.catalog().every((model) => !("keyEnv" in model)));
});

test("the default catalog exposes seeded OpenAI tiers and custom tiers need complete routing and fallback prices", (t) => {
  const previous = process.env.YP_LIVE_WORKFLOW_MODELS;
  delete process.env.YP_LIVE_WORKFLOW_MODELS;
  t.after(() => {
    if (previous === undefined) delete process.env.YP_LIVE_WORKFLOW_MODELS;
    else process.env.YP_LIVE_WORKFLOW_MODELS = previous;
  });
  assert.equal(processingModelDefinitions().length, 12);
  for (const tier of ["fast", "flex"] as const) {
    const catalog = builtinProcessingModels(tier);
    assert.equal(catalog.length, 4);
    for (const model of catalog) {
      assert.equal(model.provider, "openai");
      assert.equal(model.inferenceType, tier === "fast" ? "priority" : "flex");
      assert.notEqual(model.id, model.apiModel);
      assert.throws(
        () => processingModelSchema.parse({ ...model, provider: "google" }),
        /OpenAI routing/,
      );
      assert.throws(
        () =>
          processingModelSchema.parse({ ...model, standardPrices: undefined }),
        /fallback prices/,
      );
    }
  }
});

test("an explicit workflow model registry still replaces the defaults and rejects duplicate IDs", () => {
  assert.deepEqual(processingModelDefinitions("[]"), []);
  const fixture = processingModelDefinitions(fixtureModelsJson);
  assert.equal(fixture.length, 1);
  assert.throws(
    () => processingModelDefinitions(JSON.stringify([...fixture, ...fixture])),
    /unique/,
  );
  assert.throws(() => processingModelDefinitions("not-json"));
});
