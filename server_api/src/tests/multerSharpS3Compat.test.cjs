"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const Module = require("node:module");
const { PassThrough } = require("node:stream");

const sharpPath = require.resolve("sharp");
const mimeTypesPath = require.resolve("mime-types");
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
  const originalCompatModule = require.cache[multerSharpS3CompatPath];

  injectMockModule(sharpPath, mockSharp);
  injectMockModule(mimeTypesPath, mockMimeTypes);
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

      if (originalCompatModule) {
        require.cache[multerSharpS3CompatPath] = originalCompatModule;
      }
    },
  };
};

test("multerSharpS3Compat honors file.outputFormat over the default format", async (t) => {
  const requestedFormats = [];
  const uploads = [];

  const mockSharp = () => ({
    resize() {
      return this;
    },
    toFormat(format) {
      requestedFormats.push(format);
      return this;
    },
    async toBuffer() {
      return {
        data: Buffer.from("gif-data"),
        info: {
          format: requestedFormats[requestedFormats.length - 1],
          size: 8,
        },
      };
    },
  });

  const { multerSharpS3Compat, restore } = loadMulterSharpS3Compat({
    mockSharp,
    mockMimeTypes: {
      contentType(format) {
        return `image/${format}`;
      },
    },
  });
  t.after(restore);

  const storage = multerSharpS3Compat({
    s3: {
      upload(params) {
        uploads.push(params);
        return {
          promise() {
            return Promise.resolve({
              Bucket: params.Bucket,
              Key: params.Key,
              Location: `https://example.com/${params.Key}`,
            });
          },
        };
      },
      deleteObject() {},
    },
    Bucket: "images",
    toFormat: "png",
    Key: "animated.gif",
  });

  const fileStream = new PassThrough();
  fileStream.end(Buffer.from("source"));

  const file = {
    mimetype: "image/gif",
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
