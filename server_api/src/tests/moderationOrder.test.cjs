"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const { MODERATION_LIST_LIMIT, newestFirst } = require("../utils/moderationOrder.cjs");

test("caps moderation lists at 7,500 rows per content type", () => {
  assert.equal(MODERATION_LIST_LIMIT, 7500);
});

test("orders by newest first before any include ordering, so a capped list keeps the latest items", () => {
  const includeOrder = [["PostHeaderImages", "updated_at", "asc"]];
  assert.deepEqual(newestFirst(includeOrder), [
    ["created_at", "DESC"],
    ["id", "DESC"],
    ["PostHeaderImages", "updated_at", "asc"],
  ]);
});

test("does not change the order array it is given", () => {
  const includeOrder = [["PointRevisions", "created_at", "asc"]];
  newestFirst(includeOrder);
  assert.deepEqual(includeOrder, [["PointRevisions", "created_at", "asc"]]);
});
