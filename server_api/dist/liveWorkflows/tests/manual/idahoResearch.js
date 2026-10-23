import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import path from "node:path";
export const idahoResearchNodes = ["licenses", "education"];
export const idahoResearchLimits = {
    queriesPerRound: 2,
    maxPages: 3,
    maxSources: 4,
    maxFollowupRounds: 1,
    maxDocuments: 3,
    maxDocumentPages: 10,
    maxDocumentChars: 60000,
};
export const idahoMaximumFirecrawlRequests = 80;
export const idahoMaximumCreditsPerRequest = 12;
/** Independent receipt totals for comparing test reports with the browser Usage view. */
export function summarizeIdahoFirecrawl(usage) {
    const entries = usage.filter((entry) => entry.creditUsage);
    const totals = (items) => ({
        searches: items.filter((entry) => entry.creditUsage.operation === "search")
            .length,
        scrapes: items.filter((entry) => entry.creditUsage.operation === "scrape")
            .length,
        credits: items.reduce((sum, entry) => sum +
            (entry.status === "settled"
                ? (entry.creditUsage.actualCredits ?? 0)
                : 0), 0),
        reservedCredits: items.reduce((sum, entry) => sum +
            (entry.status !== "settled" ? entry.creditUsage.maximumCredits : 0), 0),
        unknownRequests: items.filter((entry) => entry.status === "unknown" ||
            (entry.status === "settled" &&
                entry.creditUsage.actualCredits === undefined)).length,
        costMicros: items.reduce((sum, entry) => sum + (entry.status === "settled" ? (entry.actualMicros ?? 0) : 0), 0),
    });
    const keys = [
        ...new Set(entries.map((entry) => JSON.stringify([
            entry.runId,
            entry.nodeId,
            entry.creditUsage.bindingId,
        ]))),
    ];
    return {
        ...totals(entries),
        rows: keys.map((key) => {
            const [runId, nodeId, bindingId] = JSON.parse(key);
            return {
                runId,
                nodeId,
                bindingId,
                ...totals(entries.filter((entry) => entry.runId === runId &&
                    entry.nodeId === nodeId &&
                    entry.creditUsage.bindingId === bindingId)),
            };
        }),
    };
}
/** A second bound in addition to the production ledger. No retry or provider fallback. */
export function boundedIdahoFirecrawl(request = fetch) {
    let paidRequests = 0;
    const firecrawlFetch = async (url, init) => {
        const address = String(url);
        assert.ok([
            "https://api.firecrawl.dev/v2/search",
            "https://api.firecrawl.dev/v2/scrape",
            "https://api.firecrawl.dev/v2/team/credit-usage",
        ].includes(address), "Unexpected Firecrawl endpoint");
        if (address.endsWith("/credit-usage")) {
            assert.equal(init?.method ?? "GET", "GET");
        }
        else {
            assert.equal(init?.method, "POST");
            assert.ok(paidRequests < idahoMaximumFirecrawlRequests, "Idaho research reached its paid-request ceiling; do not retry automatically");
            paidRequests++;
        }
        return request(url, init);
    };
    return { firecrawlFetch, paidRequests: () => paidRequests };
}
/** Fixture setup only: credentials go directly to the service, never through Playwright. */
export async function prepareIdahoResearch(harness, apiKey) {
    const binding = {
        id: "firecrawl",
        kind: "firecrawl",
        label: "Idaho web research",
        resourceId: "web",
        writeEnabled: false,
        settings: {
            creditMicros: 1000,
            maxCreditsPerRequest: idahoMaximumCreditsPerRequest,
        },
    };
    await harness.connectors.bind(1, 10, binding, { apiKey });
    const before = await harness.connectors.creditUsage(1, binding.id);
    assert.ok(before.planCredits > 0, "A known Firecrawl plan allowance is required");
    assert.ok(before.remainingCredits >=
        idahoMaximumFirecrawlRequests * idahoMaximumCreditsPerRequest, "Insufficient Firecrawl credits for the bounded research pilot");
    // Allocation of the user's $99 plan; included in processing, not an additional invoice.
    binding.settings.creditMicros = Math.ceil(99000000 / before.planCredits);
    await harness.connectors.bind(1, 10, binding, { apiKey });
    const { workspace } = await harness.request("");
    for (const node of workspace.graph.nodes)
        if (idahoResearchNodes.includes(node.id)) {
            Object.assign(node.configuration, idahoResearchLimits);
            node.recordBudgetMicros = 500000;
        }
    await harness.request("/graph", "PUT", {
        graph: workspace.graph,
        revision: workspace.revision,
    });
    return { before, creditMicros: binding.settings.creditMicros };
}
const object = (value) => value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
const array = (value) => Array.isArray(value) ? value : [];
/** Follow exact citations back to this record/stage's settled retrieval, not just another model response. */
export function verifyIdahoResearch(records, usage, runId) {
    const findings = [];
    const issues = [];
    let quotesVerified = 0;
    for (const job of records) {
        const analysis = object(job.analysis);
        for (const nodeId of idahoResearchNodes) {
            const stage = object(object(analysis.research)[nodeId]);
            if (!Object.keys(stage).length) {
                issues.push(`${job.id}: ${nodeId} has no completed research result`);
                continue;
            }
            const requests = usage.filter((entry) => entry.runId === runId &&
                entry.nodeId === nodeId &&
                entry.recordId === (job.parentId ?? job.id) &&
                entry.status === "settled" &&
                entry.creditUsage);
            const sources = array(stage.sources).map(object);
            const citations = array(stage.citations).map(object);
            for (const citation of citations) {
                const source = sources.find((source) => source.url === citation.url);
                const retrieved = requests.flatMap((entry) => {
                    const result = object(entry.result);
                    return entry.creditUsage.operation === "search"
                        ? array(result.pages).map(object)
                        : [result];
                });
                if (!source ||
                    typeof citation.quote !== "string" ||
                    !citation.quote.length ||
                    !retrieved.some((page) => page.url === citation.url &&
                        typeof page.markdown === "string" &&
                        page.markdown.includes(String(citation.quote))))
                    issues.push(`${job.id}: ${nodeId} citation is not an exact quote from its settled retrieval: ${citation.url}`);
                else
                    quotesVerified++;
                if (stage.status === "known" &&
                    (source?.truncated ||
                        source?.jurisdictionMatches !== true ||
                        source?.authority === "secondary" ||
                        object(source?.extraction).status !== "known" ||
                        array(object(source?.extraction).gaps).length))
                    issues.push(`${job.id}: ${nodeId} claims certainty from incomplete/inapplicable evidence`);
            }
            const review = object(stage.review);
            if (stage.status === "known" &&
                (!citations.length ||
                    array(stage.gaps).length ||
                    array(stage.conflicts).length ||
                    review.supported !== true ||
                    review.jurisdictionCorrect !== true ||
                    review.conflictsResolved !== true ||
                    array(review.issues).length))
                issues.push(`${job.id}: ${nodeId} claims certainty despite unresolved review`);
            findings.push({
                recordId: String(job.id),
                name: String(job.name),
                nodeId,
                status: stage.status,
                citations: citations.length,
                sources: sources.length,
                gaps: array(stage.gaps),
                review: stage.review,
                limits: stage.limits,
            });
        }
        for (const raw of array(object(job.degreeAnalysis).deepResearchResults)) {
            const row = object(raw);
            if (!idahoResearchNodes.some((nodeId) => array(object(object(analysis.research)[nodeId]).citations).some((c) => object(c).url === row.sourceUrl &&
                object(c).quote === row.evidenceQuote)))
                issues.push(`${job.id}: exported legal finding lacks a validated research citation`);
        }
    }
    return {
        passed: !issues.length && findings.length > 0,
        quotesVerified,
        issues,
        known: findings.filter((row) => row.status === "known").length,
        unknown: findings.filter((row) => row.status === "unknown").length,
        findings,
    };
}
export async function saveIdahoResearch(harness, output, prepared, records, paidRequests) {
    const usage = await harness.request("/usage");
    const entries = usage.filter((entry) => entry.creditUsage);
    const summary = summarizeIdahoFirecrawl(entries);
    const after = await harness.connectors
        .creditUsage(1, "firecrawl")
        .catch(() => null);
    const snapshot = await harness.request("");
    const trial = snapshot.runs.find((run) => run.mode === "trial");
    const verification = verifyIdahoResearch(records, entries, trial?.id ?? "");
    const report = {
        ...summary,
        verification,
        paidRequests,
        ...prepared,
        after,
        accountCreditDelta: after
            ? prepared.before.remainingCredits - after.remainingCredits
            : null,
        note: "Per-run credits come from settled provider receipts. The shared account delta may include other activity or delayed balance updates. Dollars allocate the $99 plan cost and are already included in processing totals.",
    };
    await writeFile(path.join(output, "research-report.json"), JSON.stringify(report, null, 2), { mode: 0o600 });
    await writeFile(path.join(output, "research-sources.json"), JSON.stringify(entries.map((entry) => ({
        id: entry.id,
        runId: entry.runId,
        nodeId: entry.nodeId,
        recordId: entry.recordId,
        status: entry.status,
        creditUsage: entry.creditUsage,
        result: entry.result,
    })), null, 2), { mode: 0o600 });
    return report;
}
