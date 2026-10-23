import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, readFile, readdir, } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Readable } from "node:stream";
import { AssetService, maximumUploadBytes } from "../assets.js";
import { SecretBox } from "../secrets.js";
import { resolveAuthEnvironment } from "../vm/codex/codexAuth.js";
import { DurableOutbox } from "../vm/durableOutbox.js";
import { fixture, workspace, runId } from "./memoryStore.js";
test("ChatGPT auth rejects API material and host keys cannot supply missing credentials", () => {
    for (const authMode of [
        "openai_api_key",
        "env_secret",
        "codex_chatgpt_with_api_fallback",
    ])
        assert.throws(() => resolveAuthEnvironment({ authMode }, { OPENAI_API_KEY: "host-secret" }), /credentials|not supported/);
    const material = {
        format: "codex_home_files_v1",
        files: [
            {
                path: "auth.json",
                dataBase64: Buffer.from(JSON.stringify({
                    auth_mode: "chatgpt",
                    tokens: { access_token: "test-token" },
                })).toString("base64"),
            },
        ],
    };
    const resolved = resolveAuthEnvironment({ authMode: "codex_chatgpt", metadata: { codexAuthMaterial: material } }, { OPENAI_API_KEY: "host-secret" });
    assert.deepEqual(resolved.env, {});
    assert.equal(resolved.apiFallback, false);
    assert.equal(resolved.apiKey, undefined);
    material.files[0].dataBase64 = Buffer.from(JSON.stringify({ OPENAI_API_KEY: "hidden-key" })).toString("base64");
    assert.throws(() => resolveAuthEnvironment({
        authMode: "codex_chatgpt",
        metadata: { codexAuthMaterial: material },
    }, {}), /ChatGPT/);
});
test("encrypted credentials are bound to their user and cannot be swapped", () => {
    const box = new SecretBox(Buffer.alloc(32, 7).toString("base64")), encrypted = box.seal({ token: "secret" }, "account:user-1");
    assert.deepEqual(box.open(encrypted, "account:user-1"), { token: "secret" });
    assert.throws(() => box.open(encrypted, "account:user-2"));
    assert.ok(!encrypted.includes("secret"));
});
test("uploads stream immutable versions, reject truncation and keep groups isolated", async () => {
    const { store } = await fixture();
    await store.create({ ...workspace(2), id: "other" });
    const directory = await mkdtemp(path.join(os.tmpdir(), "yp-assets-")), assets = new AssetService(store, directory);
    try {
        const first = await assets.upload(1, Readable.from([Buffer.from("hello")]), { name: "jobs.csv", contentType: "text/csv", length: 5 });
        const second = await assets.upload(1, Readable.from([Buffer.from("world")]), { name: "jobs.csv", contentType: "text/csv", length: 5 });
        assert.equal(second.version, 2);
        assert.notEqual(first.checksum, second.checksum);
        assert.equal(await readFile(assets.path(1, first.id), "utf8"), "hello");
        await assert.rejects(assets.get(2, first.id), /not found/);
        await assert.rejects(assets.upload(1, Readable.from([Buffer.from("short")]), {
            name: "broken.csv",
            contentType: "text/csv",
            length: 10,
        }), /truncated/);
        await assert.rejects(assets.upload(1, Readable.from([]), {
            name: "huge.csv",
            contentType: "text/csv",
            length: maximumUploadBytes + 1,
        }), /250 MiB/);
        assert.equal(await store.transact(1, async (tx) => tx.state.uploadReservedBytes), 0);
        assert.equal(await store.transact(1, async (tx) => tx.state.storedBytes), 10);
        assert.throws(() => assets.path(1, "../escape"), /Invalid/);
    }
    finally {
        await rm(directory, { recursive: true, force: true });
    }
});
test("durable outbox survives an offline API and replays after reconstruction", async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), "yp-outbox-"));
    try {
        const first = new DurableOutbox(directory, async () => {
            throw new Error("offline");
        });
        await first.enqueue("session.event", { text: "saved" }, "event-1");
        await new Promise((resolve) => setTimeout(resolve, 20));
        assert.equal((await readdir(directory)).filter((n) => n.endsWith(".json")).length, 1);
        const delivered = [];
        const second = new DurableOutbox(directory, async (item) => {
            delivered.push(item);
        });
        await second.drain();
        assert.equal(delivered.length, 1);
        assert.equal((await readdir(directory)).length, 0);
    }
    finally {
        await rm(directory, { recursive: true, force: true });
    }
});
test("concurrent artifact retries cannot duplicate uploads or storage charges", async () => {
    const { store } = await fixture();
    const directory = await mkdtemp(path.join(os.tmpdir(), "yp-artifacts-"));
    const assets = new AssetService(store, directory);
    const input = {
        name: "result.json",
        contentType: "application/json",
        length: 2,
        request: { id: "artifact-request", fingerprint: "same-result", runId },
    };
    let release;
    const gate = new Promise((resolve) => {
        release = resolve;
    });
    async function* slow() {
        await gate;
        yield Buffer.from("{}");
    }
    try {
        const first = assets.upload(1, Readable.from(slow()), input);
        // Waiting for the workspace lock puts the second request after the first reservation.
        await store.transact(1, async () => undefined);
        await assert.rejects(assets.upload(1, Readable.from("{}"), input), /already in progress/);
        release();
        const created = await first;
        assert.deepEqual(await assets.upload(1, Readable.from("{}"), input), created);
        await assert.rejects(assets.upload(1, Readable.from("{}"), {
            ...input,
            request: { ...input.request, fingerprint: "different-result" },
        }), /different contents/);
        assert.equal(await store.transact(1, async (tx) => tx.state.storedBytes), 2);
    }
    finally {
        release();
        await rm(directory, { recursive: true, force: true });
    }
});
test("outbox replays concurrent streamed deltas in capture order after an outage", async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), "yp-outbox-order-"));
    try {
        const offline = new DurableOutbox(directory, async () => {
            throw new Error("offline");
        });
        await Promise.all(Array.from({ length: 30 }, (_, seq) => offline.enqueue("delta", { seq }, `source:${seq}`)));
        await new Promise((resolve) => setTimeout(resolve, 20));
        const sequence = [];
        const restored = new DurableOutbox(directory, async (item) => {
            sequence.push(item.data.seq);
        });
        await restored.drain();
        assert.deepEqual(sequence, Array.from({ length: 30 }, (_, seq) => seq));
    }
    finally {
        await rm(directory, { recursive: true, force: true });
    }
});
