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
const fraudGetPostsPath = require.resolve(
  "../services/engine/moderation/fraud/FraudGetPosts.cjs"
);
const fraudBasePath = require.resolve(
  "../services/engine/moderation/fraud/FraudBase.cjs"
);
const fraudScannerNotifierPath = require.resolve(
  "../services/engine/moderation/fraud/FraudScannerNotifier.cjs"
);
const validationPath = require.resolve(
  "../services/engine/moderation/fraud/FraudRequestValidation.cjs"
);
const fraudAuditReportPath = require.resolve(
  "../services/engine/moderation/fraud/CreateFraudAuditReport.cjs"
);
const queuePath = require.resolve("../services/workers/queue.cjs");

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
    fraudGetPostsPath,
    fraudBasePath,
    fraudScannerNotifierPath,
    fraudAuditReportPath,
    queuePath,
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
  injectMockModule(queuePath, {
    add() {},
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
    fraudGetPostsPath,
    fraudBasePath,
    fraudScannerNotifierPath,
    fraudAuditReportPath,
  ]) {
    delete require.cache[modulePath];
  }

  const scannerModule = require(fraudScannerNotifierPath);

  return {
    FraudDeleteBase: require(fraudDeleteBasePath),
    FraudDeleteRatings: require(fraudDeleteRatingsPath),
    FraudGetBase: require(fraudGetBasePath),
    FraudGetPosts: require(fraudGetPostsPath),
    FraudScannerNotifier: scannerModule.FraudScannerNotifier,
    FraudAuditReport: require(fraudAuditReportPath).FraudAuditReport,
    runFraudScannerNotifier: scannerModule.runFraudScannerNotifier,
    sanitizeWorksheetName: require(fraudAuditReportPath).sanitizeWorksheetName,
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

test("fraud scan compression tolerates missing parent associations", (t) => {
  const { FraudGetBase, restore } = loadFraudModules();
  t.after(restore);

  const ratingsEngine = new FraudGetBase({ collectionType: "ratings" });
  ratingsEngine.dataToProcess = [
    {
      key: "127.0.0.1:fingerprint",
      items: [
        makeFraudItem({
          Post: null,
        }),
      ],
    },
  ];

  assert.doesNotThrow(() => ratingsEngine.customCompress());
  assert.deepEqual(ratingsEngine.dataToProcess.cPostNames, [""]);
  assert.equal(ratingsEngine.dataToProcess.items[0].Post.name, 0);

  const pointQualityEngine = new FraudGetBase({ collectionType: "pointQualities" });
  pointQualityEngine.dataToProcess = [
    {
      key: "127.0.0.1:fingerprint",
      items: [
        makeFraudItem({
          Point: null,
        }),
      ],
    },
  ];

  assert.doesNotThrow(() => pointQualityEngine.customCompress());
  assert.deepEqual(pointQualityEngine.dataToProcess.cPostNames, [""]);
  assert.equal(pointQualityEngine.dataToProcess.items[0].Point.Post.name, 0);
});

test("post fraud detection counts post rows by id", (t) => {
  const { FraudGetPosts, restore } = loadFraudModules();
  t.after(restore);

  const postItems = Array.from({ length: 20 }, (_value, index) => {
    return makeFraudItem({
      id: index + 1,
      post_id: undefined,
      created_at: `2026-01-01T00:${String(index).padStart(2, "0")}:00.000Z`,
      data: {
        browserFingerprint: "fingerprint",
      },
    });
  });
  const groupedItems = {
    "127.0.0.1:fingerprint": postItems,
  };
  const engine = new FraudGetPosts({ collectionType: "posts" });

  const byIpFingerprint = engine.getTopItems(groupedItems, "byIpFingerprint");
  const byIpAddress = engine.getTopItems(groupedItems, "byIpAddress");

  assert.equal(byIpFingerprint.length, 1);
  assert.equal(byIpFingerprint[0].count, 20);
  assert.equal(byIpAddress.length, 1);
  assert.equal(byIpAddress[0].count, 20);
});

test("fraud scanner notifier is safe to import", (t) => {
  const originalExit = process.exit;
  let exitCalled = false;
  process.exit = ((code) => {
    exitCalled = true;
    throw new Error(`Unexpected process.exit(${code})`);
  });

  const {
    FraudScannerNotifier,
    runFraudScannerNotifier,
    restore,
  } = loadFraudModules();

  t.after(() => {
    process.exit = originalExit;
    restore();
  });

  assert.equal(typeof FraudScannerNotifier, "function");
  assert.equal(typeof runFraudScannerNotifier, "function");
  assert.equal(exitCalled, false);
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
  let auditLogData;
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
        auditLogData = data.data;
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
  assert.deepEqual(auditLogData.deleteData.idsToDelete, [2]);
  assert.deepEqual(auditLogData.deleteData.requestedIdsToDelete, [1, 2]);
});

test("fraud action request validation rejects unsafe and invalid inputs", () => {
  const {
    MAX_FRAUD_IDS_TO_DELETE,
    validateFraudActionRequest,
  } = require(validationPath);

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
      type: "get-items",
      selectedMethod: "byIpFingerprintPostId",
      collectionType: "posts",
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
      selectedMethod: "byIpAddress",
      collectionType: "ratings",
      idsToDelete: [],
    }).error,
    "delete_requires_ids"
  );

  assert.equal(
    validateFraudActionRequest({
      type: "delete-items",
      selectedMethod: "byIpAddress",
      collectionType: "ratings",
      idsToDelete: "1",
    }).error,
    "invalid_ids_to_delete"
  );

  assert.equal(
    validateFraudActionRequest({
      type: "delete-items",
      selectedMethod: "byIpAddress",
      collectionType: "ratings",
      idsToDelete: [1, 0],
    }).error,
    "invalid_ids_to_delete"
  );

  assert.equal(
    validateFraudActionRequest({
      type: "delete-items",
      selectedMethod: "byIpAddress",
      collectionType: "ratings",
      idsToDelete: [1, "bad"],
    }).error,
    "invalid_ids_to_delete"
  );

  assert.equal(
    validateFraudActionRequest({
      type: "delete-items",
      selectedMethod: "byIpAddress",
      collectionType: "ratings",
      idsToDelete: Array.from({ length: MAX_FRAUD_IDS_TO_DELETE + 1 }, (_value, index) => index + 1),
    }).error,
    "too_many_ids_to_delete"
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
      type: "delete-items",
      selectedMethod: "byIpAddress",
      collectionType: "ratings",
      idsToDelete: [3, "2", 3, "2"],
    }),
    { idsToDelete: [3, 2] }
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

