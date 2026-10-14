import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import express from "express";
import { LiveWorkflowsController } from "../controller.js";
import { WorkflowService } from "../workflowService.js";
import { HostDirectory, SecretBox } from "../secrets.js";
import { ModelGateway } from "../modelGateway.js";
import { AssetService } from "../assets.js";
import type { ConnectorService } from "../connectors.js";
import type { VmBrokerRegistry } from "../services/vmBrokerRegistry.js";
import { ForbiddenError } from "../services/errors.js";
import { fixture, hostId } from "./memoryStore.js";
import { fixtureModelsJson } from "./modelFixture.js";
import {
  browserKeyMarker,
  importedBrowserKey,
} from "./manual/browserKeyImport.js";

test("API-key login and assistant settings enforce HTTP origin, membership and operator permission", async (t) => {
  const { store } = await fixture();
  const previousOrigin = process.env.YP_LIVE_WORKFLOW_PUBLIC_ORIGIN;
  delete process.env.YP_LIVE_WORKFLOW_PUBLIC_ORIGIN;
  t.after(() => {
    if (previousOrigin === undefined)
      delete process.env.YP_LIVE_WORKFLOW_PUBLIC_ORIGIN;
    else process.env.YP_LIVE_WORKFLOW_PUBLIC_ORIGIN = previousOrigin;
  });
  const service = new WorkflowService(
    store,
    { isConnected: () => false } as unknown as VmBrokerRegistry,
    new HostDirectory(
      JSON.stringify([
        {
          id: hostId,
          name: "test",
          rootPath: "/tmp/workflows",
          token: "x".repeat(32),
        },
      ]),
    ),
    new SecretBox(Buffer.alloc(32, 3).toString("base64")),
    new ModelGateway(store, fixtureModelsJson),
    {} as ConnectorService,
  );
  const controller = new LiveWorkflowsController({
    service,
    assets: new AssetService(store, "/tmp/unused-key-test-assets"),
    groupChoices: async () => [],
    groupAccess: async (group, userId) => {
      if (group !== 1 || ![10, 11].includes(userId)) throw new ForbiddenError();
      return { userId, admin: false };
    },
  });
  t.after(() => controller.close());
  await controller.ready;
  const key = "sk-imported-http-test-key-only";
  const app = express();
  let base = "";
  app.use(express.json());
  app.use((req, _res, next) => {
    req.user = { id: Number(req.headers["x-test-user"] ?? 10) };
    next();
  });
  app.use(
    importedBrowserKey(
      () => key,
      () => base,
    ),
  );
  app.use(controller.path, controller.router);
  const server = app.listen(0, "127.0.0.1");
  t.after(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });
  await once(server, "listening");
  base = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  const request = async (
    route = "/account/api-key",
    method = "POST",
    userId = 10,
    origin = base,
    body: unknown = { apiKey: browserKeyMarker },
  ) => {
    const response = await fetch(
      `${base}/api/live-workflows/groups/1${route}`,
      {
        method,
        headers: {
          origin,
          "x-test-user": String(userId),
          "content-type": "application/json",
        },
        body: ["POST", "PUT"].includes(method)
          ? JSON.stringify(body)
          : undefined,
        signal: AbortSignal.timeout(5000),
      },
    );
    const text = await response.text();
    assert.ok(!text.includes(key));
    return { status: response.status, text };
  };
  assert.equal(
    (await request(undefined, undefined, 10, "https://example.invalid")).status,
    403,
  );
  assert.equal((await request(undefined, undefined, 99)).status, 403);
  assert.equal((await request(undefined, undefined, 11)).status, 403);
  assert.equal(
    (await request(undefined, undefined, 10, base, { apiKey: "invalid" }))
      .status,
    400,
  );
  const connected = await request();
  assert.equal(connected.status, 200);
  assert.deepEqual(JSON.parse(connected.text), { connected: true });
  assert.equal(
    JSON.parse((await request("", "GET")).text).codexAuthMode,
    "api-key",
  );
  assert.equal(
    JSON.parse((await request("", "GET", 11)).text).codexAuthMode,
    null,
  );
  assert.ok(!JSON.stringify(await store.events(1, 0)).includes(key));
  const next = {
    model: "gpt-6-sol",
    reasoningEffort: "high",
    serviceTier: "fast",
  };
  const change = {
    settings: next,
    expected: {
      model: "test-codex",
      reasoningEffort: "max",
      serviceTier: "regular",
    },
  };
  assert.equal(
    (
      await request(
        "/assistant-settings",
        "PUT",
        10,
        "https://example.invalid",
        change,
      )
    ).status,
    403,
  );
  assert.equal(
    (await request("/assistant-settings", "PUT", 11, base, change)).status,
    403,
  );
  assert.equal(
    (await request("/assistant-settings", "PUT", 99, base, change)).status,
    403,
  );
  assert.equal(
    (
      await request("/assistant-settings", "PUT", 10, base, {
        ...change,
        budgetMicros: 500,
      })
    ).status,
    400,
  );
  const updated = await request("/assistant-settings", "PUT", 10, base, change);
  assert.equal(updated.status, 200);
  assert.deepEqual(JSON.parse(updated.text), next);
  assert.equal(
    (await request("/assistant-settings", "PUT", 10, base, change)).status,
    409,
  );
  const saved = JSON.parse((await request("", "GET")).text);
  assert.equal(saved.workspace.config.codexModel, next.model);
  assert.equal(
    saved.workspace.config.codexReasoningEffort,
    next.reasoningEffort,
  );
  assert.equal(saved.workspace.config.codexServiceTier, next.serviceTier);
  assert.equal(saved.workspace.revision, 1);
  assert.equal((await request("/account", "DELETE")).status, 200);
  assert.equal(JSON.parse((await request("", "GET")).text).codexAuthMode, null);
});
