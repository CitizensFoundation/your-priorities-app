import { offlineProcessing } from "../manual/offlineProviders.js";
export declare const researchUrl = "https://example.gov/licensing/records-officer";
export declare const researchQuote = "A license is required.";
export declare function connectorFixtures(): {
    calls: {
        operation: string;
        body: Record<string, unknown>;
    }[];
    firecrawlFetch: typeof fetch;
    processing: typeof offlineProcessing;
    holdNextSearch(): () => void;
};
