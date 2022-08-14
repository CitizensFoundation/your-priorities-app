import { formatISO } from './util/date.js';

let abortController = new AbortController();
let SHARED_LINK_AUTH: string | undefined = undefined;

class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

function serialize(obj: any) {
  var str = [];
  /* eslint-disable-next-line no-prototype-builtins */
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  return str.join('&');
}

export function setSharedLinkAuth(auth: string) {
  SHARED_LINK_AUTH = auth;
}

export function cancelAll() {
  abortController.abort();
  abortController = new AbortController();
}

function serializeFilters(filters: any) {
  const cleaned = {};
  //@ts-ignore
  Object.entries(filters).forEach(([key, val]) =>
    //@ts-ignore
    val ? (cleaned[key] = val) : null
  );
  return JSON.stringify(cleaned);
}

export function serializeQuery(
  query: PlausibleQueryData,
  extraQuery: any = []
) {
  const queryObj: PlausibleQueryStringsData = { period: 'realtime' };
  if (query.period) {
    queryObj.period = query.period;
  }
  if (query.date) {
    queryObj.date = formatISO(query.date);
  }
  if (query.from) {
    queryObj.from = formatISO(query.from);
  }
  if (query.to) {
    queryObj.to = formatISO(query.to);
  }
  //@ts-ignore
  if (query.filters) {
    //@ts-ignore
    queryObj.filters = serializeFilters(query.filters);
  }
  if (query.with_imported) {
    queryObj.with_imported = query.with_imported;
  }
  if (SHARED_LINK_AUTH) {
    queryObj.auth = SHARED_LINK_AUTH;
  }
  Object.assign(queryObj, ...extraQuery);

  return '?' + serialize(queryObj);
}

export function get(
  collectionType: string,
  collectionId: number,
  url: string | Request,
  query: PlausibleQueryData,
  ...extraQuery: any[]
) {
  const headers = SHARED_LINK_AUTH
    ? {
        'X-Shared-Link-Auth': SHARED_LINK_AUTH,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    : { Accept: 'application/json', 'Content-Type': 'application/json' };
  //@ts-ignore

  url = url + serializeQuery(query, extraQuery);
  return fetch(`/api/${collectionType}/${collectionId}/plausibleStatsProxy`, {
    method: 'PUT',
    body: JSON.stringify({
      plausibleUrl: url,
    }),
    signal: abortController.signal,
    headers: headers,
  }).
  then(response => {
    if (!response.ok) {
      //@ts-ignore
      return response.json();
      /*return response.json().then(msg => {
        throw new ApiError(msg.error);
      });*/

    }
    return response.json();
  });
}
