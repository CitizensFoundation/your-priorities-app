"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const Module = require("node:module");
const { once } = require("node:events");
const { PassThrough } = require("node:stream");

const axiosPath = require.resolve("axios");
const requestCompatPath = require.resolve("../utils/requestCompat.cjs");

const injectMockModule = (modulePath, moduleExports) => {
  const mockModule = new Module(modulePath);
  mockModule.filename = modulePath;
  mockModule.loaded = true;
  mockModule.exports = moduleExports;
  require.cache[modulePath] = mockModule;
};

const loadRequestCompat = (mockAxios) => {
  const originalAxiosModule = require.cache[axiosPath];
  const originalRequestCompatModule = require.cache[requestCompatPath];

  injectMockModule(axiosPath, mockAxios);
  delete require.cache[requestCompatPath];

  const request = require(requestCompatPath);

  return {
    request,
    restore() {
      delete require.cache[requestCompatPath];

      if (originalAxiosModule) {
        require.cache[axiosPath] = originalAxiosModule;
      } else {
        delete require.cache[axiosPath];
      }

      if (originalRequestCompatModule) {
        require.cache[requestCompatPath] = originalRequestCompatModule;
      }
    },
  };
};

const runCallbackRequest = (requestFn, options) => {
  return new Promise((resolve) => {
    requestFn(options, (error, response, body) => {
      resolve({ error, response, body });
    });
  });
};

test("request.get maps query params and returns text bodies", async (t) => {
  let seenConfig;

  const mockAxios = async (config) => {
    seenConfig = config;
    return {
      status: 200,
      statusText: "OK",
      headers: { "x-test": "1" },
      data: "hello world",
    };
  };

  const { request, restore } = loadRequestCompat(mockAxios);
  t.after(restore);

  const result = await runCallbackRequest(request.get, {
    url: "https://example.com/items",
    qs: { page: "2", sort: "asc" },
    headers: { Authorization: "Bearer token" },
  });

  assert.equal(result.error, null);
  assert.equal(result.response.statusCode, 200);
  assert.equal(result.response.headers["x-test"], "1");
  assert.equal(result.body, "hello world");
  assert.equal(seenConfig.method, "get");
  assert.deepEqual(seenConfig.params, { page: "2", sort: "asc" });
  assert.equal(seenConfig.headers.Authorization, "Bearer token");
  assert.equal(seenConfig.responseType, "text");
});

test("request.post sends json payloads and preserves parsed response objects", async (t) => {
  let seenConfig;

  const mockAxios = async (config) => {
    seenConfig = config;
    return {
      status: 202,
      statusText: "Accepted",
      headers: { "content-type": "application/json" },
      data: { ok: true, id: 123 },
    };
  };

  const { request, restore } = loadRequestCompat(mockAxios);
  t.after(restore);

  const result = await runCallbackRequest(request.post, {
    url: "https://example.com/events",
    json: { name: "test-event" },
  });

  assert.equal(result.error, null);
  assert.equal(result.response.statusCode, 202);
  assert.deepEqual(result.body, { ok: true, id: 123 });
  assert.equal(seenConfig.method, "post");
  assert.deepEqual(seenConfig.data, { name: "test-event" });
  assert.equal(seenConfig.headers["Content-Type"], "application/json");
});

test("request(options, callback) respects explicit method overrides", async (t) => {
  let seenConfig;

  const mockAxios = async (config) => {
    seenConfig = config;
    return {
      status: 200,
      statusText: "OK",
      headers: {},
      data: "method-ok",
    };
  };

  const { request, restore } = loadRequestCompat(mockAxios);
  t.after(restore);

  const result = await runCallbackRequest(request, {
    url: "https://example.com/plausible",
    method: "PUT",
    formData: {
      site_id: "yrpri",
      goal_type: "event",
    },
  });

  assert.equal(result.error, null);
  assert.equal(result.body, "method-ok");
  assert.equal(seenConfig.method, "put");
  assert.equal(typeof seenConfig.data.getHeaders, "function");
});

test("request.defaults can force binary responses", async (t) => {
  let seenConfig;

  const mockAxios = async (config) => {
    seenConfig = config;
    return {
      status: 200,
      statusText: "OK",
      headers: { "content-type": "application/octet-stream" },
      data: Buffer.from([1, 2, 3, 4]),
    };
  };

  const { request, restore } = loadRequestCompat(mockAxios);
  t.after(restore);

  const binaryRequest = request.defaults({ encoding: null });
  const result = await runCallbackRequest(binaryRequest.get, {
    url: "https://example.com/file.bin",
  });

  assert.equal(result.error, null);
  assert.equal(seenConfig.responseType, "arraybuffer");
  assert.equal(Buffer.isBuffer(result.body), true);
  assert.deepEqual([...result.body], [1, 2, 3, 4]);
});

