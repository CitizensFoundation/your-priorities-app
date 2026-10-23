import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { renderWorkbook } from "../../workbooks.js";
import { verifySkillsFirstValues } from "./skillsFirstValues.js";
import { sha256 } from "./idahoData.js";
/** Keep every browser-downloaded part. Consolidation uses the same production formatter,
 * and is explicitly distinguished from byte-identical original downloads. No model calls. */
export async function collectPartnerExports(options) {
    const { output, runId, artifacts, records, usage } = options;
    const byId = new Map(records.map((record) => [String(record.id), record]));
    assert.equal(byId.size, records.length, "Duplicate result record identity");
    const stems = [...artifacts.keys()]
        .filter((name) => /^skills-first(?:-\d{4})?\.json$/.test(name))
        .map((name) => name.slice(0, -5))
        .sort();
    assert.ok(stems.length, "No canonical production export parts downloaded");
    const originalDirectory = path.join(output, "production-exports");
    await mkdir(originalDirectory, { recursive: true });
    const parts = [];
    const verifications = [];
    const memories = [];
    const seen = new Set();
    for (const stem of stems) {
        const json = artifacts.get(`${stem}.json`), csv = artifacts.get(`${stem}.csv`), xlsx = artifacts.get(`${stem}.xlsx`);
        assert.ok(json && csv && xlsx, `Missing JSON/CSV/Excel companion for ${stem}`);
        const memory = JSON.parse(json.toString());
        assert.ok(Array.isArray(memory.jobDescriptions));
        const jobs = memory.jobDescriptions;
        for (const job of jobs) {
            assert.ok(!seen.has(String(job.id)), "Repeated record across export parts");
            seen.add(String(job.id));
        }
        const matchingRecords = jobs.map((job) => {
            const record = byId.get(String(job.id));
            assert.ok(record, "Export contains an unexpected record");
            return record;
        });
        verifications.push(await verifySkillsFirstValues({
            runId,
            records: matchingRecords,
            memory,
            csv,
            xlsx,
            usage,
        }));
        const checksums = {};
        for (const extension of ["json", "csv", "xlsx", "md"]) {
            const name = `${stem}.${extension}`, bytes = artifacts.get(name);
            if (bytes) {
                await writeFile(path.join(originalDirectory, name), bytes, {
                    mode: 0o600,
                });
                checksums[name] = sha256(bytes);
            }
        }
        parts.push({ stem, records: jobs.length, checksums });
        memories.push(memory);
    }
    assert.deepEqual(seen, new Set(records.map((job) => String(job.id))), "Export parts must cover every result exactly once");
    const memory = structuredClone(memories[0]);
    for (const part of memories) {
        assert.equal(part.schemaVersion, memory.schemaVersion);
        assert.equal(part.agentId, memory.agentId);
    }
    for (const key of [
        "jobDescriptions",
        "rewrittenJobDescriptions",
        "llmErrors",
        "educationRequirementResearchResults",
        "licenseComparisons",
    ]) {
        assert.ok(memories.every((part) => Array.isArray(part[key])));
        memory[key] = memories.flatMap((part) => part[key]);
    }
    let csv = artifacts.get(`${stems[0]}.csv`);
    let xlsx = artifacts.get(`${stems[0]}.xlsx`);
    let json = artifacts.get(`${stems[0]}.json`);
    if (stems.length > 1) {
        const { masterTable, workbook } = await import(new URL("../../../../workflow-packages/skills-first/source/workbook.ts", import.meta.url).href);
        const { csvCell } = await import(new URL("../../../../workflow-packages/skills-first/source/export.ts", import.meta.url).href);
        csv = Buffer.from(masterTable(memory)
            .map((row) => row.map((value) => csvCell(String(value ?? ""))).join(","))
            .join("\r\n"));
        xlsx = await renderWorkbook(JSON.stringify(workbook(memory)));
        json = Buffer.from(JSON.stringify(memory, null, 2));
    }
    await writeFile(path.join(output, "idaho-trial-results.csv"), csv, {
        mode: 0o600,
    });
    await writeFile(path.join(output, "idaho-trial-results.xlsx"), xlsx, {
        mode: 0o600,
    });
    await writeFile(path.join(output, "skills-first-memory.json"), json, {
        mode: 0o600,
    });
    const combinedVerification = await verifySkillsFirstValues({
        runId,
        records: memory.jobDescriptions.map((job) => byId.get(String(job.id))),
        memory,
        csv,
        xlsx,
        usage,
    });
    const delivery = {
        consolidated: stems.length > 1,
        ...(options.recovered ? { recovered: options.recovered } : {}),
        parts,
        note: options.recovered
            ? `PARTIAL RESULTS: rendered locally with the production exporter from ${options.recovered.stage}. ${options.recovered.method} The export agent did not complete in the browser. No model requests were made to create these files.`
            : stems.length > 1
                ? "The main workbook/CSV/JSON consolidate all verified production parts with the production formatter. Unchanged browser downloads are in production-exports/. No models were rerun."
                : "The main workbook, CSV and JSON are byte-identical to the browser-downloaded production artifacts.",
    };
    await writeFile(path.join(output, "export-delivery.json"), JSON.stringify(delivery, null, 2));
    return {
        ...combinedVerification,
        passed: combinedVerification.passed &&
            verifications.every((check) => check.passed),
        missingOrChangedValues: [
            ...combinedVerification.missingOrChangedValues,
            ...verifications.flatMap((check) => check.missingOrChangedValues),
        ],
        parts: verifications,
        delivery,
    };
}
/** Preserve reviewable files after a failed trial without claiming a finished browser export. */
export async function recoverPartnerExports(options) {
    const { run } = await import(new URL("../../../../workflow-packages/skills-first/source/export.ts", import.meta.url).href);
    const artifacts = new Map();
    const forbidden = async () => {
        throw new Error("Partial export recovery must never make a model or connector request");
    };
    const exportedRecords = await run({
        nodeId: "export",
        mode: "trial",
        configuration: { agentId: "skills-first" },
        model: forbidden,
        connector: forbidden,
        progress: async () => { },
        checkpoint: async () => { },
        restore: async () => undefined,
        cancelled: async () => false,
        artifact: async (name, content, contentType) => {
            artifacts.set(name, contentType === "application/vnd.yrpri.workbook+json"
                ? await renderWorkbook(content)
                : Buffer.from(content));
        },
    }, options.records);
    const records = exportedRecords;
    const verification = await collectPartnerExports({
        ...options,
        records,
        artifacts,
        recovered: { stage: options.stage, method: options.method },
    });
    return { records, verification };
}
