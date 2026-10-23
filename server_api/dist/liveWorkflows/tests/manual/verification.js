import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { z } from "zod";
export const analysisNames = [
    "degrees",
    "evidence",
    "mandatory",
    "licenses",
    "barriers",
    "consistency",
    "readingLevel",
];
export function exportedJobs(value) {
    const rows = Array.isArray(value)
        ? value
        : value && typeof value === "object"
            ? value.jobDescriptions
            : undefined;
    assert.ok(Array.isArray(rows), "Expected a Skills First memory export or result array");
    return rows;
}
/** Structural acceptance, not a claim that a model's employment advice is correct. */
export function verifySkillsFirstOutput(input, output) {
    output = exportedJobs(output);
    const rows = z
        .array(z.object({
        id: z.string(),
        name: z.string(),
        originalText: z.string(),
        errors: z.array(z.string()),
        status: z.enum(["complete", "unknown"]),
        rewrittenText: z.string().optional(),
        analysis: z.record(z.string(), z.unknown()),
    }))
        .parse(output);
    assert.equal(rows.length, input.length, "Every single-level input must have one result");
    assert.equal(new Set(rows.map((row) => row.id)).size, input.length, "Result IDs must be unique");
    for (const original of input) {
        const row = rows.find((candidate) => candidate.id === original.id);
        assert.ok(row, `Missing job ${original.id}`);
        assert.equal(row.name, original.name);
        assert.equal(row.originalText, original.text, "Original text changed");
        assert.deepEqual(row.errors, [], `Processing failed for ${original.id}`);
        assert.ok(["complete", "unknown"].includes(row.status));
        assert.equal(typeof row.rewrittenText, "string");
        assert.ok(row.rewrittenText?.trim(), `Missing proposed rewrite for ${original.id}`);
        for (const name of analysisNames) {
            assert.ok(row.analysis[name], `Missing ${name} analysis for ${original.id}`);
            const analysis = z
                .object({
                status: z.enum(["known", "unknown"]),
                evidence: z.array(z.string()),
            })
                .parse(row.analysis[name]);
            for (const quote of analysis.evidence)
                assert.ok(typeof quote === "string" &&
                    quote.trim() &&
                    original.text.includes(quote), "Analysis contains an unsupported quotation");
        }
    }
    return {
        records: rows.length,
        unknown: rows.filter((row) => row.status === "unknown").length,
    };
}
export function verifyDownload(asset, data) {
    assert.equal(data.length, asset.bytes, "Download size differs from stored metadata");
    assert.equal(createHash("sha256").update(data).digest("hex"), asset.checksum, "Downloaded bytes differ from the stored artifact");
}
