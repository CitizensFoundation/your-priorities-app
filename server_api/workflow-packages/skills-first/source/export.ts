import { jobs, asJson, type Agent, type Job } from "./sdk.js";

export function csvCell(value: string): string {
  // CSVs are often opened in spreadsheets; prevent formula execution from source data.
  const safe = /^[=+@\-\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replaceAll('"', '""')}"`;
}
export const run: Agent = async (context, input) => {
  const items = jobs(input);
  const parts: Job[][] = [];
  let part: Job[] = [],
    bytes = 0;
  for (const job of items) {
    const size = new TextEncoder().encode(JSON.stringify(job)).length;
    if (part.length && bytes + size > 1_000_000) {
      parts.push(part);
      part = [];
      bytes = 0;
    }
    part.push(job);
    bytes += size;
  }
  if (part.length || !parts.length) parts.push(part);
  let rowOffset = 0;
  let exportRowOffset = 0;
  for (const [index, records] of parts.entries()) {
    if (await context.cancelled())
      throw new Error("Run is paused or cancelled");
    const stem =
      parts.length === 1
        ? "skills-first"
        : `skills-first-${String(index + 1).padStart(4, "0")}`;
    const header = [
      "id",
      "title",
      "status",
      "original",
      "rewritten",
      "citations",
      "errors",
      "parentId",
      "level",
      "levelText",
    ];
    const rows = records.map((j) => [
      j.id,
      j.name,
      j.status,
      j.originalText ?? j.text,
      j.rewrittenText ?? "",
      JSON.stringify(j.citations),
      j.errors.join("; "),
      j.parentId ?? "",
      j.level?.name ?? "",
      j.text,
    ]);
    await context.artifact(
      `${stem}.json`,
      JSON.stringify(records, null, 2),
      "application/json",
    );
    await context.artifact(
      `${stem}.csv`,
      [header, ...rows]
        .map((row) => row.map(csvCell).join(","))
        .join("\r\n"),
      "text/csv",
    );
    await context.artifact(
      `${stem}.md`,
      records
        .map(
          (j) =>
            `## ${j.name}\n\nStatus: ${j.status}\n\n${j.rewrittenText ?? j.text}\n\n${j.citations.map((c) => `Source: ${c.url}\n> ${c.quote}`).join("\n\n")}`,
        )
        .join("\n\n"),
      "text/markdown",
    );
    const eligible = records.filter(
      (job) => job.status === "complete" && !job.errors.length,
    );
    if (
      context.mode === "bulk" &&
      Array.isArray(context.configuration.outputBindings) &&
      eligible.length
    ) {
      const exportRows = rows.filter(
        (_, index) =>
          records[index].status === "complete" &&
          !records[index].errors.length,
      );
      const outgoingRows =
        exportRowOffset === 0 ? [header, ...exportRows] : exportRows;
      for (const binding of context.configuration.outputBindings)
        await context.connector(
          `export:${binding}:${index}`,
          String(binding),
          "write",
          {
            rows: asJson(outgoingRows),
            rowOffset: exportRowOffset,
            documents: asJson(eligible),
          },
        );
      exportRowOffset += outgoingRows.length;
    }
    rowOffset += rows.length + (index === 0 ? 1 : 0);
    await context.progress(rowOffset - 1, items.length);
  }
  if (parts.length > 1)
    await context.artifact(
      "skills-first-manifest.json",
      JSON.stringify(
        {
          records: items.length,
          parts: parts.map((records, index) => ({
            stem: `skills-first-${String(index + 1).padStart(4, "0")}`,
            records: records.length,
          })),
        },
        null,
        2,
      ),
      "application/json",
    );
  return asJson(items);
};
