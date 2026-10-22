import { constants as fsConstants } from "node:fs";
import type { Dirent, Stats } from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import {
  WorkspaceFileMaterializePayloadSchema,
  WorkspacePreparePayloadSchema,
  WorkspacePreparedLayoutSchema,
  type WorkspaceFileMaterializePayload,
  type WorkspaceFileMaterializedPayload,
  type WorkspaceGitHubFolder,
  type WorkspaceGitHubFolderPrepareResult,
  type WorkspacePreparePayload,
  type WorkspacePreparedLayout,
  type WorkspacePreparedPayload,
  type WorkspaceRepoPrepareResult,
} from "../../contracts/index.js";
import { simpleGit } from "simple-git";

export type WorkspaceLayout = {
  rootPath: string;
  workspacePath: string;
  codexHomePath: string;
  artifactsPath: string;
  cachePath: string;
  datasetOutputPath?: string;
};

export type WorkspaceDirectoryPresence = {
  workspace: boolean;
  codexHome: boolean;
  artifacts: boolean;
  cache: boolean;
};

export type WorkspaceGitCloneOptions = {
  credentialHelperPath?: string | null;
};

export type WorkspaceGitLocalConfigOptions = {
  allowUnsafeCredentialHelper?: boolean;
};

export type WorkspaceListEntry = {
  rootPath: string;
  layout: WorkspaceLayout;
  directories: WorkspaceDirectoryPresence;
};

export interface WorkspaceGitAdapter {
  clone(repoUrl: string, workspacePath: string, options?: WorkspaceGitCloneOptions): Promise<void>;
  fetch(workspacePath: string): Promise<void>;
  pull(workspacePath: string): Promise<void>;
  checkout(workspacePath: string, ref: string): Promise<void>;
  currentRef(workspacePath: string): Promise<string | null>;
  currentCommit(workspacePath: string): Promise<string | null>;
  setRemoteUrl(workspacePath: string, remoteName: string, repoUrl: string): Promise<void>;
  setLocalConfig(workspacePath: string, key: string, value: string, options?: WorkspaceGitLocalConfigOptions): Promise<void>;
}

export type WorkspaceManagerOptions = {
  git?: WorkspaceGitAdapter;
  now?: () => Date;
  allowedRootPath?: string;
  allowedDatasetOutputRootPath?: string;
};

export class WorkspaceManager {
  private readonly git: WorkspaceGitAdapter;
  private readonly now: () => Date;
  private readonly allowedRootPath?: string;
  private readonly allowedDatasetOutputRootPath?: string;

  constructor(options: WorkspaceManagerOptions = {}) {
    this.git = options.git ?? new SimpleGitWorkspaceGitAdapter();
    this.now = options.now ?? (() => new Date());
    this.allowedRootPath = options.allowedRootPath ? path.resolve(options.allowedRootPath) : undefined;
    this.allowedDatasetOutputRootPath = options.allowedDatasetOutputRootPath
      ? path.resolve(options.allowedDatasetOutputRootPath)
      : undefined;
  }

  describeLayout(rootPath: string, datasetOutputPath?: string): WorkspaceLayout {
    const resolvedRootPath = path.resolve(rootPath);

    return {
      rootPath: resolvedRootPath,
      workspacePath: path.join(resolvedRootPath, "workspace"),
      codexHomePath: path.join(resolvedRootPath, "codex-home"),
      artifactsPath: path.join(resolvedRootPath, "artifacts"),
      cachePath: path.join(resolvedRootPath, "cache"),
      ...(datasetOutputPath ? { datasetOutputPath: path.resolve(datasetOutputPath) } : {}),
    };
  }

