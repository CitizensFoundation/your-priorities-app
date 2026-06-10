"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const Module = require("node:module");
const imageModelPath = require.resolve("../models/image.cjs");
const loggerPath = require.resolve("../utils/logger.cjs");
const injectMockModule = (modulePath, moduleExports) => {
    const mockModule = new Module(modulePath);
    mockModule.filename = modulePath;
    mockModule.loaded = true;
    mockModule.exports = moduleExports;
    require.cache[modulePath] = mockModule;
};
const loadImageModelFactory = () => {
    const originalLoggerModule = require.cache[loggerPath];
    const originalImageModelModule = require.cache[imageModelPath];
    injectMockModule(loggerPath, {
        error() { },
        info() { },
        warn() { },
    });
    delete require.cache[imageModelPath];
    return {
        createImageModel: require(imageModelPath),
        restore() {
            delete require.cache[imageModelPath];
            if (originalLoggerModule) {
                require.cache[loggerPath] = originalLoggerModule;
            }
            else {
                delete require.cache[loggerPath];
            }
            if (originalImageModelModule) {
                require.cache[imageModelPath] = originalImageModelModule;
            }
        },
    };
};
const createDataTypesStub = () => new Proxy({}, {
    get() {
        return {};
    },
});
const createResponse = () => {
    return {
        body: null,
        statusCode: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(body) {
            this.body = body;
            return this;
        },
    };
};
const setupImageModel = ({ imageRecord, postWithImage, groupWithImage, remainingAssociations, remainingPostHeaderImageCount = 0, createImageModel, associations, }) => {
    const post = {
        cover_media_type: undefined,
        saveCallCount: 0,
        removedHeaderImages: [],
        removedPostImages: [],
        removedUserImages: [],
        async save() {
            this.saveCallCount += 1;
        },
        async removePostHeaderImage(image) {
            this.removedHeaderImages.push(image.id);
        },
        async countPostHeaderImages() {
            return remainingPostHeaderImageCount;
        },
        async removePostImage(image) {
            this.removedPostImages.push(image.id);
        },
        async removePostUserImage(image) {
            this.removedUserImages.push(image.id);
        },
    };
    const group = {
        removedLogoImages: [],
        async removeGroupLogoImage(image) {
            this.removedLogoImages.push(image.id);
        },
    };
    const sequelize = {
        define() {
            return {};
        },
        models: {
            Group: {
                async findByPk() {
                    return groupWithImage !== undefined ? group : null;
                },
                async findOne() {
                    return groupWithImage;
                },
            },
            Post: {
                async findByPk() {
                    return post;
                },
                async findOne() {
                    return postWithImage;
                },
            },
        },
    };
    const Image = createImageModel(sequelize, createDataTypesStub());
    sequelize.models.Image = Image;
    Image.associations =
        associations || {
            PostImages: { associationType: "BelongsToMany" },
            PostHeaderImages: { associationType: "BelongsToMany" },
            PostUserImages: { associationType: "BelongsToMany" },
        };
    Image.findByPk = async (_imageId, options) => {
        if (options?.include) {
            return remainingAssociations;
        }
        return imageRecord;
    };
    return { Image, post, group };
};
test("removeImageFromCollection detaches shared post header images without deleting the image", async (t) => {
    const { createImageModel, restore } = loadImageModelFactory();
    t.after(restore);
    const imageRecord = {
        id: 42,
        deleted: false,
        saveCallCount: 0,
        async save() {
            this.saveCallCount += 1;
        },
    };
    const { Image, post } = setupImageModel({
        createImageModel,
        imageRecord,
        postWithImage: {
            PostHeaderImages: [{ id: 42 }],
            PostImages: [],
            PostUserImages: [],
        },
        remainingAssociations: {
            PostImages: [],
            PostHeaderImages: [{ id: 42 }],
            PostUserImages: [],
        },
    });
    const res = createResponse();
    await Image.removeImageFromCollection({
        params: {
            imageId: "42",
            postId: "10",
        },
        query: {},
    }, res);
    assert.deepEqual(post.removedHeaderImages, [42]);
    assert.equal(imageRecord.deleted, false);
    assert.equal(imageRecord.saveCallCount, 0);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { message: "Image removed from collection" });
});
test("removeImageFromCollection still deletes unshared post images", async (t) => {
    const { createImageModel, restore } = loadImageModelFactory();
    t.after(restore);
    const imageRecord = {
        id: 99,
        deleted: false,
        saveCallCount: 0,
        async save() {
            this.saveCallCount += 1;
        },
    };
    const { Image, post } = setupImageModel({
        createImageModel,
        imageRecord,
        postWithImage: {
            PostHeaderImages: [],
            PostImages: [{ id: 99 }],
            PostUserImages: [],
        },
        remainingAssociations: {
            PostImages: [],
            PostHeaderImages: [],
            PostUserImages: [],
        },
    });
    const res = createResponse();
    await Image.removeImageFromCollection({
        params: {
            imageId: "99",
            postId: "10",
        },
        query: {},
    }, res);
    assert.deepEqual(post.removedPostImages, [99]);
    assert.equal(imageRecord.deleted, true);
    assert.equal(imageRecord.saveCallCount, 1);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { message: "Image removed from collection" });
});
test("removeByUserIdOnly detaches the current collection before preserving shared images", async (t) => {
    const { createImageModel, restore } = loadImageModelFactory();
    t.after(restore);
    const imageRecord = {
        id: 77,
        user_id: 850,
        deleted: false,
        saveCallCount: 0,
        async save() {
            this.saveCallCount += 1;
        },
    };
    const { Image, group } = setupImageModel({
        createImageModel,
        imageRecord,
        groupWithImage: {
            GroupLogoImages: [{ id: 77 }],
        },
        remainingAssociations: {
            GroupLogoImages: [{ id: 77 }],
            CommunityLogoImages: [],
        },
        associations: {
            GroupLogoImages: { associationType: "BelongsToMany" },
            CommunityLogoImages: { associationType: "BelongsToMany" },
        },
    });
    const res = createResponse();
    await Image.removeImageFromCollection({
        params: {
            groupId: "55",
            imageId: "77",
        },
        query: {
            removeByUserIdOnly: "true",
        },
        user: {
            id: 850,
        },
    }, res);
    assert.deepEqual(group.removedLogoImages, [77]);
    assert.equal(imageRecord.deleted, false);
    assert.equal(imageRecord.saveCallCount, 0);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { message: "Image removed from collection" });
});
test("removeByUserIdOnly directly deletes unattached uploads owned by the current user", async (t) => {
    const { createImageModel, restore } = loadImageModelFactory();
    t.after(restore);
    const imageRecord = {
        id: 88,
        user_id: 850,
        deleted: false,
        saveCallCount: 0,
        async save() {
            this.saveCallCount += 1;
        },
    };
    const { Image, group } = setupImageModel({
        createImageModel,
        imageRecord,
        groupWithImage: null,
        remainingAssociations: {
            GroupLogoImages: [],
        },
        associations: {
            GroupLogoImages: { associationType: "BelongsToMany" },
        },
    });
    const res = createResponse();
    await Image.removeImageFromCollection({
        params: {
            groupId: "55",
            imageId: "88",
        },
        query: {
            removeByUserIdOnly: "true",
        },
        user: {
            id: 850,
        },
    }, res);
    assert.deepEqual(group.removedLogoImages, []);
    assert.equal(imageRecord.deleted, true);
    assert.equal(imageRecord.saveCallCount, 1);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { message: "Image removed from collection" });
});
test("removing the only post header image resets cover_media_type", async (t) => {
    const { createImageModel, restore } = loadImageModelFactory();
    t.after(restore);
    const imageRecord = {
        id: 123,
        deleted: false,
        saveCallCount: 0,
        async save() {
            this.saveCallCount += 1;
        },
    };
    const { Image, post } = setupImageModel({
        createImageModel,
        imageRecord,
        postWithImage: {
            PostHeaderImages: [{ id: 123 }],
            PostImages: [],
            PostUserImages: [],
        },
        remainingAssociations: {
            PostImages: [],
            PostHeaderImages: [],
            PostUserImages: [],
        },
        remainingPostHeaderImageCount: 0,
    });
    post.cover_media_type = "image";
    const res = createResponse();
    await Image.removeImageFromCollection({
        params: {
            imageId: "123",
            postId: "10",
        },
        query: {},
    }, res);
    assert.deepEqual(post.removedHeaderImages, [123]);
    assert.equal(post.cover_media_type, "none");
    assert.equal(post.saveCallCount, 1);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { message: "Image removed from collection" });
});
test("removing one post header image keeps cover_media_type when others remain", async (t) => {
    const { createImageModel, restore } = loadImageModelFactory();
    t.after(restore);
    const imageRecord = {
        id: 124,
        deleted: false,
        saveCallCount: 0,
        async save() {
            this.saveCallCount += 1;
        },
    };
    const { Image, post } = setupImageModel({
        createImageModel,
        imageRecord,
        postWithImage: {
            PostHeaderImages: [{ id: 124 }],
            PostImages: [],
            PostUserImages: [],
        },
        remainingAssociations: {
            PostImages: [],
            PostHeaderImages: [{ id: 999 }],
            PostUserImages: [],
        },
        remainingPostHeaderImageCount: 1,
    });
    post.cover_media_type = "image";
    const res = createResponse();
    await Image.removeImageFromCollection({
        params: {
            imageId: "124",
            postId: "10",
        },
        query: {},
    }, res);
    assert.deepEqual(post.removedHeaderImages, [124]);
    assert.equal(post.cover_media_type, "image");
    assert.equal(post.saveCallCount, 0);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { message: "Image removed from collection" });
});
