import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { randomUUID, webcrypto } from "node:crypto";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

// Exercise the actual component's request and streaming lifecycle without a DOM.
function createAnalysis({ cryptoApi = { randomUUID }, ready = true }: { cryptoApi?: any; ready?: boolean } = {}) {
  const source = readFileSync(
    new URL("../src/allOurIdeas/survey/aoi-streaming-analysis.ts", import.meta.url),
    "utf8",
  );
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2021,
      experimentalDecorators: true,
      useDefineForClassFields: false,
    },
  }).outputText;
  const imports: Record<string, unknown> = {
    lit: { html() {}, css() {} },
    "lit/decorators.js": {
      customElement: () => (value: unknown) => value,
      property: () => () => {},
    },
    "./AoiServerApi.js": { AoiServerApi: class {} },
    "../../common/litMarkdown/litMarkdown.js": { resolveMarkdown() {} },
    "../../common/languages/ypLanguages.js": {
      YpLanguages: { getEnglishName: () => "English" },
    },
    "../../yp-chatbots/yp-streaming-llm-scrolling.js": {
      YpStreamingLlmScrolling: class extends EventTarget {
        connectedCallback() {}
        disconnectedCallback() {}
        scrollDown() {}
        async onMessage(event: { data: string }) {
          const data = JSON.parse(event.data);
          if (data.sender === "assistant") await (this as any).addChatBotElement(data);
        }
      },
    },
  };
  const module = { exports: {} as any };
  const mockedRequire = (name: string) => {
    if (name.startsWith("@material/")) return {};
    if (name in imports) return imports[name];
    throw new Error(`Unexpected component import: ${name}`);
  };
  vm.runInNewContext(
    `(function(require, module, exports) { ${output}\n })`,
    { console: { warn() {} }, crypto: cryptoApi,
      WebSocket: { OPEN: 1, CONNECTING: 0, CLOSING: 2, CLOSED: 3 } },
  )(mockedRequire, module, module.exports);
  const element = new module.exports.AoiStreamingAnalysis();
  element.ws = { readyState: 1 };
  element.wsClientId = "socket";
  // Prime the real socket-open lifecycle without starting a request during setup.
  const streamAnalysis = element.streamAnalysis;
  element.streamAnalysis = async () => {};
  element.connectedCallback();
  if (ready) element.dispatchEvent(new Event("yp-ws-opened"));
  element.streamAnalysis = streamAnalysis;
  return element;
}

test("analysis formatting preserves heading levels and separates headings joined to prose", () => {
  const element = createAnalysis();
  element.analysis = "## Community priorities\n\n### Safer crossings\n\nResidents want safer streets.## Next steps";
  assert.equal(element.normalizedAnalysis,
    "## Community priorities\n\n### Safer crossings\n\nResidents want safer streets.\n\n## Next steps");
});

test("an HTTP failure is handled and a retry can load cached analysis", async () => {
  const element = createAnalysis();
  element.serverApi.getSurveyAnalysis = async () => null;
  element.isStreaming = true;
  await assert.doesNotReject(() => element.streamAnalysis());
  assert.equal(element.analysisError, true);
  assert.equal(element.isStreaming, false);
  assert.equal(element.haveStartedStreaming, false);

  const choices = [{ id: 7, data: { content: "An answer" } }];
  element.serverApi.getSurveyAnalysis = async () => ({
    cachedAnalysis: "Cached analysis", selectedChoices: choices,
  });
  await element.streamAnalysis();
  assert.equal(element.analysisError, false);
  assert.equal(element.analysis, "Cached analysis");
  assert.equal(element.selectedChoices, choices);
  assert.equal(element.haveStartedStreaming, true);
});

test("a rejected network request is handled without an unhandled rejection", async () => {
  const element = createAnalysis();
  element.serverApi.getSurveyAnalysis = async () => { throw new TypeError("Failed to fetch"); };
  await assert.doesNotReject(() => element.streamAnalysis());
  assert.equal(element.analysisError, true);
  assert.equal(element.haveStartedStreaming, false);
});

test("repeated socket-open events do not start duplicate analysis requests", async () => {
  const element = createAnalysis();
  let requests = 0;
  let complete!: (value: unknown) => void;
  element.serverApi.getSurveyAnalysis = () => {
    requests++;
    return new Promise((resolve) => { complete = resolve; });
  };
  const firstRequest = element.streamAnalysis();
  await element.streamAnalysis();
  assert.equal(requests, 1);
  complete({ selectedChoices: [] });
  await firstRequest;
  assert.equal(element.analysisError, false);
});