  async listWorkspaces(rootPath?: string): Promise<WorkspaceListEntry[]> {
    const resolvedRootPath = rootPath ? path.resolve(rootPath) : this.allowedRootPath;

    if (!resolvedRootPath) {
      return [];
    }

    if (this.allowedRootPath && !isPathInside(this.allowedRootPath, resolvedRootPath)) {
      throw new Error(`Workspace list path is outside the VM workspace root: ${rootPath}`);
    }

    let entries: Dirent[];
    try {
      entries = await fs.readdir(resolvedRootPath, { withFileTypes: true });
    } catch (error) {
      if (isNotFoundError(error)) {
        return [];
      }

      throw error;
    }

    return Promise.all(
      entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => this.workspaceListEntry(path.join(resolvedRootPath, entry.name)))
    );
  }

  async validateSessionLayout(input: WorkspacePreparedLayout): Promise<WorkspaceLayout> {
    const layout = WorkspacePreparedLayoutSchema.parse(input);
    const expected = this.describeLayout(layout.rootPath, layout.datasetOutputPath);

    if (!layoutsMatch(layout, expected)) {
      throw new Error("Workspace session layout does not match the workspace root path");
    }

    await this.validateRootPath(layout.rootPath);
    await Promise.all([
      ensureSafeDirectory(layout.rootPath, layout.workspacePath),
      ensureSafeDirectory(layout.rootPath, layout.codexHomePath),
      ensureSafeDirectory(layout.rootPath, layout.artifactsPath),
      ensureSafeDirectory(layout.rootPath, layout.cachePath),
      ...(layout.datasetOutputPath ? [ensureSafeDirectoryForDatasetOutput(layout.datasetOutputPath, this.allowedDatasetOutputRootPath)] : []),
    ]);

    return expected;
  }

  async prepareWorkspace(input: WorkspacePreparePayload): Promise<WorkspacePreparedPayload> {
    const payload = WorkspacePreparePayloadSchema.parse(input);
    await this.validateRootPath(payload.rootPath);
    const layout = this.describeLayout(payload.rootPath, payload.datasetOutputPath);
    const materializedFiles: string[] = [];

    await this.ensureLayout(layout);
    const repo = await this.prepareRepository(layout, payload);
    const githubFolder = await this.prepareGitHubFolder(layout, payload);
    await this.materializeFiles(layout, payload, materializedFiles);

    return {
      commandId: payload.commandId,
      auditContext: payload.auditContext,
      workspaceId: payload.workspaceId,
      vmHostId: payload.vmHostId,
      rootPath: layout.rootPath,
      preparedAt: this.now().toISOString(),
      layout,
      repo,
      githubFolder,
      materializedFiles,
    };
  }

  async materializeWorkspaceFile(
    input: WorkspaceFileMaterializePayload,
    content: AsyncIterable<Buffer | Uint8Array | string> | Iterable<Buffer | Uint8Array | string>
  ): Promise<WorkspaceFileMaterializedPayload> {
    const payload = WorkspaceFileMaterializePayloadSchema.parse(input);
    await this.validateRootPath(payload.rootPath);
    const layout = this.describeLayout(payload.rootPath);
    await this.ensureLayout(layout);
    const result = await this.writeTransferredFile(layout, payload.target ?? "workspace", payload.path, content, {
      checksumSha256: payload.checksumSha256,
      sizeBytes: Number(payload.sizeBytes),
      mode: payload.mode ?? undefined,
    });

    return {
      commandId: payload.commandId,
      workspaceId: payload.workspaceId,
      vmHostId: payload.vmHostId,
      rootPath: layout.rootPath,
      target: payload.target ?? "workspace",
      path: result.relativePath,
      contentChecksumSha256: result.checksumSha256,
      sizeBytes: result.sizeBytes,
      materializedAt: this.now().toISOString(),
    };
  }

  private async ensureLayout(layout: WorkspaceLayout): Promise<void> {
    await Promise.all([
      ensureSafeDirectory(layout.rootPath, layout.workspacePath),
      ensureSafeDirectory(layout.rootPath, layout.codexHomePath),
      ensureSafeDirectory(layout.rootPath, layout.artifactsPath),
      ensureSafeDirectory(layout.rootPath, layout.cachePath),
      ...(layout.datasetOutputPath ? [ensureSafeDirectoryForDatasetOutput(layout.datasetOutputPath, this.allowedDatasetOutputRootPath)] : []),
    ]);
  }

  private async prepareRepository(
    layout: WorkspaceLayout,
    payload: WorkspacePreparePayload
  ): Promise<WorkspaceRepoPrepareResult> {
    if (!payload.repoUrl) {
      return {
        status: "empty",
        repoUrl: null,
        repoRef: payload.repoRef ?? null,
        checkedOutRef: null,
      };
    }

    const hasGitDirectory = await pathExists(path.join(layout.workspacePath, ".git"));
    const status = hasGitDirectory ? "updated" : "cloned";

    if (hasGitDirectory) {
      await this.git.fetch(layout.workspacePath);

      if (payload.repoRef) {
        await this.git.checkout(layout.workspacePath, payload.repoRef);
        const checkedOutRef = await this.git.currentRef(layout.workspacePath);

        if (checkedOutRef && checkedOutRef !== "HEAD") {
          await this.git.pull(layout.workspacePath);
        }
      } else {
        await this.git.pull(layout.workspacePath);
      }
    } else {
      await this.git.clone(payload.repoUrl, layout.workspacePath);

      if (payload.repoRef) {
        await this.git.checkout(layout.workspacePath, payload.repoRef);
      }
    }

    return {
      status,
      repoUrl: payload.repoUrl,
      repoRef: payload.repoRef ?? null,
      checkedOutRef: await this.git.currentRef(layout.workspacePath),
    };
  }

  private async prepareGitHubFolder(
    layout: WorkspaceLayout,
    payload: WorkspacePreparePayload
  ): Promise<WorkspaceGitHubFolderPrepareResult | null> {
    const githubFolder = payload.githubFolder ?? null;
    if (!githubFolder) {
      return null;
    }

    const repoPath = path.join(layout.workspacePath, githubFolder.repoDirectoryName);
    if (!isPathInside(layout.workspacePath, repoPath)) {
      throw new Error("GitHub repository directory is outside the managed workspace");
    }

    const hasGitDirectory = await prepareSafeGitHubRepoDirectory(layout, repoPath);
    const status = hasGitDirectory ? "updated" : "cloned";
    let credentialHelperPath: string | null = null;

    if (hasGitDirectory) {
      credentialHelperPath = await this.writeGitHubFolderCredentialHelper(repoPath, githubFolder);
      await this.configureGitHubFolderCredentialHelper(repoPath, credentialHelperPath);
      await this.git.setRemoteUrl(repoPath, "origin", githubFolder.cloneUrl);
      await this.git.fetch(repoPath);
      await this.git.checkout(repoPath, githubFolder.branchName);
      const checkedOutRef = await this.git.currentRef(repoPath);

      if (checkedOutRef && checkedOutRef !== "HEAD") {
        await this.git.pull(repoPath);
      }
      await this.configureGitHubFolderCredentialHelper(
        repoPath,
        githubFolderCredentialHelperContainerPath(githubFolder)
      );
    } else {
      const cloneCredentialHelperPath = await this.writeGitHubFolderTemporaryCredentialHelper(layout, githubFolder);
      try {
        await this.git.clone(githubFolder.cloneUrl, repoPath, {
          credentialHelperPath: cloneCredentialHelperPath,
        });
        await assertSafeGitHubRepoDirectory(layout, repoPath);
        credentialHelperPath = await this.writeGitHubFolderCredentialHelper(repoPath, githubFolder);
        await this.configureGitHubFolderCredentialHelper(
          repoPath,
          githubFolderCredentialHelperContainerPath(githubFolder)
        );
        await this.git.setRemoteUrl(repoPath, "origin", githubFolder.cloneUrl);
        await this.git.checkout(repoPath, githubFolder.branchName);
      } finally {
        if (cloneCredentialHelperPath) {
          await removePathNoFollow(cloneCredentialHelperPath).catch(() => undefined);
        }
      }
    }

    await this.configureGitHubFolderCommitIdentity(repoPath, githubFolder);

    return {
      status,
      repositoryFullName: githubFolder.repositoryFullName,
      branchName: githubFolder.branchName,
      repoDirectoryName: githubFolder.repoDirectoryName,
      folderPath: githubFolder.folderPath,
      workspacePath: repoPath,
      credentialHelperPath,
      checkedOutRef: await this.git.currentRef(repoPath),
      checkedOutCommitSha: await this.git.currentCommit(repoPath),
    };
  }

  private async writeGitHubFolderCredentialHelper(repoPath: string, githubFolder: WorkspaceGitHubFolder): Promise<string | null> {
    const helperPath = path.join(repoPath, ".git", "yp-live-workflow-github-credential-helper.sh");
    return this.writeGitHubFolderCredentialHelperFile(helperPath, githubFolder);
  }

  private async writeGitHubFolderTemporaryCredentialHelper(
    layout: WorkspaceLayout,
    githubFolder: WorkspaceGitHubFolder
  ): Promise<string | null> {
    const helperPath = path.join(
      layout.cachePath,
      "github-credential-helpers",
      `github-folder-${githubFolderCredentialHelperCacheKey(githubFolder)}.sh`
    );
    await ensureSafeDirectory(layout.rootPath, path.dirname(helperPath));
    return this.writeGitHubFolderCredentialHelperFile(helperPath, githubFolder);
  }

  private async writeGitHubFolderCredentialHelperFile(
    helperPath: string,
    githubFolder: WorkspaceGitHubFolder
  ): Promise<string | null> {
    const accessToken = githubFolder.accessToken?.trim();
    if (!accessToken) {
      return null;
    }

    const username = githubFolder.tokenUsername?.trim() || "x-access-token";
    const repositoryFullName = githubFolder.repositoryFullName.trim().replace(/\.git$/u, "");
    const script = [
      "#!/usr/bin/env bash",
      "if [ \"$1\" = \"get\" ]; then",
      "  protocol=\"\"",
      "  host=\"\"",
      "  path_value=\"\"",
      "  while IFS='=' read -r key value; do",
      "    case \"$key\" in",
      "      protocol) protocol=\"$value\" ;;",
      "      host) host=\"$value\" ;;",
      "      path) path_value=\"$value\" ;;",
      "    esac",
      "  done",
      "  path_value=\"${path_value#/}\"",
      "  path_value=\"${path_value%.git}\"",
      `  if [ "$protocol" != "https" ] || [ "$host" != "github.com" ] || [ "$path_value" != ${shellSingleQuote(repositoryFullName)} ]; then`,
      "    exit 0",
      "  fi",
      `  printf 'username=%s\\n' ${shellSingleQuote(username)}`,
      `  printf 'password=%s\\n' ${shellSingleQuote(accessToken)}`,
      "fi",
      "",
    ].join("\n");

    await removeSymlinkIfExists(helperPath);
    await writeFileNoFollow(helperPath, script, 0o700);
    return helperPath;
  }

  private async configureGitHubFolderCredentialHelper(repoPath: string, helperPath: string | null): Promise<void> {
    if (!helperPath) {
      return;
    }

    await this.git.setLocalConfig(repoPath, "credential.helper", `!${helperPath}`, {
      allowUnsafeCredentialHelper: true,
    });
    await this.git.setLocalConfig(repoPath, "credential.useHttpPath", "true");
  }

  private async configureGitHubFolderCommitIdentity(
    repoPath: string,
    githubFolder: WorkspaceGitHubFolder
  ): Promise<void> {
    const name = githubFolder.commitAuthorName.trim();
    const email = githubFolder.commitAuthorEmail.trim();

    if (!name || !email) {
      throw new Error("GitHub folder commit identity is missing");
    }

    await this.git.setLocalConfig(repoPath, "user.name", name);
    await this.git.setLocalConfig(repoPath, "user.email", email);
  }

  private async materializeFiles(
    layout: WorkspaceLayout,
    payload: WorkspacePreparePayload,
    materializedFiles: string[]
  ): Promise<void> {
    const materialization = payload.materialization ?? {};

    if (materialization.agentsMd !== undefined) {
      await this.writeManagedFile(layout, layout.workspacePath, "AGENTS.md", materialization.agentsMd, materializedFiles);
    }

    if (materialization.codexHomeAgentsOverrideMd !== undefined) {
      await this.writeManagedFile(
        layout,
        layout.codexHomePath,
        "AGENTS.override.md",
        materialization.codexHomeAgentsOverrideMd,
        materializedFiles
      );
    }

    if (materialization.codexConfigToml !== undefined) {
      await this.writeManagedFile(
        layout,
        layout.workspacePath,
        ".codex/config.toml",
        materialization.codexConfigToml,
        materializedFiles
      );
    }

    for (const rule of materialization.rules ?? []) {
      const filename = rule.name.endsWith(".rules") ? rule.name : `${rule.name}.rules`;
      await this.writeManagedFile(layout, layout.workspacePath, `.codex/rules/${filename}`, rule.content, materializedFiles);
    }

    for (const skill of materialization.skills ?? []) {
      const skillRoot = `.codex/skills/${skill.name}`;
      await this.writeManagedFile(layout, layout.workspacePath, `${skillRoot}/SKILL.md`, skill.skillMd, materializedFiles);

      for (const file of skill.files ?? []) {
        await this.writeManagedFile(
          layout,
          layout.workspacePath,
          `${skillRoot}/${file.path}`,
          materializationFileContent(file),
          materializedFiles,
          materializationFileMode(file)
        );
      }
    }

    if (materialization.fullPlanMd !== undefined) {
      await this.writeManagedFile(layout, layout.workspacePath, "FULL_PLAN.md", materialization.fullPlanMd, materializedFiles);
    }

    if (materialization.researchPlanMd !== undefined) {
      await this.writeManagedFile(
        layout,
        layout.workspacePath,
        "RESEARCH_PLAN.md",
        materialization.researchPlanMd,
        materializedFiles
      );
    }

    for (const file of materialization.files ?? []) {
      await this.writeManagedFile(
        layout,
        layout.workspacePath,
        file.path,
        materializationFileContent(file),
        materializedFiles,
        materializationFileMode(file)
      );
    }

    for (const file of materialization.cacheFiles ?? []) {
      await this.writeManagedFile(
        layout,
        layout.cachePath,
        file.path,
        materializationFileContent(file),
        materializedFiles,
        materializationFileMode(file)
      );
    }
  }

  private async writeManagedFile(
    layout: WorkspaceLayout,
    basePath: string,
    relativePath: string,
    content: string | Buffer,
    materializedFiles: string[],
    mode?: number
  ): Promise<void> {
    const destination = safeJoin(basePath, relativePath);

    if (!isPathInside(path.resolve(layout.rootPath), destination)) {
      throw new Error(`Materialized file escapes workspace root: ${relativePath}`);
    }

    await ensureSafeDirectory(layout.rootPath, path.dirname(destination));
    await writeFileNoFollow(destination, content, mode);
    materializedFiles.push(normalizeRelativePath(path.relative(layout.rootPath, destination)));
  }

  private async writeTransferredFile(
    layout: WorkspaceLayout,
    target: "workspace" | "artifacts",
    relativePath: string,
    content: AsyncIterable<Buffer | Uint8Array | string> | Iterable<Buffer | Uint8Array | string>,
    expected: { checksumSha256: string; sizeBytes: number; mode?: number }
  ): Promise<{ relativePath: string; checksumSha256: string; sizeBytes: number }> {
    const basePath = target === "artifacts" ? layout.artifactsPath : layout.workspacePath;
    const destination = safeJoin(basePath, relativePath);

    if (!isPathInside(path.resolve(layout.rootPath), destination)) {
      throw new Error(`Materialized file escapes workspace root: ${relativePath}`);
    }

    await ensureSafeDirectory(layout.rootPath, path.dirname(destination));
    const result = await writeTransferredFileNoFollow(destination, content, expected);
    return {
      ...result,
      relativePath: normalizeRelativePath(path.relative(basePath, destination)),
    };
  }

  private async validateRootPath(rootPath: string): Promise<void> {
    if (!path.isAbsolute(rootPath)) {
      throw new Error(`Workspace root path must be absolute: ${rootPath}`);
    }

    if (!this.allowedRootPath) {
      return;
    }

    const resolvedRootPath = path.resolve(rootPath);

    if (!isPathInside(this.allowedRootPath, resolvedRootPath)) {
      throw new Error(`Workspace root path is outside the VM workspace root: ${rootPath}`);
    }

    await ensureSafeRootDirectory(this.allowedRootPath);
    await assertExistingPathComponentsAreNotSymlinks(this.allowedRootPath, resolvedRootPath);

    const [allowedRealPath, rootRealPath] = await Promise.all([
      fs.realpath(this.allowedRootPath),
      realpathIfExists(resolvedRootPath),
    ]);

    if (rootRealPath && !isPathInside(allowedRealPath, rootRealPath)) {
      throw new Error(`Workspace root path is outside the VM workspace root: ${rootPath}`);
    }
  }

  private async workspaceListEntry(rootPath: string): Promise<WorkspaceListEntry> {
    const layout = this.describeLayout(rootPath);

    return {
      rootPath: layout.rootPath,
      layout,
      directories: {
        workspace: await isDirectory(layout.workspacePath),
        codexHome: await isDirectory(layout.codexHomePath),
        artifacts: await isDirectory(layout.artifactsPath),
        cache: await isDirectory(layout.cachePath),
      },
    };
  }
}

