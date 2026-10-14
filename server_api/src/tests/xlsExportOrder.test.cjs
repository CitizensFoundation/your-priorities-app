"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const { orderPostsByVotes, orderPostsForExport } = require("../utils/xlsExportOrder.cjs");

const post = (id, category, up = 0, down = 0) => ({
  id,
  category,
  endorsementsUp: up,
  endorsementsDown: down,
});
const ids = (posts) => posts.map((p) => p.id);

test("orders posts by net votes, highest first", () => {
  const posts = [post(1, null, 1, 0), post(2, null, 5, 1), post(3, null, 0, 2)];

  assert.deepEqual(ids(orderPostsByVotes(posts)), [2, 1, 3]);
});

test("with no categories, exports every post by net votes", () => {
  const posts = [post(1, "Parks", 1), post(2, null, 3), post(3, "Roads", 2)];

  assert.deepEqual(ids(orderPostsForExport(posts, [])), [2, 3, 1]);
});

test("groups posts by category in name order, then the uncategorised last", () => {
  const posts = [
    post(1, "Roads", 1),
    post(2, null, 9),
    post(3, "Parks", 1),
    post(4, "Roads", 5),
    post(5, "", 2),
    post(6, "Parks", 3),
  ];

  assert.deepEqual(ids(orderPostsForExport(posts, ["Roads", "Parks"])), [6, 3, 4, 1, 2, 5]);
});

test("leaves out posts whose category is not in the list, as before", () => {
  const posts = [post(1, "Parks"), post(2, "Unknown"), post(3, null)];

  assert.deepEqual(ids(orderPostsForExport(posts, ["Parks"])), [1, 3]);
});

test("does not reorder the list it was given", () => {
  const posts = [post(1, "Roads", 1), post(2, "Parks", 2)];
  const categories = ["Roads", "Parks"];
  orderPostsForExport(posts, categories);

  assert.deepEqual(ids(posts), [1, 2]);
  assert.deepEqual(categories, ["Roads", "Parks"]);
});
