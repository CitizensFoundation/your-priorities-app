import { z } from "zod";
import { connectorSchema, fingerprint, money } from "./schemas.js";
import type { WorkflowTransaction } from "./store.js";
import { ConflictError } from "./services/errors.js";

interface BindingVersion {
  binding: YpWorkflowConnector;
  revision?: number;
}
const bindingVersion = (current: BindingVersion | undefined) =>
  current
    ? fingerprint({
        binding: current.binding,
        revision: current.revision ?? 0,
      })
    : null;

/** Proposals are visible to Codex. Only public configuration belongs here. */
export const connectionProposalSchema = z
  .object({
    binding: connectorSchema.superRefine((binding, ctx) => {
      let settings: z.ZodTypeAny = z.object({}).strict();
      if (binding.kind === "your-priorities") {
        if (!/^[1-9]\d{0,14}$/.test(binding.resourceId))
          ctx.addIssue({
            code: "custom",
            message: "Use a numeric group ID",
          });
      } else if (binding.kind.startsWith("google-")) {
        if (!/^[\w-]{1,200}$/.test(binding.resourceId))
          ctx.addIssue({
            code: "custom",
            message: "Use a Google file ID, not a URL or credential",
          });
        if (binding.kind === "google-sheets")
          settings = z
            .object({ range: z.string().min(1).max(200).optional() })
            .strict();
      } else {
        if (binding.resourceId !== "web" || binding.writeEnabled)
          ctx.addIssue({
            code: "custom",
            message: "Firecrawl uses resource web with writes disabled",
          });
        settings = z
          .object({
            creditMicros: money.positive(),
            maxCreditsPerRequest: z.number().int().min(1).max(1000),
          })
          .strict();
      }
      if (binding.kind === "google-drive" && binding.writeEnabled)
        ctx.addIssue({
          code: "custom",
          message: "Drive connections are read-only",
        });
      if (!settings.safeParse(binding.settings).success)
        ctx.addIssue({
          code: "custom",
          message:
            "Unsupported public settings; supply credentials only during admin approval",
        });
    }),
    purpose: z.string().trim().min(1).max(1000),
  })
  .strict();

export async function proposeConnection(
  tx: WorkflowTransaction,
  userId: number,
  value: unknown,
) {
  const { binding, purpose } = connectionProposalSchema.parse(value);
  const current = await tx.get<BindingVersion>("connector", binding.id);
  const baseBindingHash = bindingVersion(current);
  const id = fingerprint({
    binding,
    purpose,
    baseBindingHash,
    userId,
    generation: tx.state.operator?.generation,
  });
  const existing = await tx.get<YpWorkflowConnectionProposal>(
    "connection-proposal",
    id,
  );
  if (existing) return existing;
  if (
    (
      await tx.list<YpWorkflowConnectionProposal>("connection-proposal")
    ).filter((p) => p.status === "pending").length >= 20
  )
    throw new ConflictError("Review existing connection proposals first");
  const proposal: YpWorkflowConnectionProposal = {
    id,
    binding,
    purpose,
    baseBindingHash,
    proposedBy: userId,
    createdAt: new Date().toISOString(),
    status: "pending",
  };
  await tx.put("connection-proposal", id, proposal);
  await tx.emit("connection.proposed", {
    proposalId: id,
    connectorId: binding.id,
  });
  return proposal;
}

/** Called inside the same locked transaction as binding installation. */
export async function commitConnection(
  tx: WorkflowTransaction,
  binding: YpWorkflowConnector,
  userId: number,
  secret: string,
  proposalId?: string,
) {
  if (proposalId) {
    const proposal = await tx.get<YpWorkflowConnectionProposal>(
      "connection-proposal",
      proposalId,
    );
    if (!proposal || proposal.status !== "pending")
      throw new ConflictError("Connection proposal is no longer pending");
    const current = await tx.get<BindingVersion>("connector", binding.id);
    if (
      fingerprint(proposal.binding) !== fingerprint(binding) ||
      proposal.baseBindingHash !== bindingVersion(current)
    )
      throw new ConflictError(
        "Connection changed; request a fresh proposal",
      );
    proposal.status = "approved";
    proposal.decidedBy = userId;
    proposal.decidedAt = new Date().toISOString();
    await tx.put("connection-proposal", proposalId, proposal);
  }
  await tx.put("connector", binding.id, {
    binding,
    secret,
    createdBy: userId,
    revision: tx.state.revision + 1,
  });
  tx.state.revision++;
  await tx.emit("connector.updated", {
    connectorId: binding.id,
    kind: binding.kind,
    ...(proposalId ? { proposalId } : {}),
  });
}
