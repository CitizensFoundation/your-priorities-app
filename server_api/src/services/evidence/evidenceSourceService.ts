import crypto from "crypto";

import { PolicySynthSimpleAgentBase } from "@policysynth/agents/base/simpleAgent.js";

import models from "../../models/index.cjs";
import log from "../../utils/loggerTs.js";

const dbModels: Models = models;

type EvidenceFetchResult = {
  canonicalUrl: string;
  title?: string;
  markdown?: string;
  rawHtml?: string;
  extractedText?: string;
  status: "ok" | "failed";
  errorMessage?: string;
  fetchMethod: string;
  metadata: Record<string, unknown>;
};

type SourceCandidate = {
  url: string;
  title?: string;
  sourceRole?: string;
};

type SourceProfile = {
  source_type: string;
  publisher?: string;
  trust_tier: string;
  freshness_policy: string;
  license?: string;
  language?: string;
};

type DiscoveryResult = {
  queries?: string[];
  urls?: Array<{ url: string; title?: string; sourceRole?: string }>;
};

class EvidenceSourceDiscoveryAgent extends PolicySynthSimpleAgentBase {
  constructor() {
    super({
      groupId: 0,
      stages: {},
      totalCost: 0,
    } as PsSimpleAgentMemoryData);
    this.maxModelTokensOut = 700;
    this.modelTemperature = 0.15;
  }

  async discover(question: string): Promise<DiscoveryResult> {
    const messages = [
      {
        role: "system",
        message: [
          "You plan source discovery for an Icelandic public consultation evidence bundle.",
          "Prefer official Icelandic, Nordic, EU, OECD, and open data sources.",
          "Return JSON only with queries and urls.",
          "queries should be web search queries. urls should be known high-value source URLs if you are confident.",
        ].join(" "),
      },
      {
        role: "user",
        message: JSON.stringify({ question }),
      },
    ];

    return (await this.callLLM(
      "betterIcelandEvidenceSourceDiscovery",
      messages,
      true,
      700
    )) as DiscoveryResult;
  }
}

export class EvidenceSourceService {
  private EvidenceSource = dbModels.EvidenceSource as any;
  private EvidenceSnapshot = dbModels.EvidenceSnapshot as any;

  canonicalizeUrl(url: string): string {
    const parsed = new URL(url.trim());
    parsed.hash = "";
    parsed.hostname = parsed.hostname.toLowerCase();
    parsed.searchParams.sort();

    const normalized = parsed.toString();
    return normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
  }

  seedSourcesForResearch(
    _question: string,
    extraUrls: string[] = []
  ): SourceCandidate[] {
    const baseSources: SourceCandidate[] = [
      {
        title: "Icelandic government AI strategy announcement",
        url: "https://www.stjornarradid.is/efst-a-baugi/frettir/stok-frett/2021/04/09/Gervigreindarstefna-fyrir-Island/",
        sourceRole: "policy_context",
      },
      {
        title: "Digital Iceland guidelines on the use of AI",
        url: "https://island.is/en/o/digital-iceland/guidelines-on-the-use-of-ai",
        sourceRole: "policy_guidance",
      },
      {
        title: "Statistics Iceland open data access",
        url: "https://statice.is/publications/open-data-access/",
        sourceRole: "open_data",
      },
      {
        title: "Statistics Iceland PxWeb API",
        url: "https://px.hagstofa.is/pxen/api/v1/en/",
        sourceRole: "open_data_api",
      },
      {
        title: "Althingi XML data access",
        url: "https://www.althingi.is/altext/xml/",
        sourceRole: "parliamentary_source",
      },
      {
        title: "Iceland consultation portal",
        url: "https://island.is/samradsgatt/um",
        sourceRole: "consultation_context",
      },
    ];

    const explicitSources = extraUrls
      .filter((url) => url && url.trim().length > 0)
      .map((url) => ({ url, sourceRole: "requested_source" }));

    const seen = new Set<string>();
    return [...explicitSources, ...baseSources].filter((candidate) => {
      try {
        const canonical = this.canonicalizeUrl(candidate.url);
        if (seen.has(canonical)) return false;
        seen.add(canonical);
        return true;
      } catch (error) {
        log.warn("Skipping invalid evidence source URL", {
          url: candidate.url,
          error,
        });
        return false;
      }
    });
  }

