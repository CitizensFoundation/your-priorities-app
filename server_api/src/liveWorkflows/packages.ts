import { open, readdir, lstat, realpath } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { graphSchema, fingerprint, identifier } from "./schemas.js";
import { z } from "zod";
import { packageManifest } from "./runner/packageContract.js";
import { orderedAgents } from "./graph.js";

export const sourceFilesSchema = z.record(
  z
    .string()
    .regex(
      /^(source\/[\w/-]+(?:\.d)?\.ts|(?:schemas|evaluation)\/[\w-]+\.json|graph\.json|manifest\.json|package\.json|tsconfig\.json|AGENTS\.md|README\.md|LICENSE)$/,
    )
    .refine((p) => !p.includes("..")),
  z.string().max(1_000_000),
);
export interface PackageSnapshot {
  files: Record<string, string>;
  graph: YpWorkflowGraph;
  hash: string;
  runtimeImage?: string;
}

export async function readPackage(root: string): Promise<PackageSnapshot> {
  const canonicalRoot = await realpath(root);
  if (canonicalRoot !== path.resolve(root))
    throw new Error("Package roots cannot contain symlinks");
  root = canonicalRoot;
  const files: Record<string, string> = {};
  async function walk(directory: string) {
    for (const name of (await readdir(directory)).sort()) {
      const target = path.join(directory, name),
        relative = path.relative(root, target).replaceAll(path.sep, "/");
      const stat = await lstat(target);
      if (stat.isSymbolicLink())
        throw new Error("Package symlinks are not allowed");
      if (stat.isDirectory()) {
        if (
          ["source", "schemas", "evaluation"].includes(relative.split("/")[0])
        )
          await walk(target);
      } else if (sourceFilesSchema.keyType.safeParse(relative).success) {
        if (stat.size > 1_000_000) throw new Error("Package file is too large");
        const handle = await open(
          target,
          constants.O_RDONLY | constants.O_NOFOLLOW,
        );
        try {
          // Check the opened descriptor, including parent-directory swaps during a Codex edit.
          const openedPath = await realpath(`/proc/self/fd/${handle.fd}`);
          if (
            !openedPath.startsWith(`${root}${path.sep}`) ||
            !(await handle.stat()).isFile()
          )
            throw new Error("Package path changed during capture");
          files[relative] = await handle.readFile("utf8");
        } finally {
          await handle.close();
        }
      }
    }
  }
  await walk(root);
  return validatePackage(files);
}
export function validatePackage(value: unknown): PackageSnapshot {
  const files = sourceFilesSchema.parse(value);
  if (
    Object.keys(files).length > 500 ||
    JSON.stringify(files).length > 8_000_000
  )
    throw new Error("Package exceeds snapshot limits");
  const graph = graphSchema.parse(JSON.parse(files["graph.json"]));
  packageManifest(files);
  for (const node of graph.nodes)
    if (node.entrypoint && !files[node.entrypoint])
      throw new Error(`Missing agent source: ${node.entrypoint}`);
  return { files, graph, hash: fingerprint(files) };
}

/** Apply defaults only at workspace creation, preserving explicit package choices. */
export function withDefaultAgentModel(
  snapshot: PackageSnapshot,
  modelId: string,
): PackageSnapshot {
  const graph = structuredClone(snapshot.graph);
  for (const node of graph.nodes)
    if (node.kind === "agent") node.models.default ??= modelId;
  return validatePackage({
    ...snapshot.files,
    "graph.json": `${JSON.stringify(graph, null, 2)}\n`,
  });
}

/** A targeted experiment includes every upstream dependency of its chosen agent. */
export function selectedAgents(
  graph: YpWorkflowGraph,
  targetNodeId?: string,
): string[] {
  const selected = new Set<string>();
  const visit = (id: string) => {
    if (selected.has(id)) return;
    selected.add(id);
    graph.edges.filter((e) => e.target === id).forEach((e) => visit(e.source));
  };
  if (targetNodeId) {
    if (
      !graph.nodes.some(
        (n) => n.id === targetNodeId && n.kind === "agent" && n.enabled,
      )
    )
      throw new Error("Choose an enabled target agent");
    visit(targetNodeId);
  }
  return orderedAgents(graph)
    .filter((n) => !targetNodeId || selected.has(n.id))
    .map((n) => n.id);
}
export async function skillsFirstPackage() {
  return loadPackage("skills-first");
}
const packageRoot = () =>
  process.env.YP_LIVE_WORKFLOW_PACKAGE_ROOT ??
  fileURLToPath(new URL("../../workflow-packages", import.meta.url));
export async function loadPackage(id: string) {
  identifier.refine((value) => !value.includes("..")).parse(id);
  return readPackage(path.join(packageRoot(), id));
}
export async function packageCatalog(): Promise<
  { id: string; name: string; version: string }[]
> {
  const catalog = [];
  for (const entry of await readdir(packageRoot(), {
    withFileTypes: true,
  })) {
    if (!entry.isDirectory()) continue;
    const snapshot = await loadPackage(entry.name);
    const manifest = z
      .object({
        id: z.literal(entry.name),
        name: z.string(),
        version: z.string(),
      })
      .parse(JSON.parse(snapshot.files["manifest.json"]));
    catalog.push(manifest);
  }
  return catalog;
}
