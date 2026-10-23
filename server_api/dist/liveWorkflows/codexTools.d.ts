import type { WorkflowService, WorkflowActor } from "./workflowService.js";
import type { AssetService } from "./assets.js";
import type { ConnectorService } from "./connectors.js";
/** The controller authenticates the VM host; every capability also checks its current operator. */
export declare class CodexWorkflowTools {
    private readonly service;
    private readonly assets;
    private readonly connectors;
    private readonly groups;
    constructor(service: WorkflowService, assets: Pick<AssetService, "upload">, connectors: Pick<ConnectorService, "list" | "read">, groups: (userId: number, search: string) => Promise<{
        id: number;
        name: string;
    }[]>);
    execute(groupId: number, actor: WorkflowActor, operation: unknown, value: unknown): Promise<YpWorkflowRun | YpWorkflowConnectionProposal | YpWorkflowAsset | YpWorkflowSnapshot | {
        id: number;
        name: string;
    }[] | {
        records: number;
        bindings?: undefined;
        proposals?: undefined;
        setup?: undefined;
        hash?: undefined;
        graph?: undefined;
        files?: undefined;
    } | {
        bindings: YpWorkflowConnector[];
        proposals: YpWorkflowConnectionProposal[];
        setup: {
            "your-priorities": string;
            "google-sheets": string;
            "google-docs": string;
            "google-drive": string;
            firecrawl: string;
        };
        records?: undefined;
        hash?: undefined;
        graph?: undefined;
        files?: undefined;
    } | {
        hash: string;
        graph: YpWorkflowGraph;
        records?: undefined;
        bindings?: undefined;
        proposals?: undefined;
        setup?: undefined;
        files?: undefined;
    } | {
        files: {
            id: string;
            name: string;
            path: string;
            checksum: string;
        }[];
        records?: undefined;
        bindings?: undefined;
        proposals?: undefined;
        setup?: undefined;
        hash?: undefined;
        graph?: undefined;
    }>;
}