  async discoverSourcesForResearch(
    question: string,
    extraUrls: string[] = []
  ): Promise<SourceCandidate[]> {
    const candidates = this.seedSourcesForResearch(question, extraUrls);
    const discoveredCandidates: SourceCandidate[] = [];

    if (this.hasAiModelConfig()) {
      try {
        const discovery = await new EvidenceSourceDiscoveryAgent().discover(
          question
        );
        for (const source of discovery.urls || []) {
          discoveredCandidates.push({
            url: source.url,
            title: source.title,
            sourceRole: source.sourceRole || "agent_suggested_source",
          });
        }

        if (process.env.FIRECRAWL_API_KEY) {
          const queries = (discovery.queries || []).slice(0, 4);
          for (const query of queries) {
            discoveredCandidates.push(
              ...(await this.searchWebCandidates(query, 5))
            );
          }
        }
      } catch (error) {
        log.warn("Evidence source discovery agent failed", { error });
      }
    } else if (process.env.FIRECRAWL_API_KEY) {
      try {
        discoveredCandidates.push(
          ...(await this.searchWebCandidates(question, 5))
        );
      } catch (error) {
        log.warn("Evidence Firecrawl source search failed", { error });
      }
    }

    return this.dedupeCandidates([...discoveredCandidates, ...candidates]).slice(
      0,
      12
    );
  }

  async searchWebCandidates(
    query: string,
    limit = 8
  ): Promise<SourceCandidate[]> {
    if (!process.env.FIRECRAWL_API_KEY) return [];

    try {
      return await this.searchWithFirecrawl(query, limit);
    } catch (error) {
      log.warn("Firecrawl evidence search failed", { query, error });
      return [];
    }
  }

  async upsertSourceSnapshot(
    url: string,
    preferredMetadata: Record<string, unknown> = {}
  ) {
    const canonicalUrl = this.canonicalizeUrl(url);
    const profile = this.detectSource(canonicalUrl, preferredMetadata.title);
    const [source] = await this.EvidenceSource.findOrCreate({
      where: { canonical_url: canonicalUrl },
      defaults: {
        canonical_url: canonicalUrl,
        ...profile,
        title: preferredMetadata.title,
        metadata: preferredMetadata,
      },
    });

    const fetchResult = await this.fetchSource(canonicalUrl);
    const contentForHash =
      fetchResult.extractedText ||
      fetchResult.markdown ||
      fetchResult.rawHtml ||
      `${canonicalUrl}:${fetchResult.errorMessage || "empty"}`;
    const snapshotHash = this.hashText(contentForHash);
    const [snapshot] = await this.EvidenceSnapshot.findOrCreate({
      where: {
        source_id: source.id,
        snapshot_hash: snapshotHash,
      },
      defaults: {
        source_id: source.id,
        snapshot_hash: snapshotHash,
        fetched_at: new Date(),
        fetch_method: fetchResult.fetchMethod,
        status: fetchResult.status,
        error_message: fetchResult.errorMessage,
        raw_html: fetchResult.rawHtml,
        markdown: fetchResult.markdown,
        extracted_text: fetchResult.extractedText,
        metadata: fetchResult.metadata,
      },
    });

    await source.update({
      ...profile,
      title:
        preferredMetadata.title ||
        fetchResult.title ||
        source.title ||
        profile.publisher ||
        canonicalUrl,
      current_snapshot_id: snapshot.id,
      last_checked_at: new Date(),
      content_hash: snapshotHash,
      metadata: {
        ...(source.metadata || {}),
        ...preferredMetadata,
        lastFetchMethod: fetchResult.fetchMethod,
      },
    });

    return { source, snapshot };
  }

  detectSource(url: string, title?: unknown): SourceProfile {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    const lowerUrl = url.toLowerCase();
    const baseProfile: SourceProfile = {
      source_type: "web_page",
      trust_tier: "standard",
      freshness_policy: "monthly",
      language: this.guessLanguage(url, title),
    };

    if (hostname.includes("hagstofa.is") || hostname.includes("statice.is")) {
      return {
        ...baseProfile,
        source_type: lowerUrl.includes("/api/") ? "api_table" : "dataset",
        publisher: "Statistics Iceland",
        trust_tier: "official",
        freshness_policy: "weekly",
        license: "Open data",
      };
    }

    if (hostname.includes("althingi.is")) {
      return {
        ...baseProfile,
        source_type: "parliamentary_source",
        publisher: "Althingi",
        trust_tier: "official",
        freshness_policy: "daily",
      };
    }

    if (hostname.includes("island.is")) {
      return {
        ...baseProfile,
        source_type: lowerUrl.includes("samradsgatt")
          ? "consultation_record"
          : "government_guidance",
        publisher: lowerUrl.includes("samradsgatt")
          ? "Island.is / Samradsgatt"
          : "Island.is",
        trust_tier: "official",
        freshness_policy: "weekly",
      };
    }

    if (
      hostname.includes("stjornarradid.is") ||
      hostname.includes("government.is")
    ) {
      return {
        ...baseProfile,
        source_type: "government_policy",
        publisher: "Government of Iceland",
        trust_tier: "official",
        freshness_policy: "monthly",
      };
    }

    if (
      hostname.includes("eurostat") ||
      hostname.includes("oecd.org") ||
      hostname.includes("worldbank.org") ||
      hostname.includes("data.europa.eu")
    ) {
      return {
        ...baseProfile,
        source_type: "international_dataset",
        publisher: hostname,
        trust_tier: "official_international",
        freshness_policy: "monthly",
      };
    }

    return {
      ...baseProfile,
      publisher: hostname,
    };
  }

