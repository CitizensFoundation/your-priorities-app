import { createReadStream } from "node:fs";
import { readFile as read } from "node:fs/promises";
import path from "node:path";
import { parse } from "csv-parse";
import { z } from "zod";
import { load } from "cheerio";

export async function parseInput(
  file: string,
  name: string,
  source: string,
): Promise<Record<string, YpWorkflowJson>[]> {
  const extension = path.extname(name).toLowerCase();
  let values: unknown[];
  if (extension === ".csv" || extension === ".tsv") {
    values = [];
    const parser = createReadStream(file).pipe(
      parse({
        columns: true,
        bom: true,
        skip_empty_lines: true,
        delimiter: extension === ".tsv" ? "\t" : ",",
        max_record_size: 1_000_000,
      }),
    );
    for await (const record of parser) values.push(record);
  } else if (extension === ".json") {
    const input: unknown = JSON.parse(await read(file, "utf8"));
    // Original Skills First memory exports wrap jobs in jobDescriptions.
    // Keep their row fields intact; the package handles domain normalization.
    const memory =
      input && typeof input === "object" && !Array.isArray(input)
        ? (input as Record<string, unknown>)
        : undefined;
    values =
      memory && Array.isArray(memory.jobDescriptions)
        ? memory.jobDescriptions.map((value) => ({
            ...z.record(z.string(), z.unknown()).parse(value),
            ...(typeof memory.agentId === "string" ||
            typeof memory.agentId === "number"
              ? { agentId: memory.agentId }
              : {}),
          }))
        : Array.isArray(input)
          ? input
          : [input];
  } else {
    let text: string;
    if (extension === ".pdf") {
      const { PDFParse } = await import("pdf-parse");
      const parser = new PDFParse({ data: await read(file) });
      try {
        text = (await parser.getText()).text;
      } finally {
        await parser.destroy();
      }
    } else if (extension === ".docx") {
      const { default: mammoth } = await import("mammoth");
      text = (await mammoth.extractRawText({ path: file })).value;
    } else if ([".txt", ".md", ".html", ".htm"].includes(extension)) {
      text = await read(file, "utf8");
      if (extension.startsWith(".htm")) {
        const $ = load(text);
        $("script,style").remove();
        text = $.text();
      }
    } else
      throw new Error(
        `Unsupported input format: ${extension}. Use JSON, CSV, TSV, text, Markdown, HTML, PDF or DOCX.`,
      );
    values = [{ id: source, name, text }];
  }
  // Preserve arbitrary table fields. Domain normalization belongs to the package.
  const schema = z.record(z.string(), z.unknown());
  return values.map((value, index) => {
    const row = schema.parse(value);
    return {
      ...(row as Record<string, YpWorkflowJson>),
      id: `${source}:${row.id ?? index + 1}`,
      source,
    };
  });
}
export function stratifiedSample<T extends { text?: YpWorkflowJson }>(
  items: T[],
  count: number,
): T[] {
  if (count >= items.length) return items;
  const sorted = [...items].sort(
    (a, b) =>
      String(a.text ?? JSON.stringify(a)).length -
      String(b.text ?? JSON.stringify(b)).length,
  );
  if (count === 1) return [sorted[Math.floor(sorted.length / 2)]];
  return Array.from(
    { length: count },
    (_, i) => sorted[Math.round((i * (sorted.length - 1)) / (count - 1))],
  );
}
