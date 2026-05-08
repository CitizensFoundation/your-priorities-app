"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const Module = require("node:module");
const path = require("node:path");

const modelsPath = path.resolve(__dirname, "../models/index.cjs");
const recountUtilsPath = require.resolve("../utils/recount_utils.cjs");
const loggerPath = require.resolve("../utils/logger.cjs");
const fraudDeleteBasePath = require.resolve(
  "../services/engine/moderation/fraud/FraudDeleteBase.cjs"
);
const fraudDeleteEndorsementsPath = require.resolve(
  "../services/engine/moderation/fraud/FraudDeleteEndorsements.cjs"
);
const fraudDeleteRatingsPath = require.resolve(
  "../services/engine/moderation/fraud/FraudDeleteRatings.cjs"
);
const fraudGetBasePath = require.resolve(
  "../services/engine/moderation/fraud/FraudGetBase.cjs"
);
const fraudBasePath = require.resolve(
  "../services/engine/moderation/fraud/FraudBase.cjs"
);
const validationPath = require.resolve(
  "../services/engine/moderation/fraud/FraudRequestValidation.cjs"
);

const injectMockModule = (modulePath, moduleExports) => {
  const mockModule = new Module(modulePath);
  mockModule.filename = modulePath;
  mockModule.loaded = true;
  mockModule.exports = moduleExports;
  require.cache[modulePath] = mockModule;
};

const loadFraudModules = (fakeModels = {}, fakeRecountUtils) => {
  const originalResolveFilename = Module._resolveFilename;
  const pathsToRestore = [
    modelsPath,
    recountUtilsPath,
    loggerPath,
    fraudDeleteBasePath,
    fraudDeleteEndorsementsPath,
    fraudDeleteRatingsPath,
    fraudGetBasePath,
    fraudBasePath,
  ];
  const originals = new Map(pathsToRestore.map(path => [path, require.cache[path]]));

  injectMockModule(modelsPath, fakeModels);
  injectMockModule(recountUtilsPath, fakeRecountUtils || {
    recountCommunity: (_communityId, done) => done(),
    recountPoints: (_pointIds, done) => done(),
    recountPosts: (_postIds, done) => done(),
  });
  injectMockModule(loggerPath, {
    error() {},
    info() {},
    warn() {},
  });
  Module._resolveFilename = function (request, parent, isMain, options) {
    if (request.endsWith("models/index.cjs")) {
      return modelsPath;
    }

    return originalResolveFilename.call(this, request, parent, isMain, options);
  };

  for (const modulePath of [
    fraudDeleteBasePath,
    fraudDeleteEndorsementsPath,
    fraudDeleteRatingsPath,
    fraudGetBasePath,
    fraudBasePath,
  ]) {
    delete require.cache[modulePath];
  }

  return {
    FraudDeleteBase: require(fraudDeleteBasePath),
    FraudDeleteRatings: require(fraudDeleteRatingsPath),
    FraudGetBase: require(fraudGetBasePath),
    restore() {
      Module._resolveFilename = originalResolveFilename;
      for (const [modulePath, originalModule] of originals) {
        if (originalModule) {
          require.cache[modulePath] = originalModule;
        } else {
          delete require.cache[modulePath];
        }
      }
    },
  };
};

const makeFraudItem = (overrides = {}) => {
  return {
    id: 1,
    created_at: "2026-01-01T00:00:00.000Z",
    value: 1,
    post_id: 10,
    user_id: 20,
    user_agent: "test-agent",
    ip_address: "127.0.0.1",
    data: {},
    dataValues: {
      backgroundColor: "#ffffff",
      confidenceScore: "80%",
    },
    User: {
      id: 20,
      email: "user@example.com",
      name: "User",
    },
    Post: {
      id: 10,
      name: "Post",
    },
    ...overrides,
  };
};

test("fraud scan compression tolerates missing user associations", (t) => {
  const { FraudGetBase, restore } = loadFraudModules();
  t.after(restore);

  const engine = new FraudGetBase({ collectionType: "ratings" });
  engine.dataToProcess = [
    {
      key: "127.0.0.1:fingerprint",
      items: [
        makeFraudItem({
          User: null,
        }),
      ],
    },
  ];

  assert.doesNotThrow(() => engine.customCompress());
  assert.deepEqual(engine.dataToProcess.cEmails, [""]);
  assert.deepEqual(engine.dataToProcess.cNames, [""]);
  assert.equal(engine.dataToProcess.items[0].User.email, 0);
  assert.equal(engine.dataToProcess.items[0].User.name, 0);
});

test("fraud delete grouping tolerates missing user associations", (t) => {
  const { FraudDeleteBase, restore } = loadFraudModules();
  t.after(restore);

  const engine = new FraudDeleteBase({ type: "delete-items" });
  const itemsToDelete = engine.getAllItemsExceptOne([
    makeFraudItem({
      id: 1,
      created_at: "2026-01-01T00:00:00.000Z",
      User: null,
    }),
    makeFraudItem({
      id: 2,
      created_at: "2026-01-02T00:00:00.000Z",
      User: undefined,
    }),
  ]);

  assert.equal(itemsToDelete.length, 1);
  assert.equal(itemsToDelete[0].id, 1);
});

