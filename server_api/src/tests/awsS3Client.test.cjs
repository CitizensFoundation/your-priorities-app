"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createS3Client,
  getPresignedPutObjectUrl,
} = require("../utils/awsS3Client.cjs");

const withAwsEnv = async (fn) => {
  const originalEnv = {
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_SESSION_TOKEN: process.env.AWS_SESSION_TOKEN,
    S3_REGION: process.env.S3_REGION,
    S3_ENDPOINT: process.env.S3_ENDPOINT,
    S3_FORCE_PATH_STYLE: process.env.S3_FORCE_PATH_STYLE,
    MINIO_ROOT_USER: process.env.MINIO_ROOT_USER,
    S3_ACCELERATED_ENDPOINT: process.env.S3_ACCELERATED_ENDPOINT,
  };

  process.env.AWS_ACCESS_KEY_ID = "AKIAEXAMPLE";
  process.env.AWS_SECRET_ACCESS_KEY = "secret";
  process.env.S3_REGION = "us-east-1";
  delete process.env.S3_ENDPOINT;
  delete process.env.AWS_SESSION_TOKEN;
  delete process.env.S3_FORCE_PATH_STYLE;
  delete process.env.MINIO_ROOT_USER;
  delete process.env.S3_ACCELERATED_ENDPOINT;

  try {
    await fn();
  } finally {
    Object.entries(originalEnv).forEach(([key, value]) => {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    });
  }
};

test("presigned PUT URLs do not include an empty-object checksum", async () => {
  await withAwsEnv(async () => {
    const client = createS3Client();
    const url = await getPresignedPutObjectUrl(client, {
      Bucket: "bucket",
      Key: "key",
      Expires: 3600,
      ContentType: "audio/mp4",
    });

    assert.match(url, /X-Amz-Content-Sha256=UNSIGNED-PAYLOAD/);
    assert.doesNotMatch(url, /x-amz-checksum/i);
    assert.doesNotMatch(url, /x-amz-sdk-checksum-algorithm/i);
  });
});

test("accelerated clients can presign without a custom endpoint conflict", async () => {
  await withAwsEnv(async () => {
    const client = createS3Client({
      endpoint: "s3-accelerate.amazonaws.com",
      useAccelerateEndpoint: true,
      forcePathStyle: true,
    });
    const url = await getPresignedPutObjectUrl(client, {
      Bucket: "bucket",
      Key: "key",
      Expires: 3600,
      ContentType: "audio/mp4",
    });

    assert.match(url, /^https:\/\/bucket\.s3-accelerate\.amazonaws\.com\/key\?/);
  });
});

test("presigned URLs include AWS session tokens when env credentials are temporary", async () => {
  await withAwsEnv(async () => {
    process.env.AWS_SESSION_TOKEN = "session-token";
    const client = createS3Client();
    const url = await getPresignedPutObjectUrl(client, {
      Bucket: "bucket",
      Key: "key",
      Expires: 3600,
      ContentType: "audio/mp4",
    });

    assert.match(url, /X-Amz-Security-Token=session-token/);
  });
});
