"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = require("openai");
const axios_1 = __importDefault(require("axios"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const index_js_1 = __importDefault(require("../../models/index.js"));
const dbModels = index_js_1.default;
const Image = dbModels.Image;
const AcBackgroundJob = dbModels.AcBackgroundJob;
const maxDalleRetryCount = 3;
class GenerativeAiWorker {
    async downloadImage(imageUrl, imageFilePath) {
        const response = await (0, axios_1.default)({
            method: "GET",
            url: imageUrl,
            responseType: "stream",
        });
        const writer = fs_1.default.createWriteStream(imageFilePath);
        response.data.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });
    }
    async uploadImageToS3(bucket, filePath, key) {
        const s3 = new aws_sdk_1.default.S3();
        const fileContent = fs_1.default.readFileSync(filePath);
        const params = {
            Bucket: bucket,
            Key: key,
            Body: fileContent,
            ACL: "public-read", // Makes sure the uploaded files are publicly accessible
            ContentType: "image/png",
            ContentDisposition: "inline",
        };
        return new Promise((resolve, reject) => {
            s3.upload(params, (err, data) => {
                if (err) {
                    reject(err);
                }
                fs_1.default.unlinkSync(filePath); // Deleting file from local storage
                //console.log(`Upload response: ${JSON.stringify(data)}`);
                resolve(data);
            });
        });
    }
    async getImageUrlFromPrompt(prompt) {
        const configuration = {
            apiKey: process.env.OPENAI_API_KEY,
        };
        const client = new openai_1.OpenAI(configuration);
        let retryCount = 0;
        let retrying = true; // Initialize as true
        let result;
        while (retrying && retryCount < maxDalleRetryCount) {
            try {
                result = await client.images.generate({
                    model: "dall-e-3",
                    prompt,
                    n: 1,
                    quality: "hd",
                    size: "1792x1024",
                });
                if (result) {
                    retrying = false; // Only change retrying to false if there is a result.
                }
                else {
                    console.debug(`Result: NONE`);
                }
            }
            catch (error) {
                console.warn("Error generating image, retrying...");
                console.warn(error.stack);
                retryCount++;
                console.warn(error);
                const sleepingFor = 5000 + retryCount * 10000;
                console.debug(`Sleeping for ${sleepingFor} milliseconds`);
                await new Promise((resolve) => setTimeout(resolve, sleepingFor));
            }
        }
        if (result) {
            console.debug(`Result: ${JSON.stringify(result)}`);
            const imageURL = result.data[0].url;
            if (!imageURL)
                throw new Error("Error getting generated image");
            return imageURL;
        }
        else {
            console.error(`Error generating image after ${retryCount} retries`);
            return undefined;
        }
    }
    async createCollectionImage(workPackage) {
        return new Promise(async (resolve, reject) => {
            let newImageUrl;
            const imageFilePath = path_1.default.join("/tmp", `${(0, uuid_1.v4)()}.png`);
            const s3ImagePath = `ypGenAi/${workPackage.collectionType}/${workPackage.collectionId}/${(0, uuid_1.v4)()}.png`;
            try {
                const imageUrl = await this.getImageUrlFromPrompt(workPackage.prompt);
                if (imageUrl) {
                    await this.downloadImage(imageUrl, imageFilePath);
                    console.debug(fs_1.default.existsSync(imageFilePath)
                        ? "File downloaded successfully."
                        : "File download failed.");
                    await this.uploadImageToS3(process.env.S3_BUCKET, imageFilePath, s3ImagePath);
                    if (process.env.CLOUDFLARE_IMAGE_PROXY_DOMAIN) {
                        newImageUrl = `https://${process.env.CLOUDFLARE_IMAGE_PROXY_DOMAIN}/${s3ImagePath}`;
                    }
                    else {
                        newImageUrl = `https://${process.env
                            .S3_BUCKET}.s3.amazonaws.com/${s3ImagePath}`;
                    }
                    const formats = JSON.stringify([newImageUrl]);
                    const image = await Image.build({
                        user_id: workPackage.userId,
                        s3_bucket_name: process.env.S3_BUCKET,
                        original_filename: "n/a",
                        formats,
                        user_agent: "AI worker",
                        ip_address: "127.0.0.1",
                    });
                    await image.save();
                    resolve({ imageId: image.id, imageUrl: newImageUrl });
                }
                else {
                    reject("Error getting image URL from prompt.");
                }
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async process(workPackage, callback) {
        console.info(`Processing workPackage: ${JSON.stringify(workPackage)}`);
        switch (workPackage.type) {
            case "collection-image":
                try {
                    const { imageId, imageUrl } = await this.createCollectionImage(workPackage);
                    console.info(`Created imageId: ${imageId} imageUrl: ${imageUrl}`);
                    if (imageId) {
                        await AcBackgroundJob.updateDataAsync(workPackage.jobId, { imageId, imageUrl });
                        console.debug(`Updated job ${workPackage.jobId} with imageId: ${imageId} imageUrl: ${imageUrl}`);
                    }
                    else {
                        await AcBackgroundJob.update({
                            error: "Can't generate image try again later",
                        }, {
                            where: { id: workPackage.jobId },
                        });
                    }
                    callback();
                }
                catch (error) {
                    console.error(error);
                    if (typeof error !== "string") {
                        error = JSON.stringify(error);
                    }
                    try {
                        await AcBackgroundJob.updateErrorAsync(workPackage.jobId, error);
                    }
                    catch (error) {
                        console.error(error);
                    }
                    callback(error);
                }
                break;
            default:
                callback("Unknown type for workPackage: " + workPackage.type);
        }
    }
}
module.exports = new GenerativeAiWorker();