test("fraud audit report validates community ownership and xlsx metadata", (t) => {
  const { FraudAuditReport, sanitizeWorksheetName, restore } = loadFraudModules();
  t.after(restore);

  const report = new FraudAuditReport({
    communityId: 10,
    community: {
      id: 10,
      name: "Community / With * Invalid : Characters",
    },
    userName: "Admin [With] A Very Very Very Long Name",
    auditReportData: {
      workPackage: {
        collectionType: "posts",
      },
    },
  });

  assert.doesNotThrow(() => report.validateAuditReportCommunity({
    data: {
      workPackage: {
        communityId: "10",
      },
    },
  }));
  assert.throws(
    () => report.validateAuditReportCommunity({
      data: {
        workPackage: {
          communityId: 11,
        },
      },
    }),
    /does not belong/
  );

  report.setupFilename();
  assert.ok(report.workPackage.filename.endsWith(".xlsx"));
  assert.equal(report.workPackage.fileEnding, "xlsx");

  const worksheetName = sanitizeWorksheetName("Community Users 10 Admin [With] / Invalid * Long Long Long Long");
  assert.ok(worksheetName.length <= 31);
  assert.equal(/[\\/\*\?:\[\]]/.test(worksheetName), false);

  const apostropheBoundaryName = sanitizeWorksheetName("Community Users 10 ABCDEFGHIJK'LMNO");
  assert.ok(apostropheBoundaryName.length <= 31);
  assert.equal(apostropheBoundaryName.endsWith("'"), false);
  assert.equal(apostropheBoundaryName.startsWith("'"), false);
});
