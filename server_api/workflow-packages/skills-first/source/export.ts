import { jobs, asJson, type Agent, type Job } from "./sdk.js";
import { canonicalJob, skillsFirstMemory } from "./memory.js";
import { masterTable, workbook, workbookContentType } from "./workbook.js";

export function csvCell(value: string): string {
  // CSVs are often opened in spreadsheets; prevent formula execution from source data.
  const safe = /^(?:\s*[=+@\-]|[\t\r])/.test(value) ? `'${value}` : value;
  return `"${safe.replaceAll('"', '""')}"`;
}
export const run: Agent = async (context, input) => {
  const items = jobs(input).map(canonicalJob);
  const configuredAgentId = context.configuration.agentId;
  const agentId =
    typeof configuredAgentId === "string" ||
    typeof configuredAgentId === "number"
      ? configuredAgentId
      : null;
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
    const memory = skillsFirstMemory(records, agentId);
    const rows = masterTable(memory);
    await context.artifact(
      `${stem}.json`,
      JSON.stringify(memory, null, 2),
      "application/json",
    );
    await context.artifact(
      `${stem}.csv`,
      rows
        .map((row) =>
          row.map((value) => csvCell(String(value ?? ""))).join(","),
        )
        .join("\r\n"),
      "text/csv",
    );
    await context.artifact(
      `${stem}.xlsx`,
      JSON.stringify(workbook(memory)),
      workbookContentType,
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
      const eligibleTable = masterTable(skillsFirstMemory(eligible, agentId));
      const outgoingRows =
        exportRowOffset === 0 ? eligibleTable : eligibleTable.slice(2);
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
    rowOffset += records.length;
    await context.progress(rowOffset, items.length);
  }
  if (parts.length > 1)
    await context.artifact(
      "skills-first-manifest.json",
      JSON.stringify(
        {
          records: items.length,
          schemaVersion: "skills-first-memory-v1",
          formats: ["json", "csv", "xlsx", "md"],
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
