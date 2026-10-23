import { ValidationError } from "../services/errors.js";
/** Stable chunking keeps retries idempotent and avoids huge API/DB payloads. */
export function resultChunks(output) {
    const values = Array.isArray(output) ? output : [output];
    const chunks = [];
    let rows = [], bytes = 2;
    for (const value of values) {
        const row = JSON.stringify(value && typeof value === "object" && !Array.isArray(value)
            ? value
            : { value });
        const size = Buffer.byteLength(row) + 1;
        if (size + 2 > 1048576)
            throw new ValidationError("A result record exceeds 1 MiB; put large contents in a separate artifact");
        if (rows.length && (rows.length === 100 || bytes + size > 1048576)) {
            chunks.push(`[${rows.join(",")}]`);
            rows = [];
            bytes = 2;
        }
        rows.push(row);
        bytes += size;
    }
    if (rows.length || !chunks.length)
        chunks.push(`[${rows.join(",")}]`);
    return chunks;
}
