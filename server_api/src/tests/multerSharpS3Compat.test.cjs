"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const Module = require("node:module");
const { PassThrough } = require("node:stream");

const sharpPath = require.resolve("sharp");
const mimeTypesPath = require.resolve("mime-types");
const awsLibStoragePath = require.resolve("@aws-sdk/lib-storage");
const awsClientS3Path = require.resolve("@aws-sdk/client-s3");
const multerSharpS3CompatPath = require.resolve("../utils/multerSharpS3Compat.cjs");

const injectMockModule = (modulePath, moduleExports) => {
  const mockModule = new Module(modulePath);
  mockModule.filename = modulePath;
  mockModule.loaded = true;
  mockModule.exports = moduleExports;
  require.cache[modulePath] = mockModule;
};

const loadMulterSharpS3Compat = ({ mockSharp, mockMimeTypes }) => {
  const originalSharpModule = require.cache[sharpPath];
  const originalMimeTypesModule = require.cache[mimeTypesPath];
  const originalAwsLibStorageModule = require.cache[awsLibStoragePath];
  const originalAwsClientS3Module = require.cache[awsClientS3Path];
  const originalCompatModule = require.cache[multerSharpS3CompatPath];

  injectMockModule(sharpPath, mockSharp);
  injectMockModule(mimeTypesPath, mockMimeTypes);
  injectMockModule(awsLibStoragePath, {
    Upload: class MockUpload {
      constructor({ client, params }) {
        this.client = client;
        this.params = params;
      }

      done() {
        return this.client.upload(this.params);
      }

      abort() {}
    },
  });
  injectMockModule(awsClientS3Path, {
    DeleteObjectCommand: class MockDeleteObjectCommand {
      constructor(input) {
        this.input = input;
      }
    },
  });
  delete require.cache[multerSharpS3CompatPath];

  const multerSharpS3Compat = require(multerSharpS3CompatPath);

  return {
    multerSharpS3Compat,
    restore() {
      delete require.cache[multerSharpS3CompatPath];

      if (originalSharpModule) {
        require.cache[sharpPath] = originalSharpModule;
      } else {
        delete require.cache[sharpPath];
      }

      if (originalMimeTypesModule) {
        require.cache[mimeTypesPath] = originalMimeTypesModule;
      } else {
        delete require.cache[mimeTypesPath];
      }

      if (originalAwsLibStorageModule) {
        require.cache[awsLibStoragePath] = originalAwsLibStorageModule;
      } else {
        delete require.cache[awsLibStoragePath];
      }

      if (originalAwsClientS3Module) {
        require.cache[awsClientS3Path] = originalAwsClientS3Module;
      } else {
        delete require.cache[awsClientS3Path];
      }

      if (originalCompatModule) {
        require.cache[multerSharpS3CompatPath] = originalCompatModule;
      }
    },
  };
};

const createMockSharp = (requestedFormats) => {
  return () => {
    let selectedFormat = null;
    const stream = new PassThrough();

    stream.resize = () => stream;
    stream.toFormat = (format) => {
      selectedFormat = format;
      requestedFormats.push(format);
      return stream;
    };

    process.nextTick(() => {
      stream.end(Buffer.from(`formatted:${selectedFormat || "original"}`));
    });

    return stream;
  };
};

const createMockS3 = ({ failKeys = [] } = {}) => {
  const uploads = [];
  const deletedObjects = [];

  return {
    uploads,
    deletedObjects,
    s3: {
      upload(params) {
        uploads.push(params);
        return new Promise((resolve, reject) => {
          const chunks = [];

          params.Body.on("data", (chunk) => {
            chunks.push(chunk);
          });
          params.Body.on("error", reject);
          params.Body.on("end", () => {
            if (failKeys.includes(params.Key)) {
              reject(new Error(`upload failed for ${params.Key}`));
            } else {
              resolve({
                Bucket: params.Bucket,
                Key: params.Key,
                Location: `https://example.com/${params.Key}`,
                uploadedBody: Buffer.concat(chunks).toString("utf8"),
              });
            }
          });
        });
      },
      send(command) {
        deletedObjects.push(command.input);
        return Promise.resolve();
      },
    },
  };
};

