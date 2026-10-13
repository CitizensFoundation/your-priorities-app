import { readFile, writeFile } from "node:fs/promises";
import { parseInput } from "./inputs.js";

// Document parsers run with the same network, memory, CPU and mount restrictions as agents.
const manifest = JSON.parse(await readFile("/input/manifest.json", "utf8")) as {
  id: string;
  name: string;
};
const records = await parseInput("/input/document", manifest.name, manifest.id);
await writeFile("/output/records.json", JSON.stringify(records), {
  mode: 0o600,
});