  private async fetchSource(url: string): Promise<EvidenceFetchResult> {
    if (process.env.FIRECRAWL_API_KEY) {
      try {
        return await this.fetchWithFirecrawl(url);
      } catch (error) {
        log.warn("Firecrawl evidence fetch failed, falling back to fetch", {
          url,
          error,
        });
      }
    }

    return this.fetchWithNativeFetch(url);
  }

  private async fetchWithFirecrawl(url: string): Promise<EvidenceFetchResult> {
    const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        formats: ["markdown", "html"],
        onlyMainContent: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Firecrawl returned ${response.status}`);
    }

    const json = (await response.json()) as any;
    const data = json.data || json;
    const markdown = data.markdown as string | undefined;
    const rawHtml = data.html as string | undefined;
    const extractedText = markdown || this.stripHtml(rawHtml || "");

    return {
      canonicalUrl: url,
      title: data.metadata?.title,
      markdown,
      rawHtml,
      extractedText,
      status: "ok",
      fetchMethod: "firecrawl_scrape",
      metadata: {
        firecrawl: {
          statusCode: response.status,
          metadata: data.metadata || {},
        },
      },
    };
  }

  private async searchWithFirecrawl(
    query: string,
    limit = 5
  ): Promise<SourceCandidate[]> {
    const response = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        limit,
      }),
    });

    if (!response.ok) {
      throw new Error(`Firecrawl search returned ${response.status}`);
    }

    const json = (await response.json()) as any;
    const results = json.data || json.results || [];

    return results
      .filter((result: any) => typeof result.url === "string")
      .map((result: any) => ({
        url: result.url,
        title: result.title,
        sourceRole: "firecrawl_search_result",
      }));
  }

  private async fetchWithNativeFetch(url: string): Promise<EvidenceFetchResult> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Better Iceland Evidence Research/1.0 (+https://betriaisland.is)",
        },
      });
      const contentType = response.headers.get("content-type") || "";
      const body = await response.text();
      const extractedText = contentType.includes("html")
        ? this.stripHtml(body)
        : body;

      return {
        canonicalUrl: url,
        rawHtml: contentType.includes("html") ? body : undefined,
        extractedText,
        status: response.ok ? "ok" : "failed",
        errorMessage: response.ok
          ? undefined
          : `Fetch returned HTTP ${response.status}`,
        fetchMethod: "fetch",
        metadata: {
          contentType,
          statusCode: response.status,
          lastModified: response.headers.get("last-modified"),
        },
      };
    } catch (error: any) {
      return {
        canonicalUrl: url,
        status: "failed",
        errorMessage: error?.message || "Fetch failed",
        fetchMethod: "fetch",
        metadata: {},
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  private stripHtml(html: string): string {
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 120000);
  }

  private guessLanguage(url: string, title?: unknown): string | undefined {
    const value = `${url} ${String(title || "")}`.toLowerCase();
    if (value.includes("/en/") || value.includes("statice.is")) return "en";
    if (value.includes("island.is") || value.includes("stjornarradid")) {
      return "is";
    }
    return undefined;
  }

  private hashText(text: string): string {
    return crypto.createHash("sha256").update(text).digest("hex");
  }

  private dedupeCandidates(candidates: SourceCandidate[]): SourceCandidate[] {
    const seen = new Set<string>();
    return candidates.filter((candidate) => {
      try {
        const canonical = this.canonicalizeUrl(candidate.url);
        if (seen.has(canonical)) return false;
        seen.add(canonical);
        return true;
      } catch (error) {
        log.warn("Skipping invalid discovered evidence source URL", {
          url: candidate.url,
          error,
        });
        return false;
      }
    });
  }

  private hasAiModelConfig(): boolean {
    return !!(
      process.env.AI_MODEL_API_KEY &&
      process.env.AI_MODEL_NAME &&
      process.env.AI_MODEL_PROVIDER
    );
  }
}
