import _ from "lodash";
import moment from "moment";
import fetch from "node-fetch";
import fs from "fs";
import stream from "stream";
import { promisify } from "util";
import models from "../../../models/index.cjs";
import ExcelJS from "exceljs";
import log from "../../../utils/loggerTs.js";
import { Upload } from "@aws-sdk/lib-storage";
import s3Utils from "../../../utils/awsS3Client.cjs";

const { createS3Client, getPresignedGetObjectUrl } = s3Utils;

const dbModels: Models = models;
const AcBackgroundJob = dbModels.AcBackgroundJob as AcBackgroundJobClass;

export const updateUploadJobStatus = async (
  jobId: number,
  uploadProgress: number,
  data: object | undefined = undefined
): Promise<void> => {
  try {
    const progress = uploadProgress==100 ? 100 : Math.min(Math.round(50 + uploadProgress / 2), 95);
    if (data) {
      await AcBackgroundJob.update({ progress, data }, { where: { id: jobId } });
    } else {
      await AcBackgroundJob.update({ progress }, { where: { id: jobId } });
    }
  } catch (error) {
    log.error("updateUploadJobStatus", { error: error });
  }
};

export const setJobError = async (
  jobId: number,
  errorToUser: string,
  errorDetail: Error | undefined = undefined
): Promise<void> => {
  log.error("Error in background job", { error: errorDetail });
  try {
    await AcBackgroundJob.update(
      { error: errorToUser, progress: 0 },
      { where: { id: jobId } }
    );
  } catch (error) {
    throw error;
  }
};

const pipeline = promisify(stream.pipeline);

export const downloadImage = async (
  uri: string,
  filename: string
): Promise<void> => {
  const response = await fetch(uri);
  if (!response.ok)
    throw new Error(`Failed to fetch ${uri}: ${response.statusText}`);
  await pipeline(response.body!, fs.createWriteStream(filename));
};

export const uploadToS3 = (
  jobId: number,
  userId: string,
  filename: string,
  exportType: string,
  data: ExcelJS.Buffer,
  done: (error: Error | null, url?: string) => void
): void => {
  const s3 = createS3Client({
    endpoint: process.env.S3_ENDPOINT || "s3.amazonaws.com",
    region:
      process.env.S3_REGION ||
      (process.env.S3_ENDPOINT || process.env.S3_ACCELERATED_ENDPOINT
        ? null
        : "us-east-1")!,
  });

  const keyName = `/${exportType}/${userId}/${filename}`;

  const upload = new Upload({
    client: s3,
    params: {
      Bucket: process.env.S3_REPORTS_BUCKET!,
      Key: keyName,
      Body: data as any,
    },
  });

  upload
    .done()
    .then(() =>
      getPresignedGetObjectUrl(s3, {
        Bucket: process.env.S3_REPORTS_BUCKET!,
        Key: keyName,
        Expires: 60 * 60,
      })
    )
    .then((url: string) => {
      done(null, url);
    })
    .catch((error: Error) => {
      done(error);
    });

  upload.on("httpUploadProgress", (progress) => {
    if (progress.loaded !== undefined && progress.total) {
      const uploadProgress = Math.round((progress.loaded / progress.total) * 100);
      updateUploadJobStatus(jobId, uploadProgress);
    }
  });
};
