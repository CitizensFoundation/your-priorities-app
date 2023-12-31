type Site = {
  domain: string;
};

// Define the type for the 'site' and 'path' parameters and the return type of the function.
export function apiPath(site: Site, path: string = ''): string {
  return `/api/stats/${encodeURIComponent(site.domain)}${path}`;
}

export function siteBasePath(site: Site, path: string = ''): string {
  return `/${encodeURIComponent(site.domain)}${path}`;
}

export function sitePath(site: Site, path: string = ''): string {
  return siteBasePath(site, path) + window.location.search;
}

export function setQuery(key: string, value: string): string {
  const query = new URLSearchParams(window.location.search);
  query.set(key, value);
  return `${window.location.pathname}?${query.toString()}`;
}

export function setQuerySearch(key: string, value: string): string {
  const query = new URLSearchParams(window.location.search);
  query.set(key, value);
  return `${query.toString()}`;
}

export function externalLinkForPage(domain: string, page: string): string {
  const domainURL = new URL(`https://${domain}`);
  return `https://${window.location.hostname}${page}`;
}
