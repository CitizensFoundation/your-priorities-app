"use strict";

const { PassThrough } = require("stream");

// Run write(stream), which returns a promise, and upload(stream, done) on one
// PassThrough, so a file is uploaded as it is written and never held whole in
// memory. callback(error) is called once, at the first failure from either
// side, or callback(null, uploadResult) once both have finished. A failure
// destroys the stream: that aborts the upload when the writer failed, and stops
// the writer when the upload failed.
function streamIntoUpload({ write, upload }, callback) {
  const stream = new PassThrough();
  // Errors are reported through callback. Without a listener, destroying the
  // stream with an error before the upload or the writer has attached one
  // would crash the process.
  stream.on("error", () => {});

  let finished = false;
  let written = false;
  let uploaded = false;
  let uploadResult;

  const finish = (error) => {
    if (finished) return;
    if (error) {
      finished = true;
      stream.destroy(error);
      callback(error);
    } else if (written && uploaded) {
      finished = true;
      callback(null, uploadResult);
    }
  };

  try {
    upload(stream, (error, result) =>
      process.nextTick(() => {
        uploaded = true;
        uploadResult = result;
        finish(error);
      })
    );
  } catch (error) {
    finish(error);
    return;
  }

  // finish runs on the next tick on both sides, outside any promise chain, so
  // a throw from callback surfaces as an ordinary exception rather than being
  // caught by the writer's or the upload's own promise handling.
  Promise.resolve()
    .then(() => write(stream))
    .then(
      () =>
        process.nextTick(() => {
          written = true;
          finish();
        }),
      (error) => process.nextTick(() => finish(error))
    );
}

module.exports = { streamIntoUpload };
