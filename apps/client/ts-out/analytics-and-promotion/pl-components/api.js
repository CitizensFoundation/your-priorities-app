import { formatISO } from './util/date.js';
let abortController = new AbortController();
let SHARED_LINK_AUTH = undefined;
class ApiError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ApiError';
    }
}
function serialize(obj) {
    var str = [];
    /* eslint-disable-next-line no-prototype-builtins */
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
    return str.join('&');
}
export function setSharedLinkAuth(auth) {
    SHARED_LINK_AUTH = auth;
}
export function cancelAll() {
    abortController.abort();
    abortController = new AbortController();
}
function serializeFilters(filters) {
    const cleaned = {};
    //@ts-ignore
    Object.entries(filters).forEach(([key, val]) => 
    //@ts-ignore
    val ? (cleaned[key] = val) : null);
    return JSON.stringify(cleaned);
}
export function serializeQuery(query, extraQuery = []) {
    const queryObj = { period: 'realtime' };
    if (query.period) {
        queryObj.period = query.period;
    }
    if (query.date && query.date instanceof Date) {
        queryObj.date = formatISO(query.date);
    }
    else {
        queryObj.date = query.date;
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
export function get(proxyUrl, url, query, ...extraQuery) {
    if (proxyUrl) {
        return getWithProxy(proxyUrl, url, query, ...extraQuery);
    }
    else {
        return getDirect(url, query, ...extraQuery);
    }
}
export function getWithProxy(proxyUrl, url, query, ...extraQuery) {
    const headers = SHARED_LINK_AUTH
        ? {
            'X-Shared-Link-Auth': SHARED_LINK_AUTH,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
        : { Accept: 'application/json', 'Content-Type': 'application/json' };
    url = url + serializeQuery(query, extraQuery);
    return fetch(proxyUrl, {
        method: 'PUT',
        body: JSON.stringify({
            plausibleUrl: url,
        }),
        signal: abortController.signal,
        headers: headers,
    }).then(response => {
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
export function getDirect(url, query, ...extraQuery) {
    const headers = SHARED_LINK_AUTH
        ? {
            'X-Shared-Link-Auth': SHARED_LINK_AUTH,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
        : { Accept: 'application/json', 'Content-Type': 'application/json' };
    url = url + serializeQuery(query, extraQuery);
    return fetch(url, {
        signal: abortController.signal,
        headers: headers,
    }).then(response => {
        if (!response.ok) {
            //@ts-ignore
            return response.json().then(msg => {
                throw new ApiError(msg.error);
            });
        }
        return response.json();
    });
}
//# sourceMappingURL=api.js.map