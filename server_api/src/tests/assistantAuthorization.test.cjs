"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const Module = require("node:module");
const ts = require("typescript");

const servicePath = path.resolve(
  __dirname,
  "../agents/services/assistantAccessService.ts"
);
const controllerPath = path.resolve(
  __dirname,
  "../agents/controllers/assistantsController.ts"
);
const workflowManagerPath = path.resolve(
  __dirname,
  "../agents/managers/workflowConversationManager.ts"
);
const voiceAssistantBasePath = path.resolve(
  __dirname,
  "../agents/assistants/baseAssistantWithVoice.ts"
);

const loadAccessService = ({ findRun, findSubscription } = {}) => {
  const source = fs.readFileSync(servicePath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: servicePath,
  }).outputText;

  const transaction = { id: "test-transaction" };
  const sequelize = {
    async transaction(callback) {
      return callback(transaction);
    },
  };
  const YpAgentProductRun = {
    async findOne(options) {
      return findRun ? findRun(options, transaction) : null;
    },
  };
  const YpSubscription = {
    async findOne(options) {
      return findSubscription ? findSubscription(options) : null;
    },
  };

  const module = { exports: {} };
  const mockedRequire = (request) => {
    switch (request) {
      case "sequelize":
        return { Transaction: { LOCK: { UPDATE: "UPDATE" } } };
      case "@policysynth/agents/dbModels/sequelize.js":
        return { sequelize };
      case "../models/agentProductRun.js":
        return { YpAgentProductRun };
      case "../models/subscription.js":
        return { YpSubscription };
      default:
        throw new Error(`Unexpected import in assistant access service: ${request}`);
    }
  };

  const compiled = vm.runInThisContext(Module.wrap(output), {
    filename: servicePath,
  });
  compiled(
    module.exports,
    mockedRequire,
    module,
    servicePath,
    path.dirname(servicePath)
  );
  return module.exports;
};

const loadWorkflowConversationManager = (findOne) => {
  const source = fs.readFileSync(workflowManagerPath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: workflowManagerPath,
  }).outputText;
  const module = { exports: {} };
  const mockedRequire = (request) => {
    if (request === "../models/workflowConversation.js") {
      return { YpWorkflowConversation: { findOne } };
    }
    if (request === "../../utils/loggerTs.js") {
      return { __esModule: true, default: { error() {} } };
    }
    throw new Error(`Unexpected workflow manager import: ${request}`);
  };
  const compiled = vm.runInThisContext(Module.wrap(output), {
    filename: workflowManagerPath,
  });
  compiled(
    module.exports,
    mockedRequire,
    module,
    workflowManagerPath,
    path.dirname(workflowManagerPath)
  );
  return module.exports;
};

const createRun = (overrides = {}) => ({
  status: "running",
  end_time: undefined,
  workflow: {
    currentStepIndex: 0,
    workflowGroupId: 20,
    steps: [
      { agentId: 30, type: "agentOps" },
      { agentId: 31, type: "subAgent" },
    ],
  },
  changedFields: [],
  savedOptions: undefined,
  changed(field) {
    this.changedFields.push(field);
  },
  async save(options) {
    this.savedOptions = options;
  },
  ...overrides,
});

test("validates positive identifiers, UUIDs, and domain-isolated memory keys", () => {
  const {
    buildAssistantMemoryRedisKey,
    isUuid,
    parsePositiveInteger,
  } = loadAccessService();

  assert.equal(parsePositiveInteger("12"), 12);
  assert.equal(parsePositiveInteger("0"), null);
  assert.equal(parsePositiveInteger("12x"), null);
  assert.equal(parsePositiveInteger(1.5), null);

  const uuid = "123e4567-e89b-42d3-a456-426614174000";
  assert.equal(isUuid(uuid), true);
  assert.equal(isUuid("not-a-uuid"), false);
  assert.equal(buildAssistantMemoryRedisKey("7", uuid), `assistant:7:${uuid}`);
  assert.equal(buildAssistantMemoryRedisKey("8", uuid), `assistant:8:${uuid}`);
  assert.equal(buildAssistantMemoryRedisKey("bad", uuid), null);
});

test("scopes subscriptions by owner and domain", async () => {
  let query;
  const { AssistantAccessService } = loadAccessService({
    findSubscription(options) {
      query = options;
      return { id: 4 };
    },
  });

  const result = await new AssistantAccessService().getOwnedSubscription(9, 4, 2);
  assert.equal(result.id, 4);
  assert.deepEqual(query.where, { id: 4, user_id: 9, domain_id: 2 });
});

test("scopes runs by owner and rejects mismatched group or agent IDs", async () => {
  const run = createRun();
  let query;
  const { AssistantAccessService } = loadAccessService({
    findRun(options) {
      query = options;
      return run;
    },
  });
  const service = new AssistantAccessService();

  assert.equal(
    await service.getOwnedRun({ userId: 9, runId: 5, groupId: 99 }),
    null
  );
  assert.equal(
    await service.getOwnedRun({
      userId: 9,
      runId: 5,
      groupId: 20,
      agentId: 31,
      requireCurrentAgent: true,
    }),
    null
  );
  assert.equal(
    await service.getOwnedRun({
      userId: 9,
      runId: 5,
      domainId: 2,
      groupId: 20,
      agentId: 31,
    }),
    run
  );
  assert.deepEqual(query.include[0].where, { user_id: 9, domain_id: 2 });
});

