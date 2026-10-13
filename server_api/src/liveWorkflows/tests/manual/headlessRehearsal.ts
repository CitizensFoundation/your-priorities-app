/** Scripted rehearsal of the operator, never used for a live Codex turn. */
import { open, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { socketRequest } from "../../runner/socketClient.js";
import { parseWorkflowArguments } from "../../runner/cliArguments.js";

export function offlineOperator(adapt: boolean) {
  let turns = 0;
  return async (workspace: string) => {
    const cli = async <T>(...args: string[]) => {
      const parsed = parseWorkflowArguments(args);
      // Match the runtime's short descriptor path: host workspace UUIDs exceed sockaddr_un's limit.
      const directory = await open(path.join(workspace, ".workflow"), "r");
      try {
        return await socketRequest<T>(
          `/proc/self/fd/${directory.fd}/control.sock`,
          parsed.route,
          parsed.body,
        );
      } finally {
        await directory.close();
      }
    };
    const snapshot = await cli<YpWorkflowSnapshot>("status");
    if (++turns > 1) {
      const run = snapshot.runs.find(
        (candidate) => candidate.status === "completed",
      )!;
      return `Offline scripted summary: trial ${run.id}; ${run.spentMicros} microdollars; ${run.reservedMicros} reserved. Results are available for download. This is fixture output.`;
    }
    const asset = snapshot.assets.find(
      (candidate) => candidate.source === "upload",
    )!;
    await cli("data", asset.id);
    await readFile(path.join(workspace, "data", asset.id), "utf8");
    if (adapt) {
      const packagePath = path.join(workspace, "package");
      // This implementation exists only in the scripted offline provider. Live Codex writes its own adapter.
      await writeFile(
        path.join(packagePath, "source/adaptImport.ts"),
        `import { asJson, object, type Agent } from "./sdk.js";
export const run: Agent = async (context, input) => {
  if (!Array.isArray(input)) throw new Error("Expected export rows");
  const rows = input.map(value => {
    const row = object(value), card = object(row.vacancy_card);
    return { ...row, name: card.display_heading, jurisdiction: row.location_note,
      text: [...card.day_to_day as string[], ...card.entry_rules as string[], ...card.nice_to_have as string[]].join("\\n\\n") };
  });
  await context.artifact("adapted-jobs.json", JSON.stringify(rows), "application/json");
  await context.progress(rows.length, rows.length);
  return asJson(rows);
};\n`,
      );
      const graph = snapshot.workspace.graph;
      graph.nodes.push({
        id: "adapt-import",
        kind: "agent",
        label: "Adapt recruitment export",
        description:
          "Convert vacancy_card fields into name/text; preserve input ID, source, duties and qualifications. Runs before normalize.",
        entrypoint: "source/adaptImport.ts",
        enabled: true,
        configuration: {},
        models: {},
        position: { x: 40, y: 80 },
      });
      for (const edge of graph.edges)
        if (edge.target === "normalize") edge.target = "adapt-import";
      graph.edges.push({
        id: "adapt-normalize",
        source: "adapt-import",
        target: "normalize",
        label: "Standard job fields",
      });
      graph.nodes.find((node) => node.id === "analyze")!.configuration.tasks = [
        "evidence",
      ];
      await writeFile(
        path.join(packagePath, "graph.json"),
        JSON.stringify(graph, null, 2),
      );
    }
    await cli("validate");
    const run = await cli<YpWorkflowRun>(
      "trial",
      ...(adapt ? ["--target", "analyze"] : []),
      "--sample",
      "2",
      asset.id,
    );
    return `Offline scripted operator started trial ${run.id}. ${adapt ? "Adaptation precedes normalize → levels → degrees → evidence." : "The standard Skills First stages are running."}`;
  };
}
