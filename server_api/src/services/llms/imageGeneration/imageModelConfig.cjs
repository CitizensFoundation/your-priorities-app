"use strict";

const defaultOpenAiImageModel = "gpt-image-2";
const defaultImagenImageModel = "imagen-3.0-generate-002";
const defaultGptImage2LandscapeSize = "2048x1152";

const imageProviders = ["openai", "azureOpenai", "flux", "imagen"];
const openAiGptImageModels = [
  "gpt-image-2",
  "gpt-image-1.5",
  "gpt-image-1",
  "gpt-image-1-mini",
];
const openAiDalleImageModels = ["dall-e-3"];
const openAiGptImageQualities = ["auto", "low", "medium", "high"];
const openAiDalleImageQualities = ["standard", "hd"];
const openAiLegacyGptImageSizes = [
  "auto",
  "1024x1024",
  "1536x1024",
  "1024x1536",
];
const openAiDalleImageSizes = ["1024x1024", "1792x1024", "1024x1792"];
const supportedAspectRatioSizes = [
  "1:1",
  "16:9",
  "9:16",
  "4:3",
  "3:4",
  "3:2",
  "2:3",
  "4:5",
  "5:4",
  "21:9",
  "9:21",
];

const uniqueDefined = (values) => [...new Set(values.filter(Boolean))];
const parsePixelSize = (imageSize) => {
  const match = /^(\d+)x(\d+)$/.exec(imageSize || "");
  if (!match) return undefined;
  return {
    width: Number(match[1]),
    height: Number(match[2]),
  };
};
const greatestCommonDivisor = (a, b) =>
  b === 0 ? a : greatestCommonDivisor(b, a % b);
const getAspectRatioForImageSize = (imageSize) => {
  if (!imageSize) return undefined;
  if (supportedAspectRatioSizes.includes(imageSize)) return imageSize;

  const parsedSize = parsePixelSize(imageSize);
  if (!parsedSize) return undefined;

  const divisor = greatestCommonDivisor(parsedSize.width, parsedSize.height);
  return `${parsedSize.width / divisor}:${parsedSize.height / divisor}`;
};

const isValidGptImage2Size = (imageSize) => {
  if (imageSize === "auto") return true;
  const parsedSize = parsePixelSize(imageSize);
  if (!parsedSize) return false;

  const { width, height } = parsedSize;
  const longEdge = Math.max(width, height);
  const shortEdge = Math.min(width, height);

  return (
    width > 0 &&
    height > 0 &&
    longEdge <= 3840 &&
    width % 16 === 0 &&
    height % 16 === 0 &&
    longEdge / shortEdge <= 3
  );
};

const isValidAspectRatioSize = (imageSize) =>
  supportedAspectRatioSizes.includes(imageSize) || Boolean(parsePixelSize(imageSize));

const getAllowedImageModels = (imageProvider) => {
  switch (imageProvider) {
    case "openai":
      return [...openAiGptImageModels, ...openAiDalleImageModels];
    case "azureOpenai":
      return uniqueDefined([process.env.AZURE_OPENAI_API_DALLE_DEPLOYMENT_NAME]);
    case "flux":
      return uniqueDefined([process.env.FLUX_PRO_MODEL_NAME]);
    case "imagen":
      return [defaultImagenImageModel];
    default:
      return [];
  }
};

const getDefaultImageModelForProvider = (imageProvider) => {
  switch (imageProvider) {
    case "openai":
      return defaultOpenAiImageModel;
    case "azureOpenai":
      return process.env.AZURE_OPENAI_API_DALLE_DEPLOYMENT_NAME;
    case "flux":
      return process.env.FLUX_PRO_MODEL_NAME;
    case "imagen":
      return defaultImagenImageModel;
    default:
      return undefined;
  }
};

const getDefaultImageSizeForOptions = (imageProvider, imageModel, imageType) => {
  if (imageProvider === "openai" && imageModel === "gpt-image-2") {
    return imageType === "icon" ? "1024x1024" : defaultGptImage2LandscapeSize;
  }

  if (imageProvider === "openai" && openAiGptImageModels.includes(imageModel)) {
    return imageType === "icon" ? "1024x1024" : "1536x1024";
  }

  if (
    (imageProvider === "openai" && openAiDalleImageModels.includes(imageModel)) ||
    imageProvider === "azureOpenai"
  ) {
    return imageType === "icon" ? "1024x1024" : "1792x1024";
  }

  return undefined;
};