test("a failed stream can retry without appending to its partial response", async () => {
  const element = createAnalysis();
  element.analysis = "Partial response";
  element.isStreaming = true;
  element.haveStartedStreaming = true;
  await element.addChatBotElement({ type: "error" });
  assert.equal(element.analysisError, true);
  assert.equal(element.isStreaming, false);
  element.serverApi.getSurveyAnalysis = async () => ({ selectedChoices: [] });
  await element.streamAnalysis();
  await element.addChatBotElement({ type: "start" });
  await element.addChatBotElement({ type: "stream", message: "New response" });
  assert.equal(element.analysis, "New response");
  assert.equal(element.analysisError, false);
});


const message = (type: string, uniqueToken: string | undefined, content = "") => ({
  data: JSON.stringify({ sender: "assistant", type, uniqueToken, message: content }),
});

test("retry ignores all messages from a generation whose HTTP response was lost", async () => {
  const element = createAnalysis();
  element.analysisIndex = 0;
  element.analysisTypeIndex = 1;
  let completeFirst!: (value: unknown) => void;
  let firstRequestId: string | undefined;
  element.serverApi.getSurveyAnalysis = (...args: any[]) => {
    firstRequestId = args[5];
    return new Promise((resolve) => { completeFirst = resolve; });
  };
  const first = element.streamAnalysis();
  const oldToken = element.analysisStreamToken;
  await element.onMessage(message("start", oldToken));
  await element.onMessage(message("stream", oldToken, "Partial old response"));
  completeFirst(null);
  await first;

  let secondRequestId: string | undefined;
  element.serverApi.getSurveyAnalysis = async (...args: any[]) => {
    secondRequestId = args[5];
    return { selectedChoices: [] };
  };
  await element.streamAnalysis();
  const newToken = element.analysisStreamToken;
  assert.ok(firstRequestId);
  assert.ok(secondRequestId);
  assert.notEqual(firstRequestId, secondRequestId);
  assert.equal(newToken, `aoi-analysis-0-1-${secondRequestId}`);
  await element.onMessage(message("start", newToken));
  await element.onMessage(message("stream", newToken, "New response"));

  for (const type of ["start", "stream", "error", "end"]) {
    await element.onMessage(message(type, oldToken, "Stale response"));
  }
  assert.equal(element.analysis, "New response");
  assert.equal(element.isStreaming, true);
  assert.equal(element.analysisError, false);
  assert.equal(element.haveStartedStreaming, true);
  await element.onMessage(message("end", newToken));
  assert.equal(element.isStreaming, false);
});

for (const outcome of ["response", "failure"]) {
  test(`a late HTTP ${outcome} from an earlier attempt cannot overwrite a retry`, async () => {
    const element = createAnalysis();
    let finishFirst!: (value: unknown) => void;
    let rejectFirst!: (error: Error) => void;
    element.serverApi.getSurveyAnalysis = () => new Promise((resolve, reject) => {
      finishFirst = resolve;
      rejectFirst = reject;
    });
    const first = element.streamAnalysis();
    await element.onMessage(message("error", element.analysisStreamToken));
    const choices = [{ id: 8 }];
    element.serverApi.getSurveyAnalysis = async () => ({
      cachedAnalysis: "Retry result", selectedChoices: choices,
    });
    await element.streamAnalysis();
    if (outcome === "failure") rejectFirst(new Error("Late failure"));
    else finishFirst({ cachedAnalysis: "Stale result", selectedChoices: [] });
    await first;
    assert.equal(element.analysis, "Retry result");
    assert.equal(element.selectedChoices, choices);
    assert.equal(element.analysisError, false);
    assert.equal(element.haveStartedStreaming, true);
  });
}

test("assistant messages are ignored before an analysis request has started", async () => {
  const element = createAnalysis();
  await element.onMessage(message("stream", undefined, "Unrelated response"));
  assert.equal(element.analysis, "");
});


function createServerApi() {
  const source = readFileSync(new URL("../src/allOurIdeas/survey/AoiServerApi.ts", import.meta.url), "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021 },
  }).outputText;
  const module = { exports: {} as any };
  const mockedRequire = (name: string) => {
    assert.equal(name, "../../common/YpServerApi.js");
    return { YpServerApi: class { async fetchWrapper(url: string) { return url; } } };
  };
  vm.runInNewContext(`(function(require, module, exports) { ${output}\n })`, {
    URLSearchParams,
  })(mockedRequire, module, module.exports);
  return new module.exports.AoiServerApi();
}

test("the analysis API sends the attempt ID and encodes the output language", async () => {
  const api = createServerApi();
  const requestId = randomUUID();
  const url = new URL(await api.getSurveyAnalysis(1, "socket", 0, 1, "English & Icelandic", requestId), "https://example.test");
  assert.equal(url.pathname, "/api/allOurIdeas/1/questions/socket/0/1/analysis");
  assert.equal(url.searchParams.get("requestId"), requestId);
  assert.equal(url.searchParams.get("languageName"), "English & Icelandic");
});

