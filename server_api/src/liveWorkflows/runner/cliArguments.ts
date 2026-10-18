import { parseArgs } from "node:util";

export const codexOperations = [
  "status",
  "data",
  "validate",
  "trial",
  "connections",
  "groups",
  "propose-connection",
  "check-connection",
  "import-connection",
] as const;
export const cliUsage = `Usage: yp-workflow status|data [asset-id ...]|validate|connections
  groups [--search text]
  propose-connection <public-proposal.json>
  check-connection|import-connection <binding-id>
  trial [--target agent-id] [--sample 1..20] [--reuse run-id --from agent-id] [asset-id ...]
Credentials and bulk approvals must be supplied by an administrator in the UI.`;

export function parseWorkflowArguments(args: string[]) {
  const command = args[0] ?? "status";
  if (!(codexOperations as readonly string[]).includes(command))
    throw new Error(cliUsage);
  const { values, positionals } = parseArgs({
    args: args.slice(1),
    strict: true,
    allowPositionals: true,
    options:
      command === "trial"
        ? {
            target: { type: "string" },
            sample: { type: "string" },
            reuse: { type: "string" },
            from: { type: "string" },
          }
        : command === "groups"
          ? { search: { type: "string" } }
          : {},
  });
  const body: Record<string, unknown> = {};
  if (command === "data" || command === "trial") {
    if (positionals.length) body.assetIds = positionals;
    if (values.target !== undefined) body.targetNodeId = values.target;
    if (values.reuse !== undefined || values.from !== undefined) {
      if (!values.reuse || !values.from)
        throw new Error("--reuse and --from must be supplied together");
      body.reuse = { runId: values.reuse, fromNodeId: values.from };
    }
    if (values.sample !== undefined) {
      if (!/^(?:[1-9]|1\d|20)$/.test(String(values.sample)))
        throw new Error("Sample must be 1..20");
      body.sampleCount = Number(values.sample);
    }
  } else if (command === "propose-connection") {
    if (positionals.length !== 1) throw new Error(cliUsage);
    return { route: `/${command}`, body, proposalFile: positionals[0] };
  } else if (
    command === "check-connection" ||
    command === "import-connection"
  ) {
    if (positionals.length !== 1) throw new Error(cliUsage);
    body.bindingId = positionals[0];
  } else {
    if (positionals.length) throw new Error(cliUsage);
    if (command === "groups") body.search = values.search ?? "";
  }
  return { route: `/${command}`, body, proposalFile: undefined };
}
