import test from "node:test";
import assert from "node:assert/strict";
import { openAiGpt6Models } from "../../agents/managers/openAiGpt6Models.js";
import {
  builtinProcessingModels,
  processingModelDefinitions,
} from "../modelCatalog.js";
import { ModelGateway } from "../modelGateway.js";
import { MemoryWorkflowStore } from "./memoryStore.js";
import { fixtureModelsJson } from "./modelFixture.js";

test("workflow models use backend seeding prices and stay below its long-context price threshold", () => {
  const catalog = builtinProcessingModels();
  assert.equal(catalog.length, 3);
  const seeded = openAiGpt6Models();
  assert.equal(seeded.length, 9); // Database seeding retains standard, priority and flex.
  for (const model of catalog) {
    const { configuration } = seeded.find(
      (entry) => entry.configuration.model === model.id,
    )!;
    assert.equal(configuration.inferenceType, undefined);
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