test("transitions an owned run under a row lock and advances once", async () => {
  const run = createRun();
  let query;
  const { AssistantAccessService } = loadAccessService({
    findRun(options) {
      query = options;
      return run;
    },
  });

  const result = await new AssistantAccessService().transitionOwnedRun({
    userId: 9,
    runId: 5,
    groupId: 20,
    agentId: 30,
    expectedCurrentStepIndex: 0,
    status: "completed",
  });

  assert.equal(result.outcome, "updated");
  assert.equal(run.workflow.currentStepIndex, 1);
  assert.equal(run.status, "waiting_on_user");
  assert.equal(query.lock, "UPDATE");
  assert.equal(query.transaction.id, "test-transaction");
  assert.equal(run.savedOptions.transaction.id, "test-transaction");
});

test("rejects stale transitions without mutating the run", async () => {
  const run = createRun();
  const { AssistantAccessService } = loadAccessService({
    findRun() {
      return run;
    },
  });

  const result = await new AssistantAccessService().transitionOwnedRun({
    userId: 9,
    runId: 5,
    groupId: 20,
    agentId: 30,
    expectedCurrentStepIndex: 1,
    status: "completed",
  });

  assert.deepEqual(result, { outcome: "conflict" });
  assert.equal(run.workflow.currentStepIndex, 0);
  assert.equal(run.savedOptions, undefined);
});

test("rejects replayed transitions after a run has stopped", async () => {
  const run = createRun({ status: "completed" });
  const { AssistantAccessService } = loadAccessService({
    findRun() {
      return run;
    },
  });

  const result = await new AssistantAccessService().transitionOwnedRun({
    userId: 9,
    runId: 5,
    groupId: 20,
    agentId: 30,
    expectedCurrentStepIndex: 0,
    status: "completed",
  });

  assert.deepEqual(result, { outcome: "conflict" });
  assert.equal(run.savedOptions, undefined);
});

test("workflow conversation updates are scoped to the owning user", async () => {
  let query;
  const conversation = {
    configuration: { running: true },
    saved: false,
    async save() {
      this.saved = true;
    },
  };
  const { WorkflowConversationManager } = loadWorkflowConversationManager(
    async (options) => {
      query = options;
      return conversation;
    }
  );

  const result = await new WorkflowConversationManager().connectToWorkflowConversation(
    8,
    42,
    { connected: true }
  );
  assert.deepEqual(query.where, { id: 8, userId: 42 });
  assert.deepEqual(result.configuration, { running: true, connected: true });
  assert.equal(conversation.saved, true);
});

test("route registration guards sensitive endpoints and removes obsolete ones", () => {
  const source = fs.readFileSync(controllerPath, "utf8");
  const guardedRoutes = [
    ["/:domainId/:subscriptionId/submitAgentConfiguration", "submitAgentConfiguration"],
    ["/:domainId/:subscriptionId/getConfigurationAnswers", "getAgentConfigurationAnswers"],
    ["/:groupId/:runId/updatedWorkflow", "getUpdatedWorkflow"],
    ["/:groupId/:agentId/:runId/advanceOrStopWorkflow", "advanceOrStopCurrentWorkflowStep"],
    ["/:domainId/:agentId/:runId/getDocxReport", "getDocxReport"],
    ["/:domainId/workflowConversations/connect", "connectToWorkflowConversation"],
  ];

  for (const [route, handler] of guardedRoutes) {
    const start = source.indexOf(`"${route}"`);
    const end = source.indexOf(`this.${handler}.bind(this)`, start);
    assert.notEqual(start, -1, `missing route ${route}`);
    assert.notEqual(end, -1, `missing handler ${handler}`);
    assert.match(
      source.slice(start, end),
      /auth\.isLoggedInNoAnonymousCheck/,
      `missing login guard for ${route}`
    );
  }

  assert.doesNotMatch(source, /\/:groupId\/:agentId\/startWorkflowAgent/);
  assert.doesNotMatch(source, /\/:groupId\/:agentId\/startNextWorkflowStep/);
  assert.doesNotMatch(source, /\/:groupId\/:agentId\/stopCurrentWorkflowStep/);
  assert.doesNotMatch(source, /YpSubscription\.destroy/);
});

test("assistant instances are cleaned up on disconnect and initialization failure", () => {
  const controllerSource = fs.readFileSync(controllerPath, "utf8");
  const voiceAssistantSource = fs.readFileSync(voiceAssistantBasePath, "utf8");

  assert.match(controllerSource, /socket\.once\("close", handler\)/);
  assert.match(controllerSource, /socket\.once\("error", handler\)/);
  assert.match(
    controllerSource,
    /void assistant\.conversation\(chatLog\)\.catch/
  );
  assert.match(
    controllerSource,
    /cleanupAssistantForMemory\(assistantMemoryKey, assistantInstance\)/
  );
  assert.match(voiceAssistantSource, /await this\.createVoiceBot\(\)/);
});
