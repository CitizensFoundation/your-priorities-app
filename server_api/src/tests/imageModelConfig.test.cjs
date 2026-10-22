"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  getAspectRatioForImageSize,
  getDefaultImageSizeForOptions,
  normalizeImageGenerationProfileOptions,
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

test("image generation options default to OpenAI GPT Image 2.5 Flare", () => {
  withEnv({ OPENAI_IMAGE_MODEL_NAME: undefined }, () => {
    const options = normalizeImageGenerationOptions(undefined, undefined);

    assert.deepEqual(options, {
      imageProvider: "openai",
      imageModel: "gpt-image-2.5-flare",
    });
  });
});

test("image generation options default Imagen to Imagen 4 GA", () => {
  const options = normalizeImageGenerationOptions("imagen", undefined);

  assert.deepEqual(options, {
    imageProvider: "imagen",
    imageModel: "imagen-4.0-generate-001",
  });
});

test("image generation options allow Imagen 4 variants", () => {
  const options = normalizeImageGenerationOptions(
    "imagen",
    "imagen-4.0-ultra-generate-001",
    "16:9",
  );

  assert.deepEqual(options, {
    imageProvider: "imagen",
    imageModel: "imagen-4.0-ultra-generate-001",
    imageSize: "16:9",
  });
});

test("image generation options map Imagen 4 listed resolutions to aspect ratios", () => {
  assert.equal(getAspectRatioForImageSize("2816x1536"), "16:9");
  assert.equal(getAspectRatioForImageSize("1536x2816"), "9:16");
});

test("image generation options reject unsupported Imagen aspect ratios", () => {
  const options = normalizeImageGenerationOptions(
    "imagen",
    "imagen-4.0-generate-001",
    "21:9",
  );

  assert.equal(options.error, "Unsupported image size for imagen: 21:9");
});

test("gpt-image-2 defaults to 16:9 landscape size outside icon generation", () => {
  assert.equal(
    getDefaultImageSizeForOptions("openai", "gpt-image-2", "logo"),
    "2048x1152",
  );
  assert.equal(
    getDefaultImageSizeForOptions("openai", "gpt-image-2", "other"),
    "2048x1152",
  );
  assert.equal(
    getDefaultImageSizeForOptions("openai", "gpt-image-2", "icon"),
    "1024x1024",
  );
});

test("image generation options allow gpt-image-2 custom size and quality", () => {
  const options = normalizeImageGenerationOptions(
    "openai",
    "gpt-image-2",
    "816x816",
    "low",
  );

  assert.deepEqual(options, {
    imageProvider: "openai",
    imageModel: "gpt-image-2",
    imageSize: "816x816",
    imageQuality: "low",
  });
});

test("image generation profile maps AOI icons to low quality GPT Image 2.5 Flare", () => {
  withEnv({ OPENAI_IMAGE_MODEL_NAME: undefined }, () => {
    const options = normalizeImageGenerationProfileOptions(
      "aoiIcon",
      "aoiIconAdmin",
      "icon",
    );

    assert.deepEqual(options, {
      imageProvider: "openai",
      imageModel: "gpt-image-2.5-flare",
      imageSize: "1024x1024",
      imageQuality: "low",
      imageGenerationProfile: "aoiIcon",
    });
  });
});

test("image generation profile maps regular images to medium landscape GPT Image 2.5 Flare", () => {
  withEnv({ OPENAI_IMAGE_MODEL_NAME: undefined }, () => {
    const options = normalizeImageGenerationProfileOptions(
      "regularAiImage",
      "regularAiImage",
      "logo",
    );

    assert.deepEqual(options, {
      imageProvider: "openai",
      imageModel: "gpt-image-2.5-flare",
      imageSize: "2048x1152",
      imageQuality: "medium",
      imageGenerationProfile: "regularAiImage",
    });
  });
});

test("image generation profiles reject context and type mismatches", () => {
  assert.equal(
    normalizeImageGenerationProfileOptions(
      "regularAiImage",
      "aoiIconAdmin",
      "icon",
    ).error,
    "Image generation profile regularAiImage is not allowed for aoiIconAdmin",
  );

  assert.equal(
    normalizeImageGenerationProfileOptions("aoiIcon", "aoiIconAdmin", "logo")
      .error,
    "Image generation profile aoiIcon only supports icon images",
  );
});

test("image generation options reject invalid gpt-image-2 custom sizes", () => {
  const nonMultipleSizeOptions = normalizeImageGenerationOptions(
    "openai",
    "gpt-image-2",
    "2049x1152",
    "high",
  );

  assert.equal(
    nonMultipleSizeOptions.error,
    "Unsupported image size for gpt-image-2: 2049x1152",
  );

  const tooSmallOptions = normalizeImageGenerationOptions(
    "openai",
    "gpt-image-2",
    "512x512",
    "low",
  );

  assert.equal(
    tooSmallOptions.error,
    "Unsupported image size for gpt-image-2: 512x512",
  );

  const tooLargeOptions = normalizeImageGenerationOptions(
    "openai",
    "gpt-image-2",
    "3840x3840",
    "high",
  );

  assert.equal(
    tooLargeOptions.error,
    "Unsupported image size for gpt-image-2: 3840x3840",
  );
});

