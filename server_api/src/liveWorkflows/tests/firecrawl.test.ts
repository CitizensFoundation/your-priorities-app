import test from "node:test";
import assert from "node:assert/strict";
import {
  boundedFirecrawlJson,
  firecrawlBody,
  normalizeFirecrawl,
  publicDocumentUrl,
  requireObservedDocument,
  observedLinks,
  maximumFirecrawlResponseBytes,
} from "../firecrawl.js";

test("multi-megabyte search responses retain billing while normalized evidence stays bounded", async () => {
  const body = {
    success: true,
    creditsUsed: 5,
    data: {
      web: [
        { url: "https://example.gov/large", markdown: "text ".repeat(500_000) },
      ],
    },
  };
  const normalized = normalizeFirecrawl(
    await boundedFirecrawlJson(Response.json(body)),
    "search",
    { query: "fixture", limit: 1 },
  ) as any;
  assert.equal(normalized.creditsUsed, 5);
  assert.equal(normalized.pages[0].markdown.length, 60_000);
  assert.equal(normalized.pages[0].truncated, true);
  await assert.rejects(
    boundedFirecrawlJson(
      new Response("x".repeat(maximumFirecrawlResponseBytes + 1)),
    ),
    /byte limit/,
  );
});
import type { UsageReservation } from "../budget.js";
const binding: YpWorkflowConnector = {
  id: "web",
  label: "Web",
  kind: "firecrawl",
  resourceId: "web",
  writeEnabled: false,
  settings: { maxCreditsPerRequest: 12, creditMicros: 1000 },
};
const input = {
  url: "https://example.gov/statutes.pdf",
  sourceRequestId: "33333333-3333-4333-8333-333333333333",
  maxPages: 10,
  maxChars: 60000,
};
test("bounded document links confer only same-run, record, stage and binding retrieval capability", () => {
  const links = observedLinks(
    "[Specification](/jobs.pdf) [Private](http://127.0.0.1/secret) [Script](javascript:alert) [Fake](https://other.gov/missing)",
    "https://official.gov/jobs",
  );
  assert.equal(links.length, 2);
  assert.equal(links[0].url, "https://official.gov/jobs.pdf");
  const source = {
    runId: "run",
    nodeId: "education",
    recordId: "parent",
    status: "settled",
    description: "firecrawl:scrape",
    result: { binding: "web", links },
  } as unknown as UsageReservation;
  requireObservedDocument(
    source,
    "run",
    "education",
    "web",
    links[0].url,
    "parent",
  );
  for (const changed of ["record", "node", "run", "url"])
    assert.throws(() =>
      requireObservedDocument(
        source,
        changed === "run" ? "elsewhere" : "run",
        changed === "node" ? "licenses" : "education",
        "web",
        changed === "url" ? "https://official.gov/invented" : links[0].url,
        changed === "record" ? "other-parent" : "parent",
      ),
    );
  assert.equal(
    observedLinks(
      Array.from({ length: 100 }, (_, i) => `[page](/${i})`).join(" "),
      "https://official.gov/",
    ).length,
    50,
  );
});
test("document authority is scoped to a settled search in the same run, node and binding", () => {
  const source: UsageReservation = {
    id: input.sourceRequestId,
    runId: "run",
    nodeId: "research",
    status: "settled",
    fingerprint: "fixture",
    maximumMicros: 100,
    actualMicros: 10,
    createdAt: "2026-10-01",
    description: "firecrawl:search",
    result: { binding: "web", pages: [{ url: input.url + "#section" }] },
  };
  requireObservedDocument(source, "run", "research", "web", input.url);
  for (const changed of [
    { runId: "another" },
    { nodeId: "other" },
    { status: "unknown" as const },
    { result: { binding: "other", pages: [{ url: input.url }] } },
    {
      result: {
        binding: "web",
        pages: [{ url: "https://example.gov/different" }],
      },
    },
  ])
    assert.throws(
      () =>
        requireObservedDocument(
          { ...source, ...changed },
          "run",
          "research",
          "web",
          input.url,
        ),
      /completed search/,
    );
  assert.throws(() =>
    requireObservedDocument(undefined, "run", "research", "web", input.url),
  );
});
test("document requests reject unbounded, private and over-budget inputs", () => {
  const body = firecrawlBody(binding, "scrape", input);
  assert.deepEqual((body as any).parsers, [
    { type: "pdf", mode: "fast", maxPages: 10, pageMarkers: true },
  ]);
  assert.throws(
    () => firecrawlBody(binding, "scrape", { ...input, maxPages: 50 }),
    /credit bound/,
  );
  assert.throws(() =>
    firecrawlBody(binding, "scrape", { ...input, actions: [] }),
  );
  for (const url of [
    "http://127.0.0.1/x",
    "http://[::1]/x",
    "http://169.254.169.254/x",
    "http://a.internal/x",
    "file:///x",
    "https://user:pass@example.gov/x",
  ])
    assert.throws(() => publicDocumentUrl(url));
});
test("PDF coverage, provider warnings and text caps stay explicit; missing usage fails closed", () => {
  const reply = {
    success: true,
    creditsUsed: 11,
    data: {
      markdown: "a".repeat(1500),
      metadata: {
        contentType: "application/pdf",
        numPages: 10,
        totalPages: 30,
        statusCode: 200,
      },
    },
  };
  const limited = normalizeFirecrawl(reply, "scrape", {
    ...input,
    maxChars: 1000,
  }) as any;
  assert.equal(limited.markdown.length, 1000);
  assert.equal(limited.truncated, true);
  assert.deepEqual(limited.coverage.reasons, ["character-limit", "page-limit"]);
  reply.data.metadata.totalPages = 10;
  assert.equal(
    (normalizeFirecrawl(reply, "scrape", input) as any).truncated,
    false,
  );
  assert.equal(
    (
      normalizeFirecrawl(
        {
          ...reply,
          data: {
            ...reply.data,
            metadata: { contentType: "application/pdf", numPages: 10 },
          },
        },
        "scrape",
        input,
      ) as any
    ).truncated,
    true,
  );
  assert.throws(
    () =>
      normalizeFirecrawl({ ...reply, creditsUsed: undefined }, "scrape", input),
    /credit usage/,
  );
  assert.equal(
    (
      normalizeFirecrawl(
        { ...reply, data: { ...reply.data, warning: "partial" } },
        "scrape",
        input,
      ) as any
    ).truncated,
    true,
  );
});
test("the Firecrawl response reader stops when its byte limit is crossed", async () => {
  await assert.rejects(
    boundedFirecrawlJson(new Response("x".repeat(100)), 20),
    /byte limit/,
  );
  assert.deepEqual(
    await boundedFirecrawlJson(new Response('{"ok":true}'), 100),
    { ok: true },
  );
});
