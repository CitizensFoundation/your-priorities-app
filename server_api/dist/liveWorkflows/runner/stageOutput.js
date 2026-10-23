import { createHash } from "node:crypto";
export function stageChunks(value) {
    const text = JSON.stringify(value);
    if (Buffer.byteLength(text) > 128 * 1024 ** 2)
        throw new Error("Stage output exceeds 128 MiB; split the dataset");
    const chunks = [];
    for (let start = 0; start < text.length;) {
        let end = Math.min(start + 200000, text.length);
        if (end < text.length && /[\uD800-\uDBFF]/.test(text[end - 1]))
            end--;
        chunks.push(text.slice(start, end));
        start = end;
    }
    return { chunks, checksum: createHash("sha256").update(text).digest("hex") };
}
export function decodeStage(chunks, output) {
    if (chunks.length !== output.assets.length)
        throw new Error("Missing stage snapshot chunks");
    for (const [part, chunk] of chunks.entries())
        if (Buffer.byteLength(chunk) !== output.assets[part].bytes ||
            createHash("sha256").update(chunk).digest("hex") !==
                output.assets[part].checksum)
            throw new Error("Stage snapshot chunk checksum mismatch");
    const content = chunks.join("");
    if (Buffer.byteLength(content) > 128 * 1024 ** 2 ||
        createHash("sha256").update(content).digest("hex") !== output.checksum)
        throw new Error("Stage snapshot checksum mismatch");
    return JSON.parse(content);
}
