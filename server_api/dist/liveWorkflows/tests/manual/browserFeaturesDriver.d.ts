import type { ManualConfig } from "./environment.js";
import { type ManualHarness } from "./harness.js";
export declare function driveBrowserFeatures(harness: ManualHarness, config: ManualConfig, output: string, headed: boolean, signal: AbortSignal): Promise<{
    browserChecks: {
        name: string;
        at: string;
    }[];
    browserDownloads: {
        id: string;
        path: string;
        checksum: string;
        bytes: number;
    }[];
    automatedBrowser: boolean;
    realBrowser: string;
    browserOperatorConfirmedReview: boolean;
}>;
