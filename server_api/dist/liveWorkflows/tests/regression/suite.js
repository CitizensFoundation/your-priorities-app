/** Shared no-key suite setup. Each browser scenario runs in its own Node process. */
import test from "node:test";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { format } from "node:util";
import { workflowModelDefaults } from "../../modelDefaults.js";
import { manualKeyName, redactManualText, } from "../manual/environment.js";
import { startManualHarness } from "../manual/harness.js";
import { driveGroupCreation, } from "../manual/groupCreationDriver.js";
// Provider responses are injected locally; no credentials are imported or provider SDK invoked.
const config = {
    codexModel: "offline-codex",
    codexReasoningEffort: "max",
    codexServiceTier: "regular",
    processingReasoningEffort: "max",
    processingServiceTier: "regular",
    trialBudgetMicros: 2000000,
    processingModel: {
        id: workflowModelDefaults.processingModel,
        label: "Local fixture provider",
        provider: "openai",
        reasoning: true,
        keyEnv: manualKeyName,
        inputMicrosPerMillion: 2000000,
        outputMicrosPerMillion: 8000000,
        maxOutputTokens: 4096,
        contextTokens: 200000,
        priceVersion: "fixture-only",
    },
};
for (const name of ["log", "info", "warn", "error", "debug"]) {
    const original = console[name].bind(console);
    console[name] = (...args) => original(redactManualText(format(...args)));
}
const root = "/tmp/skills-first-regression";
await mkdir(root, { recursive: true, mode: 0o700 });
const directory = await mkdtemp(path.join(root, "run-"));
console.info(`Regression evidence: ${directory}`);
async function scenario(name, factory, signal, options = {}) {
    const output = path.join(directory, name);
    await mkdir(output, { mode: 0o700 });
    const report = {
        passed: false,
        mode: "offline",
        simulated: true,
        realProviderCalls: 0,
        credentialsImported: false,
        realYourPrioritiesLoginTested: false,
        startedAt: new Date().toISOString(),
    };
    let harness;
    try {
        const marker = `REGRESSION_READY_${randomBytes(6).toString("hex")}`;
        harness = await startManualHarness(config, "offline", {
            groupCreation: true,
            browserLogin: true,
            codex: "greeting",
            offlineTurn: async () => marker,
            usageDirectory: output,
            ...options,
        });
        Object.assign(report, await driveGroupCreation(harness, config, output, marker, false, signal, factory(harness, output, signal)));
        report.passed = true;
    }
    catch (error) {
        report.error = redactManualText(String(error));
        throw error;
    }
    finally {
        try {
            await harness?.close();
        }
        catch (error) {
            report.passed = false;
            report.cleanupError = redactManualText(String(error));
            throw error;
        }
        finally {
            report.finishedAt = new Date().toISOString();
            await writeFile(path.join(output, "report.json"), redactManualText(JSON.stringify(report, null, 2)), { mode: 0o600 });
            console.info(`${name}: ${report.passed ? "PASS" : "FAIL"}; ${output}/report.json`);
        }
    }
}
export function regressionCase(name, factory, options = {}) {
    test(name, { timeout: 600000 }, async (t) => {
        await scenario(name, factory, t.signal, options);
    });
}
