/** Scores saved outputs only. This module never calls a model or connector. */
export interface EvaluationDataset {
  version: string;
  evidence: { url: string; text: string }[];
  cases: {
    id: string;
    expected: {
      names: string[];
      status: string;
      requiredText: string[];
      requiredByName?: Record<string, string[]>;
      forbiddenByName: Record<string, string[]>;
      originalText: string;
      minimumCitations: number;
    };
  }[];
}
export function evaluate(
  dataset: EvaluationDataset,
  outputs: Record<string, unknown>[],
) {
  const recordKey = (row: Record<string, unknown>) => {
    const id = String(row.parentId ?? row.id);
    const prefix = `${row.source}:`;
    return row.source && id.startsWith(prefix)
      ? id.slice(prefix.length)
      : id;
  };
  const seen = new Set<unknown>();
  const duplicateIds: unknown[] = [];
  for (const row of outputs) {
    if (seen.has(row.id)) duplicateIds.push(row.id);
    seen.add(row.id);
  }
  const cases = dataset.cases.map((example) => {
    const rows = outputs.filter((row) => recordKey(row) === example.id);
    const issues: string[] = [];
    if (
      JSON.stringify(rows.map((row) => row.name).sort()) !==
      JSON.stringify([...example.expected.names].sort())
    )
      issues.push("level coverage");
    for (const row of rows) {
      if (row.originalText !== example.expected.originalText)
        issues.push("original text changed");
      if (row.status !== example.expected.status) issues.push("status");
      for (const text of example.expected.requiredText)
        if (!String(row.text).includes(text))
          issues.push("required passage missing");
      for (const text of example.expected.requiredByName?.[
        String(row.name)
      ] ?? [])
        if (
          !String(row.text).includes(text) ||
          !String(row.rewrittenText ?? "").includes(text)
        )
          issues.push("level qualification missing");
      for (const text of example.expected.forbiddenByName[
        String(row.name)
      ] ?? [])
        if (
          String(row.text).includes(text) ||
          String(row.rewrittenText ?? "").includes(text)
        )
          issues.push("qualification crossed levels");
      const citations = Array.isArray(row.citations)
        ? (row.citations as { url: string; quote: string }[])
        : [];
      if (citations.length < example.expected.minimumCitations)
        issues.push("missing citations");
      if (
        citations.some(
          (c) =>
            !c.quote?.trim() ||
            !dataset.evidence.some(
              (e) => e.url === c.url && e.text.includes(c.quote),
            ),
        )
      )
        issues.push("unsupported citation");
      if (
        example.expected.status === "complete" &&
        (!row.rewrittenText || (row.errors as unknown[])?.length)
      )
        issues.push("rewrite incomplete");
      if (
        example.expected.status === "complete" &&
        String(row.text).includes("A license is required.") &&
        !String(row.rewrittenText).includes("A license is required.")
      )
        issues.push("mandatory qualification removed");
      if (rows.length > 1 && (!row.parentId || !row.level))
        issues.push("missing lineage");
    }
    return {
      id: example.id,
      passed: !issues.length,
      issues: [...new Set(issues)],
    };
  });
  const unknownRecords = outputs.filter(
    (row) => !dataset.cases.some((c) => c.id === recordKey(row)),
  ).length;
  return {
    datasetVersion: dataset.version,
    records: outputs.length,
    passed: cases.filter((c) => c.passed).length,
    total: cases.length,
    duplicateIds,
    unknownRecords,
    success:
      cases.every((c) => c.passed) &&
      !duplicateIds.length &&
      !unknownRecords,
    cases,
  };
}
