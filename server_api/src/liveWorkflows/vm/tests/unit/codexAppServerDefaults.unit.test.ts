import assert from "node:assert/strict";
import test from "node:test";
import { DefaultCodexAppServerArgs } from "../../codex/codexAppServerDefaults.js";

test("default Codex app-server args explicitly enable live web search", () => {
  const configFlagIndex = DefaultCodexAppServerArgs.indexOf("-c");

  assert.notEqual(configFlagIndex, -1);
  assert.equal(DefaultCodexAppServerArgs[configFlagIndex + 1], 'web_search="live"');
});
