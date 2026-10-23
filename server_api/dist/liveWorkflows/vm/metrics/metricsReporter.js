import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import { promisify } from "node:util";
const execFileAsync = promisify(execFile);
const NvidiaSmiTimeoutMs = 3000;
const Mebibyte = 1024 ** 2;
const NvidiaSmiArgs = [
    "--query-gpu=index,uuid,name,utilization.gpu,memory.used,memory.total",
    "--format=csv,noheader,nounits",
];
export class MetricsReporter {
    constructor(options = {}) {
        this.reportsCpuMemoryDisk = true;
        this.probes = {
            hostname: options.hostname ?? os.hostname,
            platform: options.platform ?? os.platform,
            arch: options.arch ?? os.arch,
            cpus: options.cpus ?? os.cpus,
            loadavg: options.loadavg ?? os.loadavg,
            uptime: options.uptime ?? os.uptime,
            totalmem: options.totalmem ?? os.totalmem,
            freemem: options.freemem ?? os.freemem,
            statfs: options.statfs ?? ((targetPath) => fs.statfs(targetPath)),
            gpuProbe: options.gpuProbe ?? probeNvidiaSmi,
        };
    }
    async collectSnapshot(input) {
        const cpus = this.probes.cpus();
        const system = {
            hostname: this.probes.hostname(),
            platform: this.probes.platform(),
            arch: this.probes.arch(),
            cpuCount: cpus.length,
            cpuModel: cpus[0]?.model ?? null,
            loadAverage: this.probes.loadavg(),
            uptimeSeconds: this.probes.uptime(),
            totalMemoryBytes: this.probes.totalmem(),
            freeMemoryBytes: this.probes.freemem(),
        };
        const [volumes, gpu] = await Promise.all([
            this.collectVolumes(input),
            this.collectGpu(),
        ]);
        return {
            system,
            volumes,
            telemetry: {
                system,
                gpu,
            },
        };
    }
    async collectGpu() {
        try {
            const output = await this.probes.gpuProbe();
            return parseNvidiaSmiOutput(output);
        }
        catch {
            return unavailableGpu("error");
        }
    }
    async collectVolumes(input) {
        const snapshots = await Promise.all([
            this.collectVolume(input.workspaceRoot, "workspace"),
            this.collectVolume(input.archiveRoot, "archive"),
        ]);
        return snapshots.filter((snapshot) => snapshot !== null);
    }
    async collectVolume(mountPath, role) {
        try {
            const stats = await this.probes.statfs(mountPath);
            return {
                mountPath,
                role,
                totalBytes: stats.blocks * stats.bsize,
                availableBytes: stats.bavail * stats.bsize,
            };
        }
        catch (error) {
            if (isNotFoundError(error)) {
                return null;
            }
            throw error;
        }
    }
}
async function probeNvidiaSmi() {
    const result = await execFileAsync("nvidia-smi", NvidiaSmiArgs, {
        encoding: "utf8",
        maxBuffer: 256 * 1024,
        timeout: NvidiaSmiTimeoutMs,
    });
    return result.stdout;
}
export function parseNvidiaSmiOutput(output) {
    const lines = output.split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
    if (lines.length === 0) {
        return unavailableGpu("unavailable");
    }
    const devices = lines.map(parseNvidiaSmiDevice).sort((left, right) => left.index - right.index);
    const utilizationValues = devices
        .map((device) => device.utilizationPercent)
        .filter((value) => value !== null);
    return {
        available: true,
        status: "ok",
        deviceCount: devices.length,
        ...(utilizationValues.length > 0 ? { utilizationPercent: Math.max(...utilizationValues) } : {}),
        devices,
    };
}
function parseNvidiaSmiDevice(line) {
    const fields = parseCsvRow(line).map((value) => value.trim());
    if (fields.length !== 6) {
        throw new Error("Unexpected nvidia-smi GPU field count");
    }
    const [indexValue, uuid, name, utilizationValue, memoryUsedValue, memoryTotalValue] = fields;
    const index = Number(indexValue);
    if (!Number.isInteger(index) || index < 0 || !uuid || !name) {
        throw new Error("Invalid nvidia-smi GPU identity");
    }
    return {
        index,
        uuid,
        name,
        utilizationPercent: optionalFiniteNumber(utilizationValue, { minimum: 0, maximum: 100 }),
        memoryUsedBytes: optionalFiniteNumber(memoryUsedValue, { minimum: 0, multiplier: Mebibyte }),
        memoryTotalBytes: optionalFiniteNumber(memoryTotalValue, { minimum: 0, multiplier: Mebibyte }),
    };
}
function parseCsvRow(line) {
    const values = [];
    let value = "";
    let quoted = false;
    for (let index = 0; index < line.length; index += 1) {
        const character = line[index];
        if (character === '"') {
            if (quoted && line[index + 1] === '"') {
                value += '"';
                index += 1;
            }
            else {
                quoted = !quoted;
            }
        }
        else if (character === "," && !quoted) {
            values.push(value);
            value = "";
        }
        else {
            value += character;
        }
    }
    if (quoted) {
        throw new Error("Unterminated nvidia-smi CSV field");
    }
    values.push(value);
    return values;
}
function optionalFiniteNumber(value, options) {
    if (!value || value.toLowerCase() === "n/a" || value === "[Not Supported]") {
        return null;
    }
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < options.minimum ||
        (options.maximum !== undefined && parsed > options.maximum)) {
        return null;
    }
    return parsed * (options.multiplier ?? 1);
}
function unavailableGpu(status) {
    return {
        available: false,
        status,
        deviceCount: 0,
        devices: [],
    };
}
function isNotFoundError(error) {
    return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}
