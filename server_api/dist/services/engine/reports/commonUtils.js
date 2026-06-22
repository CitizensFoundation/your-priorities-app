import fetch from "node-fetch";
import fs from "fs";
import stream from "stream";
import { promisify } from "util";
import models from "../../../models/index.cjs";
import log from "../../../utils/loggerTs.js";
import { Upload } from "@aws-sdk/lib-storage";
import s3Utils from "../../../utils/awsS3Client.cjs";
const { createS3ClientForBucket, getPresignedGetObjectUrl } = s3Utils;
const dbModels = models;
const AcBackgroundJob = dbModels.AcBackgroundJob;
export const updateUploadJobStatus = async (jobId, uploadProgress, data = undefined) => {
    try {
        const progress = uploadProgress == 100 ? 100 : Math.min(Math.round(50 + uploadProgress / 2), 95);
        if (data) {
            await AcBackgroundJob.update({ progress, data }, { where: { id: jobId } });
        }
        else {
            await AcBackgroundJob.update({ progress }, { where: { id: jobId } });
        }
    }
    catch (error) {
        log.error("updateUploadJobStatus", { error: error });
    }
};
export const setJobError = async (jobId, errorToUser, errorDetail = undefined) => {
    log.error("Error in background job", { error: errorDetail });
    try {
        await AcBackgroundJob.update({ error: errorToUser, progress: 0 }, { where: { id: jobId } });
    }
    catch (error) {
        throw error;
    }
};
const pipeline = promisify(stream.pipeline);
export const downloadImage = async (uri, filename) => {
    const response = await fetch(uri);
    if (!response.ok)
        throw new Error(`Failed to fetch ${uri}: ${response.statusText}`);
    await pipeline(response.body, fs.createWriteStream(filename));
};
export const uploadToS3 = (jobId, userId, filename, exportType, data, done) => {
    const keyName = `/${exportType}/${userId}/${filename}`;
    createS3ClientForBucket(process.env.S3_REPORTS_BUCKET, {
        endpoint: process.env.S3_ENDPOINT || "s3.amazonaws.com",
        region: process.env.S3_REGION,
    })
        .then((s3) => {
        const upload = new Upload({
            client: s3,
            params: {
                Bucket: process.env.S3_REPORTS_BUCKET,
                Key: keyName,
                Body: data,
            },
        });
        upload.on("httpUploadProgress", (progress) => {
            if (progress.loaded !== undefined && progress.total) {
                const uploadProgress = Math.round((progress.loaded / progress.total) * 100);
                updateUploadJobStatus(jobId, uploadProgress);
            }
        });
        return upload.done().then(() => getPresignedGetObjectUrl(s3, {
            Bucket: process.env.S3_REPORTS_BUCKET,
            Key: keyName,
            Expires: 60 * 60,
        }));
    })
        .then((url) => {
        done(null, url);
    })
        .catch((error) => {
        done(error);
    });
};