class SimpleGitWorkspaceGitAdapter implements WorkspaceGitAdapter {
  async clone(repoUrl: string, workspacePath: string, options?: WorkspaceGitCloneOptions): Promise<void> {
    const cloneOptions = options?.credentialHelperPath
      ? ["-c", `credential.helper=!${options.credentialHelperPath}`, "-c", "credential.useHttpPath=true"]
      : undefined;
    if (cloneOptions) {
      await simpleGit({ unsafe: { allowUnsafeCredentialHelper: true } }).clone(repoUrl, workspacePath, cloneOptions);
      return;
    }

    await simpleGit().clone(repoUrl, workspacePath);
  }

  async fetch(workspacePath: string): Promise<void> {
    await simpleGit({ baseDir: workspacePath }).fetch();
  }

  async pull(workspacePath: string): Promise<void> {
    await simpleGit({ baseDir: workspacePath }).pull();
  }

  async checkout(workspacePath: string, ref: string): Promise<void> {
    await simpleGit({ baseDir: workspacePath }).checkout(ref);
  }

  async currentRef(workspacePath: string): Promise<string | null> {
    try {
      const value = await simpleGit({ baseDir: workspacePath }).revparse(["--abbrev-ref", "HEAD"]);
      return value.trim() || null;
    } catch {
      return null;
    }
  }

