import { RecordError, record } from "./sdk.js";

/** Stable sentence/clause IDs bind model selections to untouched uploaded bytes. */
export function documentPassages(source: string) {
  const passages: { id: string; text: string }[] = [];
  for (const match of source.matchAll(/[^.!?;\r\n]+[.!?;]*/gu)) {
    const text = match[0];
    for (let start = 0; start < text.length; ) {
      let end = Math.min(start + 1800, text.length);
      if (end < text.length) {
        const space = text.lastIndexOf(" ", end);
        if (space > start + 600) end = space;
        if (/[\uD800-\uDBFF]/.test(text[end - 1])) end--;
      }
      const value = text.slice(start, end);
      if (value.trim())
        passages.push({ id: "p" + passages.length, text: value });
      start = end;
    }
  }
  return passages;
}

const statements = [
  "required",
  "preferred",
  "alternative",
  "conditional",
  "explicitly_not_required",
  "not_stated",
  "unclear",
];

/** Legacy verbatim responses remain valid; ID responses never supply quote text. */
export function resolveDocumentEvidence(
  response: Record<string, unknown>,
  source: string,
  task: string,
): Record<string, unknown> {
  const result = structuredClone(response);
  if (!Object.hasOwn(result, "evidenceIds")) return result;
  const passages = documentPassages(source);
  const quote = (id: unknown): string => {
    const passage = passages.find((p) => p.id === id);
    if (!passage)
      throw new RecordError("Unknown document evidence ID: " + String(id));
    return passage.text;
  };
  const quotes = (value: unknown): string[] => {
    if (
      !Array.isArray(value) ||
      value.length > 100 ||
      value.some((id) => typeof id !== "string") ||
      new Set(value).size !== value.length
    )
      throw new RecordError("Invalid document evidence IDs");
    return value.map(quote);
  };
  const bind = (
    target: Record<string, unknown>,
    key: string,
    value: unknown,
  ) => {
    if (
      Object.hasOwn(target, key) &&
      JSON.stringify(target[key]) !== JSON.stringify(value)
    )
      throw new RecordError(
        "Document evidence conflicts with selected source: " + key,
      );
    target[key] = value;
  };
  bind(result, "evidence", quotes(result.evidenceIds));
  const findings = record(result.findings);
  if (Array.isArray(findings.educationRequirements))
    for (const item of findings.educationRequirements) {
      const requirement = record(item);
      bind(requirement, "evidenceQuote", quote(requirement.evidenceId));
      delete requirement.evidenceId;
    }
  if (task === "mandatory")
    bind(
      findings,
      "degreePreferenceQuote",
      findings.degreePreferenceEvidenceId === null
        ? null
        : quote(findings.degreePreferenceEvidenceId),
    );
  if (task === "readingLevel")
    bind(
      findings,
      "difficultPassages",
      findings.difficultPassageIds === null
        ? null
        : quotes(findings.difficultPassageIds),
    );
  delete findings.degreePreferenceEvidenceId;
  delete findings.difficultPassageIds;
  if (Array.isArray(findings.barriers))
    for (const item of findings.barriers) {
      const barrier = record(item);
      bind(barrier, "wording", quote(barrier.evidenceId));
      delete barrier.evidenceId;
    }
  if (task === "degrees" || task === "licenses") {
    if (
      !statements.includes(String(findings.documentStatement)) ||
      typeof findings.documentStatementExplanation !== "string" ||
      !findings.documentStatementExplanation.trim()
    )
      throw new RecordError("Missing or invalid document-only statement");
    if (
      !["not_stated", "unclear"].includes(String(findings.documentStatement)) &&
      !(result.evidence as string[]).length
    )
      throw new RecordError(
        "Stated document requirement needs source evidence",
      );
    if (
      findings.documentStatement === "not_stated" &&
      (findings.isLicenseRequired === true ||
        (Array.isArray(findings.educationRequirements) &&
          findings.educationRequirements.length))
    )
      throw new RecordError(
        "Document statement conflicts with extracted requirements",
      );
  }
  if (
    task === "consistency" &&
    Object.values(record(findings.validationChecks)).some(
      (value) => !["pass", "fail", "n/a"].includes(String(value)),
    )
  )
    throw new RecordError("New consistency checks must use pass, fail or n/a");
  result.findings = findings;
  return result;
}

export function documentStatement(result: Record<string, unknown>) {
  const findings = record(result.findings);
  return {
    statement: statements.includes(String(findings.documentStatement))
      ? String(findings.documentStatement)
      : "unclear",
    explanation:
      typeof findings.documentStatementExplanation === "string"
        ? findings.documentStatementExplanation
        : "This saved analysis did not separately classify what the supplied description states.",
    evidence: Array.isArray(result.evidence) ? result.evidence : [],
  };
}
