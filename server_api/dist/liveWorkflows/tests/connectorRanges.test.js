import test from "node:test";
import assert from "node:assert/strict";
import { sheetsWriteRange } from "../connectorRanges.js";
test("chunked Sheets exports stay within the approved row and column rectangle", () => {
    assert.equal(sheetsWriteRange("'Results 2026'!B2:H100", 2, [["a"], ["b"]]), "'Results 2026'!B4:H5");
    assert.equal(sheetsWriteRange("A:ZZ", 1000, [["a"]]), "A1001:ZZ1001");
    assert.throws(() => sheetsWriteRange("A1:G2", 2, [["a"]]), /exceeds/);
    assert.throws(() => sheetsWriteRange("B2:C10", 0, [[1, 2, 3]]), /exceeds/);
    assert.throws(() => sheetsWriteRange("A1", 0, [[1], [2]]), /exceeds/);
    assert.throws(() => sheetsWriteRange("A:Z", -1, [[1]]), /nonnegative/);
    assert.throws(() => sheetsWriteRange("named-range", 0, [[1]]), /A1 range/);
});
