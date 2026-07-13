"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const iconv = require("iconv-lite");

const {
  UrlPreviewError,
  createPinnedLookup,
  fetchPublicHtml,
  getUrlPreview,
  isPublicAddress,
  parseAndValidateUrl,
  sanitizeUrlForLogging,
} = require("../services/urlPreviewService.cjs");
const {
  DEFAULT_MAX_REQUESTS,
  DEFAULT_WINDOW_MS,
  createUrlPreviewRateLimitOptions,
  sendRateLimitResponse,
  urlPreviewRateLimitKey,
} = require("../services/urlPreviewRateLimiter.cjs");

const PUBLIC_IPV4 = "93.184.216.34";

const publicResolver = async () => [
  { address: PUBLIC_IPV4, family: 4 },
];

const htmlResponse = (html = "<html><head><title>Example</title></head></html>") =>
  new Response(html, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });

const createDispatcherRecorder = () => {
  const records = [];
  const factory = (options) => {
    const dispatcher = {
      closed: false,
      async close() {
        this.closed = true;
      },
      destroy() {
        this.closed = true;
      },
    };
    records.push({ ...options, dispatcher });
    return dispatcher;
  };
  return { factory, records };
};

const assertRejectCode = async (promise, code) => {
  await assert.rejects(promise, (error) => {
    assert.ok(error instanceof UrlPreviewError);
    assert.equal(error.code, code);
    return true;
  });
};

test("URL validation permits only credential-free HTTP(S) on ports 80 and 443", () => {
  assert.equal(
    parseAndValidateUrl("https://example.com/path#fragment").toString(),
    "https://example.com/path"
  );
  assert.equal(
    parseAndValidateUrl("http://example.com:443/path").port,
    "443"
  );

  for (const url of [
    "",
    "example.com",
    "ftp://example.com/file",
    "rtsp://example.com/media",
    "https://user:password@example.com/",
    "https://example.com:8443/",
  ]) {
    assert.throws(
      () => parseAndValidateUrl(url),
      (error) => error.code === "INVALID_PREVIEW_URL",
      url
    );
  }
});

test("address classification accepts only global unicast IPv4 and IPv6", () => {
  for (const address of ["8.8.8.8", "1.1.1.1", "2001:4860:4860::8888"]) {
    assert.equal(isPublicAddress(address), true, address);
  }

  for (const address of [
    "0.0.0.0",
    "10.0.0.1",
    "100.100.100.200",
    "127.0.0.1",
    "169.254.169.254",
    "172.16.0.1",
    "192.168.0.1",
    "192.0.2.1",
    "224.0.0.1",
    "::",
    "::1",
    "::ffff:127.0.0.1",
    "64:ff9b::7f00:1",
    "2001::ff:ffff:fffe",
    "2002:7f00:1::",
    "fc00::1",
    "fe80::1",
  ]) {
    assert.equal(isPublicAddress(address), false, address);
  }
});

test("literal private and alternative numeric loopback URLs are blocked before fetch", async () => {
  let fetchCalls = 0;
  const fetchFn = async () => {
    fetchCalls += 1;
    return htmlResponse();
  };

  for (const url of [
    "http://127.0.0.1/",
    "http://169.254.169.254/latest/meta-data/",
    "http://2130706433/",
    "http://[::1]/",
  ]) {
    await assertRejectCode(
      fetchPublicHtml(url, { fetchFn }),
      "PREVIEW_URL_BLOCKED"
    );
  }
  assert.equal(fetchCalls, 0);
});

test("a hostname with any non-public DNS answer is blocked", async () => {
  let fetchCalls = 0;
  await assertRejectCode(
    fetchPublicHtml("https://mixed.example/", {
      resolver: async () => [
        { address: PUBLIC_IPV4, family: 4 },
        { address: "10.0.0.5", family: 4 },
      ],
      fetchFn: async () => {
        fetchCalls += 1;
        return htmlResponse();
      },
    }),
    "PREVIEW_URL_BLOCKED"
  );
  assert.equal(fetchCalls, 0);
});

