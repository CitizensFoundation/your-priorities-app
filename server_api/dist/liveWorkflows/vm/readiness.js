import { access, readFile, stat, statfs } from "node:fs/promises";
import { constants } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { HostDirectory, SecretBox } from "../secrets.js";
import { loadVmAgentConfig } from "./config.js";
export function inspectRuntimeContract(info, codex, processing, versions) {
    const runtimes = info.Runtimes ?? {};
    const labels = codex.Config
        ?.Labels ?? {};
    const imageId = processing.Id;
    const expected = {
        version: versions.codexVersion,
        "source-commit": versions.codexSourceCommit,
        "patch-revision": versions.codexPatchRevision,
        "bwrap-sha256": versions.codexBundledBwrapSha256,
        "resolved-cargo-lock-sha256": versions.codexResolvedCargoLockSha256,
    };
    return [
        {
            name: "Docker runtimes",
            ok: Boolean(runtimes["sysbox-runc"] && runtimes.runc),
            detail: "Codex requires sysbox-runc; processing and parsing require runc.",
        },
        {
            name: "Codex image contract",
            ok: Object.entries(expected).every(([key, value]) => typeof value === "string" &&
                labels[`ai.yp-live-workflow.codex.${key}`] === value),
            detail: "Image labels must match the pinned Codex version, source, patch, bwrap and lockfile.",
        },
        {
            name: "Processing image",
            ok: typeof imageId === "string" &&
                /^sha256:[a-f0-9]{64}$/.test(imageId),
            detail: "A locally installed processing image must resolve to an immutable ID.",
        },
    ];
}
export async function readiness(mode, env = process.env, docker) {
    const checks = [];
    const check = async (name, detail, work) => {
        try {
            await work();
            checks.push({ name, ok: true, detail });
        }
        catch {
            checks.push({ name, ok: false, detail });
        } // Never print environment values or command stderr containing secrets.
    };
    const ensure = (condition) => {
        if (!condition)
            throw new Error("not ready");
    };
    const directory = async (name, value) => check(name, "Must be an existing absolute private directory owned and writable by this service account, with sufficient disk space.", async () => {
        ensure(value && path.isAbsolute(value));
        const directory = value;
        const stats = await stat(directory), space = await statfs(directory);
        ensure(stats.isDirectory() &&
            stats.uid === process.getuid?.() &&
            !(stats.mode & 0o077));
        await access(directory, constants.R_OK | constants.W_OK | constants.X_OK);
        const minimum = Number(env.YP_LIVE_WORKFLOW_MIN_FREE_BYTES ?? 1024 ** 3);
        ensure(Number.isSafeInteger(minimum) &&
            minimum > 0 &&
            space.bavail * space.bsize >= minimum);
    });
    await check("Node", "Node 24 is required by the pinned runtime.", () => ensure(Number(process.versions.node.split(".")[0]) === 24));
    if (mode === "api") {
        await check("Encryption key", "Configure a stable base64-encoded 32-byte key.", () => new SecretBox(env.YP_LIVE_WORKFLOW_AUTH_ENCRYPTION_KEY ?? ""));
        await check("Host registry", "Configure at least one host with unique IDs and tokens.", () => ensure(new HostDirectory(env.YP_LIVE_WORKFLOW_HOSTS ?? "[]").hosts
            .length));
        await check("Processing models", "Configure verified integer prices, context/output limits, unique models and their provider credentials.", () => {
            const models = JSON.parse(env.YP_LIVE_WORKFLOW_MODELS ?? "[]");
            ensure(Array.isArray(models) &&
                models.length &&
                new Set(models.map((m) => m.id)).size === models.length);
            for (const model of models) {
                ensure(typeof model.id === "string" &&
                    model.id.length &&
                    ["openai", "anthropic", "google"].includes(String(model.provider)) &&
                    model.priceVersion);
                for (const field of [
                    "inputMicrosPerMillion",
                    "outputMicrosPerMillion",
                    "maxOutputTokens",
                    "contextTokens",
                ])
                    ensure(Number.isSafeInteger(model[field]) &&
                        Number(model[field]) >= (field.endsWith("Tokens") ? 1 : 0));
                ensure(typeof model.keyEnv === "string" &&
                    /^[A-Z][A-Z0-9_]+$/.test(model.keyEnv) &&
                    env[model.keyEnv]);
            }
        });
        await directory("API asset storage", env.YP_LIVE_WORKFLOW_DATA_ROOT);
        await check("Public origin", "Set a HTTPS UI origin for cookie checks behind the proxy.", () => {
            const url = new URL(env.YP_LIVE_WORKFLOW_PUBLIC_ORIGIN ?? "");
            ensure(url.protocol === "https:" &&
                url.pathname === "/" &&
                !url.username &&
                !url.password &&
                !url.search &&
                !url.hash);
        });
        return checks;
    }
    await check("Host service account", "Run the coordinator as a dedicated non-root account with Docker access.", () => ensure(process.getuid?.() !== 0));
    let config;
    await check("VM configuration", "Configure host ID, token, TLS API origin, loopback control, broker mode and Sysbox container-root defaults.", () => {
        config = loadVmAgentConfig(env);
        ensure(config.vmHostId &&
            /^[a-f0-9-]{36}$/.test(config.vmHostId) &&
            config.token.length >= 32);
        const origin = new URL(config.apiBaseUrl);
        ensure(origin.protocol === "https:" &&
            !origin.username &&
            !origin.password);
        ensure(config.brokerEnabled &&
            !config.codexCommand &&
            ["127.0.0.1", "::1", "localhost"].includes(config.controlHost));
        ensure(config.dockerRuntime === "sysbox-runc" &&
            config.dockerRunUser === "0:0" &&
            !config.dockerDropAllCapabilities &&
            !config.dockerNoNewPrivileges &&
            !config.dockerGpuMode);
        ensure(!config.codexAllowedImages ||
            config.codexAllowedImages.includes(config.codexContainerImage));
    });
    if (!config)
        return checks;
    await directory("VM workspace", config.workspaceRoot);
    await directory("VM state/outbox", path.dirname(config.statePath));
    await directory("VM archive", config.archiveRoot);
    await directory("VM datasets", config.datasetsHotRoot);
    await check("Installed image inspection", "Install Docker, both runtimes, and build the pinned Codex and processing images.", async () => {
        const run = docker ??
            (async (args) => (await promisify(execFile)(config.dockerBin, args, {
                timeout: 15000,
                maxBuffer: 2 * 1024 ** 2,
            })).stdout);
        const info = JSON.parse(await run(["info", "--format", "{{json .}}"]));
        const codex = JSON.parse(await run(["image", "inspect", config.codexContainerImage]));
        const processing = JSON.parse(await run([
            "image",
            "inspect",
            env.YP_LIVE_WORKFLOW_PROCESSING_IMAGE ??
                "yp-live-workflow/processing-runtime:1",
        ]));
        const versions = JSON.parse(await readFile(new URL("../../docker/versions.json", import.meta.url), "utf8"));
        checks.push(...inspectRuntimeContract(info, codex[0], processing[0], versions));
    });
    return checks;
}
if (process.argv[1] &&
    import.meta.url === pathToFileURL(process.argv[1]).href) {
    const mode = process.argv[2];
    if (mode !== "api" && mode !== "vm")
        throw new Error("Usage: readiness <api|vm>");
    const checks = await readiness(mode);
    console.log(JSON.stringify({
        mode,
        ok: checks.every((c) => c.ok),
        checks,
        scope: "Local configuration and image inspection only. Database migration, proxy routing and real login still require installation checks.",
    }, null, 2));
    process.exitCode = checks.every((c) => c.ok) ? 0 : 1;
}
