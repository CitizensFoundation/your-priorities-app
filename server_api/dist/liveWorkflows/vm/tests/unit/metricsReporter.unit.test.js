import assert from "node:assert/strict";
import test from "node:test";
import { MetricsReporter, parseNvidiaSmiOutput } from "../../metrics/metricsReporter.js";
const MiB = 1024 ** 2;
test("nvidia-smi telemetry preserves and orders every GPU", () => {
    const snapshot = parseNvidiaSmiOutput([
        '1, GPU-b, "NVIDIA L4, secondary", 4, 1024, 24576',
        "0, GPU-a, NVIDIA L4, 37, 2048, 24576",
    ].join("\n"));
    assert.equal(snapshot.available, true);
    assert.equal(snapshot.status, "ok");
    assert.equal(snapshot.deviceCount, 2);
    assert.equal(snapshot.utilizationPercent, 37);
    assert.deepEqual(snapshot.devices, [{
            index: 0,
            uuid: "GPU-a",
            name: "NVIDIA L4",
            utilizationPercent: 37,
            memoryUsedBytes: 2048 * MiB,
            memoryTotalBytes: 24576 * MiB,
        }, {
            index: 1,
            uuid: "GPU-b",
            name: "NVIDIA L4, secondary",
            utilizationPercent: 4,
            memoryUsedBytes: 1024 * MiB,
            memoryTotalBytes: 24576 * MiB,
        }]);
});
test("nvidia-smi telemetry keeps unsupported metrics nullable", () => {
    const snapshot = parseNvidiaSmiOutput("0, GPU-a, NVIDIA L4, N/A, [Not Supported], N/A");
    assert.equal(snapshot.utilizationPercent, undefined);
    assert.deepEqual(snapshot.devices[0], {
        index: 0,
        uuid: "GPU-a",
        name: "NVIDIA L4",
        utilizationPercent: null,
        memoryUsedBytes: null,
        memoryTotalBytes: null,
    });
});
test("nvidia-smi telemetry distinguishes no devices from malformed output", () => {
    assert.deepEqual(parseNvidiaSmiOutput("\n"), {
        available: false,
        status: "unavailable",
        deviceCount: 0,
        devices: [],
    });
    assert.throws(() => parseNvidiaSmiOutput("not,a,valid,row"), /field count/u);
});
test("GPU probe failures do not suppress system and volume telemetry", async () => {
    const reporter = new MetricsReporter({
        hostname: () => "vm-a",
        platform: () => "linux",
        arch: () => "x64",
        cpus: () => [],
        loadavg: () => [0, 0, 0],
        uptime: () => 1,
        totalmem: () => 1000,
        freemem: () => 500,
        statfs: async () => ({ blocks: 10, bsize: 100, bavail: 4 }),
        gpuProbe: async () => {
            throw new Error("probe failed");
        },
    });
    const snapshot = await reporter.collectSnapshot({ workspaceRoot: "/workspace", archiveRoot: "/archive" });
    assert.equal(snapshot.system.hostname, "vm-a");
    assert.equal(snapshot.volumes.length, 2);
    assert.deepEqual(snapshot.telemetry.gpu, {
        available: false,
        status: "error",
        deviceCount: 0,
        devices: [],
    });
});
