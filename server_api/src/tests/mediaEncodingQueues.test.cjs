"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const Module = require("node:module");

const audioModelPath = require.resolve("../models/audio.cjs");
const videoModelPath = require.resolve("../models/video.cjs");
const loggerPath = require.resolve("../utils/logger.cjs");
const applicationQueuePath = require.resolve("../services/workers/queue.cjs");
const awsS3ClientPath = require.resolve("../utils/awsS3Client.cjs");
const bullmqPath = require.resolve("bullmq");

const injectMockModule = (modulePath, moduleExports) => {
  const mockModule = new Module(modulePath);
  mockModule.filename = modulePath;
  mockModule.loaded = true;
  mockModule.exports = moduleExports;
  require.cache[modulePath] = mockModule;
};

const createDataTypesStub = () =>
  new Proxy(
    {},
    {
      get() {
        return {};
      },
    }
  );

test("media encoding queues are created lazily and reused", async (t) => {
  const pathsToRestore = [
    audioModelPath,
    videoModelPath,
    loggerPath,
    applicationQueuePath,
    awsS3ClientPath,
    bullmqPath,
  ];
  const originals = new Map(
    pathsToRestore.map((modulePath) => [modulePath, require.cache[modulePath]])
  );
  const createdQueueNames = [];
  const addedJobs = [];

  class FakeQueue {
    constructor(name) {
      this.name = name;
      createdQueueNames.push(name);
    }

    async add(name, data) {
      addedJobs.push({ queue: this.name, name, data });
    }
  }

  injectMockModule(loggerPath, {
    error() {},
    info() {},
    warn() {},
  });
  injectMockModule(applicationQueuePath, { add() {} });
  injectMockModule(awsS3ClientPath, {
    getPresignedPutObjectUrlForBucket: async () => "https://example.com/upload",
  });
  injectMockModule(bullmqPath, { Queue: FakeQueue });
  delete require.cache[audioModelPath];
  delete require.cache[videoModelPath];

  t.after(() => {
    for (const modulePath of [audioModelPath, videoModelPath]) {
      delete require.cache[modulePath];
    }

    for (const [modulePath, originalModule] of originals) {
      if (originalModule) {
        require.cache[modulePath] = originalModule;
      } else {
        delete require.cache[modulePath];
      }
    }
  });

  const createMediaModel = (modelPath) => {
    function MediaModel() {}

    const sequelize = {
      define() {
        return MediaModel;
      },
      models: {
        AcBackgroundJob: {
          createJob(_data, _options, callback) {
            callback(null, 42);
          },
        },
      },
    };

    return require(modelPath)(sequelize, createDataTypesStub());
  };

  const Audio = createMediaModel(audioModelPath);
  const Video = createMediaModel(videoModelPath);

  assert.deepEqual(createdQueueNames, []);

  const startAudioJob = () =>
    new Promise((resolve, reject) => {
      Audio.startYrpriEncoderTranscodingJob(
        { meta: { fileKey: "audio.mp4", maxDuration: 10 } },
        (error, result) => (error ? reject(error) : resolve(result))
      );
    });

  await startAudioJob();
  await startAudioJob();
  assert.deepEqual(createdQueueNames, ["AudioEncoding"]);

  await new Promise((resolve, reject) => {
    Video.startYrpriEncoderTranscodingJob(
      {
        id: 7,
        meta: { aspect: "landscape", fileKey: "video.mp4", maxDuration: 20 },
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
  });

  assert.deepEqual(createdQueueNames, ["AudioEncoding", "VideoEncoding"]);
  assert.deepEqual(
    addedJobs.map(({ queue, name }) => ({ queue, name })),
    [
      { queue: "AudioEncoding", name: "audio-encoding" },
      { queue: "AudioEncoding", name: "audio-encoding" },
      { queue: "VideoEncoding", name: "video-encoding" },
    ]
  );
});
