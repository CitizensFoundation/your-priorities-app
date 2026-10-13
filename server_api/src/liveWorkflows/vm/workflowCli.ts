import { randomUUID } from "node:crypto";
import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

/** The CLI is copied into an isolated workspace, without the rest of the host runtime. */
export async function writeWorkflowCli(
  directory: string,
  readArtifact = (name: string) =>
    readFile(new URL(`../runner/${name}`, import.meta.url), "utf8"),
) {
  for (const name of [
    "cli.js",
    "cliArguments.js",
    "socketClient.js",
    "modelLimits.js",
  ]) {
    const target = path.join(directory, name);
    const temporary = `${target}.${randomUUID()}.tmp`;
    await writeFile(temporary, await readArtifact(name), { mode: 0o600 });
    await rename(temporary, target);
  }
}
