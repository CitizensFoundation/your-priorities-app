"use strict";

const {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const normalizeS3Endpoint = (endpoint) => {
  if (!endpoint) {
    return undefined;
  }

  return /^https?:\/\//i.test(endpoint) ? endpoint : `https://${endpoint}`;
};

const getCredentials = () => {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    return undefined;
  }

  const credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };

  if (process.env.AWS_SESSION_TOKEN) {
    credentials.sessionToken = process.env.AWS_SESSION_TOKEN;
  }

  return credentials;
};

const createS3Client = (options = {}) => {
  const useAccelerateEndpoint =
    options.useAccelerateEndpoint === undefined
      ? undefined
      : Boolean(options.useAccelerateEndpoint);
  const endpoint =
    useAccelerateEndpoint || options.endpoint === null
      ? undefined
      : options.endpoint || process.env.S3_ENDPOINT;
  const credentials = getCredentials();
  const forcePathStyle =
    useAccelerateEndpoint
      ? undefined
      : options.forcePathStyle ??
        (process.env.S3_FORCE_PATH_STYLE || process.env.MINIO_ROOT_USER
          ? true
          : undefined);

  const config = {
    region:
      options.region ||
      process.env.S3_REGION ||
      options.defaultRegion ||
      "us-east-1",
    requestChecksumCalculation:
      options.requestChecksumCalculation || "WHEN_REQUIRED",
  };

  if (credentials) {
    config.credentials = credentials;
  }

  const normalizedEndpoint = normalizeS3Endpoint(endpoint);
  if (normalizedEndpoint) {
    config.endpoint = normalizedEndpoint;
  }

  if (forcePathStyle !== undefined) {
    config.forcePathStyle = Boolean(forcePathStyle);
  }

  if (useAccelerateEndpoint !== undefined) {
    config.useAccelerateEndpoint = Boolean(useAccelerateEndpoint);
  }

  return new S3Client(config);
};

const stripExpires = (params) => {
  const { Expires, ...commandParams } = params;
  return { commandParams, expiresIn: Expires };
};

const getPresignedPutObjectUrl = (client, params, options = {}) => {
  const { commandParams, expiresIn } = stripExpires(params);
  return getSignedUrl(client, new PutObjectCommand(commandParams), {
    expiresIn: options.expiresIn || expiresIn,
  });
};

const getPresignedGetObjectUrl = (client, params, options = {}) => {
  const { commandParams, expiresIn } = stripExpires(params);
  return getSignedUrl(client, new GetObjectCommand(commandParams), {
    expiresIn: options.expiresIn || expiresIn,
  });
};

module.exports = {
  createS3Client,
  getPresignedGetObjectUrl,
  getPresignedPutObjectUrl,
  normalizeS3Endpoint,
};
