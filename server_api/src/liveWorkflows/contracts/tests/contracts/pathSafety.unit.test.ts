import assert from "node:assert/strict";
import test from "node:test";
import { isSafeRelativePath, normalizeSafeRelativePath } from "../../index.js";

test("relative path safety preserves the protocol acceptance contract", () => {
  for (const value of ["file.txt", "nested/file.txt", "nested\\file.txt", "nested//file.txt", "nested\\\\file.txt"]) {
    assert.equal(isSafeRelativePath(value), true, value);
  }

  for (const value of ["", "/absolute", "\\absolute", "C:\\absolute", "C:/absolute", ".", "..", "a/./b", "a/../b"]) {
    assert.equal(isSafeRelativePath(value), false, value);
  }
});

test("safe relative paths normalize to stable POSIX separators", () => {
  assert.equal(normalizeSafeRelativePath("nested\\\\folder//file.txt"), "nested/folder/file.txt");
  assert.equal(normalizeSafeRelativePath("../file.txt"), null);
  assert.equal(normalizeSafeRelativePath(42), null);
});
