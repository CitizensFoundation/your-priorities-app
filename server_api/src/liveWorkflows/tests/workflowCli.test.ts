import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { tmpdir } from "node:os";
import path from "node:path";
import ts from "typescript";
import { writeWorkflowCli } from "../vm/workflowCli.js";

test("the materialized Codex CLI loads with all dependencies in an isolated workspace", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "yp-workflow-cli-"));
  try {
    await writeWorkflowCli(
      directory,
      async (name) =>
        ts.transpileModule(
          await readFile(
            new URL(
              `../runner/${name.replace(/\.js$/, ".ts")}`,
              import.meta.url,
            ),
            "utf8",
          ),
          {
            compilerOptions: {
              module: ts.ModuleKind.ESNext,
              target: ts.ScriptTarget.ES2022,
            },
          },
        ).outputText,
    );
    // Argument validation must load every import before it can reject this command.
    // No socket, container, credentials or paid provider is involved.
    await assert.rejects(
      promisify(execFile)(process.execPath, [
        path.join(directory, "cli.js"),
        "invalid-command",
      ]),
      (error: Error & { code?: number; stderr?: string }) => {
        assert.equal(error.code, 1);
        assert.match(error.stderr ?? "", /Usage: yp-workflow/);
        assert.doesNotMatch(error.stderr ?? "", /ERR_MODULE_NOT_FOUND/);
        return true;
      },
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
