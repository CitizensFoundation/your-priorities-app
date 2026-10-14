"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const { streamIntoUpload } = require("../utils/streamIntoUpload.cjs");

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Calls the callback under test records, resolving once the test has waited
// long enough for any second call to show up.
function recorder() {
  const calls = [];
  const callback = (...args) => calls.push(args);
  return { calls, callback, settled: () => wait(30).then(() => calls) };
}

// An upload that reads the stream to its end, like lib-storage does, and
// reports the given result or the stream's error.
function readingUpload(result = "https://example.invalid/report") {
  return (stream, done) => {
    stream.on("data", () => {});
    stream.on("end", () => done(null, result));
    stream.on("error", (error) => done(error));
  };
}

test("passes on the upload result once both sides have finished", async () => {
  const { callback, settled } = recorder();
  streamIntoUpload(
    {
      upload: readingUpload("https://example.invalid/report"),
      write: async (stream) => {
        stream.write("data");
        stream.end();
      },
    },
    callback
  );

  assert.deepEqual(await settled(), [[null, "https://example.invalid/report"]]);
});

test("waits for the writer even if the upload reports first", async () => {
  const { calls, callback, settled } = recorder();
  let finishWrite;
  streamIntoUpload(
    {
      upload: (stream, done) => done(null, "url"),
      write: () => new Promise((resolve) => (finishWrite = resolve)),
    },
    callback
  );

  await wait(10);
  assert.deepEqual(calls, []);
  finishWrite();
  assert.deepEqual(await settled(), [[null, "url"]]);
});

test("reports a write failure once and destroys the stream", async () => {
  const { callback, settled } = recorder();
  const failure = new Error("write failed");
  let output;
  streamIntoUpload(
    {
      upload: readingUpload(),
      write: async (stream) => {
        output = stream;
        throw failure;
      },
    },
    callback
  );

  assert.deepEqual(await settled(), [[failure]]);
  assert.equal(output.destroyed, true);
});

test("reports an upload failure once and destroys the stream for the writer", async () => {
  const { callback, settled } = recorder();
  const failure = new Error("upload failed");
  let writerSawDestroyed = false;
  streamIntoUpload(
    {
      upload: (stream, done) => setTimeout(() => done(failure), 5),
      write: async (stream) => {
        await wait(15);
        writerSawDestroyed = stream.destroyed;
        throw new Error("writer stopped");
      },
    },
    callback
  );

  assert.deepEqual(await settled(), [[failure]]);
  assert.equal(writerSawDestroyed, true);
});

test("reports a synchronous throw from the writer", async () => {
  const { callback, settled } = recorder();
  const failure = new Error("setup failed");
  streamIntoUpload(
    {
      upload: readingUpload(),
      write: () => {
        throw failure;
      },
    },
    callback
  );

  assert.deepEqual(await settled(), [[failure]]);
});

test("reports a synchronous throw from the upload", async () => {
  const { callback, settled } = recorder();
  const failure = new Error("no client");
  streamIntoUpload(
    {
      upload: () => {
        throw failure;
      },
      write: (stream) => new Promise((resolve, reject) => stream.on("close", () => reject(stream.errored))),
    },
    callback
  );

  assert.deepEqual(await settled(), [[failure]]);
});

test("does not crash when the writer fails before anything listens to the stream", async () => {
  const { callback, settled } = recorder();
  const failure = new Error("setup failed");
  streamIntoUpload(
    {
      // Like an S3 client that does I/O before the upload starts reading.
      upload: (stream, done) => setTimeout(() => done(new Error("aborted")), 20),
      write: async () => {
        throw failure;
      },
    },
    callback
  );

  assert.deepEqual(await settled(), [[failure]]);
});
