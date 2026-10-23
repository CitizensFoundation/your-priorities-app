import { type Readable } from "node:stream";
import type { WorkflowStore } from "./store.js";
export declare const maximumUploadBytes: number;
export declare class AssetService {
    private readonly store;
    readonly root: string;
    constructor(store: WorkflowStore, root: string);
    path(groupId: number, id: string): string;
    upload(groupId: number, stream: Readable, input: {
        name: string;
        contentType: string;
        length?: number;
        source?: YpWorkflowAsset["source"];
        resultSet?: YpWorkflowAsset["resultSet"];
        stagePart?: YpWorkflowAsset["stagePart"];
        request?: {
            id: string;
            fingerprint: string;
            runId: string;
        };
    }): Promise<YpWorkflowAsset>;
    get(groupId: number, id: string): Promise<{
        asset: YpWorkflowAsset;
        stream: () => import("node:fs").ReadStream;
    }>;
    remove(groupId: number, id: string, removeCache?: (state: YpWorkflowState) => Promise<void>): Promise<void>;
    recover(groupId: number): Promise<void>;
}