const getDefaultImageQualityForOptions = (imageProvider, imageModel) => {
  if (imageProvider === "openai" && openAiGptImageModels.includes(imageModel)) {
    return "medium";
  }

  if (
    (imageProvider === "openai" && openAiDalleImageModels.includes(imageModel)) ||
    imageProvider === "azureOpenai"
  ) {
    return "standard";
  }

  return undefined;
};

const validateImageSize = (imageProvider, imageModel, imageSize) => {
  if (!imageSize) return undefined;

  if (imageProvider === "openai" && imageModel === "gpt-image-2") {
    return isValidGptImage2Size(imageSize)
      ? undefined
      : `Unsupported image size for ${imageModel}: ${imageSize}`;
  }

  if (imageProvider === "openai" && openAiGptImageModels.includes(imageModel)) {
    return openAiLegacyGptImageSizes.includes(imageSize)
      ? undefined
      : `Unsupported image size for ${imageModel}: ${imageSize}`;
  }

  if (
    (imageProvider === "openai" && openAiDalleImageModels.includes(imageModel)) ||
    imageProvider === "azureOpenai"
  ) {
    return openAiDalleImageSizes.includes(imageSize)
      ? undefined
      : `Unsupported image size for ${imageModel}: ${imageSize}`;
  }

  if (imageProvider === "flux" || imageProvider === "imagen") {
    return isValidAspectRatioSize(imageSize)
      ? undefined
      : `Unsupported image size for ${imageProvider}: ${imageSize}`;
  }

  return undefined;
};

const validateImageQuality = (imageProvider, imageModel, imageQuality) => {
  if (!imageQuality) return undefined;

  if (imageProvider === "openai" && openAiGptImageModels.includes(imageModel)) {
    return openAiGptImageQualities.includes(imageQuality)
      ? undefined
      : `Unsupported image quality for ${imageModel}: ${imageQuality}`;
  }

  if (
    (imageProvider === "openai" && openAiDalleImageModels.includes(imageModel)) ||
    imageProvider === "azureOpenai"
  ) {
    return openAiDalleImageQualities.includes(imageQuality)
      ? undefined
      : `Unsupported image quality for ${imageModel}: ${imageQuality}`;
  }

  return `Image quality is not supported for ${imageProvider}`;
};

const normalizeImageGenerationOptions = (
  imageProvider,
  imageModel,
  imageSize,
  imageQuality
) => {
  const normalizedProvider = imageProvider || "openai";

  if (!imageProviders.includes(normalizedProvider)) {
    return {
      error: `Unsupported image provider: ${normalizedProvider}`,
    };
  }

  const normalizedModel =
    imageModel || getDefaultImageModelForProvider(normalizedProvider);
  if (!normalizedModel) {
    return {
      error: `No image model is configured for provider: ${normalizedProvider}`,
    };
  }

  const allowedModels = getAllowedImageModels(normalizedProvider);
  if (!allowedModels.includes(normalizedModel)) {
    return {
      error: `Unsupported image model for ${normalizedProvider}: ${normalizedModel}`,
    };
  }

  const imageSizeError = validateImageSize(
    normalizedProvider,
    normalizedModel,
    imageSize
  );
  if (imageSizeError) {
    return { error: imageSizeError };
  }

  const imageQualityError = validateImageQuality(
    normalizedProvider,
    normalizedModel,
    imageQuality
  );
  if (imageQualityError) {
    return { error: imageQualityError };
  }

  return {
    imageProvider: normalizedProvider,
    imageModel: normalizedModel,
    ...(imageSize ? { imageSize } : {}),
    ...(imageQuality ? { imageQuality } : {}),
  };
};

module.exports = {
  defaultOpenAiImageModel,
  defaultImagenImageModel,
  defaultGptImage2LandscapeSize,
  imageProviders,
  openAiGptImageModels,
  openAiDalleImageModels,
  openAiGptImageQualities,
  openAiDalleImageQualities,
  openAiLegacyGptImageSizes,
  openAiDalleImageSizes,
  getAspectRatioForImageSize,
  getAllowedImageModels,
  getDefaultImageModelForProvider,
  getDefaultImageSizeForOptions,
  getDefaultImageQualityForOptions,
  isOpenAiGptImageModel: (imageModel) =>
    openAiGptImageModels.includes(imageModel),
  isOpenAiDalleImageModel: (imageModel) =>
    openAiDalleImageModels.includes(imageModel),
  normalizeImageGenerationOptions,
};
