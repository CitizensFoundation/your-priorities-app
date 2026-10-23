import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { DatasetManager } from "../../datasets/datasetManager.js";
test("Dataset manager returns checksums only for assets that declare them", async () => {
    const hotRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-datasets-hot-"));
    const sourcePath = path.join(hotRoot, "outputs", "groups", "201", "experiments", "dataset", "reference");
    const checksummedContent = "gene\tvalue\nHDAC1\t1\n";
    const declaredChecksum = createHash("sha256").update(checksummedContent).digest("hex");
    try {
        await fs.mkdir(sourcePath, { recursive: true });
        await fs.writeFile(path.join(sourcePath, "checksummed.tsv"), checksummedContent);
        await fs.writeFile(path.join(sourcePath, "unchecksummed.tsv"), "gene\tvalue\nTP53\t2\n");
        const manager = new DatasetManager({ hotRoot });
        const result = await manager.validateHotDataset({
            sourcePath,
            allowedSourceRootPath: hotRoot,
            expectedFiles: ["checksummed.tsv", "unchecksummed.tsv"],
            assets: [
                {
                    relativePath: "checksummed.tsv",
                    checksumSha256: declaredChecksum,
                },
                {
                    relativePath: "unchecksummed.tsv",
                },
            ],
        });
        const filesByPath = new Map(result.files.map((file) => [file.relativePath, file]));
        assert.equal(filesByPath.get("checksummed.tsv")?.checksumSha256, declaredChecksum);
        assert.equal(filesByPath.get("unchecksummed.tsv")?.checksumSha256, null);
        assert.deepEqual(result.checksumFailures, []);
        assert.deepEqual(result.missingAssetFiles, []);
        assert.deepEqual(result.missingExpectedFiles, []);
    }
    finally {
        await fs.rm(hotRoot, { recursive: true, force: true });
    }
});