  async currentCommit(workspacePath: string): Promise<string | null> {
    try {
      const value = await simpleGit({ baseDir: workspacePath }).revparse(["HEAD"]);
      return value.trim() || null;
    } catch {
      return null;
    }
  }

  async setRemoteUrl(workspacePath: string, remoteName: string, repoUrl: string): Promise<void> {
    await simpleGit({ baseDir: workspacePath }).remote(["set-url", remoteName, repoUrl]);
  }

  async setLocalConfig(
    workspacePath: string,
    key: string,
    value: string,
    options?: WorkspaceGitLocalConfigOptions
  ): Promise<void> {
    const allowUnsafeCredentialHelper = options?.allowUnsafeCredentialHelper === true && isCredentialHelperConfigKey(key);
    const git = allowUnsafeCredentialHelper
      ? simpleGit({ baseDir: workspacePath, unsafe: { allowUnsafeCredentialHelper: true } })
      : simpleGit({ baseDir: workspacePath });
    await git.addConfig(key, value, false, "local");
  }
}

function isCredentialHelperConfigKey(key: string): boolean {
  return key.trim().toLowerCase() === "credential.helper";
}

async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await fs.access(targetPath);
    return true;
  } catch (error) {
    if (isNotFoundError(error)) {
      return false;
    }

    throw error;
  }
}

