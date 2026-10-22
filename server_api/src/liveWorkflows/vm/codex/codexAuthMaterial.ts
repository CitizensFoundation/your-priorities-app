import { createHash } from "node:crypto";
import { constants as fsConstants } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import {
  CodexAuthMaterialSchema,
  type CodexAuthMaterial,
  type CodexAuthMaterialFile,
} from "../../contracts/index.js";

const PersistedCodexAuthFiles = ["auth.json"] as const;
const PersistedCodexAuthFileMode = 0o600;
const MaxAuthMaterialBytes = 2 * 1024 * 1024;

export async function materializeCodexAuthMaterial(input: unknown, codexHomePath: string): Promise<CodexAuthMaterial> {
  const material = CodexAuthMaterialSchema.parse(input);
  const resolvedRoot = path.resolve(codexHomePath);

  await fs.mkdir(resolvedRoot, { recursive: true, mode: 0o700 });
  await assertDirectoryNotSymlink(resolvedRoot);

  for (const file of material.files) {
    await writeAuthFile(resolvedRoot, file);
  }

  return material;
}

export async function archiveCodexAuthMaterial(codexHomePath: string): Promise<CodexAuthMaterial> {
  const resolvedRoot = path.resolve(codexHomePath);
  const files: CodexAuthMaterialFile[] = [];
  let totalBytes = 0;

  await assertDirectoryNotSymlink(resolvedRoot);

  for (const relativePath of PersistedCodexAuthFiles) {
    const filePath = safeAuthPath(resolvedRoot, relativePath);

    try {
      const stats = await fs.lstat(filePath);

      if (stats.isSymbolicLink()) {
        throw new Error(`Codex auth material refuses symlinks: ${relativePath}`);
      }

      if (!stats.isFile()) {
        continue;
      }

      totalBytes += stats.size;
      if (totalBytes > MaxAuthMaterialBytes) {
        throw new Error("Codex auth material is too large");
      }

      const data = await fs.readFile(filePath);
      files.push({
        path: relativePath,
        dataBase64: data.toString("base64"),
        mode: PersistedCodexAuthFileMode,
      });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
    }
  }

  if (files.length === 0) {
    throw new Error("Codex auth login did not produce auth material");
  }

  return {
    format: "codex_home_files_v1",
    files,
    metadata: {
      archivedAt: new Date().toISOString(),
    },
  };
}

export function codexAuthMaterialFingerprintSha256(material: CodexAuthMaterial): string {
  const parsed = CodexAuthMaterialSchema.parse(material);
  const files = [...parsed.files]
    .sort((left, right) => left.path.localeCompare(right.path))
    .map((file) => ({
      path: file.path,
      dataBase64: file.dataBase64,
      mode: typeof file.mode === "number" ? file.mode : null,
    }));

  return createHash("sha256")
    .update(JSON.stringify({ format: parsed.format, files }))
    .digest("hex");
}

async function writeAuthFile(rootPath: string, file: CodexAuthMaterialFile): Promise<void> {
  const destination = safeAuthPath(rootPath, file.path);
  const parentPath = path.dirname(destination);
  const bytes = Buffer.from(file.dataBase64, "base64");

  if (bytes.length > MaxAuthMaterialBytes) {
    throw new Error(`Codex auth material file is too large: ${file.path}`);
  }

  await fs.mkdir(parentPath, { recursive: true, mode: 0o700 });
  await assertDirectoryNotSymlink(parentPath);
  await assertPathNotSymlink(destination);

  const handle = await fs.open(
    destination,
    fsConstants.O_WRONLY | fsConstants.O_CREAT | fsConstants.O_TRUNC | fsConstants.O_NOFOLLOW,
    file.mode ?? 0o600
  );

  try {
    await handle.writeFile(bytes);
  } finally {
    await handle.close();
  }
}

function safeAuthPath(rootPath: string, relativePath: string): string {
  if (path.isAbsolute(relativePath) || relativePath.includes("\0")) {
    throw new Error(`Invalid Codex auth material path: ${relativePath}`);
  }

  const destination = path.resolve(rootPath, relativePath);
  const relative = path.relative(rootPath, destination);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Codex auth material path escapes CODEX_HOME: ${relativePath}`);
  }

  return destination;
}

async function assertDirectoryNotSymlink(targetPath: string): Promise<void> {
  const stats = await fs.lstat(targetPath);

  if (stats.isSymbolicLink()) {
    throw new Error(`Codex auth material directory must not be a symlink: ${targetPath}`);
  }

  if (!stats.isDirectory()) {
    throw new Error(`Codex auth material path must be a directory: ${targetPath}`);
  }
}

async function assertPathNotSymlink(targetPath: string): Promise<void> {
  try {
    const stats = await fs.lstat(targetPath);

    if (stats.isSymbolicLink()) {
      throw new Error(`Codex auth material file must not be a symlink: ${targetPath}`);
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return;
    }

    throw error;
  }
}
