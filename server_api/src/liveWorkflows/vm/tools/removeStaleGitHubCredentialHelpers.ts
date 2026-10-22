import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const CredentialHelperFileName = "yp-live-workflow-github-credential-helper.sh";

export type RemoveStaleGitHubCredentialHelpersResult = {
  dryRun: boolean;
  groupId: number;
  workspaceRoot: string;
  groupExperimentsRoot: string;
  candidates: Array<{
    path: string;
    action: "would_remove" | "removed";
  }>;
  warnings: string[];
};

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const result = await removeStaleGitHubCredentialHelpers(options);
  console.log(JSON.stringify(result, null, 2));
}

export async function removeStaleGitHubCredentialHelpers(input: {
  groupId: number;
  workspaceRoot: string;
  yes?: boolean;
}): Promise<RemoveStaleGitHubCredentialHelpersResult> {
  if (!Number.isSafeInteger(input.groupId) || input.groupId <= 0) {
    throw new Error("groupId must be a positive integer");
  }

  const workspaceRoot = path.resolve(requiredString(input.workspaceRoot, "workspaceRoot"));
  if (workspaceRoot === path.parse(workspaceRoot).root) {
    throw new Error("workspaceRoot must not be a filesystem root");
  }

  const groupExperimentsRoot = path.join(
    workspaceRoot,
    "groups",
    String(input.groupId),
    "experiments"
  );
  assertPathWithin(workspaceRoot, groupExperimentsRoot);
  await assertDirectoryWithinWorkspace(workspaceRoot, groupExperimentsRoot);

  const warnings: string[] = [];
  const helperPaths: string[] = [];
  const experimentEntries = await fs.readdir(groupExperimentsRoot, { withFileTypes: true });

  for (const experimentEntry of experimentEntries) {
    const experimentRoot = path.join(groupExperimentsRoot, experimentEntry.name);
    if (!experimentEntry.isDirectory()) {
      if (experimentEntry.isSymbolicLink()) {
        warnings.push(`Skipped symlinked experiment directory: ${experimentRoot}`);
      }
      continue;
    }

    const experimentWorkspace = path.join(experimentRoot, "workspace");
    if (!(await isPlainDirectory(experimentWorkspace, warnings))) {
      continue;
    }

    const repositoryEntries = await fs.readdir(experimentWorkspace, { withFileTypes: true });
    for (const repositoryEntry of repositoryEntries) {
      const repositoryPath = path.join(experimentWorkspace, repositoryEntry.name);
      if (!repositoryEntry.isDirectory()) {
        if (repositoryEntry.isSymbolicLink()) {
          warnings.push(`Skipped symlinked repository directory: ${repositoryPath}`);
        }
        continue;
      }

      const gitDirectory = path.join(repositoryPath, ".git");
      if (!(await isPlainDirectory(gitDirectory, warnings))) {
        continue;
      }

      const helperPath = path.join(gitDirectory, CredentialHelperFileName);
      assertPathWithin(groupExperimentsRoot, helperPath);
      const helperStats = await lstatOrNull(helperPath);
      if (!helperStats) {
        continue;
      }
      if (helperStats.isSymbolicLink() || !helperStats.isFile()) {
        warnings.push(`Skipped non-regular credential helper: ${helperPath}`);
        continue;
      }
      helperPaths.push(helperPath);
    }
  }

  helperPaths.sort();
  const dryRun = input.yes !== true;
  const candidates: RemoveStaleGitHubCredentialHelpersResult["candidates"] = [];

  for (const helperPath of helperPaths) {
    if (!dryRun) {
      const currentStats = await lstatOrNull(helperPath);
      if (!currentStats) {
        warnings.push(`Credential helper disappeared before removal: ${helperPath}`);
        continue;
      }
      if (currentStats.isSymbolicLink() || !currentStats.isFile()) {
        warnings.push(`Credential helper changed to a non-regular file before removal: ${helperPath}`);
        continue;
      }
      await fs.unlink(helperPath);
    }

    candidates.push({
      path: helperPath,
      action: dryRun ? "would_remove" : "removed",
    });
  }

  return {
    dryRun,
    groupId: input.groupId,
    workspaceRoot,
    groupExperimentsRoot,
    candidates,
    warnings,
  };
}

function parseArgs(args: string[]): {
  groupId: number;
  workspaceRoot: string;
  yes: boolean;
} {
  let groupId: number | null = null;
  let workspaceRoot = process.env.YP_LIVE_WORKFLOW_VM_WORKSPACE_ROOT?.trim() || null;
  let yes = false;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--yes") {
      yes = true;
      continue;
    }
    if (arg === "--workspace-root") {
      workspaceRoot = requiredString(args[index + 1], "--workspace-root");
      index += 1;
      continue;
    }
    if (arg?.startsWith("--")) {
      throw new Error(`Unknown argument: ${arg}`);
    }
    if (groupId !== null) {
      throw new Error(`Unexpected argument: ${arg}`);
    }

    const parsed = Number(arg);
    if (!Number.isSafeInteger(parsed) || parsed <= 0) {
      throw new Error("groupId must be a positive integer");
    }
    groupId = parsed;
  }

  if (groupId === null || !workspaceRoot) {
    throw new Error(
      "Usage: node apps/vm-agent/dist/tools/removeStaleGitHubCredentialHelpers.js <group-id> " +
      "--workspace-root <path> [--yes]"
    );
  }

  return { groupId, workspaceRoot, yes };
}

async function assertDirectoryWithinWorkspace(workspaceRoot: string, directoryPath: string): Promise<void> {
  const workspaceStats = await fs.lstat(workspaceRoot);
  if (!workspaceStats.isDirectory()) {
    throw new Error(`workspaceRoot is not a directory: ${workspaceRoot}`);
  }

  const directoryStats = await fs.lstat(directoryPath);
  if (!directoryStats.isDirectory()) {
    throw new Error(`Group experiments path is not a directory: ${directoryPath}`);
  }

  const [realWorkspaceRoot, realDirectoryPath] = await Promise.all([
    fs.realpath(workspaceRoot),
    fs.realpath(directoryPath),
  ]);
  assertPathWithin(realWorkspaceRoot, realDirectoryPath);
}

async function isPlainDirectory(directoryPath: string, warnings: string[]): Promise<boolean> {
  const stats = await lstatOrNull(directoryPath);
  if (!stats) {
    return false;
  }
  if (stats.isSymbolicLink() || !stats.isDirectory()) {
    warnings.push(`Skipped non-directory or symlinked path: ${directoryPath}`);
    return false;
  }
  return true;
}

async function lstatOrNull(targetPath: string): Promise<Awaited<ReturnType<typeof fs.lstat>> | null> {
  try {
    return await fs.lstat(targetPath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

function assertPathWithin(parentPath: string, childPath: string): void {
  const relativePath = path.relative(parentPath, childPath);
  if (relativePath === "" || relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error(`Path must be below ${parentPath}: ${childPath}`);
  }
}

function requiredString(value: unknown, label: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} is required`);
  }
  return value.trim();
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
