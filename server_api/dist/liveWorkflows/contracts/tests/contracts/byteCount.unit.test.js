import assert from "node:assert/strict";
import test from "node:test";
import { ByteCountSchema, DatasetVersionSchema } from "../../index.js";
test("byte counts normalize decimal persistence strings to safe integers", () => {
    assert.equal(ByteCountSchema.parse(0), 0);
    assert.equal(ByteCountSchema.parse("5000"), 5000);
    assert.equal(ByteCountSchema.parse(String(Number.MAX_SAFE_INTEGER)), Number.MAX_SAFE_INTEGER);
    const version = DatasetVersionSchema.parse({
        id: "dataset-version-1",
        datasetId: "dataset-1",
        versionLabel: "v1",
        sizeBytes: "5000",
        logicalSizeBytes: "4000",
        physicalSizeBytes: 3000,
        fileCount: null,
        componentCount: null,
        versionKind: "raw",
        verificationStatus: "unverified",
        completenessStatus: "complete",
        accessLevel: "unknown",
        license: null,
        status: "available",
        metadata: {},
        createdAt: "2026-07-18T00:00:00.000Z",
        updatedAt: "2026-07-18T00:00:00.000Z",
    });
    assert.equal(version.sizeBytes, 5000);
    assert.equal(typeof version.sizeBytes, "number");
    assert.equal(version.logicalSizeBytes, 4000);
});
test("byte counts reject malformed, fractional, negative, and unsafe values", () => {
    for (const value of ["", "1.5", "-1", "1e3", -1, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
        assert.equal(ByteCountSchema.safeParse(value).success, false, String(value));
    }
    assert.equal(ByteCountSchema.safeParse((BigInt(Number.MAX_SAFE_INTEGER) + 1n).toString()).success, false);
});
