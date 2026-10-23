import assert from "node:assert/strict";
import test from "node:test";
import { LiveUpdatedEventDataSchema } from "../../live.js";
test("live invalidations carry an optional infographic job identity", () => {
    const parsed = LiveUpdatedEventDataSchema.parse({
        groupId: 42,
        infographicJobId: "40000000-0000-4000-8000-000000000001",
        parentScopes: [
            { type: "domain", id: "7" },
            { type: "community", id: "8" },
            { type: "group", id: "42" },
        ],
        reason: "infographic_job",
        scope: { type: "group", id: "42" },
        updatedAt: "2026-08-03T12:00:00.000Z",
    });
    assert.equal(parsed.infographicJobId, "40000000-0000-4000-8000-000000000001");
});
