import { socketRequest } from "./socketClient.js";
import { readFile, stat } from "node:fs/promises";
import { parseWorkflowArguments } from "./cliArguments.js";
const parsed = parseWorkflowArguments(process.argv.slice(2));
let body = parsed.body;
if (parsed.proposalFile) {
  if ((await stat(parsed.proposalFile)).size > 64_000)
    throw new Error("Proposal file is too large");
  body = JSON.parse(await readFile(parsed.proposalFile, "utf8"));
}
const result = await socketRequest(
  "/workspace/.workflow/control.sock",
  parsed.route,
  body,
);
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
