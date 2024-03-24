import AWS from "aws-sdk";
import fetch from "node-fetch";
import fs from "fs";
import stream from "stream";
import { promisify } from "util";
import models from "../../../models/index.cjs";
const dbModels = models;
const AcBackgroundJob = dbModels.AcBackgroundJob;
export const updateUploadJobStatus = async (jobId, uploadProgress, data = undefined) => {
    try {
        const progress = Math.min(Math.round(50 + uploadProgress / 2), 95);
        if (data) {
            await AcBackgroundJob.update({ progress }, { where: { id: jobId } });
        }
        else {
            await AcBackgroundJob.update({ progress, data }, { where: { id: jobId } });
        }
    }
    catch (error) {
        console.error("updateUploadJobStatus", { error: error });
    }
};
export const setJobError = async (jobId, errorToUser, errorDetail) => {
    console.error("Error in background job", { error: errorDetail });
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
    const s3 = new AWS.S3({
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        endpoint: process.env.S3_ENDPOINT || "s3.amazonaws.com",
        region: process.env.S3_REGION ||
            (process.env.S3_ENDPOINT || process.env.S3_ACCELERATED_ENDPOINT
                ? null
                : "us-east-1"),
    });
    const keyName = `/${exportType}/${userId}/${filename}`;
    s3.upload({
        Bucket: process.env.S3_REPORTS_BUCKET,
        Key: keyName,
        Body: data,
    }, (error, data) => {
        if (error) {
            done(error);
            return;
        }
        s3.getSignedUrl("getObject", {
            Bucket: process.env.S3_REPORTS_BUCKET,
            Key: keyName,
            Expires: 60 * 60,
        }, (error, url) => {
            if (error) {
                done(error);
            }
            else {
                done(null, url);
            }
        });
    }).on("httpUploadProgress", (progress) => {
        const uploadProgress = Math.round((progress.loaded / progress.total) * 100);
        updateUploadJobStatus(jobId, uploadProgress);
    });
};
