import { z } from "zod";
import type { WorkflowTransaction } from "./store.js";
/** Proposals are visible to Codex. Only public configuration belongs here. */
export declare const connectionProposalSchema: z.ZodObject<{
    binding: z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        kind: z.ZodEnum<{
            "your-priorities": "your-priorities";
            "google-sheets": "google-sheets";
            "google-docs": "google-docs";
            "google-drive": "google-drive";
            firecrawl: "firecrawl";
        }>;
        resourceId: z.ZodString;
        writeEnabled: z.ZodBoolean;
        settings: z.ZodRecord<z.ZodString, z.ZodType<YpWorkflowJson, unknown, z.core.$ZodTypeInternals<YpWorkflowJson, unknown>>>;
    }, z.core.$strict>;
    purpose: z.ZodString;
}, z.core.$strict>;
export declare function proposeConnection(tx: WorkflowTransaction, userId: number, value: unknown): Promise<YpWorkflowConnectionProposal>;
/** Called inside the same locked transaction as binding installation. */
export declare function commitConnection(tx: WorkflowTransaction, binding: YpWorkflowConnector, userId: number, secret: string, proposalId?: string): Promise<void>;