async function prepareSafeGitHubRepoDirectory(layout: WorkspaceLayout, repoPath: string): Promise<boolean> {
  await ensureSafeDirectory(layout.rootPath, path.dirname(repoPath));

  const repoStats = await lstatIfExists(repoPath);
  if (!repoStats) {
    return false;
  }

  if (repoStats.isSymbolicLink() || !repoStats.isDirectory()) {
    await removePathNoFollow(repoPath);
    return false;
  }

  await ensureSafeDirectory(layout.rootPath, repoPath);
  const gitPath = path.join(repoPath, ".git");
  const gitStats = await lstatIfExists(gitPath);

  if (!gitStats) {
    await removePathNoFollow(repoPath);
    return false;
  }

  if (gitStats.isSymbolicLink() || !gitStats.isDirectory()) {
    await removePathNoFollow(repoPath);
    return false;
  }

  const gitConfigStats = await lstatIfExists(path.join(gitPath, "config"));
  if (gitConfigStats?.isSymbolicLink()) {
    await removePathNoFollow(repoPath);
    return false;
  }

  return true;
}

async function assertSafeGitHubRepoDirectory(layout: WorkspaceLayout, repoPath: string): Promise<void> {
  await ensureSafeDirectory(layout.rootPath, repoPath);
  const gitPath = path.join(repoPath, ".git");
  const gitStats = await lstatIfExists(gitPath);

  if (!gitStats || gitStats.isSymbolicLink() || !gitStats.isDirectory()) {
    throw new Error(`GitHub repository clone did not create a safe .git directory: ${repoPath}`);
  }

  const gitConfigStats = await lstatIfExists(path.join(gitPath, "config"));
  if (gitConfigStats?.isSymbolicLink()) {
    throw new Error(`GitHub repository clone created a symlinked git config: ${repoPath}`);
  }
}

