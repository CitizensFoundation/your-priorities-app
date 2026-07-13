"use strict";
const dns = require("node:dns");
const { getEncoding } = require("encoding-sniffer");
const ipaddr = require("ipaddr.js");
const iconv = require("iconv-lite");
const { Agent, fetch } = require("undici");
const ogs = require("open-graph-scraper");
const DEFAULT_TIMEOUT_MS = 10000;
const DEFAULT_MAX_BYTES = 2 * 1024 * 1024;
const DEFAULT_MAX_REDIRECTS = 3;
const MAX_URL_LENGTH = 2083;
const ALLOWED_PORTS = new Set(["80", "443"]);
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);
const ALLOWED_CONTENT_TYPES = new Set([
    "text/html",
    "application/xhtml+xml",
]);
const ERROR_DEFINITIONS = Object.freeze({
    INVALID_PREVIEW_URL: {
        status: 400,
        message: "The preview URL is invalid.",
    },
    PREVIEW_URL_BLOCKED: {
        status: 403,
        message: "The preview URL is not allowed.",
    },
    PREVIEW_RESPONSE_TOO_LARGE: {
        status: 413,
        message: "The preview response is too large.",
    },
    UNSUPPORTED_PREVIEW_CONTENT_TYPE: {
        status: 415,
        message: "The preview response is not HTML.",
    },
    PREVIEW_REDIRECT_LIMIT: {
        status: 422,
        message: "The preview URL redirected too many times.",
    },
    PREVIEW_FETCH_FAILED: {
        status: 502,
        message: "The preview could not be fetched.",
    },
    PREVIEW_FETCH_TIMEOUT: {
        status: 504,
        message: "The preview request timed out.",
    },
});
class UrlPreviewError extends Error {
    constructor(code, options = {}) {
        const definition = ERROR_DEFINITIONS[code];
        if (!definition) {
            throw new Error(`Unknown URL preview error code: ${code}`);
        }
        super(definition.message, options.cause ? { cause: options.cause } : undefined);
        this.name = "UrlPreviewError";
        this.code = code;
        this.status = definition.status;
        this.safeTarget = options.safeTarget || null;
        this.redirectCount = options.redirectCount || 0;
    }
}
const stripIpv6Brackets = (hostname) => hostname.startsWith("[") && hostname.endsWith("]")
    ? hostname.slice(1, -1)
    : hostname;
