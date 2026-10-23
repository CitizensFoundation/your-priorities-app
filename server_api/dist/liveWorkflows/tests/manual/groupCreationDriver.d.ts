import { type Page } from "@playwright/test";
import { type ManualConfig } from "./environment.js";
import { type ManualHarness } from "./harness.js";
/** Allows no-key integration cases to continue in the browser-created workspace. */
export interface GroupCreationContinuation {
    budgetMicros: number;
    run(context: {
        page: Page;
        groupId: number;
        check: (name: string) => Promise<void>;
        screenshot: (name: string) => Promise<unknown>;
        expectFailure: (method: string, route: string, status: number) => void;
    }): Promise<Record<string, unknown>>;
}
export declare function driveGroupCreation(harness: ManualHarness, config: ManualConfig, output: string, marker: string, headed: boolean, signal: AbortSignal, continuation?: GroupCreationContinuation): Promise<{
    checks: {
        name: string;
        at: string;
    }[];
    scenario?: Record<string, unknown> | undefined;
    workspaceId: string;
    hostId: string;
    processingSpentMicros: number;
    processingCalls: number;
    groupCreationThroughProductionRouter: boolean;
    browserScreenshots: number;
    groupId: number;
    communityId: number;
    name: string;
    groupType: number;
    creatorIsAdminAndMember: boolean;
    unrelatedGroupAccessDenied: boolean;
    backgroundJobsRecordedOnly: string[];
}>;
