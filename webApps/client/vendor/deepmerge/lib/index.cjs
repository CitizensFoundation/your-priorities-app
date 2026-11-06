"use strict";
// Derived from deepmerge 4.3.1 and is-mergeable-object 1.1.0 (MIT).
// Edit this TypeScript source; regenerate lib/ with npm run build:deepmerge.
// See README.md for provenance and the two __proto__ guards added locally.
function defaultIsMergeableObject(value) {
    if (!value || typeof value !== "object")
        return false;
    const tag = Object.prototype.toString.call(value);
    return tag !== "[object RegExp]" && tag !== "[object Date]" &&
        value.$$typeof !== Symbol.for("react.element");
}
function emptyTarget(value) {
    return Array.isArray(value) ? [] : {};
}
function cloneUnlessOtherwiseSpecified(value, options) {
    const configured = options;
    return configured.clone !== false && configured.isMergeableObject(value)
        ? deepmerge(emptyTarget(value), value, configured)
        : value;
}
function defaultArrayMerge(target, source, options) {
    return target.concat(source).map((element) => cloneUnlessOtherwiseSpecified(element, options));
}
function getMergeFunction(key, options) {
    if (!options.customMerge)
        return deepmerge;
    // Upstream's public types use string; enumerable symbols are also passed
    // through unchanged at runtime, as in deepmerge 4.3.1.
    const customMerge = options.customMerge(key);
    return typeof customMerge === "function" ? customMerge : deepmerge;
}
function getKeys(target) {
    return Object.keys(target).concat(Object.getOwnPropertySymbols(target).filter((symbol) => Object.prototype.propertyIsEnumerable.call(target, symbol)));
}
function propertyIsOnObject(object, property) {
    try {
        return property in object;
    }
    catch {
        return false;
    }
}
function propertyIsUnsafe(target, key) {
    // A null-prototype target or an own enumerable key can bypass the upstream
    // guard. Never write this key to the ordinary destination object.
    return key === "__proto__" || (propertyIsOnObject(target, key) &&
        !(Object.prototype.hasOwnProperty.call(target, key) &&
            Object.prototype.propertyIsEnumerable.call(target, key)));
}
function mergeObject(target, source, options) {
    const destination = {};
    if (options.isMergeableObject(target)) {
        getKeys(target).forEach((key) => {
            // The target-copy path needs its own guard, before reading the value.
            if (key === "__proto__")
                return;
            destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
        });
    }
    getKeys(source).forEach((key) => {
        if (propertyIsUnsafe(target, key))
            return;
        if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
            destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
        }
        else {
            destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
        }
    });
    return destination;
}
function deepmerge(target, source, options) {
    const configured = (options || {});
    configured.arrayMerge = configured.arrayMerge || defaultArrayMerge;
    configured.isMergeableObject = configured.isMergeableObject || defaultIsMergeableObject;
    configured.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;
    const sourceIsArray = Array.isArray(source);
    const targetIsArray = Array.isArray(target);
    if (sourceIsArray !== targetIsArray) {
        return cloneUnlessOtherwiseSpecified(source, configured);
    }
    else if (sourceIsArray) {
        return configured.arrayMerge(target, source, configured);
    }
    else {
        return mergeObject(target, source, configured);
    }
}
(function (deepmerge) {
    function all(objects, options) {
        if (!Array.isArray(objects))
            throw new Error("first argument should be an array");
        return objects.reduce((previous, next) => deepmerge(previous, next, options), {});
    }
    deepmerge.all = all;
})(deepmerge || (deepmerge = {}));
module.exports = deepmerge;
