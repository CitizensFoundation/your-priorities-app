"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const Module = require("node:module");
const guardPath = path.resolve(__dirname, "../utils/ai_image_generation_guard.cjs");
const loadGuard = ({ community, domain }) => {
    const source = fs.readFileSync(guardPath, "utf8");
    const module = { exports: {} };
    const baseRequire = Module.createRequire(guardPath);
    const mockedRequire = (request) => {
        switch (request) {
            case "../models/index.cjs":
                return {
                    Community: {
                        async findOne() {
                            return community;
                        },
                    },
                    Domain: {
                        async findOne() {
                            return domain;
                        },
                    },
                };
            case "./logger.cjs":
                return {
                    error() { },
                };
            case "uuid":
                return {
                    v4() {
                        return "test-uuid";
                    },
                };
            default:
                return baseRequire(request);
        }
    };
    const wrapped = Module.wrap(source);
    const compiled = vm.runInThisContext(wrapped, {
        filename: guardPath,
    });
    compiled(module.exports, mockedRequire, module, guardPath, path.dirname(guardPath));
    return module.exports;
};
const allowedRedisClient = {
    async eval() {
        return [1, 1, 0];
    },
};
test("allows logged-in regular domain image generation when community creation is open", async () => {
    const guard = loadGuard({
        domain: {
            id: 3,
            user_id: 10,
            only_admins_can_create_communities: false,
            async hasDomainAdmins() {
                return false;
            },
        },
    });
    const result = await guard.validateImageGenerationStartRequest({
        user: { id: 42 },
        redisClient: allowedRedisClient,
        body: {
            generationContext: "regularAiImage",
            imageType: "logo",
        },
    }, {
        collectionType: "domain",
        collectionId: 3,
    });
    assert.equal(result.allowed, true);
    assert.equal(result.userId, 42);
});
test("denies non-admin regular domain image generation when only admins can create communities", async () => {
    const guard = loadGuard({
        domain: {
            id: 3,
            user_id: 10,
            only_admins_can_create_communities: true,
            async hasDomainAdmins() {
                return false;
            },
        },
    });
    const result = await guard.validateImageGenerationStartRequest({
        user: { id: 42 },
        redisClient: allowedRedisClient,
        body: {
            generationContext: "regularAiImage",
            imageType: "logo",
        },
    }, {
        collectionType: "domain",
        collectionId: 3,
    });
    assert.equal(result.allowed, false);
    assert.equal(result.status, 403);
    assert.deepEqual(result.body, { error: "image_generation_not_allowed" });
});
test("allows logged-in regular community image generation when group creation is open", async () => {
    const guard = loadGuard({
        community: {
            id: 4,
            user_id: 10,
            only_admins_can_create_groups: false,
            async hasCommunityAdmins() {
                return false;
            },
        },
    });
    const result = await guard.validateImageGenerationStartRequest({
        user: { id: 42 },
        redisClient: allowedRedisClient,
        body: {
            generationContext: "regularAiImage",
            imageType: "logo",
        },
    }, {
        collectionType: "community",
        collectionId: 4,
    });
    assert.equal(result.allowed, true);
    assert.equal(result.userId, 42);
});
test("denies non-admin regular community image generation when only admins can create groups", async () => {
    const guard = loadGuard({
        community: {
            id: 4,
            user_id: 10,
            only_admins_can_create_groups: true,
            async hasCommunityAdmins() {
                return false;
            },
        },
    });
    const result = await guard.validateImageGenerationStartRequest({
        user: { id: 42 },
        redisClient: allowedRedisClient,
        body: {
            generationContext: "regularAiImage",
            imageType: "logo",
        },
    }, {
        collectionType: "community",
        collectionId: 4,
    });
    assert.equal(result.allowed, false);
    assert.equal(result.status, 403);
    assert.deepEqual(result.body, { error: "image_generation_not_allowed" });
});
