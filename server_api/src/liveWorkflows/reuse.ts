import path from "node:path";
import ts from "typescript";
import { z } from "zod";
import { fingerprint, identifier } from "./schemas.js";
import { orderedAgents } from "./graph.js";
import type { PackageSnapshot } from "./packages.js";
import type { WorkflowTransaction } from "./store.js";
import { ConflictError } from "./services/errors.js";

export const reuseRequest = z
  .object({
    runId: z.string().uuid(),
    fromNodeId: identifier,
  })
  .strict();

/** Actual transitive imports, including prompts and shared helpers. If source uses
 * filesystem access, dynamic imports, or computed require, invalidate conservatively. */
function dependencies(files: Record<string, string>, entrypoint: string) {
  const found = new Set<string>();
  let opaque = false;
  const visit = (name: string) => {
    if (found.has(name)) return;
    if (!(name in files)) {
      opaque = true;
      return;
    }
    found.add(name);
    const source = ts.createSourceFile(
      name,
      files[name],
      ts.ScriptTarget.Latest,
      true,
    );
    const resolve = (specifier: string) => {
      if (!specifier.startsWith(".")) {
        if (["node:crypto", "flesch-kincaid", "syllable"].includes(specifier))
          return;
        // External modules may inspect package files. The SDK currently uses only
        // static relative imports; be conservative with other package dependencies.
        opaque = true;
        return;
      }
      const resolved = path.posix.normalize(
        path.posix.join(path.posix.dirname(name), specifier),
      );
      const target = [
        resolved,
        resolved.replace(/\.js$/, ".ts"),
        resolved.replace(/\.js$/, ".d.ts"),
        `${resolved}.ts`,
        `${resolved}/index.ts`,
      ].find((candidate) => candidate in files);
      if (target) visit(target);
      else opaque = true;
    };
    const walk = (node: ts.Node) => {
      if (ts.isImportEqualsDeclaration(node)) opaque = true;
      if (
        ts.isIdentifier(node) &&
        [
          "process",
          "module",
          "global",
          "globalThis",
          "__dirname",
          "__filename",
          "Function",
        ].includes(node.text) &&
        !ts.findAncestor(
          node,
          (scope) =>
            ts.isFunctionLike(scope) &&
            scope.parameters.some(
              (parameter) =>
                ts.isIdentifier(parameter.name) &&
                parameter.name.text === node.text,
            ),
        )
      )
        opaque = true;
      if (
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
        node.moduleSpecifier
      ) {
        if (ts.isStringLiteral(node.moduleSpecifier))
          resolve(node.moduleSpecifier.text);
        else opaque = true;
      }
      if (ts.isCallExpression(node)) {
        const localRequire = ts.findAncestor(
          node,
          (scope) =>
            ts.isBlock(scope) &&
            scope.statements.some(
              (statement) =>
                ts.isVariableStatement(statement) &&
                statement.declarationList.declarations.some(
                  (decl) =>
                    ts.isIdentifier(decl.name) &&
                    decl.name.text === "require" &&
                    decl.initializer &&
                    (ts.isArrowFunction(decl.initializer) ||
                      ts.isFunctionExpression(decl.initializer)),
                ),
            ),
        );
        if (
          node.expression.kind === ts.SyntaxKind.ImportKeyword ||
          (ts.isIdentifier(node.expression) &&
            (node.expression.text === "eval" ||
              (node.expression.text === "require" && !localRequire)))
        )
          opaque = true;
      }
      ts.forEachChild(node, walk);
    };
    walk(source);
  };
  visit(entrypoint);
  return Object.fromEntries(
    Object.entries(files).filter(
      ([name]) =>
        opaque ||
        found.has(name) ||
        name.startsWith("schemas/") ||
        ["package.json", "manifest.json", "tsconfig.json"].includes(name),
    ),
  );
}

