import type { RequestHandler } from "express";
import type { UsageReservation } from "../../budget.js";
import type { WorkflowStore } from "../../store.js";
import type { ManualCheckpointGate } from "./checkpointGate.js";
type SavedCheckpoint = {
    checksum: string;
    records: number;
};
type RunState = {
    run: YpWorkflowRun;
    usage: UsageReservation[];
};
/** Only mounted by the interactive batch harness. Holds a durable checkpoint,
 * but never pauses, resumes or approves a run on behalf of the browser operator. */
export declare class BrowserBatchCheckpoint {
    private readonly store;
    private readonly gate;
    private readonly checkpoint;
    private readonly processingCalls;
    runId?: string;
    beforeApproval?: RunState;
    beforePause?: RunState & {
        checkpoint: SavedCheckpoint;
    };
    afterReload?: RunState;
    beforeResume?: RunState;
    resumedCallOffset?: number;
    pauseSucceeded: boolean;
    resumeSucceeded: boolean;
    constructor(store: WorkflowStore, gate: ManualCheckpointGate, checkpoint: (runId: string, nodeId: string) => Promise<SavedCheckpoint>, processingCalls: unknown[]);
    private state;
    readonly middleware: RequestHandler;
    status(): {
        runId: string | null;
        phase: string;
    };
}
export declare const browserBatchCheckpointBanner = "<p id=\"manual-checkpoint\" role=\"status\">Batch checkpoint: awaiting batch.</p><script>\nconst checkpointMessages = {\n  \"awaiting-batch\": \"Awaiting an approved batch. Complete the trial and review the estimate first.\",\n  \"processing-levels\": \"Batch is processing levels. Wait for the checkpoint before clicking pause.\",\n  \"ready-to-pause\": \"Checkpoint ready: all ten level calls are settled. Click pause in the workflow UI.\",\n  \"paused\": \"Paused. Refresh this page to verify saved chat and progress.\",\n  \"reloaded\": \"Reload verified. Review saved chat and progress, then use Approve allowance and resume.\",\n  \"resumed\": \"Resumed. Wait for completion, review results, and download both runs' inputs and results.\"\n};\nasync function updateCheckpoint() {\n  try {\n    const state = await (await fetch('/manual/checkpoint')).json();\n    document.getElementById('manual-checkpoint').textContent = checkpointMessages[state.phase];\n  } catch { /* The harness may be closing. */ }\n}\nupdateCheckpoint(); setInterval(updateCheckpoint, 2000);\n</script>";
export {};
