export function dockerStatsArgs(containerNames) {
    return ["stats", "--no-stream", "--format", "{{json .}}", ...containerNames];
}
/**
 * Parses `docker stats --no-stream --format '{{json .}}'` output (one JSON
 * object per line) into telemetry snapshots, keeping only the requested
 * containers and tagging each with its session/run.
 */
export function parseDockerStatsOutput(stdout, targets) {
    const targetsByName = new Map(targets.map((target) => [target.containerName, target]));
    const snapshots = [];
    for (const line of stdout.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed) {
            continue;
        }
        let parsed;
        try {
            parsed = JSON.parse(trimmed);
        }
        catch {
            continue;
        }
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
            continue;
        }
        const record = parsed;
        const name = typeof record.Name === "string" ? record.Name : "";
        const target = targetsByName.get(name);
        if (!target) {
            continue;
        }
        const memory = parseMemUsage(typeof record.MemUsage === "string" ? record.MemUsage : "");
        snapshots.push({
            containerName: name,
            sessionId: target.sessionId ?? null,
            runId: target.runId ?? null,
            cpuPercent: parsePercent(record.CPUPerc),
            memoryBytes: memory.usedBytes,
            memoryLimitBytes: memory.limitBytes,
            memoryPercent: parsePercent(record.MemPerc),
        });
    }
    return snapshots;
}
function parsePercent(value) {
    if (typeof value !== "string") {
        return null;
    }
    const parsed = Number.parseFloat(value.replace("%", "").trim());
    return Number.isFinite(parsed) ? parsed : null;
}
function parseMemUsage(value) {
    const [used, limit] = value.split("/").map((part) => part.trim());
    return {
        usedBytes: used ? parseByteSize(used) : null,
        limitBytes: limit ? parseByteSize(limit) : null,
    };
}
const ByteUnitMultipliers = {
    "": 1,
    b: 1,
    kb: 1000,
    mb: 1000 ** 2,
    gb: 1000 ** 3,
    tb: 1000 ** 4,
    kib: 1024,
    mib: 1024 ** 2,
    gib: 1024 ** 3,
    tib: 1024 ** 4,
};
export function parseByteSize(value) {
    const match = /^([\d.]+)\s*([a-zA-Z]*)$/u.exec(value.trim());
    if (!match) {
        return null;
    }
    const amount = Number.parseFloat(match[1]);
    if (!Number.isFinite(amount)) {
        return null;
    }
    const multiplier = ByteUnitMultipliers[match[2].toLowerCase()];
    return multiplier === undefined ? null : Math.round(amount * multiplier);
}
