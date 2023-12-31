import './pl-link.js';
import { BrowserHistory } from './util/history.js';
export declare function parseQuery(querystring: string, site: PlausibleSiteData): PlausibleQueryData;
export declare function appliedFilters(query: PlausibleQueryData): any[][];
export declare function generateQueryString(data: any): string;
export declare function navigateToQuery(history: BrowserHistory, queryFrom: PlausibleQueryData, newData: PlausibleQueryData | PlausibleQueryStringsData): void;
export declare function toHuman(query: PlausibleQueryData): string;
export declare function eventName(query: PlausibleQueryData): "pageviews" | "events";
export declare const formattedFilters: Record<string, string>;
//# sourceMappingURL=query.d.ts.map