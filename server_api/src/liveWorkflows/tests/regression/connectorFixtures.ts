import assert from "node:assert/strict";
import { researchResponse } from "../researchFixture.js";
import { offlineProcessing } from "../manual/offlineProviders.js";

export const researchUrl = "https://example.gov/licensing/records-officer";
export const researchQuote = "A license is required.";
export function connectorFixtures() {
  const calls: { operation: string; body: Record<string, unknown> }[] = [];
  let remainingCredits = 100000;
  let hold: (() => Promise<void>) | undefined;
  const firecrawlFetch: typeof fetch = async (url, init) => {
    assert.equal(
      new Headers(init?.headers).get("authorization"),
      "Bearer fixture-firecrawl-key",
    );
    const address = String(url);
    if (address === "https://api.firecrawl.dev/v2/team/credit-usage")
      return Response.json({
        success: true,
        data: {
          remainingCredits,
          planCredits: 100000,
          billingPeriodStart: "2026-10-01T00:00:00Z",
          billingPeriodEnd: "2026-11-01T00:00:00Z",
        },
      });
    assert.ok(
      address === "https://api.firecrawl.dev/v2/search" ||
        address === "https://api.firecrawl.dev/v2/scrape",
    );
    const operation = address.endsWith("/search") ? "search" : "scrape";
    const body = JSON.parse(String(init?.body)) as Record<string, unknown>;
    calls.push({ operation, body });
    if (operation === "search" && hold) {
      const wait = hold;
      hold = undefined;
      await wait();
    }
    const creditsUsed = operation === "search" ? 2 : 1;
    remainingCredits -= creditsUsed;
    const document = {
      url: researchUrl,
      title: "Fixture licensing authority",
      markdown: researchQuote,
      metadata: {
        sourceURL: researchUrl,
        statusCode: 200,
        contentType: "text/html",
      },
    };
    return Response.json({
      success: true,
      id: `fixture-${calls.length}`,
      creditsUsed,
      data: operation === "search" ? { web: [document] } : document,
    });
  };
  const processing: typeof offlineProcessing = async (...args) => {
    const system = args[1];
    if (system.startsWith("Compare INPUT.job")) {
      const input = JSON.parse(args[2]);
      const education = input.reference.education[0];
      return {
        content: JSON.stringify({
          status: "unknown",
          agreements: [],
          disagreements: [],
          missingEvidence: ["No WVU or manual reference was supplied"],
          metrics: {},
          licenseComparisons: input.reference.references.map(
            (_: unknown, referenceIndex: number) => ({
              referenceIndex,
              researchEducationRequirement: null,
              researchComparisonExplanation:
                "Fixture license evidence does not establish education requirements",
              researchMatchesWvu: null,
              researchMatchesManual: null,
              requiresManualReview: true,
              recommendedAction: "Review evidence",
              sourceUrl: education.sourceUrl,
              evidenceQuote: education.evidenceQuote,
            }),
          ),
        }),
        tokensIn: 100,
        tokensOut: 100,
      };
    }
    if (
      [
        "Plan authoritative",
        "Select the strongest",
        "Extract only requirements",
        "Independently verify the synthesized",
      ].some((prefix) => system.startsWith(prefix)) ||
      system.includes("Synthesize only the extracted evidence")
    )
      return {
        content: JSON.stringify(researchResponse(system, JSON.parse(args[2]))),
        tokensIn: 100,
        tokensOut: 100,
      };
    return offlineProcessing(...args);
  };
  return {
    calls,
    firecrawlFetch,
    processing,
    holdNextSearch() {
      let release!: () => void;
      const gate = new Promise<void>((resolve) => {
        release = resolve;
      });
      hold = () => gate;
      return release;
    },
  };
}