async function lstatIfExists(targetPath: string): Promise<Stats | null> {
  try {
    return await fs.lstat(targetPath);
  } catch (error) {
    if (isNotFoundError(error)) {
      return null;
    }

    throw error;
  }
}

async function removeSymlinkIfExists(targetPath: string): Promise<void> {
  const stats = await lstatIfExists(targetPath);
  if (stats?.isSymbolicLink()) {
    await fs.unlink(targetPath);
  }
}

async function removePathNoFollow(targetPath: string): Promise<void> {
  const stats = await lstatIfExists(targetPath);
  if (!stats) {
    return;
  }

  await fs.rm(targetPath, {
    force: true,
    recursive: stats.isDirectory() && !stats.isSymbolicLink(),
  });
}

async function isDirectory(targetPath: string): Promise<boolean> {
  try {
    return (await fs.stat(targetPath)).isDirectory();
  } catch (error) {
    if (isNotFoundError(error)) {
      return false;
    }

    throw error;
  }
}

async function ensureSafeDirectory(rootPath: string, directoryPath: string): Promise<void> {
  const resolvedRoot = path.resolve(rootPath);
  const resolvedDirectory = path.resolve(directoryPath);

  if (!isPathInside(resolvedRoot, resolvedDirectory)) {
    throw new Error(`Materialized directory escapes workspace root: ${directoryPath}`);
  }

  let currentPath = resolvedRoot;
  await ensureSafeRootDirectory(currentPath);

  for (const segment of path.relative(resolvedRoot, resolvedDirectory).split(path.sep).filter(Boolean)) {
    currentPath = path.join(currentPath, segment);

    try {
      const stats = await fs.lstat(currentPath);

      if (stats.isSymbolicLink()) {
        throw new Error(`Materialized directory path contains a symlink: ${currentPath}`);
      }

      if (!stats.isDirectory()) {
        throw new Error(`Materialized directory path is not a directory: ${currentPath}`);
      }
    } catch (error) {
      if (!isNotFoundError(error)) {
        throw error;
      }

      await fs.mkdir(currentPath);
      await assertExistingPathIsNotSymlink(currentPath);
    }
  }
}

