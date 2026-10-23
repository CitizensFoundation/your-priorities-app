import assert from "node:assert/strict";
import test from "node:test";
import { ResearchGitHubSourceSchema } from "../../core.js";
test("ResearchGitHubSourceSchema accepts only the public source fields", () => {
    const source = {
        repositoryFullName: "yp-live-workflow/research",
        branchName: "yp-live-workflow/groups/201",
        folderPath: "apps/api",
        htmlUrl: "https://github.com/yp-live-workflow/research/tree/yp-live-workflow/groups/201/apps/api",
    };
    assert.deepEqual(ResearchGitHubSourceSchema.parse(source), source);
    assert.equal(ResearchGitHubSourceSchema.safeParse({ ...source, authProfileId: "secret" }).success, false);
});
