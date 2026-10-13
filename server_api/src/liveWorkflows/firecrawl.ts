import { z } from "zod";
import { isIP } from "node:net";
import {
  ConflictError,
  ForbiddenError,
  ValidationError,
} from "./services/errors.js";
import type { UsageReservation } from "./budget.js";

export function requireObservedDocument(
  source: UsageReservation | undefined,
  runId: string,
  nodeId: string,
  binding: string,
  url: string,
) {
  const result = source?.result as
    | { pages?: { url: string }[]; binding?: string }
    | undefined;
  const target = publicDocumentUrl(url);
  const observed = result?.pages?.some((page) => {
    try {
      return publicDocumentUrl(page.url) === target;
    } catch {
      return false;
    }
  });
  if (
    source?.runId !== runId ||
    source.nodeId !== nodeId ||
    source.status !== "settled" ||
    source.description !== "firecrawl:search" ||
    result?.binding !== binding ||
    !observed
  )
    throw new ForbiddenError(
      "Documents must come from a completed search in this run, node and binding",
    );
}

export const documentRequest = z
  .object({
    url: z.string().url().max(2048),
    sourceRequestId: z.string().uuid(),
    maxPages: z.number().int().min(1).max(50).default(10),
    maxChars: z.number().int().min(1000).max(200_000).default(60_000),
  })
  .strict();
export function publicDocumentUrl(value: string) {
  const url = new URL(value);
  const host = url.hostname.toLowerCase().replace(/\.$/, "");
  // Only public DNS names from a prior search. No IP literals, credentials,
  // alternate ports, single-label names or common private DNS suffixes.
  if (
    !["https:", "http:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.port ||
    isIP(host) ||
    host.includes(":") ||
    !host.includes(".") ||
    /(^|\.)(localhost|local|internal|test|invalid)$/.test(host)
  )
    throw new ValidationError(
      "Document URL must be a public HTTP(S) search result",
    );
  url.hash = "";
  return url.href;
}
export function firecrawlBody(
  binding: YpWorkflowConnector,
  operation: string,
  input: Record<string, YpWorkflowJson>,
) {
  const credits = Number(binding.settings.maxCreditsPerRequest);
  if (operation === "search") {
    const request = z
      .object({
        query: z.string().min(1).max(500),
        limit: z.number().int().min(1).max(5).default(3),
      })
      .strict()
      .parse(input);
    if (credits < request.limit * 3 + 2)
      throw new ValidationError(
        "Firecrawl credit bound is too small for the requested result count",
      );
    return {
      ...request,
      sources: ["web"],
      scrapeOptions: {
        formats: ["markdown"],
        onlyMainContent: true,
        parsers: [{ type: "pdf", mode: "fast", maxPages: 1 }],
        proxy: "basic",
        skipTlsVerification: false,
      },
    };
  }
  if (operation !== "scrape")
    throw new ValidationError("Unsupported Firecrawl operation");
  const request = documentRequest.parse(input);
  if (credits < request.maxPages + 2)
    throw new ValidationError(
      "Firecrawl credit bound must cover the PDF page limit plus two credits",
    );
  return {
    url: publicDocumentUrl(request.url),
    formats: ["markdown"],
    onlyMainContent: false,
    parsers: [
      {
        type: "pdf",
        mode: "fast",
        maxPages: request.maxPages,
        pageMarkers: true,
      },
    ],
    proxy: "basic",
    skipTlsVerification: false,
    timeout: 60000,
  };
}

const object = z.record(z.string(), z.unknown());
function page(value: unknown, maxChars: number, maxPages: number) {
  const data = object.parse(value);
  const metadata = object.parse(data.metadata ?? {});
  const markdown = z.string().parse(data.markdown ?? "");
  let address = String(
    data.url ?? metadata.sourceURL ?? metadata.url ?? "",
  );
  try {
    const normalized = new URL(address);
    normalized.hash = "";
    address = normalized.href;
  } catch {
    /* Retain for review; gateway rejects invalid document URLs. */
  }
  const pdf =
    /pdf/i.test(String(metadata.contentType)) ||
    /\.pdf(?:$|[?#])/i.test(address) ||
    metadata.numPages !== undefined;
  const count = (value: unknown) =>
    typeof value === "number" && Number.isSafeInteger(value) && value > 0
      ? value
      : null;
  const parsed = count(metadata.numPages);
  const total = count(metadata.totalPages);
  const status =
    typeof metadata.statusCode === "number" ? metadata.statusCode : null;
  const reasons = [
    ...(markdown.length > maxChars ? ["character-limit"] : []),
    ...(pdf && (parsed === null || total === null)
      ? ["unknown-page-coverage"]
      : []),
    ...(pdf &&
    parsed !== null &&
    total !== null &&
    (parsed !== total || parsed > maxPages)
      ? ["page-limit"]
      : []),
    ...(data.warning || metadata.error ? ["provider-warning"] : []),
    ...(status !== null &&
    !((status >= 200 && status < 300) || status === 304)
      ? ["source-status"]
      : []),
    ...(!markdown.trim() ? ["empty-document"] : []),
  ];
  return {
    url: address,
    title: String(data.title ?? metadata.title ?? ""),
    description: String(data.description ?? ""),
    markdown: markdown.slice(0, maxChars),
    truncated: reasons.length > 0,
    coverage: {
      parsedPages: parsed,
      totalPages: total,
      maxPages,
      maxChars,
      reasons,
      statusCode: status,
    },
  };
}
export function normalizeFirecrawl(
  value: unknown,
  operation: string,
  input: Record<string, YpWorkflowJson>,
  retrievedAt = new Date().toISOString(),
): YpWorkflowJson {
  const result = object.parse(value),
    data = object.parse(result.data);
  if (result.success !== true)
    throw new Error("Firecrawl did not complete the request");
  const metadata = object.parse(data.metadata ?? {});
  const creditsUsed =
    result.creditsUsed ?? data.creditsUsed ?? metadata.creditsUsed;
  if (creditsUsed === undefined)
    throw new ConflictError(
      "Firecrawl returned no credit usage; reconcile this request before continuing",
    );
  const credits = z.number().int().nonnegative().parse(creditsUsed);
  if (operation === "search") {
    const web = z
      .array(z.unknown())
      .max(5)
      .parse(data.web ?? []);
    return {
      pages: web.map((p) => page(p, 60000, 1)),
      creditsUsed: credits,
      retrievedAt,
    };
  }
  const request = documentRequest.parse(input);
  return {
    ...page(
      { ...data, url: request.url },
      request.maxChars,
      request.maxPages,
    ),
    creditsUsed: credits,
    retrievedAt,
  };
}

/** Bound bytes while receiving, not after Response.json has allocated them. */
export async function boundedFirecrawlJson(
  response: Response,
  maximumBytes = 2 * 1024 ** 2,
) {
  if (!response.ok)
    throw new Error(`Firecrawl request failed (${response.status})`);
  if (!response.body) throw new Error("Firecrawl returned no body");
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maximumBytes)
        throw new Error(
          "Firecrawl response exceeds its byte limit; reconcile the reserved charge",
        );
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString());
  } finally {
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
}
