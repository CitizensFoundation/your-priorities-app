import { Readable } from "node:stream";
import { z } from "zod";
import type { WorkflowService, WorkflowActor } from "./workflowService.js";
import type { AssetService } from "./assets.js";
import type { ConnectorService } from "./connectors.js";
import { identifier } from "./schemas.js";
import { codexOperations } from "./runner/cliArguments.js";
import { NotFoundError } from "./services/errors.js";
import { reuseRequest } from "./reuse.js";

const assetsBody = z.object({
  assetIds: z.array(z.string().uuid()).min(1).max(100).optional(),
});
/** The controller authenticates the VM host; every capability also checks its current operator. */
export class CodexWorkflowTools {
  constructor(
    private readonly service: WorkflowService,
    private readonly assets: Pick<AssetService, "upload">,
    private readonly connectors: Pick<ConnectorService, "list" | "read">,
    private readonly groups: (
      userId: number,
      search: string,
    ) => Promise<{ id: number; name: string }[]>,
  ) {}
  async execute(
    groupId: number,
    actor: WorkflowActor,
    operation: unknown,
    value: unknown,
  ) {
    const command = z.enum(codexOperations).parse(operation);
    const state = await this.service.store.transact(groupId, async (tx) => {
      this.service.requireOperator(tx, actor);
      return tx.state;
    });
    if (command === "propose-connection")
      return this.service.proposeConnection(groupId, actor, value);
    if (command === "groups") {
      const body = z
        .object({ search: z.string().max(120).default("") })
        .strict()
        .parse(value);
      return this.groups(actor.userId, body.search);
    }
    if (command === "check-connection" || command === "import-connection") {
      const { bindingId } = z
        .object({ bindingId: identifier })
        .strict()
        .parse(value);
      const rows = await this.connectors.read(groupId, bindingId, actor.userId);
      if (command === "check-connection")
        return { records: Array.isArray(rows) ? rows.length : 1 };
      const contents = Buffer.from(JSON.stringify(rows));
      return this.assets.upload(groupId, Readable.from(contents), {
        name: `${bindingId}.json`,
        contentType: "application/json",
        length: contents.length,
        source: "connector",
      });
    }
    if (["status", "connections", "validate"].includes(command)) {
      z.object({}).strict().parse(value);
      if (command === "status") return this.service.snapshot(groupId, actor);
      if (command === "connections")
        return {
          bindings: await this.connectors.list(groupId),
          proposals: await this.service.store.transact(groupId, (tx) =>
            tx.list<YpWorkflowConnectionProposal>("connection-proposal"),
          ),
          setup: {
            "your-priorities":
              "Discover accessible group IDs with groups. Admin approval is required; no credential needed.",
            "google-sheets":
              "Supply file ID and optional range. Admin supplies a service-account credential and shares the file with that account.",
            "google-docs":
              "Supply document ID. Admin supplies a service-account credential and shares the document.",
            "google-drive":
              "Supply file ID, read-only. Admin supplies a service-account credential and shares the file.",
            firecrawl:
              "Use resource web, writes disabled, and settings creditMicros / maxCreditsPerRequest. Admin verifies pricing and supplies the API key. Paid checks happen only inside a budgeted trial.",
          },
        };
      const snapshot = await this.service.packageSnapshot(groupId);
      return { hash: snapshot.hash, graph: snapshot.graph };
    }
    const body = (
      command === "trial"
        ? assetsBody.extend({
            sampleCount: z.number().int().min(1).max(20).default(5),
            targetNodeId: identifier.optional(),
            reuse: reuseRequest.optional(),
          })
        : assetsBody
    )
      .strict()
      .parse(value);
    const assets = await this.service.store.transact(groupId, (tx) =>
      tx.list<YpWorkflowAsset>("asset"),
    );
    const latest = new Map<string, YpWorkflowAsset>();
    for (const asset of assets.filter((a) => a.source !== "artifact"))
      if ((latest.get(asset.name)?.version ?? 0) < asset.version)
        latest.set(asset.name, asset);
    const selected = body.assetIds ?? [...latest.values()].map((a) => a.id);
    if (command === "data") {
      const inputs = selected.map((id) => {
        const asset = assets.find((a) => a.id === id);
        if (!asset) throw new NotFoundError("Asset", id);
        return asset;
      });
      await this.service.command(
        state.config.hostId,
        "workflow.inputs",
        {
          groupId,
          workspaceId: state.id,
          rootPath: this.service.root(state),
          assets: inputs,
        },
        300_000,
      );
      return {
        files: inputs.map((a) => ({
          id: a.id,
          name: a.name,
          path: `/workspace/data/${a.id}`,
          checksum: a.checksum,
        })),
      };
    }
    const trial = body as {
      sampleCount: number;
      targetNodeId?: string;
      reuse?: { runId: string; fromNodeId: string };
    };
    const run = await this.service.draftRun(
      groupId,
      actor,
      "trial",
      selected,
      trial.sampleCount,
      trial.targetNodeId,
      trial.reuse,
    );
    await this.service.startRun(groupId, actor, run.id);
    // Return the accepted execution state, not the pre-start draft that would tell Codex it never ran.
    return this.service.store.transact(groupId, async (tx) => {
      const current = await tx.get<YpWorkflowRun>("run", run.id);
      if (!current) throw new NotFoundError("Trial", run.id);
      return current;
    });
  }
}
