import { readFile } from "node:fs/promises";
import { loadEvaluator } from "./skillsFirstFixture.js";
const evaluate = await loadEvaluator();
const files = process.argv.slice(2);
if (!files.length)
  throw new Error(
    "Usage: npm run evaluate:skills-first -- output.json [output-part2.json ...]",
  );
const dataset = JSON.parse(
  await readFile(
    new URL(
      "../../../workflow-packages/skills-first/evaluation/cases.json",
      import.meta.url,
    ),
    "utf8",
  ),
);
const outputs = (
  await Promise.all(
    files.map(async (file) => {
      const parsed = JSON.parse(await readFile(file, "utf8"));
      const data = Array.isArray(parsed) ? parsed : parsed.jobDescriptions;
      if (!Array.isArray(data))
        throw new Error(`${file}: expected a memory export or record array`);
      return data;
    }),
  )
).flat();
const result = evaluate(dataset, outputs);
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
process.exitCode = result.success ? 0 : 1;
