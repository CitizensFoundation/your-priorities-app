import { z } from "zod";
import type { UsageReservation } from "./budget.js";
export declare function requireObservedDocument(source: UsageReservation | undefined, runId: string, nodeId: string, binding: string, url: string, recordId?: string): void;
/** Explicit links from paid page text guide selection, never supply evidence for the linked page. */
export declare function observedLinks(markdown: string, base: string): {
    url: string;
    title: string;
}[];
export declare const documentRequest: z.ZodObject<{
    url: z.ZodString;
    sourceRequestId: z.ZodString;
    maxPages: z.ZodDefault<z.ZodNumber>;
    maxChars: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>;
export declare function publicDocumentUrl(value: string): string;
export declare function firecrawlBody(binding: YpWorkflowConnector, operation: string, input: Record<string, YpWorkflowJson>): {
    sources: string[];
    scrapeOptions: {
        formats: string[];
        onlyMainContent: boolean;
        parsers: {
            type: string;
            mode: string;
            maxPages: number;
        }[];
        proxy: string;
        skipTlsVerification: boolean;
    };
    query: string;
    limit: number;
    url?: undefined;
    formats?: undefined;
    onlyMainContent?: undefined;
    parsers?: undefined;
    proxy?: undefined;
    skipTlsVerification?: undefined;
    timeout?: undefined;
} | {
    url: string;
    formats: string[];
    onlyMainContent: boolean;
    parsers: {
        type: string;
        mode: string;
        maxPages: number;
        pageMarkers: boolean;
    }[];
    proxy: string;
    skipTlsVerification: boolean;
    timeout: number;
};
export declare function normalizeFirecrawl(value: unknown, operation: string, input: Record<string, YpWorkflowJson>, retrievedAt?: string): YpWorkflowJson;
/** https://docs.firecrawl.dev/api-reference/endpoint/credit-usage */
export declare function normalizeFirecrawlBalance(value: unknown): YpWorkflowFirecrawlBalance;
/** Bound bytes while receiving, not after Response.json has allocated them. */
export declare const maximumFirecrawlResponseBytes: number;
export declare function boundedFirecrawlJson(response: Response, maximumBytes?: number): Promise<any>;
