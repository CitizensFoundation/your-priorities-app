import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { loadAgent } from "./skillsFirstFixture.js";
import { analysisResponse } from "./analysisFixture.js";
import { preparePartnerData } from "./manual/idahoPartner.js";
import { idahoInputReport } from "./manual/idahoInputReport.js";
import { idahoHeaders } from "./manual/idahoData.js";
import { writePartnerBundle } from "./manual/idahoPartnerReport.js";
const source = "Qualifications:\r\nSome positions require a Driver’s license.\nExperience: planning programs; giving public presentations.\nRésumé preparation";
const job = {
    id: "one",
    name: "Program manager",
    source: "upload",
    text: source,
    status: "complete",
    jurisdiction: "Idaho, USA",
    analysis: {},
    citations: [],
    errors: [],
};
const context = (model, tasks) => ({
    nodeId: "analyze",
    mode: "trial",
    configuration: tasks ? { tasks } : {},
    model,
    connector: async () => {
        throw new Error("Unexpected connector");
    },
    progress: async () => { },
    checkpoint: async () => { },
    restore: async () => undefined,
    artifact: async () => { },
    cancelled: async () => false,
});
const helpers = () => import(new URL("../../../workflow-packages/skills-first/source/documentEvidence.ts", import.meta.url).href);
test("document passage IDs preserve Unicode, unpunctuated lines and source bytes; unknown IDs and edited quotations fail", async () => {
    const { documentPassages, resolveDocumentEvidence } = await helpers();
    const passages = documentPassages(source);
    assert.ok(passages.some((p) => p.text === "Qualifications:"));
    assert.ok(passages.some((p) => p.text === "Résumé preparation"));
    assert.ok(passages.every((p) => source.includes(p.text)));
    const license = passages.find((p) => p.text.includes("Driver’s"));
    const response = {
        status: "known",
        evidenceIds: [license.id],
        findings: {
            barriersToNonDegreeApplicants: "Conditional license",
            barriers: [{ evidenceId: license.id, explanation: "Conditional" }],
        },
    };
    const result = resolveDocumentEvidence(response, source, "barriers");
    assert.deepEqual(result.evidence, [license.text]);
    assert.equal(result.findings.barriers[0].wording, license.text);
    assert.equal(response.findings.barriers[0].evidenceId, license.id);
    assert.throws(() => resolveDocumentEvidence({ ...response, evidenceIds: ["invented"] }, source, "barriers"), /Unknown document/);
    assert.throws(() => resolveDocumentEvidence({ ...response, evidence: ["A drivers license is required."] }, source, "barriers"), /conflicts/);
    assert.throws(() => resolveDocumentEvidence({ ...response, evidenceIds: [license.id, license.id] }, source, "barriers"), /Invalid document/);
    assert.throws(() => resolveDocumentEvidence({
        status: "unknown",
        evidenceIds: [],
        findings: {
            validationChecks: { degreeMandatoryConsistency: "unknown" },
        },
    }, source, "consistency"), /pass, fail or n\/a/);
});
test("all analysis tasks bind nested quotations, preserve unknown decisions and export separate description findings", async () => {
    const analyze = await loadAgent("analysis");
    const output = (await analyze(context(async (key, system, input) => {
        const task = key.split(":").at(-1);
        const current = input;
        const license = current.sourcePassages.find((p) => p.text.includes("Driver’s"));
        const raw = analysisResponse(task, source, true);
        delete raw.evidence;
        raw.evidenceIds = task === "degrees" ? [] : [license.id];
        if (task === "degrees" || task === "licenses") {
            raw.findings.documentStatement =
                task === "degrees" ? "not_stated" : "conditional";
            raw.findings.documentStatementExplanation =
                task === "degrees"
                    ? "The supplied qualifications describe experience without stating an education requirement."
                    : "The license applies to some positions.";
        }
        if (task === "mandatory") {
            delete raw.findings.degreePreferenceQuote;
            raw.findings.degreePreferenceEvidenceId = null;
        }
        if (task === "licenses") {
            raw.findings.isLicenseRequired = null;
            raw.findings.licenseType = "Drivers License";
            raw.findings.licenseDescription = license.text;
        }
        if (task === "consistency")
            for (const k of Object.keys(raw.findings.validationChecks))
                raw.findings.validationChecks[k] = "pass";
        if (task === "readingLevel") {
            assert.ok(system.includes("straight apostrophes"));
            delete raw.findings.difficultPassages;
            raw.findings.difficultPassageIds = [license.id];
            raw.findings.readabilityLevel = "Bachelor’s Degree";
        }
        return raw;
    }), [job]));
    const row = output[0];
    assert.deepEqual(row.errors, []);
    assert.equal(row.analysis.documentRequirements.degree.statement, "not_stated");
    assert.equal(row.analysis.documentRequirements.license.statement, "conditional");
    assert.equal(row.degreeAnalysis.degreeRequirementStatus.isDegreeAbsolutelyRequired, null);
    assert.equal(row.degreeAnalysis.professionalLicenseRequirement.isLicenseRequired, null);
    assert.equal(row.degreeAnalysis.professionalLicenseRequirement.licenseType, "Driver's license");
    assert.ok(row.degreeAnalysis.professionalLicenseRequirement.licenseDescription.includes("Driver’s"));
    assert.equal(row.readingLevelGradeAnalysis.readabilityLevel, "Bachelor's Degree");
    assert.ok(row.readingLevelGradeAnalysis.difficultPassages[0].includes("Driver’s"));
    assert.equal(row.validationScore, 9);
    const exported = [];
    const exporter = await loadAgent("export");
    await exporter({
        ...context(async () => {
            throw new Error("No model call for export");
        }),
        nodeId: "export",
        artifact: async (name, data) => {
            exported.push({ name, data });
        },
    }, output);
    const spec = JSON.parse(exported.find((a) => a.name.endsWith(".xlsx")).data);
    const documents = spec.sheets.find((s) => s.name === "Documents");
    assert.equal(documents.rows[1][8], "not_stated");
    assert.equal(documents.rows[1][10], "conditional");
    assert.match(documents.rows[1][12], /Supplied description only/);
});
test("nested degree/preference passage selections cannot introduce a retyped quote", async () => {
    const { documentPassages, resolveDocumentEvidence } = await helpers();
    const text = "A Bachelor’s degree is preferred. Experience is an alternative.";
    const id = documentPassages(text)[0].id;
    const response = {
        status: "known",
        evidenceIds: [id],
        findings: {
            documentStatement: "preferred",
            documentStatementExplanation: "A preference is stated.",
            educationRequirements: [
                {
                    type: "Bachelor's degree",
                    isMandatory: false,
                    requirementStatus: "preferred",
                    evidenceId: id,
                },
            ],
        },
    };
    assert.equal(resolveDocumentEvidence(response, text, "degrees").findings
        .educationRequirements[0].evidenceQuote, "A Bachelor’s degree is preferred.");
    assert.equal(resolveDocumentEvidence({
        status: "known",
        evidenceIds: [id],
        findings: { degreePreferenceEvidenceId: id },
    }, text, "mandatory").findings.degreePreferenceQuote, "A Bachelor’s degree is preferred.");
    response.findings.educationRequirements[0].evidenceId = "missing";
    assert.throws(() => resolveDocumentEvidence(response, text, "degrees"), /Unknown document/);
});
test("partner Markdown report distinguishes the full input profile, selected rows and processing gaps and is checksummed", async () => {
    const directory = await mkdtemp("/tmp/idaho-input-report-");
    try {
        const csv = [
            idahoHeaders.join(","),
            ...Array.from({ length: 12 }, (_, i) => idahoHeaders
                .map((field) => field === "Class Code"
                ? "0180"
                : field === "Class Title"
                    ? "Manager " + i
                    : field === "Qualifications"
                        ? i === 11
                            ? ""
                            : "Experience required."
                        : field === "Summary"
                            ? "Summary"
                            : "")
                .join(",")),
        ].join("\n");
        const sourcePath = path.join(directory, "source.csv");
        await writeFile(sourcePath, csv);
        const data = await preparePartnerData(path.join(directory, "input"), sourcePath);
        assert.equal(data.profile.records, 12);
        assert.equal(data.profile.fields.find((f) => f.field === "Qualifications").missing, 1);
        const report = idahoInputReport({
            data,
            mode: "live",
            records: [],
            filterReady: false,
        });
        assert.match(report, /Source data records: 12/);
        assert.match(report, /first 10 data rows/);
        assert.match(report, /Qualifications \| 11 \| 1/);
        assert.match(report, /1 distinct qualifications texts/);
        assert.match(report, /Numeric title suffixes/);
        assert.match(report, /not establish that an external degree/);
        assert.match(report, /processing defects, not missing Idaho inputs/);
        const flagged = idahoInputReport({
            data,
            mode: "live",
            records: [
                {
                    name: "Manager",
                    errors: [],
                    analysis: {
                        consistency: {
                            findings: {
                                validationChecks: {
                                    alternativeQualificationsConsistency: "fail",
                                },
                            },
                        },
                    },
                },
            ],
            filterReady: false,
        });
        assert.match(flagged, /Records with failed consistency checks: 1/);
        assert.match(flagged, /records with processing errors: 0/);
        assert.match(flagged, /alternativeQualificationsConsistency/);
        await writePartnerBundle({
            output: directory,
            data,
            mode: "live",
            records: [],
            executionPassed: false,
        });
        const share = path.join(directory, "for-partners");
        assert.equal(await readFile(path.join(share, "IDAHO-INPUT-ANALYSIS.md"), "utf8"), report);
        const manifest = JSON.parse(await readFile(path.join(share, "SHA256SUMS.json"), "utf8"));
        assert.ok(manifest["IDAHO-INPUT-ANALYSIS.md"]);
        assert.ok(manifest["input-source-profile.json"]);
    }
    finally {
        await rm(directory, { recursive: true, force: true });
    }
});