const sanitizeUrlForLogging = (urlIn) => {
    try {
        if (typeof urlIn !== "string")
            return "[invalid-url]";
        const parsed = new URL(urlIn);
        if (!parsed.hostname)
            return "[invalid-url]";
        return parsed.origin;
    }
    catch (_error) {
        return "[invalid-url]";
    }
};
const parseAndValidateUrl = (urlIn) => {
    if (typeof urlIn !== "string" ||
        urlIn.length === 0 ||
        urlIn.length >= MAX_URL_LENGTH) {
        throw new UrlPreviewError("INVALID_PREVIEW_URL");
    }
    let parsed;
    try {
        parsed = new URL(urlIn);
    }
    catch (error) {
        throw new UrlPreviewError("INVALID_PREVIEW_URL", { cause: error });
    }
    if ((parsed.protocol !== "http:" && parsed.protocol !== "https:") ||
        !parsed.hostname ||
        parsed.username ||
        parsed.password) {
        throw new UrlPreviewError("INVALID_PREVIEW_URL", {
            safeTarget: sanitizeUrlForLogging(urlIn),
        });
    }
    const effectivePort = parsed.port || (parsed.protocol === "https:" ? "443" : "80");
    if (!ALLOWED_PORTS.has(effectivePort)) {
        throw new UrlPreviewError("INVALID_PREVIEW_URL", {
            safeTarget: parsed.origin,
        });
    }
    parsed.hash = "";
    return parsed;
};
const isPublicAddress = (address) => {
    try {
        return ipaddr.process(address).range() === "unicast";
    }
    catch (_error) {
        return false;
    }
};
const normalizeLookupResults = (results) => {
    if (!Array.isArray(results))
        return [];
    return results
        .filter((result) => result &&
        typeof result.address === "string" &&
        (result.family === 4 || result.family === 6))
        .map((result) => ({ address: result.address, family: result.family }));
};
const resolveAndValidateHost = async (url, resolver, signal) => {
    const hostname = stripIpv6Brackets(url.hostname);
    let addresses;
    if (ipaddr.isValid(hostname)) {
        const parsed = ipaddr.parse(hostname);
        addresses = [
            {
                address: hostname,
                family: parsed.kind() === "ipv6" ? 6 : 4,
            },
        ];
    }
    else {
        try {
            addresses = await raceWithSignal(resolver(hostname, { all: true, verbatim: true }), signal);
        }
        catch (error) {
            if (isTimeoutError(error, signal)) {
                throw new UrlPreviewError("PREVIEW_FETCH_TIMEOUT", {
                    cause: error,
                    safeTarget: url.origin,
                });
            }
            throw new UrlPreviewError("PREVIEW_FETCH_FAILED", {
                cause: error,
                safeTarget: url.origin,
            });
        }
    }
    const normalized = normalizeLookupResults(addresses);
    if (normalized.length === 0) {
        throw new UrlPreviewError("PREVIEW_FETCH_FAILED", {
            safeTarget: url.origin,
        });
    }
    if (!normalized.every((result) => isPublicAddress(result.address))) {
        throw new UrlPreviewError("PREVIEW_URL_BLOCKED", {
            safeTarget: url.origin,
        });
    }
    return normalized;
};
const createPinnedLookup = (addresses) => (_hostname, options, callback) => {
    const lookupOptions = typeof options === "number" ? { family: options } : options || {};
    const requestedFamily = Number(lookupOptions.family) || 0;
    const candidates = requestedFamily
        ? addresses.filter((address) => address.family === requestedFamily)
        : addresses;
    if (candidates.length === 0) {
        const error = new Error("No validated address is available for this family");
        error.code = "ENOTFOUND";
        callback(error);
        return;
    }
    if (lookupOptions.all) {
        callback(null, candidates.map((address) => ({ ...address })));
    }
    else {
        callback(null, candidates[0].address, candidates[0].family);
    }
};
const createPinnedDispatcher = ({ addresses, timeoutMs, maxBytes }) => new Agent({
    connect: {
        lookup: createPinnedLookup(addresses),
    },
    autoSelectFamily: addresses.length > 1,
    connections: 1,
    pipelining: 1,
    connectTimeout: Math.min(timeoutMs, 5000),
    headersTimeout: timeoutMs,
    bodyTimeout: timeoutMs,
    maxResponseSize: maxBytes,
});
const closeDispatcher = async (dispatcher) => {
    if (!dispatcher)
        return;
    try {
        if (typeof dispatcher.close === "function") {
            await dispatcher.close();
        }
    }
    catch (_error) {
        if (typeof dispatcher.destroy === "function") {
            dispatcher.destroy();
        }
    }
};
const cancelResponseBody = async (response) => {
    try {
        if (response.body && typeof response.body.cancel === "function") {
            await response.body.cancel();
        }
    }
    catch (_error) {
        // The per-hop dispatcher is closed immediately afterwards.
    }
};
const raceWithSignal = (promise, signal) => {
    if (!signal)
        return promise;
    if (signal.aborted)
        return Promise.reject(signal.reason);
    return new Promise((resolve, reject) => {
        const onAbort = () => reject(signal.reason);
        signal.addEventListener("abort", onAbort, { once: true });
        Promise.resolve(promise).then((value) => {
            signal.removeEventListener("abort", onAbort);
            resolve(value);
        }, (error) => {
            signal.removeEventListener("abort", onAbort);
            reject(error);
        });
    });
};
const hasErrorCode = (error, codes) => {
    const seen = new Set();
    let current = error;
    while (current && !seen.has(current)) {
        if (codes.has(current.code))
            return true;
        seen.add(current);
        current = current.cause;
    }
    return false;
};
const timeoutErrorCodes = new Set([
    "UND_ERR_CONNECT_TIMEOUT",
    "UND_ERR_HEADERS_TIMEOUT",
    "UND_ERR_BODY_TIMEOUT",
]);
const isTimeoutError = (error, signal) => signal?.aborted ||
    error?.name === "TimeoutError" ||
    error?.name === "AbortError" ||
    hasErrorCode(error, timeoutErrorCodes);