test("the connection dispatcher receives only validated, pinned DNS answers", async () => {
  const dispatchers = createDispatcherRecorder();
  let resolverCalls = 0;

  const result = await fetchPublicHtml("https://public.example/page", {
    resolver: async () => {
      resolverCalls += 1;
      return [
        { address: PUBLIC_IPV4, family: 4 },
        { address: "2001:4860:4860::8888", family: 6 },
      ];
    },
    dispatcherFactory: dispatchers.factory,
    fetchFn: async (url, options) => {
      assert.equal(url.hostname, "public.example");
      assert.equal(options.redirect, "manual");
      assert.equal(options.dispatcher, dispatchers.records[0].dispatcher);
      return htmlResponse();
    },
  });

  assert.equal(result.responseBytes > 0, true);
  assert.equal(resolverCalls, 1);
  assert.deepEqual(dispatchers.records[0].addresses, [
    { address: PUBLIC_IPV4, family: 4 },
    { address: "2001:4860:4860::8888", family: 6 },
  ]);
  assert.equal(dispatchers.records[0].dispatcher.closed, true);
});

test("pinned lookup never performs or substitutes a second DNS resolution", async () => {
  const lookup = createPinnedLookup([{ address: PUBLIC_IPV4, family: 4 }]);

  const all = await new Promise((resolve, reject) => {
    lookup("attacker-controlled.example", { all: true }, (error, addresses) =>
      error ? reject(error) : resolve(addresses)
    );
  });
  assert.deepEqual(all, [{ address: PUBLIC_IPV4, family: 4 }]);

  const single = await new Promise((resolve, reject) => {
    lookup("attacker-controlled.example", {}, (error, address, family) =>
      error ? reject(error) : resolve({ address, family })
    );
  });
  assert.deepEqual(single, { address: PUBLIC_IPV4, family: 4 });
});

test("public redirects are followed manually and revalidated per hop", async () => {
  const resolvedHosts = [];
  const fetchedUrls = [];
  const dispatchers = createDispatcherRecorder();

  const result = await fetchPublicHtml("https://start.example/first", {
    resolver: async (hostname) => {
      resolvedHosts.push(hostname);
      return [{ address: PUBLIC_IPV4, family: 4 }];
    },
    dispatcherFactory: dispatchers.factory,
    fetchFn: async (url) => {
      fetchedUrls.push(url.toString());
      if (url.hostname === "start.example") {
        return new Response(null, {
          status: 302,
          headers: { location: "https://next.example/final" },
        });
      }
      return htmlResponse();
    },
  });

  assert.deepEqual(resolvedHosts, ["start.example", "next.example"]);
  assert.deepEqual(fetchedUrls, [
    "https://start.example/first",
    "https://next.example/final",
  ]);
  assert.equal(result.requestUrl, "https://start.example/first");
  assert.equal(result.finalUrl, "https://next.example/final");
  assert.equal(result.redirectCount, 1);
  assert.equal(
    dispatchers.records.every((record) => record.dispatcher.closed),
    true
  );
});

test("a public URL redirecting to a private host is blocked before the second fetch", async () => {
  let fetchCalls = 0;
  await assertRejectCode(
    fetchPublicHtml("https://start.example/", {
      resolver: async (hostname) =>
        hostname === "start.example"
          ? [{ address: PUBLIC_IPV4, family: 4 }]
          : [{ address: "127.0.0.1", family: 4 }],
      dispatcherFactory: createDispatcherRecorder().factory,
      fetchFn: async () => {
        fetchCalls += 1;
        return new Response(null, {
          status: 302,
          headers: { location: "https://internal.example/admin" },
        });
      },
    }),
    "PREVIEW_URL_BLOCKED"
  );
  assert.equal(fetchCalls, 1);
});

