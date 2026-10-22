import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { removeStaleGitHubCredentialHelpers } from "../../tools/removeStaleGitHubCredentialHelpers.js";

test("stale GitHub credential helper cleanup previews and applies to one group", async () => {
  const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-stale-github-helper-"));
  const group26Helper = await writeHelper(workspaceRoot, 26, "experiment-a", "repo-a");
  const secondGroup26Helper = await writeHelper(workspaceRoot, 26, "experiment-b", "repo-b");
  const group27Helper = await writeHelper(workspaceRoot, 27, "experiment-c", "repo-c");

  const preview = await removeStaleGitHubCredentialHelpers({
    groupId: 26,
    workspaceRoot,
  });

  assert.equal(preview.dryRun, true);
  assert.deepEqual(preview.candidates, [group26Helper, secondGroup26Helper]
    .sort()
    .map((helperPath) => ({ path: helperPath, action: "would_remove" })));
  assert.equal(await pathExists(group26Helper), true);
  assert.equal(await pathExists(secondGroup26Helper), true);
  assert.equal(await pathExists(group27Helper), true);

  const applied = await removeStaleGitHubCredentialHelpers({
    groupId: 26,
    workspaceRoot,
    yes: true,
  });

  assert.equal(applied.dryRun, false);
  assert.deepEqual(applied.candidates, [group26Helper, secondGroup26Helper]
    .sort()
    .map((helperPath) => ({ path: helperPath, action: "removed" })));
  assert.equal(await pathExists(group26Helper), false);
  assert.equal(await pathExists(secondGroup26Helper), false);
  assert.equal(await pathExists(group27Helper), true);
});

test("stale GitHub credential helper cleanup skips symlinks", async () => {
  const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), "yp-live-workflow-stale-github-helper-safe-"));
  const experimentsRoot = path.join(workspaceRoot, "groups", "26", "experiments");
  const outsideRoot = path.join(workspaceRoot, "outside");
  const outsideHelper = path.join(outsideRoot, ".git", "yp-live-workflow-github-credential-helper.sh");
  await fs.mkdir(path.dirname(outsideHelper), { recursive: true });
  await fs.writeFile(outsideHelper, "outside-secret", "utf8");
  await fs.mkdir(experimentsRoot, { recursive: true });
  await fs.symlink(outsideRoot, path.join(experimentsRoot, "symlinked-experiment"), "dir");

  const linkedHelperPath = path.join(
    experimentsRoot,
    "regular-experiment",
    "workspace",
    "repo",
    ".git",
    "yp-live-workflow-github-credential-helper.sh"
  );
  await fs.mkdir(path.dirname(linkedHelperPath), { recursive: true });
  await fs.symlink(outsideHelper, linkedHelperPath, "file");

  const result = await removeStaleGitHubCredentialHelpers({
    groupId: 26,
    workspaceRoot,
    yes: true,
  });

  assert.deepEqual(result.candidates, []);
  assert.equal(result.warnings.some((warning) => warning.includes("symlinked-experiment")), true);
  assert.equal(result.warnings.some((warning) => warning.includes(linkedHelperPath)), true);
  assert.equal(await pathExists(outsideHelper), true);
  assert.equal((await fs.lstat(linkedHelperPath)).isSymbolicLink(), true);
});

test("stale GitHub credential helper cleanup rejects unsafe scope", async () => {
  await assert.rejects(
    removeStaleGitHubCredentialHelpers({ groupId: 0, workspaceRoot: "/mnt/workspaces" }),
    /groupId must be a positive integer/u
  );
  await assert.rejects(
    removeStaleGitHubCredentialHelpers({ groupId: 26, workspaceRoot: path.parse(process.cwd()).root }),
    /workspaceRoot must not be a filesystem root/u
  );
});

async function writeHelper(
  workspaceRoot: string,
  groupId: number,
  experimentDirectory: string,
  repositoryDirectory: string
): Promise<string> {
  const helperPath = path.join(
    workspaceRoot,
    "groups",
    String(groupId),
    "experiments",
    experimentDirectory,
    "workspace",
    repositoryDirectory,
    ".git",
    "yp-live-workflow-github-credential-helper.sh"
  );
  await fs.mkdir(path.dirname(helperPath), { recursive: true });
  await fs.writeFile(helperPath, "secret", { encoding: "utf8", mode: 0o700 });
  return helperPath;
}

async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await fs.lstat(targetPath);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return false;
    }
    throw error;
  }
}
