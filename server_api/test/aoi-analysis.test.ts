import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import crypto from "node:crypto";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/controllers/allOurIdeas.ts", import.meta.url), "utf8");
const output = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2021,
    esModuleInterop: true,
  },
}).outputText;

async function requestAnalysis({ range = 3, questionStatus = 200, choicesStatus = 200,
  activeChoices = 9, cached = true, requestId = undefined as unknown } = {}) {
  const requests: string[] = [];
  const errors: string[] = [];
  const aiCalls: unknown[][] = [];
  const group = { configuration: { allOurIdeas: { earl: {
    question_id: 52,
    configuration: { analysis_config: { analyses: [{ ideasIdsRange: range,
      analysisTypes: [{ contextPrompt: "Summarize", label: "Main points" }],
    }] } },
  } } } };
  const imports: Record<string, unknown> = {
    "../models/index.cjs": { Group: { findOne: async () => group } },
    "../utils/loggerTs.js": { info() {}, warn() {}, error(error: Error) { errors.push(error.message); } },
    "../services/engine/allOurIdeas/aiHelper.js": { AiHelper: class {
      async getAiAnalysis(...args: unknown[]) { aiCalls.push(args); }
    } },
    crypto,
  };
  const mockedRequire = (name: string) => {
    if (name in imports) return imports[name];
    if (["redis", "ws", "uuid", "express", "openai", "../authorization.cjs",
      "../services/engine/allOurIdeas/explainAnswersAssistant.js",
      "../services/workers/queue.cjs"].includes(name)) return {};
    throw new Error(`Unexpected controller import: ${name}`);
  };
  const fetch = async (url: string) => {
    requests.push(url);
    const choices = url.includes("/choices.json");
    const status = choices ? choicesStatus : questionStatus;
    return { status, ok: status === 200, statusText: status === 200 ? "OK" : "Upstream failure",
      async json() {
        assert.equal(status, 200, "Failed responses must be checked before JSON parsing");
        return choices
          ? [{ id: 7, data: JSON.stringify({ content: "One answer", choiceId: 7 }) }]
          : { choices_count: activeChoices + 1, inactive_choices_count: 1 };
      },
    };
  };
  const module = { exports: {} as any };
  vm.runInNewContext(`(function(require, module, exports) { ${output}\n })`, {
    fetch, Buffer, URLSearchParams,
    process: { env: { PAIRWISE_API_HOST: "http://pairwise.test" } },
  })(mockedRequire, module, module.exports);
  const controller = Object.create(module.exports.AllOurIdeasController.prototype);
  controller.wsClients = new Map();
  const response = { code: 200, body: undefined as any,
    status(code: number) { this.code = code; return this; },
    send(body: unknown) { this.body = body; },
    json(body: unknown) { this.body = body; },
  };
  // Analysis must not need a voting session or create a visitor appearance.
  await controller.analysis({
    params: { groupId: "1", analysisIndex: "0", analysisTypeIndex: "0", wsClientSocketId: "test" },
    query: requestId === undefined ? {} : { requestId }, redisClient: { get: async () => cached ? "Cached analysis" : null },
  }, response);
  return { requests, errors, aiCalls, response };
}

test("top-answer analysis succeeds without requesting question metadata", async () => {
  const result = await requestAnalysis({ questionStatus: 503 });
  assert.equal(result.response.code, 200);
  assert.equal(result.response.body.cachedAnalysis, "Cached analysis");
  assert.equal(result.response.body.selectedChoices[0].data.content, "One answer");
  assert.equal(result.requests.length, 1);
  assert.match(result.requests[0], /choices\.json\?all=1&show_all=true&limit=3&offset=0$/);
  assert.equal(result.aiCalls.length, 0);
});

test("bottom-answer analysis fetches only counts and selects the correct offset", async () => {
  const result = await requestAnalysis({ range: -3 });
  assert.equal(result.response.code, 200);
  assert.equal(result.requests[0], "http://pairwise.test/questions/52.json");
  assert.match(result.requests[1], /offset=6$/);
});

test("bottom-answer offsets never become negative", async () => {
  const result = await requestAnalysis({ range: -3, activeChoices: 2 });
  assert.equal(result.response.code, 200);
  assert.match(result.requests[1], /offset=0$/);
});

test("failed bottom-answer metadata requests log the upstream HTTP status", async () => {
  const result = await requestAnalysis({ range: -3, questionStatus: 503 });
  assert.equal(result.response.code, 500);
  assert.equal(result.requests.length, 1);
  assert.match(result.errors[0], /Pairwise question 52.*HTTP 503/);
});

test("failed choice requests log their HTTP status before JSON parsing", async () => {
  const result = await requestAnalysis({ choicesStatus: 401 });
  assert.equal(result.response.code, 500);
  assert.match(result.errors[0], /Pairwise choices for question 52.*HTTP 401/);
});

test("uncached top-answer analysis starts generation without a question request", async () => {
  const result = await requestAnalysis({ cached: false, questionStatus: 503 });
  assert.equal(result.response.code, 200);
  assert.equal(result.requests.length, 1);
  assert.equal(result.aiCalls.length, 1);
  assert.equal(result.aiCalls[0][0], 52);
  assert.equal(result.aiCalls[0][5], "English");
  assert.equal(result.aiCalls[0][6], "Top 3 answers");
  assert.equal(result.aiCalls[0][8], "aoi-analysis-0-0");
});


test("generation uses an attempt-specific stream token when a request ID is supplied", async () => {
  const firstId = "315d6ec2-b366-4b13-8e1a-c8309f529400";
  const secondId = "315d6ec2-b366-4b13-8e1a-c8309f529401";
  const first = await requestAnalysis({ cached: false, requestId: firstId });
  const second = await requestAnalysis({ cached: false, requestId: secondId });
  assert.equal(first.response.code, 200);
  assert.equal(second.response.code, 200);
  assert.equal(first.aiCalls[0][8], `aoi-analysis-0-0-${firstId}`);
  assert.equal(second.aiCalls[0][8], `aoi-analysis-0-0-${secondId}`);
});

for (const requestId of ["", "bad/token", "x".repeat(65), ["multiple", "values"]]) {
  test(`invalid request IDs are rejected before fetching or generating: ${JSON.stringify(requestId)}`, async () => {
    const result = await requestAnalysis({ cached: false, requestId });
    assert.equal(result.response.code, 400);
    assert.equal(result.requests.length, 0);
    assert.equal(result.aiCalls.length, 0);
  });
}


test("opaque hexadecimal fallback IDs are accepted for HTTP-origin browsers", async () => {
  const requestId = "fd91d0b431fb1f6d91ee34797c2b0118";
  const result = await requestAnalysis({ cached: false, requestId });
  assert.equal(result.response.code, 200);
  assert.equal(result.aiCalls[0][8], `aoi-analysis-0-0-${requestId}`);
});
