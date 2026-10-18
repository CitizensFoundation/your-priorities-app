import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { ModelGateway, validateProviderEnvironment } from "../modelGateway.js";
import { fixture, runId } from "./memoryStore.js";
import { fixtureModel as definition } from "./modelFixture.js";
import { builtinProcessingModels } from "../modelCatalog.js";
import { tokenCost } from "../schemas.js";
import type { UsageReservation } from "../budget.js";
import {
  openAiProcessingReply,
  generateOpenAiProcessing,
} from "../openAiProcessing.js";
import {
  workflowProviderTimeoutMs,
  workflowGatewayTimeoutMs,
  workflowSocketTimeoutMs,
} from "../runner/modelLimits.js";

test("reasoning effort reaches the bounded provider adapter from the immutable run without changing Codex", async (t) => {
  const { store } = await fixture();
  const model = {
    ...builtinProcessingModels("fast").find(
      (item) => item.id === "gpt-6-luna",
    )!,
    keyEnv: "YP_TEST_REASONING_KEY",
  };
  // This test enters the real provider adapter but intercepts generation before network access.
  const envNames = [
    model.keyEnv,
    "AZURE_OPENAI_KEY",
    "PS_AGENT_OVERRIDE_OPENAI_API_KEY",
    "OPENAI_BASE_URL",
    "OPENAI_ENFORCE_EU_REGION",
  ];
  const before = envNames.map((name) => process.env[name]);
  envNames.forEach((name) => delete process.env[name]);
  process.env[model.keyEnv] = "fixture-only";
  t.after(() =>
    envNames.forEach((name, index) => {
      if (before[index] === undefined) delete process.env[name];
      else process.env[name] = before[index];
    }),
  );
  const efforts: string[] = [];
  t.mock.method(
    globalThis,
    "fetch",
    async (url: string | URL | Request, init?: RequestInit) => {
      assert.equal(String(url), "https://api.openai.com/v1/responses");
      const body = JSON.parse(String(init?.body));
      efforts.push(body.reasoning.effort);
      assert.equal(body.max_output_tokens, 65536);
      assert.equal(body.service_tier, "priority");
      assert.equal(body.store, false);
      assert.ok(init?.signal);
      assert.ok(workflowGatewayTimeoutMs > workflowProviderTimeoutMs);
      assert.ok(workflowSocketTimeoutMs > workflowGatewayTimeoutMs);
      return Response.json({
        id: "resp_fixture",
        status: "completed",
        service_tier: "priority",
        usage: { input_tokens: 100, output_tokens: 500 },
        output: [
          {
            type: "message",
            phase: "commentary",
            content: [
              { type: "output_text", text: "Commentary must not become JSON" },
            ],
          },
          {
            type: "message",
            phase: "final_answer",
            content: [{ type: "output_text", text: "{}" }],
          },
        ],
      });
    },
  );
  const gateway = new ModelGateway(store, JSON.stringify([model]));
  await store.transact(1, async (tx) => {
    const run = (await tx.get<YpWorkflowRun>("run", runId))!;
    run.graph.nodes[0].models.default = model.id;
    await tx.put("run", runId, run);
    await tx.put("run-models", runId, gateway.catalog());
    tx.state.config.codexReasoningEffort = "low";
    tx.state.graph.nodes[0].reasoningEffort = "medium";
  });
  const request = {
    id: randomUUID(),
    runId,
    nodeId: "analyze",
    system: "Inspect",
    input: "hello",
  };
  const response = (await gateway.call(1, request)) as {
    appliedServiceTier: string;
  };
  assert.equal(response.appliedServiceTier, "priority");
  await gateway.call(1, request);
  assert.deepEqual(efforts, ["max"]); // Live graph changes cannot alter this run or re-spend its request.
  await store.transact(1, async (tx) => {
    const run = (await tx.get<YpWorkflowRun>("run", runId))!;
    run.graph.nodes[0].reasoningEffort = "high";
    await tx.put("run", runId, run);
  });
  await assert.rejects(gateway.call(1, request), /different|reused|match/i);
  await gateway.call(1, { ...request, id: randomUUID() });
  assert.deepEqual(efforts, ["max", "high"]);
  assert.equal(
    await store.transact(1, async (tx) => tx.state.config.codexReasoningEffort),
    "low",
  );
});

