"use strict";

const {
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const bucketRegionCache = new Map();

const normalizeS3Endpoint = (endpoint) => {
  if (!endpoint) {
    return undefined;
  }

  return /^https?:\/\//i.test(endpoint) ? endpoint : `https://${endpoint}`;
};

const getEndpointHost = (endpoint) => {
  const normalizedEndpoint = normalizeS3Endpoint(endpoint);

  if (!normalizedEndpoint) {
    return undefined;
  }

  try {
    return new URL(normalizedEndpoint).hostname;
  } catch {
    return endpoint.replace(/^https?:\/\//i, "").split("/")[0];
  }
};

const isAwsS3Endpoint = (endpoint) => {
  const host = getEndpointHost(endpoint);

  if (!host) {
    return false;
  }

  return (
    host === "s3.amazonaws.com" ||
    host === "s3-accelerate.amazonaws.com" ||
    /^s3[.-][a-z0-9-]+\.amazonaws\.com$/i.test(host) ||
    /^s3[.-][a-z0-9-]+\.amazonaws\.com\.cn$/i.test(host)
  );
};

const getConfiguredEndpoint = (options = {}) => {
  if (options.useAccelerateEndpoint || options.endpoint === null) {
    return undefined;
  }

  return options.endpoint || process.env.S3_ENDPOINT;
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
  const endpoint = getConfiguredEndpoint({
    ...options,
    useAccelerateEndpoint,
  });
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
  if (normalizedEndpoint && !isAwsS3Endpoint(normalizedEndpoint)) {
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

const getHeaderValue = (headers, name) => {
  if (!headers) {
    return undefined;
  }

  const lowerName = name.toLowerCase();
  const headerEntry = Object.entries(headers).find(
    ([key]) => key.toLowerCase() === lowerName
  );

  if (!headerEntry) {
    return undefined;
  }

  const value = headerEntry[1];
  return Array.isArray(value) ? value[0] : value;
};

const normalizeBucketRegion = (region) => {
  if (!region) {
    return undefined;
  }

  if (region === "EU") {
    return "eu-west-1";
  }

  return region;
};

const extractBucketRegion = (result) =>
  normalizeBucketRegion(
    result?.BucketRegion ||
      getHeaderValue(result?.$metadata?.httpHeaders, "x-amz-bucket-region") ||
      getHeaderValue(result?.$response?.headers, "x-amz-bucket-region") ||
      getHeaderValue(
        result?.$response?.httpResponse?.headers,
        "x-amz-bucket-region"
      )
  );

const shouldResolveBucketRegion = (bucket, options = {}) => {
  if (!bucket || options.region || process.env.S3_REGION) {
    return false;
  }

  if (process.env.MINIO_ROOT_USER) {
    return false;
  }

  const endpoint = getConfiguredEndpoint(options);
  return !endpoint || isAwsS3Endpoint(endpoint);
};

const lookupBucketRegion = async (bucket) => {
  const lookupClient = createS3Client({
    endpoint: null,
    region: "us-east-1",
    forcePathStyle: true,
    useAccelerateEndpoint: false,
  });

  try {
    const result = await lookupClient.send(new HeadBucketCommand({ Bucket: bucket }));
    return extractBucketRegion(result);
  } catch (error) {
    return extractBucketRegion(error);
  }
};

const getBucketRegion = async (bucket, options = {}) => {
  if (options.region || process.env.S3_REGION) {
    return options.region || process.env.S3_REGION;
  }

  const fallbackRegion = options.defaultRegion || "us-east-1";

  if (!shouldResolveBucketRegion(bucket, options)) {
    return fallbackRegion;
  }

  const cachedRegion = bucketRegionCache.get(bucket);
  if (cachedRegion) {
    return cachedRegion;
  }

  const regionPromise = lookupBucketRegion(bucket)
    .then((region) => {
      const resolvedRegion = region || fallbackRegion;
      if (region) {
        bucketRegionCache.set(bucket, resolvedRegion);
      } else {
        bucketRegionCache.delete(bucket);
      }
      return resolvedRegion;
    })
    .catch((error) => {
      bucketRegionCache.delete(bucket);
      throw error;
    });

  bucketRegionCache.set(bucket, regionPromise);
  return regionPromise;
};

const createS3ClientForBucket = async (bucket, options = {}) =>
  createS3Client({
    ...options,
    region: await getBucketRegion(bucket, options),
  });

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

const getPresignedPutObjectUrlForBucket = async (
  params,
  clientOptions = {},
  presignOptions = {}
) => {
  const client = await createS3ClientForBucket(params.Bucket, clientOptions);
  return getPresignedPutObjectUrl(client, params, presignOptions);
};

const getPresignedGetObjectUrlForBucket = async (
  params,
  clientOptions = {},
  presignOptions = {}
) => {
  const client = await createS3ClientForBucket(params.Bucket, clientOptions);
  return getPresignedGetObjectUrl(client, params, presignOptions);
};

module.exports = {
  createS3ClientForBucket,
  createS3Client,
  getBucketRegion,
  getPresignedGetObjectUrl,
  getPresignedGetObjectUrlForBucket,
  getPresignedPutObjectUrl,
  getPresignedPutObjectUrlForBucket,
  normalizeS3Endpoint,
};
