"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const vm = require("node:vm");
const { Op } = require("sequelize");

const sourceRoot = path.resolve(__dirname, "..");
const thisFile = path.resolve(__filename);
const sourceExtensions = new Set([".js", ".cjs", ".ts", ".cts"]);
const legacyOperatorPattern =
  /["']?\$(?:gt|gte|lt|lte|in|and|or|eq|ne|is|not|between|notBetween|like|contains|any)["']?\s*:/g;

const collectSourceFiles = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return collectSourceFiles(entryPath);
    }

    if (
      entryPath === thisFile ||
      entryPath.endsWith(".d.ts") ||
      !sourceExtensions.has(path.extname(entry.name))
    ) {
      return [];
    }

    return [entryPath];
  });

const loadCommonJsModule = (modulePath, mocks) => {
  const source = fs.readFileSync(modulePath, "utf8");
  const loadedModule = { exports: {} };
  const baseRequire = Module.createRequire(modulePath);
  const mockedRequire = (request) =>
    Object.hasOwn(mocks, request) ? mocks[request] : baseRequire(request);
  const compiled = vm.runInThisContext(Module.wrap(source), {
    filename: modulePath,
  });

  compiled(
    loadedModule.exports,
    mockedRequire,
    loadedModule,
    modulePath,
    path.dirname(modulePath)
  );

  return loadedModule.exports;
};

test("source uses symbol-based Sequelize operators", () => {
  const violations = [];

  for (const sourceFile of collectSourceFiles(sourceRoot)) {
    const source = fs.readFileSync(sourceFile, "utf8");
    const relativePath = path.relative(sourceRoot, sourceFile);

    legacyOperatorPattern.lastIndex = 0;
    if (legacyOperatorPattern.test(source)) {
      violations.push(`${relativePath}: contains a legacy string operator`);
    }

    if (source.includes("operatorsAliases")) {
      violations.push(`${relativePath}: configures operatorsAliases`);
    }
  }

  assert.deepEqual(violations, []);
});

test("news-feed query composition preserves Sequelize symbols", () => {
  const newsFeedsUtilsPath = path.resolve(
    __dirname,
    "../services/engine/news_feeds/news_feeds_utils.cjs"
  );
  const { getCommonWhereOptions } = loadCommonJsModule(newsFeedsUtilsPath, {
    "../../../models/index.cjs": {},
  });
  const beforeDate = new Date("2025-01-01T00:00:00.000Z");
  const beforeFilter = new Date("2024-01-01T00:00:00.000Z");
  const where = getCommonWhereOptions({
    dateColumn: "created_at",
    beforeDate,
    beforeFilter,
  });

  assert.equal(where.status, "active");
  assert.equal(where.deleted, false);
  assert.equal(where[Op.and][0].created_at[Op.lt], beforeDate);
  assert.equal(where[Op.and][1].created_at[Op.lt], beforeFilter);
});

test("notification pagination preserves date operator symbols", async () => {
  const notificationsControllerPath = path.resolve(
    __dirname,
    "../services/controllers/notifications.cjs"
  );
  const routes = new Map();
  const firstQueryWhere = [];
  let findAllCallCount = 0;
  const router = {
    get(route, ...handlers) {
      routes.set(`GET ${route}`, handlers.at(-1));
    },
    put() {},
  };
  const models = {
    AcNotification: {
      findAll(options) {
        const isFirstQuery = findAllCallCount++ % 2 === 0;
        if (isFirstQuery) {
          firstQueryWhere.push(options.where);
          return Promise.resolve([{ id: 11 }]);
        }

        return Promise.resolve([
          { id: 11, created_at: new Date(), AcActivities: [] },
        ]);
      },
      count() {
        return Promise.resolve(0);
      },
    },
    AcActivity: {
      setOrganizationUsersForActivities(_activities, callback) {
        callback();
      },
    },
    User: {},
    Image: {},
    Post: {},
    Community: {},
    Group: {},
    Point: {},
  };
  const getCommonWhereDateOptions = (options) => ({
    [options.dateColumn]: options.beforeDate
      ? { [Op.lt]: options.beforeDate }
      : { [Op.gt]: options.afterDate },
  });

  loadCommonJsModule(notificationsControllerPath, {
    express: { Router: () => router },
    "../../models/index.cjs": models,
    "../../authorization.cjs": { isLoggedInNoAnonymousCheck() {} },
    "../../utils/logger.cjs": { error() {} },
    "../engine/news_feeds/news_feeds_utils.cjs": {
      getCommonWhereDateOptions,
    },
  });

  const getNotifications = routes.get("GET /");
  const runRequest = (query) =>
    new Promise((resolve, reject) => {
      getNotifications(
        { query, user: { id: 42 } },
        {
          send: resolve,
          sendStatus(status) {
            reject(new Error(`Unexpected response status ${status}`));
          },
        }
      );
    });

  await runRequest({ beforeDate: "2025-01-01T00:00:00.000Z" });
  await runRequest({ afterDate: "2024-01-01T00:00:00.000Z" });

  assert.equal(firstQueryWhere[0].user_id, 42);
  assert.equal(
    firstQueryWhere[0].updated_at[Op.lt].toISOString(),
    "2025-01-01T00:00:00.000Z"
  );
  assert.equal(
    firstQueryWhere[1].updated_at[Op.gt].toISOString(),
    "2024-01-01T00:00:00.000Z"
  );
});
