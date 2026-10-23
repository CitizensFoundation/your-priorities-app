import { z } from "zod";
import { SecretBox } from "./secrets.js";
import type { WorkflowStore } from "./store.js";
import { BudgetService } from "./budget.js";
interface StoredConnector {
    binding: YpWorkflowConnector;
    secret: string;
    createdBy: number;
    readSnapshot?: YpWorkflowJson;
}
export declare const connectorRequestSchema: z.ZodObject<{
    id: z.ZodString;
    runId: z.ZodString;
    recordId: z.ZodOptional<z.ZodString>;
    nodeId: z.ZodString;
    binding: z.ZodString;
    operation: z.ZodEnum<{
        search: "search";
        write: "write";
        read: "read";
        scrape: "scrape";
    }>;
    input: z.ZodRecord<z.ZodString, z.ZodType<YpWorkflowJson, unknown, z.core.$ZodTypeInternals<YpWorkflowJson, unknown>>>;
}, z.core.$strict>;
export declare class ConnectorService {
    private readonly store;
    private readonly secrets;
    private readonly firecrawlFetch;
    readonly budget: BudgetService;
    constructor(store: WorkflowStore, secrets: SecretBox, firecrawlFetch?: typeof fetch);
    bind(groupId: number, userId: number, value: unknown, credential: unknown, proposalId?: string): Promise<void>;
    list(groupId: number): Promise<YpWorkflowConnector[]>;
    revoke(groupId: number, id: string): Promise<void>;
    snapshotBindings(groupId: number, userId: number, graph: YpWorkflowGraph): Promise<StoredConnector[]>;
    read(groupId: number, bindingId: string, userId: number): Promise<YpWorkflowJson>;
    request(groupId: number, value: unknown): Promise<YpWorkflowJson>;
    private execute;
    private folderFiles;
    private firecrawl;
    /** Admin-only HTTP caller. Account totals may include other groups/applications. */
    creditUsage(groupId: number, bindingId: string): Promise<YpWorkflowFirecrawlBalance>;
}
export {};
