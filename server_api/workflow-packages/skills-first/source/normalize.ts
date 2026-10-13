import { asJson, object, type Agent, type Job } from "./sdk.js";

export const run: Agent = async (context, input) => {
  if (!Array.isArray(input))
    throw new Error(
      "Input must contain normalized document/table records",
    );
  const seen = new Set<string>();
  const output: Job[] = [];
  const fields =
    context.configuration.fields &&
    typeof context.configuration.fields === "object"
      ? object(context.configuration.fields)
      : {};
  for (const [index, value] of input.entries()) {
    const row = object(value);
    const id = String(row.id ?? row.titleCode ?? index + 1);
    if (seen.has(id)) throw new Error(`Duplicate record ID: ${id}`);
    seen.add(id);
    const originalText = String(
      row[String(fields.text ?? "text")] ?? row.description ?? "",
    );
    const text = originalText.trim();
    if (!text) throw new Error(`Missing description for record ${id}`);
    output.push({
      id,
      name: String(row[String(fields.name ?? "name")] ?? row.title ?? id),
      text,
      originalText,
      source: String(row.source ?? row.url ?? "upload"),
      jurisdiction: String(
        row.jurisdiction ??
          context.configuration.jurisdiction ??
          "New Jersey, USA",
      ),
      status: "pending",
      analysis: {},
      citations: [],
      errors: [],
    });
  }
  await context.progress(output.length, output.length);
  return asJson(output);
};