test("request supports error-only callbacks used by fire-and-forget call sites", async (t) => {
  const mockAxios = async () => {
    return {
      status: 204,
      statusText: "No Content",
      headers: {},
      data: "",
    };
  };

  const { request, restore } = loadRequestCompat(mockAxios);
  t.after(restore);

  const error = await new Promise((resolve) => {
    request.post(
      {
        url: "https://example.com/track",
        json: { ok: true },
      },
      (requestError) => resolve(requestError),
    );
  });

  assert.equal(error, null);
});

test("request supports two-argument callbacks used by existing get callers", async (t) => {
  const mockAxios = async () => {
    return {
      status: 200,
      statusText: "OK",
      headers: {},
      data: "done",
    };
  };

  const { request, restore } = loadRequestCompat(mockAxios);
  t.after(restore);

  const result = await new Promise((resolve) => {
    request.get({ url: "https://example.com/goal" }, (first, second) => {
      resolve({ first, second });
    });
  });

  assert.equal(result.first, null);
  assert.equal(result.second.statusCode, 200);
  assert.equal(result.second.body, "done");
});

test("request.put builds multipart form data payloads", async (t) => {
  let seenConfig;

  const mockAxios = async (config) => {
    seenConfig = config;
    return {
      status: 200,
      statusText: "OK",
      headers: {},
      data: "uploaded",
    };
  };

  const { request, restore } = loadRequestCompat(mockAxios);
  t.after(restore);

  const result = await runCallbackRequest(request.put, {
    url: "https://example.com/upload",
    formData: {
      file: {
        value: Buffer.from("hello"),
        options: { filename: "hello.txt" },
      },
      tag: "demo",
    },
  });

  assert.equal(result.error, null);
  assert.equal(result.response.statusCode, 200);
  assert.equal(result.body, "uploaded");
  assert.equal(seenConfig.method, "put");
  assert.equal(typeof seenConfig.data.getHeaders, "function");
  assert.match(seenConfig.headers["content-type"], /^multipart\/form-data; boundary=/);
});

test("request(url).pipe(...) streams response bodies", async (t) => {
  let seenConfig;

  const mockAxios = async (config) => {
    seenConfig = config;
    const source = new PassThrough();
    process.nextTick(() => source.end("stream-ok"));

    return {
      status: 200,
      statusText: "OK",
      headers: { "content-type": "text/plain" },
      data: source,
    };
  };

  const { request, restore } = loadRequestCompat(mockAxios);
  t.after(restore);

  const output = request("https://example.com/report.txt");
  const chunks = [];

  output.on("data", (chunk) => {
    chunks.push(chunk);
  });

  const [response] = await once(output, "response");
  await once(output, "end");

  assert.equal(seenConfig.method, "get");
  assert.equal(seenConfig.responseType, "stream");
  assert.equal(response.statusCode, 200);
  assert.equal(Buffer.concat(chunks).toString("utf8"), "stream-ok");
});

test("request surfaces axios errors to callbacks", async (t) => {
  const transportError = new Error("boom");

  const mockAxios = async () => {
    throw transportError;
  };

  const { request, restore } = loadRequestCompat(mockAxios);
  t.after(restore);

  const result = await runCallbackRequest(request.head, {
    url: "https://example.com/head",
  });

  assert.equal(result.error, transportError);
  assert.equal(result.response, null);
  assert.equal(result.body, undefined);
});

test("request.head supports string urls and returns response metadata", async (t) => {
  let seenConfig;

  const mockAxios = async (config) => {
    seenConfig = config;
    return {
      status: 204,
      statusText: "No Content",
      headers: { etag: "abc123" },
      data: "",
    };
  };

  const { request, restore } = loadRequestCompat(mockAxios);
  t.after(restore);

  const result = await runCallbackRequest(request.head, "https://example.com/head");

  assert.equal(result.error, null);
  assert.equal(seenConfig.method, "head");
  assert.equal(result.response.statusCode, 204);
  assert.equal(result.response.headers.etag, "abc123");
});

test("request surfaces request-style errno on transport errors", async (t) => {
  const transportError = new Error("dns fail");
  transportError.code = "ENOTFOUND";

  const mockAxios = async () => {
    throw transportError;
  };

  const { request, restore } = loadRequestCompat(mockAxios);
  t.after(restore);

  const result = await runCallbackRequest(request.get, {
    url: "https://example.com/unreachable",
  });

  assert.equal(result.error, transportError);
  assert.equal(result.error.errno, "ENOTFOUND");
  assert.equal(result.response, null);
  assert.equal(result.body, undefined);
});
