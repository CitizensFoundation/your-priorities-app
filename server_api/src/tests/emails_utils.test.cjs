"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const Module = require("node:module");

const emailsUtilsPath = path.resolve(
  __dirname,
  "../services/engine/notifications/emails_utils.cjs",
);

const loadEmailsUtils = ({ logger, redisConnection, queue, models }) => {
  const source = fs.readFileSync(emailsUtilsPath, "utf8");
  const module = { exports: {} };
  const baseRequire = Module.createRequire(emailsUtilsPath);

  const mockedRequire = (request) => {
    switch (request) {
      case "../../../utils/logger.cjs":
        return logger;
      case "../../utils/redisConnection.cjs":
        return redisConnection;
      case "../../workers/queue.cjs":
        return queue;
      case "../../../models/index.cjs":
        return models;
      case "nodemailer":
        return {
          createTransport() {
            return {
              verify(callback) {
                if (callback) {
                  callback(null, true);
                }
              },
            };
          },
        };
      case "../../utils/i18n.cjs":
        return {
          t(value) {
            return value;
          },
        };
      default:
        return baseRequire(request);
    }
  };

  const wrapped = Module.wrap(source);
  const compiled = vm.runInThisContext(wrapped, {
    filename: emailsUtilsPath,
  });

  compiled(
    module.exports,
    mockedRequire,
    module,
    emailsUtilsPath,
    path.dirname(emailsUtilsPath),
  );

  return module.exports;
};

test("filterNotificationForDelivery falls back to delivery when Redis suppression lookup fails", async () => {
  const queuedEmails = [];
  const redisSetExCalls = [];
  const warnings = [];

  const emailsUtils = loadEmailsUtils({
    logger: {
      info() {},
      error() {},
      warn(message, metadata) {
        warnings.push({ message, metadata });
      },
    },
    redisConnection: {
      async get() {
        throw new Error("redis down");
      },
      setEx(...args) {
        redisSetExCalls.push(args);
      },
    },
    queue: {
      add(...args) {
        queuedEmails.push(args);
      },
    },
    models: {
      AcNotification: {
        METHOD_MUTED: "muted",
        FREQUENCY_AS_IT_HAPPENS: "as_it_happens",
      },
    },
  });

  const group = {
    name: "visible-group",
    async hasGroupAdmins() {
      return false;
    },
  };

  const user = {
    id: 42,
    email: "person@example.com",
    notifications_settings: {
      point_activity: {
        method: "email",
        frequency: "as_it_happens",
      },
    },
  };

  const notification = {
    from_notification_setting: "point_activity",
    AcActivities: [
      {
        Domain: { id: 1 },
        Community: null,
        Group: group,
        Point: {
          Group: group,
        },
        Post: null,
      },
    ],
  };

  await new Promise((resolve, reject) => {
    emailsUtils.filterNotificationForDelivery(
      notification,
      user,
      "point_activity",
      "A subject",
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      },
    );
  });

  assert.equal(warnings.length, 1);
  assert.equal(
    warnings[0].message,
    "Redis suppression lookup failed, continuing delivery",
  );
  assert.equal(warnings[0].metadata.userId, 42);
  assert.equal(queuedEmails.length, 1);
  assert.equal(queuedEmails[0][0], "send-one-email");
  assert.equal(redisSetExCalls.length, 1);
});