test("legacy analysis API callers may omit the attempt ID", async () => {
  const api = createServerApi();
  const url = new URL(await api.getSurveyAnalysis(1, "socket", 0, 0, "English"), "https://example.test");
  assert.equal(url.searchParams.has("requestId"), false);
  assert.equal(url.searchParams.get("languageName"), "English");
});


test("HTTP-origin browsers can create distinct attempt IDs without randomUUID", async () => {
  const element = createAnalysis({ cryptoApi: {
    getRandomValues: webcrypto.getRandomValues.bind(webcrypto),
  } });
  const ids: string[] = [];
  element.serverApi.getSurveyAnalysis = async (...args: any[]) => {
    ids.push(args[5]);
    return null;
  };
  await assert.doesNotReject(() => element.streamAnalysis());
  await assert.doesNotReject(() => element.streamAnalysis());
  assert.equal(ids.length, 2);
  assert.notEqual(ids[0], ids[1]);
  for (const id of ids) assert.match(id, /^[A-Za-z0-9_-]{1,64}$/);
});

test("ID initialization failure is retryable even after an earlier attempt", async () => {
  const cryptoApi = { randomUUID };
  const element = createAnalysis({ cryptoApi });
  let requests = 0;
  element.serverApi.getSurveyAnalysis = async () => { requests++; return null; };
  await element.streamAnalysis();
  cryptoApi.randomUUID = () => { throw new Error("Crypto unavailable"); };
  await assert.doesNotReject(() => element.streamAnalysis());
  assert.equal(requests, 1);
  assert.equal(element.haveStartedStreaming, false);
  assert.equal(element.analysisError, true);
  assert.equal(element.isStreaming, false);
  assert.equal(element.analysisStreamToken, undefined);

  cryptoApi.randomUUID = randomUUID;
  element.serverApi.getSurveyAnalysis = async () => ({
    selectedChoices: [], cachedAnalysis: "Recovered",
  });
  await element.streamAnalysis();
  assert.equal(element.analysis, "Recovered");
  assert.equal(element.analysisError, false);
});

test("missing crypto exposes an error without leaving the request guard latched", async () => {
  const element = createAnalysis({ cryptoApi: null });
  let requests = 0;
  element.serverApi.getSurveyAnalysis = async () => { requests++; return null; };
  await assert.doesNotReject(() => element.streamAnalysis());
  assert.equal(requests, 0);
  assert.equal(element.haveStartedStreaming, false);
  assert.equal(element.analysisError, true);
});

test("Retry waits for the replacement socket's client-ID handshake and starts once", async () => {
  const element = createAnalysis();
  element.analysisError = true;
  element.ws = { readyState: 0 };
  let requests = 0;
  let clientId: string | undefined;
  let complete!: (value: unknown) => void;
  element.serverApi.getSurveyAnalysis = (...args: any[]) => {
    requests++;
    clientId = args[1];
    return new Promise((resolve) => { complete = resolve; });
  };
  const waiting = element.streamAnalysis();
  assert.equal(requests, 0);
  await waiting;
  assert.equal(element.haveStartedStreaming, false);
  assert.equal(element.analysisError, true);

  element.ws.readyState = 1;
  await element.streamAnalysis();
  assert.equal(requests, 0, "Transport open alone is not a completed handshake");
  element.wsClientId = "replacement-client";
  element.dispatchEvent(new Event("yp-ws-opened"));
  element.dispatchEvent(new Event("yp-ws-opened"));
  assert.equal(requests, 1);
  assert.equal(clientId, "replacement-client");
  complete({ selectedChoices: [], cachedAnalysis: "Reconnected" });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(element.analysis, "Reconnected");
  assert.equal(element.analysisError, false);
});

test("an open socket without a client ID does not start an HTTP analysis request", async () => {
  const element = createAnalysis();
  element.wsClientId = "";
  let requests = 0;
  element.serverApi.getSurveyAnalysis = async () => { requests++; return { selectedChoices: [] }; };
  await element.streamAnalysis();
  assert.equal(requests, 0);
  assert.equal(element.haveStartedStreaming, false);
  element.wsClientId = "client-id";
  element.dispatchEvent(new Event("yp-ws-opened"));
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(requests, 1);
});

test("a deferred retry is removed on disconnect and resumes only after reconnect", async () => {
  const element = createAnalysis({ ready: false });
  element.analysisError = true;
  let requests = 0;
  element.serverApi.getSurveyAnalysis = async () => { requests++; return { selectedChoices: [] }; };
  await element.streamAnalysis();
  assert.equal(requests, 0);
  element.disconnectedCallback();
  element.dispatchEvent(new Event("yp-ws-opened"));
  assert.equal(requests, 0);
  await element.connectedCallback();
  element.dispatchEvent(new Event("yp-ws-opened"));
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(requests, 1);
});
