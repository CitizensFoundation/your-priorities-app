import express, { type RequestHandler } from "express";
import { SequelizeWorkflowStore } from "../../store.js";
import { WorkflowService } from "../../workflowService.js";
import { AssetService } from "../../assets.js";
import type { ConnectorService } from "../../connectors.js";
import { type ManualConfig } from "./environment.js";
import { offlineProcessing } from "./offlineProviders.js";
import { ManualCodexUsage } from "./codexUsage.js";
import { BrowserBatchCheckpoint } from "./browserBatchCheckpoint.js";
export declare const actor: {
    userId: number;
    admin: boolean;
};
export declare function waitFor<T>(label: string, check: () => Promise<T | undefined | false>, timeoutMs?: number, signal?: AbortSignal): Promise<T>;
export declare function startManualHarness(config: ManualConfig, mode: "offline" | "api-key" | "chatgpt", options?: {
    headless?: boolean;
    codex?: "greeting" | "operator";
    offlineTurn?: (workspace: string) => Promise<string>;
    usageDirectory?: string;
    port?: number;
    browserLogin?: boolean;
    browserBatch?: boolean;
    groupCreation?: boolean;
    offlineProcessingDelayMs?: number;
    connectors?: {
        firecrawlFetch: typeof fetch;
        live?: boolean;
        processing?: typeof offlineProcessing;
    };
    processingConcurrency?: number;
    observeBrowserRequest?: RequestHandler;
    manualPage?: {
        instructions: string;
        fixture: string;
        filename: string;
    };
}): Promise<{
    baseUrl: string;
    request: <T>(route: string, method?: string, body?: unknown) => Promise<T>;
    service: WorkflowService;
    connectors: ConnectorService;
    store: SequelizeWorkflowStore;
    assets: AssetService;
    codexCalls: {
        operation: string;
        status: number;
    }[];
    codexUsage: ManualCodexUsage;
    historicalCodexUsage: ReturnType<ManualCodexUsage["report"]> | undefined;
    processingCalls: {
        runId: string;
        nodeId: string;
        id: string;
        status: number;
    }[];
    browserBatch: BrowserBatchCheckpoint | undefined;
    groupCreation: {
        mount: (app: express.Express) => void;
        close: () => void;
        communityId: number;
        otherGroupId: number;
        groupId: () => number | undefined;
        groupAccess: typeof import("../../access.js").groupAccess;
        groupChoices: typeof import("../../access.js").groupChoices;
        sourceGroup(): Promise<{
            id: number;
            postId: number;
            revoke: () => any;
        }>;
        verify(): Promise<{
            groupId: number;
            communityId: number;
            name: string;
            groupType: number;
            creatorIsAdminAndMember: boolean;
            unrelatedGroupAccessDenied: boolean;
            backgroundJobsRecordedOnly: string[];
        }>;
    } | undefined;
    close: () => Promise<void>;
    drainPaidRequests: () => Promise<void>;
    checkpoint: (runId: string, nodeId: string) => Promise<{
        checksum: string;
        records: number;
    }>;
    armCheckpoint: (runId: string, nodeId: string) => void;
    interruptAtCheckpoint: (runId: string, nodeId: string, signal?: AbortSignal) => Promise<{
        containerId: string;
        executionId: string | undefined;
        spentMicros: number;
        checksum: string;
        records: number;
    }>;
}>;
export type ManualHarness = Awaited<ReturnType<typeof startManualHarness>>;
