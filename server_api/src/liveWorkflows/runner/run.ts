import { readFile, mkdir, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { AsyncLocalStorage } from "node:async_hooks";
import { resultChunks } from "./resultChunks.js";
import { createHash } from "node:crypto";
import { socketRequest, stableRequestId } from "./socketClient.js";
import { stratifiedSample } from "./inputs.js";
import { orderedAgents } from "../graph.js";
export { orderedAgents } from "../graph.js";
import { modelJson } from "./modelJson.js";
import { readPackage } from "../packages.js";
import { packageValidators, validateData } from "./packageContract.js";

export interface Context {
  nodeId: string;
  mode: "trial" | "bulk";
  configuration: Record<string, YpWorkflowJson>;
  model(
    key: string,
    system: string,
    input: YpWorkflowJson,
    role?: string,
  ): Promise<YpWorkflowJson>;
  connector(
    key: string,
    binding: string,
    operation: string,
    input: Record<string, YpWorkflowJson>,
  ): Promise<YpWorkflowJson>;
  progress(
    processed: number,
    total: number,
    child?: string,
    failedRecords?: number,
  ): Promise<void>;
  checkpoint(key: string, value: YpWorkflowJson): Promise<void>;
  restore(key: string): Promise<YpWorkflowJson | undefined>;
  artifact(name: string, content: string, contentType: string): Promise<void>;
  withRecord?<T>(id: string, work: () => Promise<T>): Promise<T>;
  cancelled(): Promise<boolean>;
}
export async function runPackage(options: {
  root: string;
  output: string;
  socket: string;
  run: YpWorkflowRun;
  inputs: YpWorkflowJson[];
  request?: <T>(route: string, data: unknown) => Promise<T>;
}) {
  const { run } = options;
  const snapshot = await readPackage(options.root);
  if (snapshot.hash !== run.sourceHash)
    throw new Error("Package source no longer matches the approved run");
  const validators = packageValidators(snapshot.files);
  validateData(validators.input, options.inputs, "Input");
  const send =
    options.request ??
    (<T>(route: string, data: unknown) =>
      socketRequest<T>(options.socket, route, data));
  const initial: YpWorkflowJson =
    run.mode === "trial"
      ? stratifiedSample(
          options.inputs as Record<string, YpWorkflowJson>[],
          run.inputCount,
        )
      : options.inputs;
  const scope = new AsyncLocalStorage<string>();
  let current: YpWorkflowJson = initial;
  const sampleRows = initial as Record<string, YpWorkflowJson>[];
  const lengths = (rows: YpWorkflowJson[]) => {
    let min = Infinity,
      max = 0;
    for (const row of rows) {
      const n = JSON.stringify(row).length;
      min = Math.min(min, n);
      max = Math.max(max, n);
    }
    return [Number.isFinite(min) ? min : 0, max];
  };
  const sample =
    run.mode === "trial"
      ? {
          recordIds: sampleRows.map((row, i) => String(row.id ?? `row:${i}`)),
          populationCount: options.inputs.length,
          populationLengthRange: lengths(options.inputs),
          sampleLengthRange: lengths(sampleRows),
        }
      : undefined;
  await mkdir(options.output, { recursive: true });
  const outputs = new Map<string, YpWorkflowJson>();
  for (const node of orderedAgents(run.graph)) {
    if (!run.nodeIds.includes(node.id)) continue;
    const checkpointDirectory = path.join(
      options.output,
      "checkpoints",
      node.id,
    );
    await mkdir(checkpointDirectory, { recursive: true });
    const fileFor = (key: string) =>
      path.join(
        checkpointDirectory,
        `${createHash("sha256").update(key).digest("hex")}.json`,
      );
    const requestId = (key: string) =>
      stableRequestId(`${run.id}:${node.id}:${key}`);
    const context: Context = {
      withRecord: (id, work) => scope.run(id, work),
      nodeId: node.id,
      mode: run.mode,
      configuration: {
        ...node.configuration,
        concurrency: Math.max(
          1,
          Math.min(
            Number(node.configuration.concurrency ?? 2),
            run.concurrency ?? 2,
          ),
        ),
      },
      model: async (key, system, input, role = "default") => {
        const result = await send<{ content: string }>("/model", {
          id: requestId(key),
          ...(scope.getStore() ? { recordId: scope.getStore() } : {}),
          nodeId: node.id,
          role,
          system,
          input,
        });
        return modelJson(result.content);
      },
      connector: (key, binding, operation, input) =>
        send("/connector", {
          id: requestId(key),
          ...(scope.getStore() ? { recordId: scope.getStore() } : {}),
          nodeId: node.id,
          binding,
          operation,
          input,
        }),
      progress: async (processed, total, child, failedRecords) => {
        await send("/progress", {
          nodeId: node.id,
          processed,
          total,
          child: child ?? null,
          ...(failedRecords === undefined ? {} : { failedRecords }),
        });
      },
      checkpoint: async (key, value) => {
        const file = fileFor(key),
          temp = `${file}.tmp`;
        await writeFile(temp, JSON.stringify(value), {
          mode: 0o600,
          flush: true,
        });
        await rename(temp, file);
      },
      restore: async (key) => {
        try {
          return JSON.parse(
            await readFile(fileFor(key), "utf8"),
          ) as YpWorkflowJson;
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code === "ENOENT")
            return undefined;
          throw error;
        }
      },
      artifact: async (name, content, contentType) => {
        await send("/artifact", {
          nodeId: node.id,
          name,
          content,
          contentType,
          id: requestId(`artifact:${name}`),
        });
      },
      cancelled: async () =>
        (await send<{ status: string }>("/status", {})).status !== "running",
    };
    if (await context.cancelled())
      throw new Error("Run is paused or cancelled");
    // For a branch, each agent receives the actual outputs of its nearest enabled upstream agents.
    const ancestors = (id: string, seen = new Set<string>()): string[] => {
      if (seen.has(id)) return [];
      seen.add(id);
      return run.graph.edges
        .filter((e) => e.target === id)
        .flatMap((e) =>
          outputs.has(e.source) ? [e.source] : ancestors(e.source, seen),
        );
    };
    const upstream = [...new Set(ancestors(node.id))];
    const input =
      upstream.length > 1
        ? Object.fromEntries(upstream.map((id) => [id, outputs.get(id)!]))
        : upstream.length === 1
          ? outputs.get(upstream[0])!
          : initial;
    await send("/progress", {
      nodeId: node.id,
      processed: 0,
      total: Array.isArray(input) ? input.length : run.inputCount,
      upstream,
      ...(outputs.size === 0 && sample ? { sample } : {}),
    });
    const completed = await context.restore("__node_output");
    if (completed !== undefined) current = completed;
    else {
      const target = path.resolve(options.root, node.entrypoint!);
      if (!target.startsWith(`${path.resolve(options.root)}/source/`))
        throw new Error("Unsafe agent entrypoint");
      const module = (await import(pathToFileURL(target).href)) as {
        run?: (
          context: Context,
          input: YpWorkflowJson,
        ) => Promise<YpWorkflowJson>;
      };
      if (typeof module.run !== "function")
        throw new Error(`Agent ${node.id} must export run(context,input)`);
      current = await module.run(context, input);
      await context.checkpoint("__node_output", current);
    }
    outputs.set(node.id, current);
    await send("/progress", {
      nodeId: node.id,
      processed: Array.isArray(input) ? input.length : run.inputCount,
      total: Array.isArray(input) ? input.length : run.inputCount,
      outputCount: Array.isArray(current) ? current.length : undefined,
      complete: true,
    });
  }
  if (orderedAgents(run.graph).every((n) => run.nodeIds.includes(n.id)))
    validateData(validators.output, current, "Output");
  const lastNode = [...outputs.keys()].at(-1);
  if (lastNode) {
    const chunks = resultChunks(current);
    for (const [part, content] of chunks.entries()) {
      await send("/artifact", {
        nodeId: lastNode,
        id: stableRequestId(`${run.id}:results:${part}`),
        name: `results-${part}.json`,
        content,
        contentType: "application/json",
        resultPart: part,
      });
    }
  }
  await writeFile(
    path.join(options.output, "completed.json"),
    JSON.stringify({ runId: run.id, nodeIds: [...outputs.keys()] }),
    { flush: true },
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const run = JSON.parse(
    await readFile("/run-data/run.json", "utf8"),
  ) as YpWorkflowRun;
  const inputs = JSON.parse(
    await readFile("/run-data/inputs.json", "utf8"),
  ) as YpWorkflowJson[];
  await runPackage({
    root: "/package",
    output: "/output",
    socket: "/gateway/control.sock",
    run,
    inputs,
  });
}