test("the actual OpenAI transport makes only one attempt on an ambiguous connection failure", async (t) => {
  let calls = 0;
  t.mock.method(globalThis, "fetch", async () => {
    calls++;
    throw new TypeError("connection reset");
  });
  await assert.rejects(
    generateOpenAiProcessing(definition, "fixture-only", "", "record"),
    /Connection error/,
  );
  assert.equal(calls, 1);
});
test("a priority reservation settles standard prices when the provider reports a downgrade", async () => {
  const { store } = await fixture();
  const model = builtinProcessingModels("fast").find(
    (item) => item.id === "gpt-6-luna",
  )!;
  const gateway = new ModelGateway(
    store,
    JSON.stringify([model]),
    async (selected) => {
      assert.equal(selected.inferenceType, "priority");
      return {
        content: "{}",
        tokensIn: 1000,
        cachedInTokens: 200,
        cacheWriteInTokens: 100,
        tokensOut: 100,
        appliedServiceTier: "default",
      };
    },
  );
  await store.transact(1, async (tx) => {
    const run = (await tx.get<YpWorkflowRun>("run", runId))!;
    run.graph.nodes[0].models.default = model.id;
    await tx.put("run", runId, run);
    await tx.put("run-models", runId, gateway.catalog());
  });
  const response = (await gateway.call(1, {
    id: randomUUID(),
    runId,
    nodeId: "analyze",
    system: "Inspect",
    input: "example",
  })) as {
    costMicros: number;
    appliedServiceTier: string;
    requestedServiceTier: string;
  };
  assert.equal(response.requestedServiceTier, "priority");
  assert.equal(response.appliedServiceTier, "default");
  assert.equal(response.costMicros, 135);
});
test("global provider overrides cannot silently change an approved model's billing identity", () => {
  const env = { YP_TEST_MODEL_KEY: "fixture" };
  assert.doesNotThrow(() => validateProviderEnvironment(definition, env));
  for (const override of [
    {
      AZURE_OPENAI_KEY: "key",
      AZURE_ENDPOINT: "https://example.invalid",
      AZURE_DEPLOYMENT_NAME: "different-model",
    },
    { PS_AGENT_OVERRIDE_OPENAI_API_KEY: "another-key" },
    { OPENAI_BASE_URL: "https://example.invalid" },
    { OPENAI_ENFORCE_EU_REGION: "true" },
  ])
    assert.throws(
      () => validateProviderEnvironment(definition, { ...env, ...override }),
      /conflict with workflow pricing/,
    );
  assert.throws(
    () => validateProviderEnvironment(definition, {}),
    /credential is not configured/,
  );
});
test("paid model calls record cached-input prices and reuse settled results without another provider call", async () => {
  const { store } = await fixture();
  let calls = 0;
  const gateway = new ModelGateway(
    store,
    JSON.stringify([definition]),
    async () => {
      calls++;
      return {
        content: '{"ok":true}',
        tokensIn: 1000,
        cachedInTokens: 200,
        tokensOut: 100,
      };
    },
  );
  await store.transact(1, (tx) =>
    tx.put("run-models", runId, gateway.catalog()),
  );
  const request = {
    id: randomUUID(),
    runId,
    nodeId: "analyze",
    system: "Review this text",
    input: { text: "hello" },
  };
  const result = (await gateway.call(1, request)) as { costMicros: number };
  assert.equal(result.costMicros, 2500);
  assert.deepEqual(await gateway.call(1, request), result);
  assert.equal(calls, 1);
  assert.equal(
    await store.transact(1, async (tx) => tx.state.spentMicros),
    2500,
  );
});
test("changed prices, oversized input and missing model selection cannot reach a paid provider", async () => {
  const { store } = await fixture();
  let calls = 0;
  const gateway = new ModelGateway(
    store,
    JSON.stringify([definition]),
    async () => {
      calls++;
      throw new Error("must not call");
    },
  );
  const request = {
    id: randomUUID(),
    runId,
    nodeId: "analyze",
    system: "",
    input: { text: "hello" },
  };
  await store.transact(1, (tx) =>
    tx.put("run-models", runId, [
      { ...gateway.catalog()[0], priceVersion: "obsolete" },
    ]),
  );
  await assert.rejects(gateway.call(1, request), /pricing changed/);
  await store.transact(1, (tx) =>
    tx.put("run-models", runId, gateway.catalog()),
  );
  await assert.rejects(
    gateway.call(1, { ...request, input: "x".repeat(200_000) }),
    /context bound/,
  );
  assert.equal(calls, 0);
  assert.equal(
    await store.transact(1, async (tx) => tx.state.reservedMicros),
    0,
  );
});
test("Luna reservations cover cache writes and settle cached, written and ordinary tokens separately", async () => {
  const { store } = await fixture();
  const model = builtinProcessingModels().find(
    (entry) => entry.id === "gpt-6-luna",
  )!;
  let calls = 0;
  const gateway = new ModelGateway(store, JSON.stringify([model]), async () => {
    calls++;
    return {
      content: "{}",
      tokensIn: 1000,
      cachedInTokens: 200,
      cacheWriteInTokens: 300,
      tokensOut: 100,
    };
  });
  await store.transact(1, async (tx) => {
    const run = (await tx.get<YpWorkflowRun>("run", runId))!;
    run.graph.nodes[0].models.default = model.id;
    await tx.put("run", runId, run);
    await tx.put("run-models", runId, gateway.catalog());
  });
  const request = {
    id: randomUUID(),
    runId,
    nodeId: "analyze",
    system: "",
    input: "hello",
  };
  const result = (await gateway.call(1, request)) as { costMicros: number };
  assert.equal(result.costMicros, 140); // $0.00005 ordinary + $0.000002 read + $0.000038 write + $0.00005 output.
  const inputBound = Buffer.byteLength(JSON.stringify(request.input)) + 1024;
  const reservation = (await store.transact(1, (tx) =>
    tx.get<UsageReservation>("usage", request.id),
  ))!;
  assert.equal(
    reservation.maximumMicros,
    tokenCost(inputBound, model.cacheWriteInputMicrosPerMillion!) +
      tokenCost(model.maxOutputTokens, model.outputMicrosPerMillion),
  );
  assert.equal(reservation.status, "settled");
  assert.deepEqual(await gateway.call(1, request), result);
  assert.equal(calls, 1);

  // A cap that would only cover ordinary input must stop before dispatch.
  await store.transact(1, async (tx) => {
    const run = (await tx.get<YpWorkflowRun>("run", runId))!;
    run.budgetMicros =
      run.spentMicros +
      tokenCost(inputBound, model.inputMicrosPerMillion) +
      tokenCost(model.maxOutputTokens, model.outputMicrosPerMillion);
    await tx.put("run", runId, run);
  });
  await assert.rejects(
    gateway.call(1, { ...request, id: randomUUID() }),
    /allowance|limit/,
  );
  assert.equal(calls, 1);
});
test("a provider timeout never silently retries or releases the money reservation", async () => {
  const { store } = await fixture();
  let calls = 0;
  const gateway = new ModelGateway(
    store,
    JSON.stringify([definition]),
    async () => {
      calls++;
      throw new Error("timeout");
    },
  );
  await store.transact(1, (tx) =>
    tx.put("run-models", runId, gateway.catalog()),
  );
  const request = {
    id: randomUUID(),
    runId,
    nodeId: "analyze",
    system: "",
    input: "record",
  };
  await assert.rejects(gateway.call(1, request), /timeout/);
  await assert.rejects(gateway.call(1, request), /unknown/);
  assert.equal(calls, 1);
  assert.ok(
    (await store.transact(1, async (tx) => tx.state.reservedMicros)) > 0,
  );
});

