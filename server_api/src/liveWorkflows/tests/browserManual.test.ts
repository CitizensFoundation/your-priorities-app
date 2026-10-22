import test from "node:test";
import assert from "node:assert/strict";
import type { Request, Response } from "express";
import {
  browserKeyMarker,
  browserKeyImportButton,
  importedBrowserKey,
} from "./manual/browserKeyImport.js";
import {
  verifyBrowserActions,
  type BrowserObservation,
} from "./manual/interactiveBrowser.js";

test("manual key substitution is restricted to same-origin API-key login and never serves the imported value", () => {
  const key = "sk-fake-server-secret-for-unit-tests";
  const origin = "http://127.0.0.1:9876";
  const middleware = importedBrowserKey(
    () => key,
    () => origin,
  );
  for (const requestOrigin of [undefined, "https://example.invalid", origin]) {
    const req = {
      method: "POST",
      path: "/api/live-workflows/groups/1/account/api-key",
      headers: { origin: requestOrigin },
      body: { apiKey: browserKeyMarker },
    } as Request;
    let status = 0,
      passed = false;
    middleware(
      req,
      {
        sendStatus: (value: number) => {
          status = value;
        },
      } as Response,
      () => {
        passed = true;
      },
    );
    assert.equal(passed, requestOrigin === origin);
    assert.equal(status, passed ? 0 : 403);
    assert.equal(req.body.apiKey, passed ? key : browserKeyMarker);
  }
  for (const route of [
    "/api/live-workflows/groups/2/account/api-key",
    "/api/live-workflows/groups/1/chat",
  ]) {
    const req = {
      method: "POST",
      path: route,
      headers: { origin },
      body: { apiKey: browserKeyMarker },
    } as Request;
    middleware(req, {} as Response, () => {});
    assert.equal(req.body.apiKey, browserKeyMarker);
  }
  assert.ok(!browserKeyImportButton.includes(key));
});

test("manual acceptance requires login, ordered browser actions and every download before verification", () => {
  const observations: BrowserObservation[] = [
    ["POST", "account/api-key"],
    ["POST", "chat"],
    ["POST", "assets"],
    ["POST", "chat"],
    ["GET", "assets/json"],
    ["GET", "assets/csv"],
    ["GET", "assets/md"],
    ["GET", "assets/xlsx"],
  ].map(([method, route], index) => ({
    method,
    route: `/api/live-workflows/groups/1/${route}`,
    status: 200,
    order: index + 1,
  }));
  const verify = (events: BrowserObservation[]) =>
    verifyBrowserActions(events, ["json", "csv", "md", "xlsx"], "api-key");
  verify(observations);
  assert.throws(() => verify(observations.slice(1)), /Connect an API key/);
  assert.throws(
    () => verify(observations.slice(0, -1)),
    /Download all required/,
  );
  assert.throws(
    () =>
      verify(
        observations.map((item) =>
          item.route.endsWith("/assets") ? { ...item, order: 10 } : item,
        ),
      ),
    /hello → upload/,
  );
  assert.throws(
    () =>
      verify([
        ...observations,
        {
          method: "POST",
          route: "/api/live-workflows/groups/1/runs",
          status: 200,
          order: 8,
        },
      ]),
    /Ask Codex/,
  );
  assert.throws(
    () =>
      verify(
        observations.map((item) =>
          item.route.endsWith("/account/api-key")
            ? { ...item, status: 403 }
            : item,
        ),
      ),
    /Connect an API key/,
  );
});

test("manual key import follows the browser-created group and rejects unsaved or other group IDs", () => {
  let createdGroupId: number | undefined;
  const origin = "http://127.0.0.1:9876";
  const key = "sk-fake-group-creation-secret";
  const middleware = importedBrowserKey(
    () => key,
    () => origin,
    () => createdGroupId,
  );
  const request = (id: number) => {
    const req = {
      method: "POST",
      path: `/api/live-workflows/groups/${id}/account/api-key`,
      headers: { origin },
      body: { apiKey: browserKeyMarker },
    } as Request;
    middleware(req, {} as Response, () => {});
    return req.body.apiKey;
  };
  assert.equal(request(42), browserKeyMarker);
  createdGroupId = -1;
  assert.equal(request(-1), browserKeyMarker);
  createdGroupId = 42;
  assert.equal(request(1), browserKeyMarker);
  assert.equal(request(41), browserKeyMarker);
  assert.equal(request(42), key);
});
