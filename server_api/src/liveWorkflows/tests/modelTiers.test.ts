import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { builtinProcessingModels } from "../modelCatalog.js";
import { ModelGateway } from "../modelGateway.js";
import { generateOpenAiProcessing } from "../openAiProcessing.js";
import { tokenCost } from "../schemas.js";
import type { UsageReservation } from "../budget.js";
import { fixture, runId } from "./memoryStore.js";

async function flexFixture() {
  const { store } = await fixture();
  const model = builtinProcessingModels("flex").find(
    (entry) => entry.id === "gpt-6-luna-flex",
  )!;
  const gateway = new ModelGateway(
    store,
    JSON.stringify([model]),
    (selected, system, input) =>
      generateOpenAiProcessing(selected, "fixture-only", system, input),
  );
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
    system: "Inspect",
    input: "example",
  };
  return { store, model, gateway, request };
}

for (const appliedTier of ["flex", "default"]) {
  test(`Flex sends the base API model, settles ${appliedTier} receipts and enforces the reserved cap`, async (t) => {
    const { store, model, gateway, request } = await flexFixture();
    let calls = 0;
    t.mock.method(
      globalThis,
      "fetch",
      async (url: string | URL | Request, init?: RequestInit) => {
        calls++;
        assert.equal(String(url), "https://api.openai.com/v1/responses");
        const body = JSON.parse(String(init?.body));
        assert.equal(body.model, "gpt-6-luna");
        assert.equal(body.service_tier, "flex");
        assert.equal(body.reasoning.effort, "max");
        assert.equal(body.max_output_tokens, 65536);
        assert.equal(body.store, false);
        return Response.json({
          id: "resp_flex",
          status: "completed",
          service_tier: appliedTier,
          usage: {
            input_tokens: 1000,
            output_tokens: 100,
            input_tokens_details: {
              cached_tokens: 200,
              cache_write_tokens: 100,
            },
          },
          output: [
            { type: "message", content: [{ type: "output_text", text: "{}" }] },
          ],
        });
      },
    );
    const result = await gateway.call(1, request);
    assert.deepEqual(result, {
      content: "{}",
      tokensIn: 1000,
      tokensOut: 100,
      costMicros: appliedTier === "flex" ? 68 : 135,
      requestedServiceTier: "flex",
      appliedServiceTier: appliedTier,
      providerResponseId: "resp_flex",
    });
    assert.deepEqual(await gateway.call(1, request), result);
    assert.equal(calls, 1);
    const inputBound =
      Buffer.byteLength(JSON.stringify(request.input) + request.system) + 1024;
    const reservation = (await store.transact(1, (tx) =>
      tx.get<UsageReservation>("usage", request.id),
    ))!;
    assert.equal(reservation.status, "settled");
    assert.equal(
      reservation.maximumMicros,
      tokenCost(
        inputBound,
        model.standardPrices!.cacheWriteInputMicrosPerMillion!,
      ) +
        tokenCost(
          model.maxOutputTokens,
          model.standardPrices!.outputMicrosPerMillion,
        ),
    );
    assert.equal(
      await store.transact(1, async (tx) => tx.state.reservedMicros),
      0,
    );

    // A Flex-only allowance cannot authorize a call with a higher possible standard tariff.
    await store.transact(1, async (tx) => {
      const run = (await tx.get<YpWorkflowRun>("run", runId))!;
      run.budgetMicros =
        run.spentMicros +
        tokenCost(inputBound, model.cacheWriteInputMicrosPerMillion!) +
        tokenCost(model.maxOutputTokens, model.outputMicrosPerMillion);
      await tx.put("run", runId, run);
    });
    await assert.rejects(
      gateway.call(1, { ...request, id: randomUUID() }),
      /allowance|limit/,
    );
    assert.equal(calls, 1);
  });
}

test("Flex capacity rejection settles zero and replays the failure without retrying or upgrading", async (t) => {
  const { store, gateway, request } = await flexFixture();
  let calls = 0;
  t.mock.method(
    globalThis,
    "fetch",
    async (_url: unknown, init?: RequestInit) => {
      calls++;
      assert.equal(JSON.parse(String(init?.body)).service_tier, "flex");
      return Response.json(
        {
          error: {
            message: "Flex capacity unavailable",
            type: "requests",
            code: "resource_unavailable",
          },
        },
        { status: 429 },
      );
    },
  );
  for (let replay = 0; replay < 2; replay++)
    await assert.rejects(gateway.call(1, request), {
      code: "model_flex_unavailable",
    });
  assert.equal(calls, 1);
  const reservation = (await store.transact(1, (tx) =>
    tx.get<UsageReservation>("usage", request.id),
  ))!;
  assert.equal(reservation.status, "settled");
  assert.equal(reservation.actualMicros, 0);
  assert.equal(
    await store.transact(1, async (tx) => tx.state.reservedMicros),
    0,
  );
  assert.equal(await store.transact(1, async (tx) => tx.state.spentMicros), 0);
});

test("an ambiguous Flex failure still retains its reservation and never retries", async (t) => {
  const { store, gateway, request } = await flexFixture();
  let calls = 0;
  t.mock.method(globalThis, "fetch", async () => {
    calls++;
    throw new TypeError("connection reset");
  });
  await assert.rejects(gateway.call(1, request), /Connection error/);
  await assert.rejects(gateway.call(1, request), /unknown/);
  const reservation = (await store.transact(1, (tx) =>
    tx.get<UsageReservation>("usage", request.id),
  ))!;
  assert.equal(reservation.status, "unknown");
  assert.equal(reservation.actualMicros, undefined);
  assert.equal(calls, 1);
  assert.ok(await store.transact(1, async (tx) => tx.state.reservedMicros > 0));
});
