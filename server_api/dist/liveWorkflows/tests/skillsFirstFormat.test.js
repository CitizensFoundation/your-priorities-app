import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import ExcelJS from "exceljs";
import { Ajv } from "ajv";
import { parse } from "csv-parse/sync";
import { loadAgent } from "./skillsFirstFixture.js";
import { analysisResponse } from "./analysisFixture.js";
import { parseInput } from "../runner/inputs.js";
import { renderWorkbook, WORKBOOK_SPEC_CONTENT_TYPE } from "../workbooks.js";
import { verifySkillsFirstValues } from "./manual/skillsFirstValues.js";
import { stableRequestId } from "../runner/socketClient.js";
const source = new URL("../../../workflow-packages/skills-first/", import.meta.url);
const { canonicalJob, skillsFirstMemory, consistencyKeys } = await import(new URL("source/memory.ts", source).href);
const { workbook: tableWorkbook } = await import(new URL("source/workbook.ts", source).href);
const { reviewedLicenseComparisons, licenseComparison } = await import(new URL("source/licenseComparisons.ts", source).href);
const normalize = await loadAgent("normalize"), analyze = await loadAgent("analysis"), exportResults = await loadAgent("export");
const context = (overrides = {}) => ({
    nodeId: "test",
    mode: "trial",
    configuration: {},
    model: async () => {
        throw new Error("Unexpected model call");
    },
    connector: async () => {
        throw new Error("Unexpected connector call");
    },
    checkpoint: async () => { },
    restore: async () => undefined,
    progress: async () => { },
    cancelled: async () => false,
    artifact: async () => { },
    ...overrides,
});
const description = "A bachelor's degree is required. A surveyor license is required. Maintain survey records.";
const base = {
    id: "row-one",
    titleCode: "00042",
    name: "Surveyor",
    text: description,
    originalText: description,
    source: "upload-1",
    jurisdiction: "Idaho, USA",
    status: "complete",
    analysis: {},
    citations: [],
    errors: [],
};
const referenceHeaders = [
    ..."agentId|titleCode|variant|classOfService|workWeek|bargainUnit|classCode|salaryRange|workMonth|deptCode|url|name|classification|error|multiLevelJob|cscRevised|notes|mainCategory|subCategory|needsCollegeDegree|maximumDegreeRequirement|includesMultipleJobLevelsWithDifferentEducationalRequirements|educationRequirements|isDegreeMandatory|hasAlternativeQualifications|alternativeQualifications|multipleQualificationPaths|isDegreeAbsolutelyRequired|substitutionPossible|degreeRequirementExplanation|bothTrueExplanation|bothFalseExplanation|isLicenseRequired|licenseType|licenseDescription|issuingAuthority|includesDegreeRequirement|barriersToNonDegreeApplicants|cscRevisedConsistency|requiredAlternativeExplanationConsistency|barriersToNonDegreeApplicantsConsistency|licenseIncludesDegreeRequirementConsistency|alternativesIfTrueConsistency|degreeMandatoryConsistency|alternativeQualificationsConsistency|educationRequirementsConsistency|needsCollegeDegreeConsistency|difficultPassages|readabilityLevel|fleschKincaidGrade|validationScore".split("|"),
    ..."Skills First Licence Type|Matchin WVU Profession|WVU Education Requirement|DR Education Requirement|DR result is likely Matching to WVU |Explanation DR compared to WVU|Manual Minimum Education Req.|Combined Manual & DR|DR Vs Manual Matching|WVU VS Deepresearch requiring manual review|Recommended Action|Source link|Notes".split("|"),
    ..."Job Title|Stated Degree Requirement|Degree Requirement Type|Type Of Official Document|Match Type For Job Title|Type Of Degree Requirement|Mandatory Degree Requirement Status|Reasoning|Source Url|Title Code".split("|"),
];
test("analysis populates the original nested memory and validates extended responses without extra model calls", async () => {
    const normalized = await normalize(context(), [
        {
            ...base,
            variant: "B",
            metadata: { "Class Code": "00042", Qualifications: description },
        },
    ]);
    const calls = [];
    const usage = [];
    const output = await analyze(context({
        model: async (key, _prompt, input) => {
            const task = key.split(":").at(-1);
            calls.push(task);
            assert.equal(input.metadata, undefined, "Whole-parent metadata must not leak into child prompts");
            const reply = analysisResponse(task, description);
            if (task === "degrees")
                reply.findings = {
                    needsCollegeDegree: true,
                    maximumDegreeRequirement: "Bachelor's degree",
                    includesMultipleJobLevelsWithDifferentEducationalRequirements: false,
                    educationRequirements: [
                        {
                            type: "Bachelor's degree",
                            isMandatory: true,
                            requirementStatus: "mandatory",
                            evidenceQuote: "A bachelor's degree is required.",
                        },
                    ],
                };
            if (task === "mandatory")
                reply.findings = {
                    isDegreeMandatory: true,
                    hasAlternativeQualifications: false,
                    alternativeQualifications: [],
                    multipleQualificationPaths: false,
                    isDegreeAbsolutelyRequired: true,
                    substitutionPossible: false,
                    degreePreferenceQuote: null,
                    mandatoryStatusExplanations: {
                        degreeRequirementExplanation: "The source explicitly requires a degree.",
                        bothTrueExplanation: null,
                        bothFalseExplanation: null,
                    },
                };
            if (task === "licenses")
                reply.findings = {
                    isLicenseRequired: true,
                    licenseType: "Surveyor",
                    licenseDescription: "A surveyor license is required.",
                    issuingAuthority: null,
                    includesDegreeRequirement: null,
                };
            if (task === "consistency")
                reply.findings = {
                    validationChecks: Object.fromEntries(consistencyKeys.map((key, index) => [
                        key,
                        index === 0 ? "n/a" : index === 1 ? "fail" : "pass",
                    ])),
                };
            if (task === "readingLevel")
                reply.findings = {
                    readabilityLevel: "High School",
                    readabilityLevelExplanation: "Estimated from the wording.",
                    difficultPassages: [
                        "A bachelor's degree is required.",
                        "Maintain survey records.",
                    ],
                    readingLevelMatchesDegreeRequirement: true,
                };
            usage.push({
                id: stableRequestId(`format-test:analyze:${key}`),
                runId: "format-test",
                nodeId: "analyze",
                fingerprint: "fixture",
                status: "settled",
                maximumMicros: 1,
                actualMicros: 1,
                result: { content: JSON.stringify(reply) },
                description: task,
                createdAt: new Date(0).toISOString(),
            });
            return reply;
        },
    }), normalized);
    assert.equal(calls.length, 7);
    const job = output[0];
    assert.equal(job.degreeAnalysis.professionalLicenseRequirement.licenseType, "Surveyor");
    assert.equal(job.degreeAnalysis.professionalLicenseRequirement.includesDegreeRequirement, null);
    assert.equal(job.degreeAnalysis.degreeRequirementStatus.isDegreeMandatory, true);
    assert.equal(job.degreeAnalysis.mandatoryStatusExplanations.bothTrueExplanation, null);
    assert.equal(job.readingLevelGradeAnalysis.readabilityLevelExplanation, "Estimated from the wording.");
    assert.equal(job.validationScore, 7, "Only pass contributes to the original nine-check score");
    assert.equal(job.titleCode, "00042");
    assert.equal(job.variant, "B");
    assert.ok(Number.isFinite(job.readabilityAnalysisTextTSNPM.fleschKincaidGrade));
    const validate = new Ajv({ allowUnionTypes: true }).compile(JSON.parse(await readFile(new URL("schemas/output.json", source), "utf8")));
    assert.equal(validate(output), true, JSON.stringify(validate.errors));
    const artifacts = new Map();
    const records = await exportResults(context({
        artifact: async (name, content) => {
            artifacts.set(name, content);
        },
    }), output);
    const verificationInput = {
        runId: "format-test",
        records: records,
        usage,
        memory: JSON.parse(artifacts.get("skills-first.json")),
        csv: Buffer.from(artifacts.get("skills-first.csv")),
        xlsx: await renderWorkbook(artifacts.get("skills-first.xlsx")),
    };
    const verified = await verifySkillsFirstValues(verificationInput);
    assert.equal(verified.passed, true, JSON.stringify(verified.missingOrChangedValues));
    assert.equal(verified.rawResponses, 7);
    assert.deepEqual(verified.excelLineEndingNormalizations.map((entry) => entry.field), ["xlsx.difficultPassages"]);
    const damaged = structuredClone(verificationInput.memory);
    damaged.jobDescriptions[0].degreeAnalysis.degreeRequirementStatus.isDegreeMandatory =
        null;
    const caught = await verifySkillsFirstValues({
        ...verificationInput,
        memory: damaged,
    });
    assert.equal(caught.passed, false);
    assert.ok(caught.missingOrChangedValues.some((issue) => issue.field === "xlsx.isDegreeMandatory"));
    assert.ok(caught.missingOrChangedValues.some((issue) => issue.field.includes("mandatory.isDegreeMandatory→")));
    const invalid = await analyze(context({
        configuration: { tasks: ["licenses"] },
        model: async () => ({
            status: "known",
            evidence: [description],
            findings: { isLicenseRequired: true },
        }),
    }), normalized);
    assert.match(JSON.stringify(invalid), /Missing licenses finding/);
});
test("a later invalid response preserves checked analysis, calculated readability and errors through Excel", async () => {
    for (const invalidJson of [false, true]) {
        const normalized = await normalize(context(), [base]);
        const output = await analyze(context({
            configuration: { tasks: ["degrees", "licenses"] },
            model: async (key) => {
                if (key.endsWith(":degrees"))
                    return analysisResponse("degrees", description);
                if (invalidJson)
                    throw Object.assign(new Error("Invalid JSON"), {
                        code: "record_invalid",
                    });
                return {
                    status: "known",
                    findings: { isLicenseRequired: true },
                    evidence: [description],
                };
            },
        }), normalized);
        const job = output[0];
        assert.ok(job.analysis.degrees);
        assert.equal(job.analysis.licenses, undefined);
        assert.equal(job.analysis.rejectedAnalysis.task, "licenses");
        assert.equal(job.degreeAnalysis.professionalLicenseRequirement.isLicenseRequired, null);
        assert.equal(job.status, "unknown");
        assert.equal(job.errors.length, 1);
        assert.ok(Number.isFinite(job.readabilityAnalysisTextTSNPM.fleschKincaidGrade));
        const memory = skillsFirstMemory([job]);
        assert.equal(memory.llmErrors.length, 1);
        assert.match(memory.llmErrors[0], /row-one/);
        const table = tableWorkbook(memory);
        const details = table.sheets.find((sheet) => sheet.name === "Review and provenance");
        assert.deepEqual(JSON.parse(details.rows[1][8]), job.analysis);
    }
});
test("reading-level selection requires degree findings and preserves original categorical labels", async () => {
    const calls = [];
    await analyze(context({
        configuration: { tasks: ["readingLevel"] },
        model: async (key, prompt, input) => {
            const task = key.split(":").at(-1);
            calls.push(task);
            if (task === "readingLevel") {
                assert.match(prompt, /Some College \(but no degree\)/);
                assert.ok(input.analysis.degrees);
            }
            return analysisResponse(task, description);
        },
    }), [base]);
    assert.deepEqual(calls, ["degrees", "readingLevel"]);
});
test("exports match all 74 reference headers, preserve source/manual fields, and retain every legal finding", async () => {
    const job = canonicalJob({
        ...base,
        variant: "V2",
        classOfService: "Career",
        classification: ["Bachelor's degree"],
        occupationalCategory: [
            { mainCategory: "Technical", subCategory: "Surveying" },
        ],
    });
    job.degreeAnalysis.professionalLicenseRequirement.licenseType = "Surveyor";
    job.degreeAnalysis.degreeRequirementStatus.isDegreeMandatory = false;
    job.degreeAnalysis.mandatoryStatusExplanations.degreeRequirementExplanation =
        "Supplied explanation";
    job.degreeAnalysis.educationRequirements = [
        {
            type: "Bachelor's degree",
            evidenceQuote: description,
            isMandatory: false,
        },
    ];
    job.readabilityAnalysisTextTSNPM.fleschKincaidGrade = 7.125;
    job.degreeAnalysis.deepResearchResults = ["one", "two"].map((suffix) => ({
        titleCode: "00042",
        jobTitle: job.name,
        statedDegreeRequirement: "Bachelor's degree",
        degreeRequirementType: "explicit",
        typeOfOfficialDocument: "statute",
        matchTypeForJobTitle: "exact",
        typeOfDegreeRequirement: "minimum",
        mandatoryDegreeRequirementStatus: "required",
        reasoning: suffix,
        sourceUrl: `https://example.gov/${suffix}`,
        evidenceQuote: description,
        status: suffix === "one" ? "known" : "unknown",
    }));
    job.licenseComparisons = [
        licenseComparison({
            "Skills First Licence Type": "Surveyor",
            "Matching WVU Profession": "Supplied profession",
            "Manual Minimum Education Req.": "Supplied manual choice",
        }),
    ];
    const artifacts = new Map();
    const result = await exportResults(context({
        configuration: { agentId: 123 },
        artifact: async (name, content, type) => {
            artifacts.set(name, { content, type });
        },
    }), [job]);
    const memory = JSON.parse(artifacts.get("skills-first.json").content);
    assert.equal(memory.agentId, 123);
    assert.deepEqual(memory.jobDescriptions, result);
    const validate = new Ajv({ allowUnionTypes: true }).compile(JSON.parse(await readFile(new URL("schemas/memory.json", source), "utf8")));
    assert.equal(validate(memory), true, JSON.stringify(validate.errors));
    const csv = parse(artifacts.get("skills-first.csv").content);
    assert.deepEqual(csv[1], referenceHeaders);
    assert.equal(csv.length, 4, "One source job with two legal findings produces two master data rows");
    assert.equal(csv[2][1], "00042");
    assert.equal(csv[2][23], "false");
    assert.equal(csv[2][29], "Supplied explanation");
    assert.equal(csv[2][49], "7.125");
    assert.equal(csv[2][57], "Supplied manual choice");
    assert.match(csv[3][71], /Needs review: two/);
    assert.equal(artifacts.get("skills-first.xlsx").type, WORKBOOK_SPEC_CONTENT_TYPE);
    const book = new ExcelJS.Workbook();
    await book.xlsx.load(Uint8Array.from(await renderWorkbook(artifacts.get("skills-first.xlsx").content)).buffer);
    assert.deepEqual(book.getWorksheet("merged (master + legal)").getRow(2)
        .values.slice(1), referenceHeaders);
    assert.equal(book.getWorksheet("Master sheet old").getRow(2).cellCount, 64);
    assert.equal(book.getWorksheet("legal research").rowCount, 3);
    assert.equal(book.getWorksheet("license info").rowCount, 2);
    assert.equal(book.getWorksheet("Documents").getCell("C2").value, description);
    assert.equal(book.getWorksheet("merged (master + legal)")
        .views[0].ySplit, 2);
});
test("old records project only known fields and memory imports keep repeated business codes and leading zeros", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "skills-first-format-"));
    try {
        const old = canonicalJob({
            ...base,
            analysis: {
                mandatory: {
                    findings: { isDegreeMandatory: false },
                    status: "known",
                    evidence: [description],
                },
            },
        });
        assert.equal(old.degreeAnalysis.degreeRequirementStatus.isDegreeMandatory, false);
        assert.equal(old.degreeAnalysis.mandatoryStatusExplanations
            .degreeRequirementExplanation, null);
        assert.equal(old.validationScore, null);
        const partialReference = canonicalJob({
            ...base,
            licenseComparisons: [
                {
                    "Skills First Licence Type": "Surveyor",
                    "Manual Minimum Education Req.": "User supplied",
                },
            ],
        });
        assert.equal(partialReference.licenseComparisons[0].manualMinimumEducationRequirement, "User supplied");
        assert.equal(partialReference.licenseComparisons[0].researchMatchesWvu, null);
        old.degreeAnalysis.mandatoryStatusExplanations.degreeRequirementExplanation =
            "Supplied legacy explanation";
        const referenceFlags = licenseComparison({
            "DR result is likely Matching to WVU ": "false",
            "DR Vs Manual Matching": "N/A",
        });
        assert.equal(referenceFlags.researchMatchesWvu, false);
        assert.equal(referenceFlags.researchMatchesManual, "N/A");
        const reprojected = canonicalJob(old);
        const extended = canonicalJob({
            ...old,
            degreeAnalysis: {
                ...old.degreeAnalysis,
                statutesResearchResults: [{ note: "Supplied legacy statute context" }],
            },
            readabilityAnalysisTextTSNPM: { fleschKincaidGrade: 8, wordCount: 12 },
        });
        assert.deepEqual(extended.degreeAnalysis.statutesResearchResults, [
            { note: "Supplied legacy statute context" },
        ]);
        assert.equal(extended.readabilityAnalysisTextTSNPM.wordCount, 12);
        assert.equal(reprojected.degreeAnalysis.mandatoryStatusExplanations
            .degreeRequirementExplanation, "Supplied legacy explanation");
        assert.equal(canonicalJob({ ...base, titleCode: undefined, "Class Code": "0042" })
            .titleCode, "0042");
        const file = path.join(directory, "memory.json");
        await writeFile(file, JSON.stringify({
            agentId: 42,
            jobDescriptions: [
                {
                    titleCode: "00042",
                    name: "First",
                    text: description,
                    degreeAnalysis: old.degreeAnalysis,
                },
                {
                    titleCode: "00042",
                    variant: "2",
                    name: "Second",
                    text: description,
                },
            ],
        }));
        const inputs = await parseInput(file, "memory.json", "asset");
        assert.deepEqual(inputs.map((row) => row.id), ["asset:1", "asset:2"]);
        const jobs = await normalize(context(), inputs);
        const memory = skillsFirstMemory(jobs);
        assert.equal(memory.agentId, 42);
        assert.equal(memory.jobDescriptions[0].titleCode, "00042");
        assert.equal(memory.jobDescriptions[0].degreeAnalysis.degreeRequirementStatus
            .isDegreeMandatory, false);
        assert.equal(memory.jobDescriptions[1].degreeAnalysis.degreeRequirementStatus
            .isDegreeMandatory, null);
    }
    finally {
        await rm(directory, { recursive: true, force: true });
    }
});
test("license comparisons retain supplied decisions and cannot manufacture matches or evidence", () => {
    const job = canonicalJob(base);
    job.degreeAnalysis.deepResearchResults = [
        {
            sourceUrl: "https://example.gov/rule",
            evidenceQuote: description,
            status: "known",
        },
    ];
    const references = [
        licenseComparison({
            licenseType: "Surveyor",
            wvuEducationRequirement: "Supplied WVU value",
            manualMinimumEducationRequirement: "Keep this manual decision",
        }),
    ];
    const comparison = {
        referenceIndex: 0,
        researchEducationRequirement: "Research result",
        researchComparisonExplanation: "Compare supplied values",
        researchMatchesWvu: false,
        researchMatchesManual: false,
        requiresManualReview: true,
        recommendedAction: "Review",
        sourceUrl: "https://example.gov/rule",
        evidenceQuote: description,
        manualMinimumEducationRequirement: "Invented override",
    };
    assert.equal(reviewedLicenseComparisons(job, references, [comparison])[0]
        .manualMinimumEducationRequirement, "Keep this manual decision");
    assert.throws(() => reviewedLicenseComparisons(job, references, [
        { ...comparison, evidenceQuote: "Invented" },
    ]), /not supported/);
    assert.throws(() => reviewedLicenseComparisons(job, [licenseComparison({})], [comparison]), /without reference data/);
    job.degreeAnalysis.deepResearchResults[0].status = "unknown";
    const uncertain = reviewedLicenseComparisons(job, references, [
        comparison,
    ])[0];
    assert.equal(uncertain.researchMatchesWvu, null);
    assert.equal(uncertain.requiresManualReview, true);
});
test("Excel exports preserve long Unicode text, literal formulas and reject executable or oversized layouts", async () => {
    const text = "x".repeat(29999) + "🧪" + "Long job description\n".repeat(4000);
    const job = canonicalJob({
        ...base,
        name: '=HYPERLINK("https://example.invalid")',
        originalText: text,
    });
    const spec = tableWorkbook(skillsFirstMemory([job]));
    const book = new ExcelJS.Workbook();
    await book.xlsx.load(Uint8Array.from(await renderWorkbook(JSON.stringify(spec))).buffer);
    assert.equal(book.getWorksheet("Documents").getCell("B2").type, ExcelJS.ValueType.String);
    const overflow = book.getWorksheet("Long cell text");
    const pieces = [];
    overflow.eachRow((row, index) => {
        if (index > 1 &&
            row.getCell(1).value === "Documents" &&
            row.getCell(2).value === 2 &&
            row.getCell(3).value === 3)
            pieces.push(String(row.getCell(5).value));
    });
    assert.equal(pieces.join(""), text);
    const invalid = (rows, widths = [20]) => JSON.stringify({
        version: 1,
        sheets: [{ name: "Test", rows, widths, headerRows: 1 }],
    });
    await assert.rejects(renderWorkbook(invalid([[{ formula: "1+1" }]])), /Invalid workbook/);
    await assert.rejects(renderWorkbook(invalid(Array.from({ length: 5000 }, () => []), Array(128).fill(20))), /500,000 cells/);
    await assert.rejects(renderWorkbook(JSON.stringify({ ...spec, sheets: [spec.sheets[0], spec.sheets[0]] })), /duplicate/);
});