test("redirect limits are enforced", async () => {
  let fetchCalls = 0;
  await assertRejectCode(
    fetchPublicHtml("https://loop.example/", {
      maxRedirects: 2,
      resolver: publicResolver,
      dispatcherFactory: createDispatcherRecorder().factory,
      fetchFn: async () => {
        fetchCalls += 1;
        return new Response(null, {
          status: 302,
          headers: { location: "/again" },
        });
      },
    }),
    "PREVIEW_REDIRECT_LIMIT"
  );
  assert.equal(fetchCalls, 3);
});

test("response content type, status, and byte limits are enforced", async () => {
  const baseOptions = {
    resolver: publicResolver,
    dispatcherFactory: createDispatcherRecorder().factory,
  };

  await assertRejectCode(
    fetchPublicHtml("https://public.example/json", {
      ...baseOptions,
      fetchFn: async () =>
        new Response("{}", {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
    }),
    "UNSUPPORTED_PREVIEW_CONTENT_TYPE"
  );

  await assertRejectCode(
    fetchPublicHtml("https://public.example/missing", {
      ...baseOptions,
      fetchFn: async () =>
        new Response("missing", {
          status: 404,
          headers: { "content-type": "text/html" },
        }),
    }),
    "PREVIEW_FETCH_FAILED"
  );

  await assertRejectCode(
    fetchPublicHtml("https://public.example/large", {
      ...baseOptions,
      maxBytes: 4,
      fetchFn: async () =>
        new Response("12345", {
          status: 200,
          headers: { "content-type": "text/html" },
        }),
    }),
    "PREVIEW_RESPONSE_TOO_LARGE"
  );
});

test("declared oversized bodies are cancelled before the dispatcher closes", async () => {
  const events = [];
  const response = {
    status: 200,
    headers: new Headers({
      "content-type": "text/html",
      "content-length": "5",
    }),
    body: {
      async cancel() {
        events.push("cancel");
      },
    },
  };

  await assertRejectCode(
    fetchPublicHtml("https://public.example/large", {
      maxBytes: 4,
      resolver: publicResolver,
      dispatcherFactory: () => ({
        async close() {
          events.push("close");
        },
        destroy() {
          events.push("destroy");
        },
      }),
      fetchFn: async () => response,
    }),
    "PREVIEW_RESPONSE_TOO_LARGE"
  );

  assert.deepEqual(events, ["cancel", "close"]);
});

test("the total request timeout maps to a typed gateway timeout", async () => {
  await assertRejectCode(
    fetchPublicHtml("https://slow.example/", {
      timeoutMs: 5,
      resolver: publicResolver,
      dispatcherFactory: createDispatcherRecorder().factory,
      fetchFn: async (_url, options) =>
        new Promise((_resolve, reject) => {
          options.signal.addEventListener(
            "abort",
            () => reject(options.signal.reason),
            { once: true }
          );
        }),
    }),
    "PREVIEW_FETCH_TIMEOUT"
  );
});

test("wrapped Undici connection timeouts map to a typed gateway timeout", async () => {
  const cause = new Error("Connect Timeout Error");
  cause.code = "UND_ERR_CONNECT_TIMEOUT";
  const wrappedError = new TypeError("fetch failed");
  wrappedError.cause = cause;

  await assertRejectCode(
    fetchPublicHtml("https://slow.example/", {
      resolver: publicResolver,
      dispatcherFactory: createDispatcherRecorder().factory,
      fetchFn: async () => {
        throw wrappedError;
      },
    }),
    "PREVIEW_FETCH_TIMEOUT"
  );
});

test("HTML decoding honors meta and XML character encoding declarations", async () => {
  const expectedTitle = "Hæ – Café";
  const declarations = [
    '<html><head><meta charset="windows-1252">',
    '<?xml version="1.0" encoding="windows-1252"?><html><head>',
  ];

  for (const [index, declaration] of declarations.entries()) {
    const encodedHtml = iconv.encode(
      `${declaration}<title>${expectedTitle}</title></head></html>`,
      "windows-1252"
    );
    const result = await fetchPublicHtml(
      `https://public.example/legacy-${index}`,
      {
        resolver: publicResolver,
        dispatcherFactory: createDispatcherRecorder().factory,
        fetchFn: async () =>
          new Response(encodedHtml, {
            headers: { "content-type": "text/html" },
          }),
      }
    );

    assert.match(result.html, new RegExp(expectedTitle));
  }
});

test("HTTP character encoding takes precedence over HTML metadata", async () => {
  const expectedTitle = "Hæ – Café";
  const encodedHtml = iconv.encode(
    `<html><head><meta charset="utf-8"><title>${expectedTitle}</title></head></html>`,
    "windows-1252"
  );
  const result = await fetchPublicHtml("https://public.example/header-charset", {
    resolver: publicResolver,
    dispatcherFactory: createDispatcherRecorder().factory,
    fetchFn: async () =>
      new Response(encodedHtml, {
        headers: { "content-type": "text/html; charset=windows-1252" },
      }),
  });

  assert.match(result.html, new RegExp(expectedTitle));
});

test("Open Graph parsing receives HTML only and preserves the success metadata", async () => {
  let scraperOptions;
  const preview = await getUrlPreview("https://public.example/article#section", {
    resolver: publicResolver,
    dispatcherFactory: createDispatcherRecorder().factory,
    fetchFn: async () =>
      htmlResponse(
        "<html><head><title>Secret-free title</title></head><body>raw body</body></html>"
      ),
    scraper: async (options) => {
      scraperOptions = options;
      return { error: false, result: { ogTitle: "Secret-free title" } };
    },
  });

  assert.deepEqual(Object.keys(scraperOptions), ["html"]);
  assert.match(scraperOptions.html, /raw body/);
  assert.equal(preview.result.ogTitle, "Secret-free title");
  assert.equal(preview.result.requestUrl, "https://public.example/article");
  assert.equal(preview.result.html, undefined);
});

test("log sanitization drops paths, queries, fragments, and malformed input", () => {
  assert.equal(
    sanitizeUrlForLogging("https://example.com/path?secret=value#fragment"),
    "https://example.com"
  );
  assert.equal(sanitizeUrlForLogging("not a url"), "[invalid-url]");
});

test("URL preview rate limiting is Redis-backed and keyed by authenticated user", () => {
  const redisClient = { sendCommand: async () => 1 };
  const options = createUrlPreviewRateLimitOptions(redisClient, {
    URL_PREVIEW_RATE_LIMIT_WINDOW_MS: "60000",
    URL_PREVIEW_RATE_LIMIT_MAX: "12",
  });

  assert.equal(options.windowMs, 60_000);
  assert.equal(options.max, 12);
  assert.equal(options.passOnStoreError, true);
  assert.equal(options.keyGenerator({ user: { id: 42 } }), "user:42");
  assert.match(
    options.keyGenerator({ ip: "2001:db8::1", socket: {} }),
    /^ip:/
  );
  assert.ok(options.store);
});

test("URL preview rate limiting uses safe defaults and a typed 429 response", () => {
  const options = createUrlPreviewRateLimitOptions(
    { sendCommand: async () => 1 },
    {
      URL_PREVIEW_RATE_LIMIT_WINDOW_MS: "invalid",
      URL_PREVIEW_RATE_LIMIT_MAX: "-1",
    }
  );
  assert.equal(options.windowMs, DEFAULT_WINDOW_MS);
  assert.equal(options.max, DEFAULT_MAX_REQUESTS);
  assert.equal(urlPreviewRateLimitKey({ user: { id: 7 } }), "user:7");

  let status;
  let body;
  const response = {
    status(value) {
      status = value;
      return this;
    },
    send(value) {
      body = value;
      return this;
    },
  };
  sendRateLimitResponse({}, response);
  assert.equal(status, 429);
  assert.deepEqual(body, {
    error: {
      code: "PREVIEW_RATE_LIMITED",
      message: "Too many URL preview requests.",
    },
  });
});
