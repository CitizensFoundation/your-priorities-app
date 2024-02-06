"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parseDomain = (urlPath) => {
    const results = {};
    const splitPath = urlPath.split(".");
    results.domain = splitPath[splitPath.length - 2];
    results.tld = splitPath[splitPath.length - 1];
    const subDomainSplit = urlPath.split('.' + results.domain + '.' + results.tld);
    if (subDomainSplit && subDomainSplit.length > 1) {
        results.subdomain = subDomainSplit[0];
    }
    else {
        results.subdomain = "";
    }
    return results;
};
module.exports = parseDomain;
