/** Manual-harness fault injection only. The runner persists __node_output before
 * this progress request. Holding its acknowledgement prevents the next paid stage. */
export class ManualCheckpointGate {
    constructor() {
        this.reached = false;
        this.middleware = (req, res, next) => {
            if (this.armed &&
                !this.reached &&
                req.method === "POST" &&
                req.path ===
                    `/api/live-workflows/vm/groups/1/runs/${this.armed.runId}/progress` &&
                req.body?.nodeId === this.armed.nodeId &&
                req.body.complete === true) {
                this.reached = true;
                this.response = res;
                return;
            }
            next();
        };
    }
    arm(runId, nodeId) {
        if (this.armed)
            throw new Error("A checkpoint interruption is already armed");
        this.armed = { runId, nodeId };
        this.reached = false;
    }
    atCheckpoint(runId, nodeId) {
        return (this.reached &&
            this.armed?.runId === runId &&
            this.armed.nodeId === nodeId);
    }
    release() {
        // Never acknowledge successful progress after a killed execution.
        if (this.response && !this.response.destroyed)
            this.response
                .status(409)
                .json({ error: "Manual checkpoint interruption" });
        this.response = undefined;
        this.armed = undefined;
        this.reached = false;
    }
}