test("image generation options reject retired OpenAI image models", () => {
  for (const model of ["dall-e-3", "gpt-image-1"]) {
    assert.equal(
      normalizeImageGenerationOptions("openai", model).error,
      `Unsupported image model for openai: ${model}`,
    );
  }
});

test("GPT Image 2.5 variants accept custom sizes and extended quality", () => {
  for (const model of ["gpt-image-2.5-flare", "gpt-image-2.5-sunburst"]) {
    for (const quality of ["low", "medium", "high", "xhigh", "max"]) {
      assert.deepEqual(
        normalizeImageGenerationOptions("openai", model, "2048x1152", quality),
        {
          imageProvider: "openai",
          imageModel: model,
          imageSize: "2048x1152",
          imageQuality: quality,
        },
      );
    }
    assert.equal(
      normalizeImageGenerationOptions("openai", model, "2049x1152").error,
      `Unsupported image size for ${model}: 2049x1152`,
    );
  }
  assert.equal(
    normalizeImageGenerationOptions("openai", "gpt-image-2", undefined, "max")
      .error,
    "Unsupported image quality for gpt-image-2: max",
  );
});

test("OpenAI image model env override reaches default options and both profiles", () => {
  withEnv({ OPENAI_IMAGE_MODEL_NAME: "gpt-image-2.5-sunburst" }, () => {
    assert.equal(
      normalizeImageGenerationOptions(undefined, undefined).imageModel,
      "gpt-image-2.5-sunburst",
    );
    for (const context of ["aoiIconPublic", "aoiIconAdmin", "regularAiImage"]) {
      const options = normalizeImageGenerationProfileOptions(
        undefined,
        context,
      );
      assert.equal(options.error, undefined);
      assert.equal(options.imageModel, "gpt-image-2.5-sunburst");
      assert.equal(
        options.imageQuality,
        context === "regularAiImage" ? "medium" : "low",
      );
      assert.equal(
        options.imageSize,
        context === "regularAiImage" ? "2048x1152" : "1024x1024",
      );
    }
    assert.equal(
      normalizeImageGenerationOptions("openai", "gpt-image-2").imageModel,
      "gpt-image-2",
    );
  });
});

test("image model env overrides adapt profile sizes for older GPT Image models", () => {
  withEnv({ OPENAI_IMAGE_MODEL_NAME: "gpt-image-1.5" }, () => {
    const options = normalizeImageGenerationProfileOptions(
      undefined,
      "regularAiImage",
    );
    assert.equal(options.error, undefined);
    assert.equal(options.imageModel, "gpt-image-1.5");
    assert.equal(options.imageSize, "1536x1024");
  });
});

test("invalid image model env overrides fail validation", () => {
  withEnv({ OPENAI_IMAGE_MODEL_NAME: "not-a-model" }, () => {
    assert.equal(
      normalizeImageGenerationOptions(undefined, undefined).error,
      "Unsupported image model for openai: not-a-model",
    );
    assert.equal(
      normalizeImageGenerationProfileOptions(undefined, "aoiIconAdmin").error,
      "Unsupported image model for openai: not-a-model",
    );
  });
});

test("image generation options reject unsupported OpenAI image models", () => {
  const options = normalizeImageGenerationOptions("openai", "not-a-model");

  assert.equal(
    options.error,
    "Unsupported image model for openai: not-a-model",
  );
});

test("image generation options allow configured Azure OpenAI deployment", () => {
  withEnv(
    { AZURE_OPENAI_API_DALLE_DEPLOYMENT_NAME: "dalle-deployment" },
    () => {
      const options = normalizeImageGenerationOptions(
        "azureOpenai",
        "dalle-deployment",
      );

      assert.deepEqual(options, {
        imageProvider: "azureOpenai",
        imageModel: "dalle-deployment",
      });

      assert.deepEqual(
        normalizeImageGenerationOptions(
          "azureOpenai",
          "dalle-deployment",
          "1792x1024",
          "hd",
        ),
        {
          imageProvider: "azureOpenai",
          imageModel: "dalle-deployment",
          imageSize: "1792x1024",
          imageQuality: "hd",
        },
      );
      assert.equal(
        normalizeImageGenerationOptions(
          "azureOpenai",
          "dalle-deployment",
          "1792x1024",
          "high",
        ).error,
        "Unsupported image quality for dalle-deployment: high",
      );
    },
  );
});

test("image generation options reject unconfigured Flux models", () => {
  withEnv({ FLUX_PRO_MODEL_NAME: "configured/flux-model" }, () => {
    const options = normalizeImageGenerationOptions("flux", "other/flux-model");

    assert.equal(
      options.error,
      "Unsupported image model for flux: other/flux-model",
    );
  });
});
