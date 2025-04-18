// Define the type for the 'site' and 'path' parameters and the return type of the function.
export function apiPath(site, path = '') {
    return `/api/stats/${encodeURIComponent(site.domain)}${path}`;
}
export function siteBasePath(site, path = '') {
    return `/${encodeURIComponent(site.domain)}${path}`;
}
export function sitePath(site, path = '') {
    return siteBasePath(site, path) + window.location.search;
}
export function setQuery(key, value) {
    const query = new URLSearchParams(window.location.search);
    query.set(key, value);
    return `${window.location.pathname}?${query.toString()}`;
}
export function setQuerySearch(key, value) {
    const query = new URLSearchParams(window.location.search);
    query.set(key, value);
    return `${query.toString()}`;
}
export function externalLinkForPage(domain, page) {
    const domainURL = new URL(`https://${domain}`);
    return `https://${window.location.hostname}${page}`;
}
//# sourceMappingURL=url.js.map