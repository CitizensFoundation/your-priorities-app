import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { collectContainerStorageSnapshot, directoryUsageBytes } from "../../docker/containerStorage.js";
import { dockerStatsArgs, parseByteSize, parseDockerStatsOutput } from "../../docker/containerStats.js";
const Targets = [
    { containerName: "yp-live-workflow-session-aaa", sessionId: "session-aaa", runId: "run-1" },
    { containerName: "yp-live-workflow-session-bbb", sessionId: "session-bbb", runId: "run-2" },
];
test("docker stats args request one non-streaming json sample per container", () => {
    assert.deepEqual(dockerStatsArgs(["a", "b"]), [
        "stats",
        "--no-stream",
        "--format",
        "{{json .}}",
        "a",
        "b",
    ]);
});
test("docker stats output parses into per-session container snapshots", () => {
    const stdout = [
        JSON.stringify({
            Name: "yp-live-workflow-session-aaa",
            CPUPerc: "42.75%",
            MemPerc: "12.5%",
            MemUsage: "512MiB / 8GiB",
        }),
        JSON.stringify({
            Name: "yp-live-workflow-session-bbb",
            CPUPerc: "0.03%",
            MemPerc: "1.27%",
            MemUsage: "99.38MiB / 7.667GiB",
        }),
    ].join("\n");
    const snapshots = parseDockerStatsOutput(stdout, Targets);
    assert.equal(snapshots.length, 2);
    assert.deepEqual(snapshots[0], {
        containerName: "yp-live-workflow-session-aaa",
        sessionId: "session-aaa",
        runId: "run-1",
        cpuPercent: 42.75,
        memoryBytes: 512 * 1024 ** 2,
        memoryLimitBytes: 8 * 1024 ** 3,
        memoryPercent: 12.5,
    });
    assert.equal(snapshots[1].cpuPercent, 0.03);
    assert.equal(snapshots[1].memoryBytes, Math.round(99.38 * 1024 ** 2));
});
test("docker stats output skips unknown containers, blank lines, and garbage", () => {
    const stdout = [
        "",
        "not json",
        JSON.stringify({ Name: "some-other-container", CPUPerc: "90%", MemUsage: "1GiB / 2GiB" }),
        JSON.stringify({ Name: "yp-live-workflow-session-aaa", CPUPerc: "5%", MemUsage: "100MiB / 1GiB" }),
    ].join("\n");
    const snapshots = parseDockerStatsOutput(stdout, Targets);
    assert.equal(snapshots.length, 1);
    assert.equal(snapshots[0].containerName, "yp-live-workflow-session-aaa");
});
test("docker stats output tolerates missing fields", () => {
    const stdout = JSON.stringify({ Name: "yp-live-workflow-session-aaa" });
    const snapshots = parseDockerStatsOutput(stdout, Targets);
    assert.equal(snapshots.length, 1);
    assert.equal(snapshots[0].cpuPercent, null);
    assert.equal(snapshots[0].memoryBytes, null);
    assert.equal(snapshots[0].memoryLimitBytes, null);
    assert.equal(snapshots[0].memoryPercent, null);
});
test("byte sizes parse binary and decimal docker units", () => {
    assert.equal(parseByteSize("0B"), 0);
    assert.equal(parseByteSize("117B"), 117);
    assert.equal(parseByteSize("1.5KiB"), 1536);
    assert.equal(parseByteSize("2MiB"), 2 * 1024 ** 2);
    assert.equal(parseByteSize("7.667GiB"), Math.round(7.667 * 1024 ** 3));
    assert.equal(parseByteSize("1.2kB"), 1200);
    assert.equal(parseByteSize("3GB"), 3 * 1000 ** 3);
    assert.equal(parseByteSize("nonsense"), null);
    assert.equal(parseByteSize(""), null);
});
test("directory usage sums nested file bytes without following symlinks", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-container-storage-"));
    try {
        await fs.mkdir(path.join(root, "nested"), { recursive: true });
        await fs.writeFile(path.join(root, "a.txt"), Buffer.alloc(7));
        await fs.writeFile(path.join(root, "nested", "b.txt"), Buffer.alloc(11));
        await fs.symlink(path.join(root, "a.txt"), path.join(root, "a-link"));
        const linkSize = (await fs.lstat(path.join(root, "a-link"))).size;
        assert.equal(await directoryUsageBytes(root), 18 + linkSize);
    }
    finally {
        await fs.rm(root, { recursive: true, force: true });
    }
});
test("directory usage bytes stays exact without explicit scan limits", async () => {
    const entries = Array.from({ length: 2100 }, (_value, index) => ({ name: `file-${index}.txt` }));
    assert.equal(await directoryUsageBytes("/root", {
        lstat: async (targetPath) => ({
            size: targetPath === "/root" ? 0 : 1,
            isDirectory: () => targetPath === "/root",
        }),
        readdir: async () => entries,
        now: () => 1000,
    }), entries.length);
});
test("container storage snapshot reports writable mounts and read-only datasets", async () => {
    const lstatSizes = new Map([
        ["/host/artifacts", { size: 0, directory: true }],
        ["/host/artifacts/result.txt", { size: 42, directory: false }],
    ]);
    const snapshot = await collectContainerStorageSnapshot({
        writableMounts: [
            { hostPath: "/host/artifacts", containerPath: "/artifacts", role: "artifacts" },
            { hostPath: "/host/missing", containerPath: "/cache", role: "cache" },
        ],
        datasetMounts: [{
                containerPath: "/datasets/reference",
                datasetVersionId: "dataset-version-1",
                name: "reference",
                versionLabel: "v1",
                readOnly: true,
                sizeBytes: 5000,
            }],
    }, {
        lstat: async (targetPath) => {
            const record = lstatSizes.get(targetPath);
            if (!record) {
                const error = new Error("not found");
                error.code = "ENOENT";
                throw error;
            }
            return {
                size: record.size,
                isDirectory: () => record.directory,
            };
        },
        readdir: async (targetPath) => {
            assert.equal(targetPath, "/host/artifacts");
            return [{ name: "result.txt" }];
        },
        statfs: async (targetPath) => {
            if (targetPath === "/host/missing") {
                const error = new Error("not found");
                error.code = "ENOENT";
                throw error;
            }
            return { blocks: 10, bsize: 100, bavail: 6 };
        },
    });
    assert.deepEqual(snapshot.writableMounts, [
        {
            containerPath: "/artifacts",
            role: "artifacts",
            readOnly: false,
            usedBytes: 42,
            totalBytes: 1000,
            availableBytes: 600,
        },
        {
            containerPath: "/cache",
            role: "cache",
            readOnly: false,
            error: "not_found",
        },
    ]);
    assert.deepEqual(snapshot.datasetMounts, [{
            containerPath: "/datasets/reference",
            datasetVersionId: "dataset-version-1",
            name: "reference",
            versionLabel: "v1",
            readOnly: true,
            sizeBytes: 5000,
        }]);
});
test("container storage snapshot marks bounded scans as limited", async () => {
    const snapshot = await collectContainerStorageSnapshot({
        writableMounts: [
            { hostPath: "/host/workspace", containerPath: "/workspace", role: "workspace" },
        ],
    }, {
        maxEntries: 2,
        maxElapsedMs: 10000,
        lstat: async (targetPath) => ({
            size: targetPath.endsWith("one.txt") ? 5 : 7,
            isDirectory: () => targetPath === "/host/workspace",
        }),
        readdir: async () => [{ name: "one.txt" }, { name: "two.txt" }],
        statfs: async () => ({ blocks: 10, bsize: 100, bavail: 6 }),
    });
    assert.deepEqual(snapshot.writableMounts, [{
            containerPath: "/workspace",
            role: "workspace",
            readOnly: false,
            usedBytes: 5,
            truncated: true,
            error: "scan_limited",
            totalBytes: 1000,
            availableBytes: 600,
        }]);
});
