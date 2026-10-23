import assert from "node:assert/strict";
import test from "node:test";
import { VmCommandDeduplicationError, VmCommandRouter } from "../../commands/vmCommandRouter.js";
const now = () => new Date("2026-05-16T13:00:00.000Z");
test("VM command router replays cached successful command responses", async () => {
    const handler = new CountingHandler("/commands/session.turn.start");
    const router = new VmCommandRouter([handler]);
    const body = envelope("session.turn.start", "command-1");
    const first = await router.dispatch("/commands/session.turn.start", body, { now });
    const second = await router.dispatch("/commands/session.turn.start", body, { now });
    assert.deepEqual(first, { ok: true, calls: 1 });
    assert.deepEqual(second, first);
    assert.equal(handler.calls, 1);
});
test("VM command router shares in-flight duplicate command responses", async () => {
    const handler = new DeferredHandler("/commands/session.turn.start");
    const router = new VmCommandRouter([handler]);
    const body = envelope("session.turn.start", "command-1");
    const first = router.dispatch("/commands/session.turn.start", body, { now });
    const second = router.dispatch("/commands/session.turn.start", body, { now });
    assert.equal(handler.calls, 1);
    handler.resolve({ ok: true, shared: true });
    assert.deepEqual(await first, { ok: true, shared: true });
    assert.deepEqual(await second, { ok: true, shared: true });
    assert.equal(handler.calls, 1);
});
test("VM command router rejects command id reuse across command types", async () => {
    const router = new VmCommandRouter([
        new CountingHandler("/commands/session.turn.start"),
        new CountingHandler("/commands/session.interrupt"),
    ]);
    await router.dispatch("/commands/session.turn.start", envelope("session.turn.start", "command-1"), { now });
    await assert.rejects(() => router.dispatch("/commands/session.interrupt", envelope("session.interrupt", "command-1"), { now }), VmCommandDeduplicationError);
});
test("VM command router rejects same-type command id reuse with different payloads", async () => {
    const handler = new CountingHandler("/commands/session.turn.start");
    const router = new VmCommandRouter([handler]);
    await router.dispatch("/commands/session.turn.start", envelope("session.turn.start", "command-1", { commandId: "command-1", prompt: "first" }), { now });
    await assert.rejects(() => router.dispatch("/commands/session.turn.start", envelope("session.turn.start", "command-1", { commandId: "command-1", prompt: "second" }), { now }), VmCommandDeduplicationError);
    assert.equal(handler.calls, 1);
});
test("VM command router rejects envelope path mismatches", async () => {
    const router = new VmCommandRouter([new CountingHandler("/commands/session.turn.start")]);
    await assert.rejects(() => router.dispatch("/commands/session.turn.start", envelope("session.interrupt", "command-1"), { now }), VmCommandDeduplicationError);
});
test("VM command router does not cache failed commands", async () => {
    const handler = new CountingHandler("/commands/session.turn.start", { failFirst: true });
    const router = new VmCommandRouter([handler]);
    const body = envelope("session.turn.start", "command-1");
    await assert.rejects(() => router.dispatch("/commands/session.turn.start", body, { now }), /failed once/);
    const response = await router.dispatch("/commands/session.turn.start", body, { now });
    assert.deepEqual(response, { ok: true, calls: 2 });
    assert.equal(handler.calls, 2);
});
test("VM command router evicts old cached command responses", async () => {
    const first = new CountingHandler("/commands/session.turn.start");
    const second = new CountingHandler("/commands/session.interrupt");
    const router = new VmCommandRouter([first, second], { maxCachedCommandResults: 1 });
    await router.dispatch("/commands/session.turn.start", envelope("session.turn.start", "command-1"), { now });
    await router.dispatch("/commands/session.interrupt", envelope("session.interrupt", "command-2"), { now });
    await router.dispatch("/commands/session.turn.start", envelope("session.turn.start", "command-1"), { now });
    assert.equal(first.calls, 2);
    assert.equal(second.calls, 1);
});
class CountingHandler {
    constructor(path, options = {}) {
        this.path = path;
        this.options = options;
        this.calls = 0;
    }
    async handle() {
        this.calls += 1;
        if (this.options.failFirst && this.calls === 1) {
            throw new Error("failed once");
        }
        return { ok: true, calls: this.calls };
    }
}
class DeferredHandler {
    constructor(path) {
        this.path = path;
        this.calls = 0;
    }
    async handle() {
        this.calls += 1;
        return await new Promise((resolve) => {
            this.resolveHandler = resolve;
        });
    }
    resolve(value) {
        this.resolveHandler?.(value);
    }
}
function envelope(messageType, commandId, data = { commandId }) {
    return {
        messageType,
        commandId,
        ts: "2026-05-16T13:00:00.000Z",
        data,
    };
}
