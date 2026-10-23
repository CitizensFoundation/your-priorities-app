import test from "node:test";
import assert from "node:assert/strict";
import { setImmediate } from "node:timers/promises";
import { stopProcessingExecution } from "../vm/stopProcessingExecution.js";
test("resume waits for the old execution receipt even when Docker has already removed its container", async () => {
    let finish, ready = false;
    const done = new Promise((resolve) => {
        finish = resolve;
    });
    const stopped = stopProcessingExecution(async () => {
        throw new Error("Error response from daemon: No such container: fixture");
    }, done).then(() => {
        ready = true;
    });
    await setImmediate();
    assert.equal(ready, false, "Resume must not race the old active.json cleanup");
    finish();
    await stopped;
    assert.equal(ready, true);
});
test("a genuine Docker stop failure is not treated as successful shutdown", async () => {
    await assert.rejects(stopProcessingExecution(async () => {
        throw new Error("Cannot connect to the Docker daemon");
    }, Promise.resolve()), /Cannot connect/);
});