async function ensureSafeDirectoryForDatasetOutput(
  directoryPath: string,
  allowedDatasetOutputRootPath?: string
): Promise<void> {
  const resolvedDirectory = path.resolve(directoryPath);
  if (!path.isAbsolute(directoryPath)) {
    throw new Error(`Dataset output directory must be absolute: ${directoryPath}`);
  }

  if (allowedDatasetOutputRootPath && !isPathInside(allowedDatasetOutputRootPath, resolvedDirectory)) {
    throw new Error(`Dataset output directory escapes the VM hot dataset root: ${directoryPath}`);
  }

  let currentPath = allowedDatasetOutputRootPath && isPathInside(allowedDatasetOutputRootPath, resolvedDirectory)
    ? path.resolve(allowedDatasetOutputRootPath)
    : path.parse(resolvedDirectory).root;

  await ensureSafeRootDirectory(currentPath);

  for (const segment of path.relative(currentPath, resolvedDirectory).split(path.sep).filter(Boolean)) {
    currentPath = path.join(currentPath, segment);

    try {
      const stats = await fs.lstat(currentPath);

      if (stats.isSymbolicLink()) {
        throw new Error(`Dataset output directory path contains a symlink: ${currentPath}`);
      }

      if (!stats.isDirectory()) {
        throw new Error(`Dataset output directory path is not a directory: ${currentPath}`);
      }
    } catch (error) {
      if (!isNotFoundError(error)) {
        throw error;
      }

      await fs.mkdir(currentPath);
      await assertExistingPathIsNotSymlink(currentPath);
    }
  }
}

async function ensureSafeRootDirectory(rootPath: string): Promise<void> {
  try {
    const stats = await fs.lstat(rootPath);

    if (stats.isSymbolicLink()) {
      throw new Error(`Workspace root must not be a symlink: ${rootPath}`);
    }

    if (!stats.isDirectory()) {
      throw new Error(`Workspace root is not a directory: ${rootPath}`);
    }
  } catch (error) {
    if (!isNotFoundError(error)) {
      throw error;
    }

    await fs.mkdir(rootPath, { recursive: true });
    await assertExistingPathIsNotSymlink(rootPath);
  }
}

async function writeFileNoFollow(destination: string, content: string | Buffer, mode?: number): Promise<void> {
  await assertExistingPathIsNotSymlink(destination);
  const temporaryPath = atomicReplacementPath(destination);
  const flags = fsConstants.O_WRONLY | fsConstants.O_CREAT | fsConstants.O_EXCL | fsConstants.O_NOFOLLOW;
  const handle = await fs.open(temporaryPath, flags, mode ?? 0o666);

  try {
    await handle.writeFile(content);
    if (mode !== undefined) {
      await handle.chmod(mode);
    }
    await handle.close();
    await assertExistingPathIsNotSymlink(destination);
    await fs.rename(temporaryPath, destination);
  } catch (error) {
    await handle.close().catch(() => undefined);
    await fs.unlink(temporaryPath).catch(() => undefined);
    throw error;
  }
}

async function writeTransferredFileNoFollow(
  destination: string,
  content: AsyncIterable<Buffer | Uint8Array | string> | Iterable<Buffer | Uint8Array | string>,
  expected: { checksumSha256: string; sizeBytes: number; mode?: number }
): Promise<{ checksumSha256: string; sizeBytes: number }> {
  await assertExistingPathIsNotSymlink(destination);
  const temporaryPath = atomicReplacementPath(destination);
  const flags = fsConstants.O_WRONLY | fsConstants.O_CREAT | fsConstants.O_EXCL | fsConstants.O_NOFOLLOW;
  const handle = await fs.open(temporaryPath, flags, 0o666);
  const hash = createHash("sha256");
  let sizeBytes = 0;

  try {
    for await (const chunk of content) {
      const buffer = typeof chunk === "string" ? Buffer.from(chunk) : Buffer.from(chunk);
      sizeBytes += buffer.byteLength;

      if (sizeBytes > expected.sizeBytes) {
        throw new Error(`Materialized file is larger than declared: ${destination}`);
      }

      hash.update(buffer);
      await handle.write(buffer);
    }
    const checksumSha256 = hash.digest("hex");

    if (sizeBytes !== expected.sizeBytes) {
      throw new Error(`Materialized file size mismatch: expected ${expected.sizeBytes}, wrote ${sizeBytes}`);
    }

    if (checksumSha256 !== expected.checksumSha256.toLowerCase()) {
      throw new Error("Materialized file checksum mismatch");
    }

    if (expected.mode !== undefined) {
      await handle.chmod(expected.mode);
    }

    await handle.close();
    await assertExistingPathIsNotSymlink(destination);
    await fs.rename(temporaryPath, destination);
    return { checksumSha256, sizeBytes };
  } catch (error) {
    await handle.close().catch(() => undefined);
    await fs.unlink(temporaryPath).catch(() => undefined);
    throw error;
  }
}

