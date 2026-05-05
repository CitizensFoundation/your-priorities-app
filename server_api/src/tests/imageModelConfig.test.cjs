"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  getDefaultImageSizeForOptions,
  normalizeImageGenerationOptions,
} = require("../services/llms/imageGeneration/imageModelConfig.cjs");

const withEnv = (updates, fn) => {
  const originals = {};
  for (const key of Object.keys(updates)) {
    originals[key] = process.env[key];
    if (updates[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = updates[key];
    }
  }

  try {
    fn();
  } finally {
    for (const key of Object.keys(updates)) {
      if (originals[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = originals[key];
      }
    }
  }
};

test("image generation options default to OpenAI gpt-image-2", () => {
  const options = normalizeImageGenerationOptions(undefined, undefined);

  assert.deepEqual(options, {
    imageProvider: "openai",
    imageModel: "gpt-image-2",
  });
});

test("gpt-image-2 defaults to 16:9 landscape size outside icon generation", () => {
  assert.equal(
    getDefaultImageSizeForOptions("openai", "gpt-image-2", "logo"),
    "2048x1152"
  );
  assert.equal(
    getDefaultImageSizeForOptions("openai", "gpt-image-2", "other"),
    "2048x1152"
  );
  assert.equal(
    getDefaultImageSizeForOptions("openai", "gpt-image-2", "icon"),
    "1024x1024"
  );
});

test("image generation options allow gpt-image-2 custom size and quality", () => {
  const options = normalizeImageGenerationOptions(
    "openai",
    "gpt-image-2",
    "3840x2160",
    "high"
  );

  assert.deepEqual(options, {
    imageProvider: "openai",
    imageModel: "gpt-image-2",
    imageSize: "3840x2160",
    imageQuality: "high",
  });
});

test("image generation options reject invalid gpt-image-2 custom sizes", () => {
  const options = normalizeImageGenerationOptions(
    "openai",
    "gpt-image-2",
    "2049x1152",
    "high"
  );

  assert.equal(
    options.error,
    "Unsupported image size for gpt-image-2: 2049x1152"
  );
});

test("image generation options still allow DALL-E 3 through OpenAI", () => {
  const options = normalizeImageGenerationOptions("openai", "dall-e-3");

  assert.deepEqual(options, {
    imageProvider: "openai",
    imageModel: "dall-e-3",
  });
});

test("image generation options allow DALL-E 3 size and quality", () => {
  const options = normalizeImageGenerationOptions(
    "openai",
    "dall-e-3",
    "1792x1024",
    "hd"
  );

  assert.deepEqual(options, {
    imageProvider: "openai",
    imageModel: "dall-e-3",
    imageSize: "1792x1024",
    imageQuality: "hd",
  });
});

test("image generation options reject GPT quality for DALL-E 3", () => {
  const options = normalizeImageGenerationOptions(
    "openai",
    "dall-e-3",
    "1792x1024",
    "high"
  );

  assert.equal(
    options.error,
    "Unsupported image quality for dall-e-3: high"
  );
});

test("image generation options reject unsupported OpenAI image models", () => {
  const options = normalizeImageGenerationOptions("openai", "not-a-model");

  assert.equal(
    options.error,
    "Unsupported image model for openai: not-a-model"
  );
});

test("image generation options allow configured Azure OpenAI deployment", () => {
  withEnv({ AZURE_OPENAI_API_DALLE_DEPLOYMENT_NAME: "dalle-deployment" }, () => {
    const options = normalizeImageGenerationOptions(
      "azureOpenai",
      "dalle-deployment"
    );

    assert.deepEqual(options, {
      imageProvider: "azureOpenai",
      imageModel: "dalle-deployment",
    });
  });
});

test("image generation options reject unconfigured Flux models", () => {
  withEnv({ FLUX_PRO_MODEL_NAME: "configured/flux-model" }, () => {
    const options = normalizeImageGenerationOptions(
      "flux",
      "other/flux-model"
    );

    assert.equal(
      options.error,
      "Unsupported image model for flux: other/flux-model"
    );
  });
});