test("multerSharpS3Compat honors file.outputFormat over the default format", async (t) => {
  const requestedFormats = [];
  const { s3, uploads } = createMockS3();

  const { multerSharpS3Compat, restore } = loadMulterSharpS3Compat({
    mockSharp: createMockSharp(requestedFormats),
    mockMimeTypes: {
      contentType(format) {
        return `image/${format}`;
      },
    },
  });
  t.after(restore);

  const storage = multerSharpS3Compat({
    s3,
    Bucket: "images",
    toFormat: "png",
    Key: "animated.gif",
  });

  const fileStream = new PassThrough();
  fileStream.end(Buffer.from("source"));

  const file = {
    mimetype: "image/gif",
    originalname: "animated.gif",
    outputFormat: "gif",
    stream: fileStream,
  };

  const result = await new Promise((resolve, reject) => {
    storage._handleFile({}, file, (error, value) => {
      if (error) {
        reject(error);
      } else {
        resolve(value);
      }
    });
  });

  assert.deepEqual(requestedFormats, ["gif"]);
  assert.equal(uploads.length, 1);
  assert.equal(uploads[0].ContentType, "image/gif");
  assert.equal(result.default.ContentType, "image/gif");
  assert.equal(result.mimetype, "image/gif");
});

test("multerSharpS3Compat rolls back earlier variants when a later upload fails", async (t) => {
  const requestedFormats = [];
  const failingKey = "up/animated-large-2.gif";
  const { s3, deletedObjects } = createMockS3({ failKeys: [failingKey] });

  const { multerSharpS3Compat, restore } = loadMulterSharpS3Compat({
    mockSharp: createMockSharp(requestedFormats),
    mockMimeTypes: {
      contentType(format) {
        return `image/${format}`;
      },
    },
  });
  t.after(restore);

  const storage = multerSharpS3Compat({
    s3,
    Bucket: "images",
    toFormat: "png",
    Key: "animated.gif",
    multiple: true,
    resize: [
      { suffix: "-small-1", directory: "up" },
      { suffix: "-large-2", directory: "up" },
    ],
  });

  const fileStream = new PassThrough();
  fileStream.end(Buffer.from("source"));

  const file = {
    mimetype: "image/gif",
    originalname: "animated.gif",
    outputFormat: "gif",
    stream: fileStream,
  };

  const error = await new Promise((resolve) => {
    storage._handleFile({}, file, (uploadError) => {
      resolve(uploadError);
    });
  });

  assert.match(error.message, /upload failed/);
  assert.deepEqual(requestedFormats, ["gif", "gif"]);
  assert.deepEqual(deletedObjects, [
    {
      Bucket: "images",
      Key: "up/animated-small-1.gif",
    },
  ]);
});

test("_removeFile deletes every uploaded variant in a multi-variant upload", async (t) => {
  const { s3, deletedObjects } = createMockS3();

  const { multerSharpS3Compat, restore } = loadMulterSharpS3Compat({
    mockSharp: createMockSharp([]),
    mockMimeTypes: {
      contentType(format) {
        return `image/${format}`;
      },
    },
  });
  t.after(restore);

  const storage = multerSharpS3Compat({
    s3,
    Bucket: "images",
    Key: "animated.gif",
  });

  await new Promise((resolve, reject) => {
    storage._removeFile(
      {},
      {
        default: { Bucket: "images", Key: "up/a.gif" },
        "-small-1": { Bucket: "images", Key: "up/a-small.gif" },
        mimetype: "image/gif",
      },
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      },
    );
  });

  assert.deepEqual(deletedObjects, [
    { Bucket: "images", Key: "up/a.gif" },
    { Bucket: "images", Key: "up/a-small.gif" },
  ]);
});