function atomicReplacementPath(destination: string): string {
  return path.join(path.dirname(destination), `.${path.basename(destination)}.${randomUUID()}.tmp`);
}

function materializationFileContent(file: { content?: string; contentBase64?: string; encoding?: string }): string | Buffer {
  if (typeof file.content === "string") {
    return file.content;
  }

  if (file.encoding === "base64" && typeof file.contentBase64 === "string") {
    return Buffer.from(file.contentBase64, "base64");
  }

  throw new Error(`Materialized file is missing content: ${String((file as { path?: string }).path ?? "")}`);
}

function materializationFileMode(file: { mode?: number | null }): number | undefined {
  return typeof file.mode === "number" ? file.mode : undefined;
}

async function assertExistingPathIsNotSymlink(targetPath: string): Promise<void> {
  try {
    const stats = await fs.lstat(targetPath);

    if (stats.isSymbolicLink()) {
      throw new Error(`Materialized path must not be a symlink: ${targetPath}`);
    }
  } catch (error) {
    if (isNotFoundError(error)) {
      return;
    }

    throw error;
  }
}

async function assertExistingPathComponentsAreNotSymlinks(basePath: string, targetPath: string): Promise<void> {
  const resolvedBase = path.resolve(basePath);
  const resolvedTarget = path.resolve(targetPath);
  let currentPath = resolvedBase;

  for (const segment of path.relative(resolvedBase, resolvedTarget).split(path.sep).filter(Boolean)) {
    currentPath = path.join(currentPath, segment);

    try {
      const stats = await fs.lstat(currentPath);

      if (stats.isSymbolicLink()) {
        throw new Error(`Workspace root path contains a symlink: ${currentPath}`);
      }

      if (!stats.isDirectory()) {
        throw new Error(`Workspace root path component is not a directory: ${currentPath}`);
      }
    } catch (error) {
      if (isNotFoundError(error)) {
        return;
      }

      throw error;
    }
  }
}

async function realpathIfExists(targetPath: string): Promise<string | null> {
  try {
    return await fs.realpath(targetPath);
  } catch (error) {
    if (isNotFoundError(error)) {
      return null;
    }

    throw error;
  }
}

function safeJoin(basePath: string, relativePath: string): string {
  if (path.isAbsolute(relativePath)) {
    throw new Error(`Materialized file path must be relative: ${relativePath}`);
  }

  const resolvedBase = path.resolve(basePath);
  const resolvedTarget = path.resolve(resolvedBase, relativePath);

  if (!isPathInside(resolvedBase, resolvedTarget)) {
    throw new Error(`Materialized file escapes target directory: ${relativePath}`);
  }

  return resolvedTarget;
}

function isPathInside(basePath: string, targetPath: string): boolean {
  const relative = path.relative(basePath, targetPath);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function layoutsMatch(left: WorkspacePreparedLayout, right: WorkspacePreparedLayout): boolean {
  return (
    path.resolve(left.rootPath) === right.rootPath &&
    path.resolve(left.workspacePath) === right.workspacePath &&
    path.resolve(left.codexHomePath) === right.codexHomePath &&
    path.resolve(left.artifactsPath) === right.artifactsPath &&
    path.resolve(left.cachePath) === right.cachePath &&
    (left.datasetOutputPath ? path.resolve(left.datasetOutputPath) : null) === (right.datasetOutputPath ?? null)
  );
}

function normalizeRelativePath(relativePath: string): string {
  return relativePath.split(path.sep).join("/");
}

function githubFolderCredentialHelperContainerPath(githubFolder: WorkspaceGitHubFolder): string {
  return `/workspace/${githubFolder.repoDirectoryName}/.git/yp-live-workflow-github-credential-helper.sh`;
}

function githubFolderCredentialHelperCacheKey(githubFolder: WorkspaceGitHubFolder): string {
  return createHash("sha256")
    .update(githubFolder.repositoryFullName)
    .update("\0")
    .update(githubFolder.repoDirectoryName)
    .update("\0")
    .update(githubFolder.branchName)
    .digest("hex")
    .slice(0, 16);
}

function shellSingleQuote(value: string): string {
  return `'${value.replace(/'/g, "'\\''")}'`;
}

function isNotFoundError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}
