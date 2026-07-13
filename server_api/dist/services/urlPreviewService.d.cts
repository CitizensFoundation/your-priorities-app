export const DEFAULT_MAX_BYTES: number;
export const DEFAULT_MAX_REDIRECTS: 3;
export const DEFAULT_TIMEOUT_MS: 10000;
export class UrlPreviewError extends Error {
    constructor(code: any, options?: {});
    code: any;
    status: any;
    safeTarget: any;
    redirectCount: any;
}
export function createPinnedLookup(addresses: any): (_hostname: any, options: any, callback: any) => void;
export function fetchPublicHtml(urlIn: any, options?: {}): Promise<{
    html: string;
    requestUrl: string;
    finalUrl: string;
    redirectCount: number;
    responseBytes: number;
}>;
export function getUrlPreview(urlIn: any, options?: {}): Promise<{
    result: any;
    requestUrl: string;
    finalUrl: string;
    redirectCount: number;
    responseBytes: number;
}>;
export function isPublicAddress(address: any): boolean;
export function parseAndValidateUrl(urlIn: any): import("url").URL;
export function sanitizeUrlForLogging(urlIn: any): string;