const responseTooLargeErrorCodes = new Set([
    "UND_ERR_RES_EXCEEDED_MAX_SIZE",
]);
const isResponseTooLargeError = (error) => hasErrorCode(error, responseTooLargeErrorCodes);
const readBoundedBody = async (response, maxBytes) => {
    const declaredLength = Number(response.headers.get("content-length"));
    if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
        await cancelResponseBody(response);
        throw new UrlPreviewError("PREVIEW_RESPONSE_TOO_LARGE");
    }
    if (!response.body) {
        throw new UrlPreviewError("PREVIEW_FETCH_FAILED");
    }
    const chunks = [];
    let size = 0;
    for await (const chunk of response.body) {
        const buffer = Buffer.from(chunk);
        size += buffer.length;
        if (size > maxBytes) {
            throw new UrlPreviewError("PREVIEW_RESPONSE_TOO_LARGE");
        }
        chunks.push(buffer);
    }
    return { buffer: Buffer.concat(chunks, size), size };
};
const decodeHtml = (buffer, contentType) => {
    const charsetMatch = /charset\s*=\s*["']?([^;"'\s]+)/i.exec(contentType);
    const encoding = getEncoding(buffer, {
        transportLayerEncodingLabel: charsetMatch?.[1],
        defaultEncoding: "utf-8",
    });
    return iconv.decode(buffer, encoding);
};
const fetchPublicHtml = async (urlIn, options = {}) => {
    const timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;
    const maxBytes = options.maxBytes || DEFAULT_MAX_BYTES;
    const maxRedirects = options.maxRedirects ?? DEFAULT_MAX_REDIRECTS;
    const resolver = options.resolver || dns.promises.lookup;
    const fetchFn = options.fetchFn || fetch;
    const dispatcherFactory = options.dispatcherFactory || createPinnedDispatcher;
    const signal = options.signal || AbortSignal.timeout(timeoutMs);
    const requestUrl = parseAndValidateUrl(urlIn).toString();
    let currentUrl = new URL(requestUrl);
    let redirectCount = 0;
    while (true) {
        currentUrl = parseAndValidateUrl(currentUrl.toString());
        const addresses = await resolveAndValidateHost(currentUrl, resolver, signal);
        const dispatcher = dispatcherFactory({ addresses, timeoutMs, maxBytes });
        let response;
        try {
            response = await fetchFn(currentUrl, {
                method: "GET",
                dispatcher,
                redirect: "manual",
                signal,
                headers: {
                    accept: "text/html,application/xhtml+xml",
                    "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
                },
            });
            if (REDIRECT_STATUSES.has(response.status)) {
                const location = response.headers.get("location");
                await cancelResponseBody(response);
                if (!location) {
                    throw new UrlPreviewError("PREVIEW_FETCH_FAILED", {
                        safeTarget: currentUrl.origin,
                        redirectCount,
                    });
                }
                if (redirectCount >= maxRedirects) {
                    throw new UrlPreviewError("PREVIEW_REDIRECT_LIMIT", {
                        safeTarget: currentUrl.origin,
                        redirectCount,
                    });
                }
                try {
                    currentUrl = new URL(location, currentUrl);
                }
                catch (error) {
                    throw new UrlPreviewError("INVALID_PREVIEW_URL", {
                        cause: error,
                        safeTarget: currentUrl.origin,
                        redirectCount,
                    });
                }
                redirectCount += 1;
                continue;
            }
            if (response.status < 200 || response.status >= 300) {
                await cancelResponseBody(response);
                throw new UrlPreviewError("PREVIEW_FETCH_FAILED", {
                    safeTarget: currentUrl.origin,
                    redirectCount,
                });
            }
            const contentTypeHeader = response.headers.get("content-type") || "";
            const contentType = contentTypeHeader.split(";", 1)[0].trim().toLowerCase();
            if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
                await cancelResponseBody(response);
                throw new UrlPreviewError("UNSUPPORTED_PREVIEW_CONTENT_TYPE", {
                    safeTarget: currentUrl.origin,
                    redirectCount,
                });
            }
            const { buffer, size } = await readBoundedBody(response, maxBytes);
            return {
                html: decodeHtml(buffer, contentTypeHeader),
                requestUrl,
                finalUrl: currentUrl.toString(),
                redirectCount,
                responseBytes: size,
            };
        }
        catch (error) {
            if (error instanceof UrlPreviewError)
                throw error;
            if (isResponseTooLargeError(error)) {
                throw new UrlPreviewError("PREVIEW_RESPONSE_TOO_LARGE", {
                    cause: error,
                    safeTarget: currentUrl.origin,
                    redirectCount,
                });
            }
            if (isTimeoutError(error, signal)) {
                throw new UrlPreviewError("PREVIEW_FETCH_TIMEOUT", {
                    cause: error,
                    safeTarget: currentUrl.origin,
                    redirectCount,
                });
            }
            throw new UrlPreviewError("PREVIEW_FETCH_FAILED", {
                cause: error,
                safeTarget: currentUrl.origin,
                redirectCount,
            });
        }
        finally {
            await closeDispatcher(dispatcher);
        }
    }
};
const getUrlPreview = async (urlIn, options = {}) => {
    const fetched = await fetchPublicHtml(urlIn, options);
    const scraper = options.scraper || ogs;
    try {
        const data = await scraper({ html: fetched.html });
        if (data.error || !data.result) {
            throw new Error("Open Graph parsing failed");
        }
        data.result.requestUrl = fetched.requestUrl;
        return {
            result: data.result,
            requestUrl: fetched.requestUrl,
            finalUrl: fetched.finalUrl,
            redirectCount: fetched.redirectCount,
            responseBytes: fetched.responseBytes,
        };
    }
    catch (error) {
        if (error instanceof UrlPreviewError)
            throw error;
        throw new UrlPreviewError("PREVIEW_FETCH_FAILED", {
            cause: error,
            safeTarget: sanitizeUrlForLogging(fetched.finalUrl),
            redirectCount: fetched.redirectCount,
        });
    }
};
module.exports = {
    DEFAULT_MAX_BYTES,
    DEFAULT_MAX_REDIRECTS,
    DEFAULT_TIMEOUT_MS,
    UrlPreviewError,
    createPinnedLookup,
    fetchPublicHtml,
    getUrlPreview,
    isPublicAddress,
    parseAndValidateUrl,
    sanitizeUrlForLogging,
};