test("incomplete model output settles its verified usage, stays blocked on replay and cannot become a successful result", async () => {
  const { store } = await fixture();
  let calls = 0;
  const raw = {
    id: "resp_incomplete",
    status: "incomplete",
    incomplete_details: { reason: "max_output_tokens" },
    service_tier: "default",
    usage: {
      input_tokens: 1000,
      output_tokens: 100,
      input_tokens_details: { cached_tokens: 200, cache_write_tokens: 0 },
    },
    output: [
      {
        type: "message",
        content: [{ type: "output_text", text: '{"truncated":' }],
      },
    ],
  };
  const gateway = new ModelGateway(
    store,
    JSON.stringify([definition]),
    async () => {
      calls++;
      return openAiProcessingReply(raw);
    },
  );
  await store.transact(1, (tx) =>
    tx.put("run-models", runId, gateway.catalog()),
  );
  const request = {
    id: randomUUID(),
    runId,
    nodeId: "analyze",
    system: "",
    input: "record",
  };
  await assert.rejects(
    gateway.call(1, request),
    /output-token limit.*Usage was recorded/,
  );
  const receipt = (await store.transact(1, (tx) =>
    tx.get<UsageReservation>("usage", request.id),
  ))!;
  assert.equal(receipt.status, "settled");
  assert.equal(receipt.actualMicros, 2500);
  assert.deepEqual(receipt.result, {
    content: '{"truncated":',
    tokensIn: 1000,
    tokensOut: 100,
    costMicros: 2500,
    providerResponseId: "resp_incomplete",
    incompleteReason: "max_output_tokens",
    requestedServiceTier: "default",
    appliedServiceTier: "default",
  });
  assert.equal(
    await store.transact(1, async (tx) => tx.state.reservedMicros),
    0,
  );
  await assert.rejects(gateway.call(1, request), /output-token limit/);
  assert.equal(calls, 1);
  assert.throws(() => openAiProcessingReply({ ...raw, usage: null }), /usage/);
  assert.throws(() => openAiProcessingReply({ ...raw, status: "in_progress" }));
});