test("rating fraud deletion preserves one row per custom rating dimension", (t) => {
  const { FraudDeleteRatings, restore } = loadFraudModules();
  t.after(restore);

  const engine = new FraudDeleteRatings({ type: "delete-items" });
  const itemsToDelete = engine.getAllItemsExceptOne([
    makeFraudItem({
      id: 1,
      type_index: 0,
      created_at: "2026-01-01T00:00:00.000Z",
    }),
    makeFraudItem({
      id: 2,
      type_index: 0,
      created_at: "2026-01-02T00:00:00.000Z",
    }),
    makeFraudItem({
      id: 3,
      type_index: 1,
      created_at: "2026-01-01T00:00:00.000Z",
    }),
    makeFraudItem({
      id: 4,
      type_index: 1,
      created_at: "2026-01-02T00:00:00.000Z",
    }),
  ]);

  assert.deepEqual(itemsToDelete.map(item => item.id), [2, 4]);
});

test("fraud deletion and audit log share one transaction", async (t) => {
  const transaction = { id: "tx" };
  const seenTransactions = [];
  const fakeModels = {
    sequelize: {
      async transaction(callback) {
        return callback(transaction);
      },
    },
    AcBackgroundJob: {
      async findOne() {
        return {
          internal_data: {
            idsToDelete: [1, 2],
          },
        };
      },
      async updateProgressAsync() {},
      async updateErrorAsync() {},
    },
    User: {
      async findOne(options) {
        seenTransactions.push(options.transaction);
        return { name: "Admin" };
      },
    },
    GeneralDataStore: {
      async create(data, options) {
        seenTransactions.push(options.transaction);
        return {
          id: 123,
          data: data.data,
        };
      },
    },
    Community: {
      async findOne(options) {
        seenTransactions.push(options.transaction);
        return {
          data: {},
          set(_path, value) {
            this.data.fraudDeletionsAuditLogs = value;
          },
          changed() {},
          async save(options) {
            seenTransactions.push(options.transaction);
          },
        };
      },
    },
  };

  const fakeRecountUtils = {
    recountCommunity: (_communityId, done, transactionArg) => {
      seenTransactions.push(transactionArg);
      done();
    },
    recountPoints: (_pointIds, done, transactionArg) => {
      seenTransactions.push(transactionArg);
      done();
    },
    recountPosts: (_postIds, done, transactionArg) => {
      seenTransactions.push(transactionArg);
      done();
    },
  };

  const { FraudDeleteBase, restore } = loadFraudModules(fakeModels, fakeRecountUtils);
  t.after(restore);

  class TestFraudDelete extends FraudDeleteBase {
    async getItemsById() {
      return [
        makeFraudItem({ id: 1, created_at: "2026-01-01T00:00:00.000Z" }),
        makeFraudItem({ id: 2, created_at: "2026-01-02T00:00:00.000Z" }),
      ];
    }

    setupDataToProcess() {
      this.dataToProcess = {
        group: {
          items: this.items,
        },
      };
    }

    async destroyChunkItems(_items, transactionArg) {
      seenTransactions.push(transactionArg);
    }
  }

  const engine = new TestFraudDelete({
    type: "delete-items",
    jobId: 1,
    userId: 2,
    communityId: 3,
  });

  await engine.deleteItems();
  assert.equal(seenTransactions.length, 6);
  assert.ok(seenTransactions.every(item => item === transaction));
});

test("fraud action request validation rejects unsafe and invalid inputs", () => {
  const { validateFraudActionRequest } = require(validationPath);

  assert.equal(
    validateFraudActionRequest({
      type: "explode",
      selectedMethod: "byIpAddress",
      collectionType: "ratings",
    }).error,
    "invalid_fraud_action_type"
  );

  assert.equal(
    validateFraudActionRequest({
      type: "get-items",
      selectedMethod: "byIpFingerprintPointId",
      collectionType: "ratings",
    }).error,
    "invalid_fraud_detection_method"
  );

  assert.equal(
    validateFraudActionRequest({
      type: "delete-one-item",
      selectedMethod: "byIpAddress",
      collectionType: "ratings",
      idsToDelete: [1, 2],
    }).error,
    "single_delete_requires_one_id"
  );

  assert.equal(
    validateFraudActionRequest({
      type: "delete-items",
      selectedMethod: "byMissingBrowserFingerprint",
      collectionType: "ratings",
      idsToDelete: [1],
    }).error,
    "bulk_delete_missing_fingerprint_disabled"
  );

  assert.deepEqual(
    validateFraudActionRequest({
      type: "get-items",
      selectedMethod: "byIpFingerprintPointId",
      collectionType: "pointQualities",
      idsToDelete: [1],
    }),
    { idsToDelete: [1] }
  );
});
