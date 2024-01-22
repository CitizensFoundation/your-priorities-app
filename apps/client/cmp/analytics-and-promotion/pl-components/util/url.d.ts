type Site = {
    domain: string;
};
export declare function apiPath(site: Site, path?: string): string;
export declare function siteBasePath(site: Site, path?: string): string;
export declare function sitePath(site: Site, path?: string): string;
export declare function setQuery(key: string, value: string): string;
export declare function setQuerySearch(key: string, value: string): string;
export declare function externalLinkForPage(domain: string, page: string): string;
export {};
//# sourceMappingURL=url.d.ts.map