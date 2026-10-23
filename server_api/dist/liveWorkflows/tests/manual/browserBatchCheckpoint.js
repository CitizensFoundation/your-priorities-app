import assert from "node:assert/strict";
/** Only mounted by the interactive batch harness. Holds a durable checkpoint,
 * but never pauses, resumes or approves a run on behalf of the browser operator. */
export class BrowserBatchCheckpoint {
    constructor(store, gate, checkpoint, processingCalls) {
        this.store = store;
        this.gate = gate;
        this.checkpoint = checkpoint;
        this.processingCalls = processingCalls;
        this.pauseSucceeded = false;
        this.resumeSucceeded = false;
        this.middleware = async (req, res, next) => {
            try {
                if (req.method === "GET" &&
                    req.path === "/" &&
                    this.pauseSucceeded &&
                    !this.resumeSucceeded) {
                    const state = await this.state(this.runId);
                    if (state.run.status === "paused")
                        this.afterReload = state;
                }
                const match = /^\/api\/live-workflows\/groups\/1\/runs\/([^/]+)\/(start|pause|resume)$/.exec(req.path);
                if (req.method !== "POST" || !match)
                    return next();
                const [, id, operation] = match;
                const state = await this.state(id);
                if (state.run.mode !== "bulk")
                    return next();
                if (operation === "start" &&
                    state.run.status === "awaiting_approval" &&
                    !this.runId) {
                    this.runId = id;
                    this.beforeApproval = state;
                    this.gate.arm(id, "levels");
                    res.once("finish", () => {
                        if (res.statusCode !== 200) {
                            this.gate.release();
                            this.runId = undefined;
                            this.beforeApproval = undefined;
                        }
                    });
                }
                else if (id === this.runId &&
                    operation === "pause" &&
                    this.gate.atCheckpoint(id, "levels")) {
                    assert.equal(state.run.reservedMicros, 0, "Wait for all paid calls to settle before pausing");
                    const captured = {
                        ...state,
                        checkpoint: await this.checkpoint(id, "levels"),
                    };
                    res.once("finish", () => {
                        if (res.statusCode === 200) {
                            this.beforePause = captured;
                            this.pauseSucceeded = true;
                            this.gate.release();
                        }
                    });
                }
                else if (id === this.runId &&
                    operation === "resume" &&
                    this.pauseSucceeded) {
                    this.beforeResume = state;
                    this.resumedCallOffset = this.processingCalls.length;
                    res.once("finish", () => {
                        if (res.statusCode === 200)
                            this.resumeSucceeded = true;
                    });
                }
                next();
            }
            catch (error) {
                next(error);
            }
        };
    }
    state(runId) {
        return this.store.transact(1, async (tx) => {
            const run = await tx.get("run", runId);
            assert.ok(run, "Missing browser batch run");
            return {
                run,
                usage: (await tx.list("usage"))
                    .filter((item) => item.runId === runId)
                    .sort((a, b) => a.id.localeCompare(b.id)),
            };
        });
    }
    status() {
        return {
            runId: this.runId ?? null,
            phase: this.resumeSucceeded
                ? "resumed"
                : this.afterReload
                    ? "reloaded"
                    : this.pauseSucceeded
                        ? "paused"
                        : this.runId && this.gate.atCheckpoint(this.runId, "levels")
                            ? "ready-to-pause"
                            : this.runId
                                ? "processing-levels"
                                : "awaiting-batch",
        };
    }
}
// Read-only status in the manual page, outside the product UI. No automated user actions.
export const browserBatchCheckpointBanner = `<p id="manual-checkpoint" role="status">Batch checkpoint: awaiting batch.</p><script>
const checkpointMessages = {
  "awaiting-batch": "Awaiting an approved batch. Complete the trial and review the estimate first.",
  "processing-levels": "Batch is processing levels. Wait for the checkpoint before clicking pause.",
  "ready-to-pause": "Checkpoint ready: all ten level calls are settled. Click pause in the workflow UI.",
  "paused": "Paused. Refresh this page to verify saved chat and progress.",
  "reloaded": "Reload verified. Review saved chat and progress, then use Approve allowance and resume.",
  "resumed": "Resumed. Wait for completion, review results, and download both runs' inputs and results."
};
async function updateCheckpoint() {
  try {
    const state = await (await fetch('/manual/checkpoint')).json();
    document.getElementById('manual-checkpoint').textContent = checkpointMessages[state.phase];
  } catch { /* The harness may be closing. */ }
}
updateCheckpoint(); setInterval(updateCheckpoint, 2000);
</script>`;