export function stageFingerprints(
  snapshot: PackageSnapshot,
  options: {
    assets: YpWorkflowAsset[];
    models: YpWorkflowModel[];
    connectors: unknown;
    concurrency: number;
  },
) {
  const result: Record<string, string> = {};
  // Include disabled nodes and connector paths in dependency signatures too.
  const visit = (id: string): string => {
    if (result[id]) return result[id];
    const node = snapshot.graph.nodes.find((n) => n.id === id)!;
    const upstream = snapshot.graph.edges
      .filter((e) => e.target === id)
      .map((e) => [e.source, visit(e.source)])
      .sort(([a], [b]) => a.localeCompare(b));
    const {
      position: _position,
      label: _label,
      description: _description,
      ...execution
    } = node;
    const models = options.models.filter((m) =>
      Object.values(node.models).includes(m.id),
    );
    return (result[id] = fingerprint({
      version: 1,
      execution,
      upstream,
      models,
      files:
        node.enabled && node.entrypoint
          ? dependencies(snapshot.files, node.entrypoint)
          : {},
      runtime: snapshot.runtimeImage,
      concurrency: options.concurrency,
      assets: options.assets.map((a) => ({ id: a.id, checksum: a.checksum })),
      connectors: options.connectors,
    }));
  };
  for (const node of snapshot.graph.nodes) visit(node.id);
  return result;
}

/** Borrow only within the same mode and population. Bulk reuse additionally needs
 * a fresh matching trial for its estimate and explicit approval in the service. */
export async function planReuse(
  tx: WorkflowTransaction,
  run: YpWorkflowRun,
  value: unknown,
) {
  const request = reuseRequest.parse(value);
  const source = await tx.get<YpWorkflowRun>("run", request.runId);
  if (
    source?.mode !== run.mode ||
    source.status !== "completed" ||
    source.reservedMicros ||
    (run.mode === "trial" && !source.sample) ||
    source.inputCount !== run.inputCount ||
    fingerprint(source.assetIds) !== fingerprint(run.assetIds)
  )
    throw new ConflictError(
      "Reuse requires a completed, reconciled run of the same mode, inputs and record count",
    );
  const ordered = orderedAgents(run.graph)
    .filter((n) => run.nodeIds.includes(n.id))
    .map((n) => n.id);
  const index = ordered.indexOf(request.fromNodeId);
  if (index <= 0)
    throw new ConflictError(
      "Choose a restart agent after at least one completed stage",
    );
  const prefix = ordered.slice(0, index);
  const ancestors = new Set<string>();
  const visit = (id: string) => {
    for (const edge of run.graph.edges.filter((e) => e.target === id)) {
      if (ancestors.has(edge.source)) continue;
      ancestors.add(edge.source);
      visit(edge.source);
    }
  };
  visit(request.fromNodeId);
  if (prefix.some((id) => !ancestors.has(id)))
    throw new ConflictError(
      "Reconnect the restart agent to its upstream stages before reusing their output; unrelated earlier agents cannot be reused",
    );
  // A prefix is deliberately stricter than an arbitrary cache: no changed upstream
  // or unselected branch can accidentally feed the resumed analysis.
  for (const id of prefix) {
    const output = source.stageOutputs?.[id];
    if (
      !output ||
      source.nodeStates[id]?.status !== "completed" ||
      source.nodeStates[id]?.failedRecords ||
      source.nodeFingerprints?.[id] !== run.nodeFingerprints?.[id] ||
      output.fingerprint !== run.nodeFingerprints?.[id]
    )
      throw new ConflictError(
        `Cannot reuse ${id}: its inputs, dependencies, code, models or completion changed`,
      );
    for (const asset of output.assets) {
      const saved = await tx.get<YpWorkflowAsset>("asset", asset.id);
      if (
        !saved ||
        saved.checksum !== asset.checksum ||
        saved.stagePart?.nodeId !== id
      )
        throw new ConflictError(
          `Saved output for ${id} is unavailable; run a fresh trial`,
        );
    }
  }
  if (source.sample) run.sample = structuredClone(source.sample);
  run.stageOutputs = Object.fromEntries(
    prefix.map((id) => [id, structuredClone(source.stageOutputs![id])]),
  );
  run.reuse = {
    ...request,
    nodeIds: prefix,
    historicalMicros: prefix.reduce(
      (sum, id) =>
        sum +
        (source.stageOutputs![id].spentMicros ??
          source.nodeCosts?.[id]?.spentMicros ??
          0),
      0,
    ),
  };
}
