export function jsonRecord(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return {};
    }
    return value;
}
export function stringValue(value) {
    return typeof value === "string" && value.length > 0 ? value : null;
}
export function withoutNullish(value) {
    const result = {};
    for (const [key, entry] of Object.entries(value)) {
        if (entry !== undefined && entry !== null) {
            result[key] = entry;
        }
    }
    return result;
}
