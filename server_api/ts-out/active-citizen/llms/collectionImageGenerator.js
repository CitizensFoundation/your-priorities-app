import { AzureOpenAI, OpenAI } from "openai";
import axios from "axios";
import AWS from "aws-sdk";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import models from "../../models/index.cjs";
import sharp from "sharp";
import Replicate from "replicate";
const dbModels = models;
const Image = dbModels.Image;
const AcBackgroundJob = dbModels.AcBackgroundJob;
const maxRetryCount = 3;
const disableFlux = false;
export class CollectionImageGenerator {
    async resizeImage(imagePath, width, height) {
        const resizedImageFilePath = path.join("/tmp", `${uuidv4()}.png`);
        try {
            // 1) Initialize Sharp instance
            const image = sharp(imagePath).rotate(); // rotate fixes orientation from EXIF
            // 2) Read metadata to validate format
            const metadata = await image.metadata();
            const validFormats = [
                "jpeg",
                "png",
                "webp",
                "gif",
                "tiff",
                "avif",
                "svg"
            ];
            if (!metadata.format || !validFormats.includes(metadata.format)) {
                throw new Error(`Unsupported format: ${metadata.format} (expected one of ${validFormats.join(", ")})`);
            }
            // 3) Resize + convert
            await image
                .resize({
                width,
                height,
                fit: "inside",
                withoutEnlargement: true,
            })
                .toFormat("png", {
                quality: 90,
                progressive: true,
            })
                .toFile(resizedImageFilePath);
            // 4) Remove the original file after successful resize
            fs.unlinkSync(imagePath);
            return resizedImageFilePath;
        }
        catch (err) {
            console.error("Error resizing image:", err);
            if (fs.existsSync(resizedImageFilePath)) {
                fs.unlinkSync(resizedImageFilePath);
            }
            throw err;
        }
    }
    async downloadImage(imageUrl, imageFilePath) {
        const response = await axios({
            method: "GET",
            url: imageUrl,
            responseType: "stream",
        });
        const writer = fs.createWriteStream(imageFilePath);
        response.data.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on("finish", () => resolve());
            writer.on("error", reject);
        });
    }
    async deleteS3Url(imageUrl) {
        const { bucket, key } = this.parseImageUrl(imageUrl);
        if (!bucket || !key) {
            throw new Error("Could not parse bucket or key from URL");
        }
        const s3 = new AWS.S3();
        const params = {
            Bucket: bucket,
            Key: key,
            ACL: "private",
        };
        console.log(`Disabling/Deleting Key from S3: ${JSON.stringify(params)}`);
        return new Promise((resolve, reject) => {
            s3.putObjectAcl(params, (err, data) => {
                if (err) {
                    console.error(`Error deleting image from S3: ${err}`);
                    reject(err);
                }
                else {
                    console.log(`Deleted image from S3: ${imageUrl}`, data);
                    if (process.env.CLOUDFLARE_API_KEY &&
                        process.env.CLOUDFLARE_ZONE_ID) {
                        console.log("Purging Cloudflare cache for image:", imageUrl);
                        axios
                            .post(`https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/purge_cache`, { files: [imageUrl] }, {
                            headers: {
                                Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
                                "Content-Type": "application/json",
                            },
                        })
                            .then((response) => {
                            console.log("Cloudflare cache purged:", response.data);
                            resolve(data);
                        })
                            .catch((error) => {
                            if (error.response) {
                                console.error("Error purging Cloudflare cache:", error.response.data);
                                console.error("Status code:", error.response.status);
                                console.error("Headers:", error.response.headers);
                            }
                            else if (error.request) {
                                console.error("No response received:", error.request);
                            }
                            else {
                                console.error("Error setting up request:", error.message);
                            }
                            resolve(data);
                        });
                    }
                    else {
                        resolve(data);
                    }
                }
            });
        });
    }
    parseImageUrl(imageUrl) {
        let bucket, key;
        if (process.env.CLOUDFLARE_IMAGE_PROXY_DOMAIN &&
            imageUrl.includes(process.env.CLOUDFLARE_IMAGE_PROXY_DOMAIN)) {
            const urlPath = new URL(imageUrl).pathname;
            const [, ...pathParts] = urlPath.split("/");
            bucket = process.env.S3_BUCKET;
            key = pathParts.join("/");
        }
        else {
            const match = imageUrl.match(/https:\/\/(.+?)\.s3\.amazonaws\.com\/(.+)/);
            if (match) {
                bucket = match[1];
                key = match[2];
            }
        }
        return { bucket, key };
    }
    async deleteMediaFormatsUrls(formats) {
        formats.forEach(async (url) => {
            await this.deleteS3Url(url);
            console.log(`Have deleted image from S3: ${url}`);
        });
    }
    async uploadImageToS3(bucket, filePath, key) {
        const s3 = new AWS.S3();
        const fileContent = fs.readFileSync(filePath);
        const params = {
            Bucket: bucket,
            Key: key,
            Body: fileContent,
            ACL: "public-read",
            ContentType: "image/png",
            ContentDisposition: "inline",
        };
        return new Promise((resolve, reject) => {
            s3.upload(params, (err, data) => {
                if (err) {
                    reject(err);
                }
                fs.unlinkSync(filePath);
                resolve(data);
            });
        });
    }
    async getImageUrlFromFlux(prompt, type = "logo") {
        const replicate = new Replicate({
            auth: process.env.REPLICATE_API_TOKEN,
        });
        let retryCount = 0;
        let retrying = true;
        let result;
        let input = {
            prompt: prompt,
        };
        if (type === "logo") {
            input.aspect_ratio = "16:9";
        }
        else if (type === "icon") {
            input.aspect_ratio = "1:1";
        }
        else {
            input.aspect_ratio = "16:9";
        }
        while (retrying && retryCount < maxRetryCount) {
            try {
                result = await replicate.run(process.env.FLUX_PRO_MODEL_NAME, { input });
                if (result) {
                    retrying = false;
                    return result;
                }
                else {
                    console.debug(`Result: NONE`);
                }
            }
            catch (error) {
                console.warn("Error generating image with Flux, retrying...");
                console.warn(error.stack);
                retryCount++;
                console.warn(error);
                const sleepingFor = 5000 + retryCount * 10000;
                console.debug(`Sleeping for ${sleepingFor} milliseconds`);
                await new Promise((resolve) => setTimeout(resolve, sleepingFor));
            }
        }
        if (!result) {
            console.error(`Error generating image after ${retryCount} retries`);
            return undefined;
        }
    }
    async getImageUrlFromDalle(prompt, type = "logo") {
        const azureOpenaAiBase = process.env["AZURE_OPENAI_API_BASE"];
        const azureOpenAiApiKey = process.env["AZURE_OPENAI_API_KEY"];
        let client;
        if (azureOpenAiApiKey && azureOpenaAiBase) {
            client = new AzureOpenAI({
                apiKey: azureOpenAiApiKey,
                endpoint: azureOpenaAiBase,
                deployment: process.env.AZURE_OPENAI_API_DALLE_DEPLOYMENT_NAME,
                apiVersion: "2024-10-21",
            });
        }
        else {
            client = new OpenAI({
                apiKey: process.env["OPENAI_API_KEY"],
            });
        }
        let retryCount = 0;
        let retrying = true;
        let result;
        let imageOptions;
        if (type === "logo") {
            imageOptions = {
                n: 1,
                size: "1792x1024",
                quality: "hd",
            };
        }
        else if (type === "icon") {
            imageOptions = {
                n: 1,
                size: "1024x1024",
                quality: "hd",
            };
        }
        else {
            imageOptions = {
                n: 1,
                size: "1792x1024",
                quality: "hd",
            };
        }
        while (retrying && retryCount < maxRetryCount) {
            try {
                if (azureOpenAiApiKey && azureOpenaAiBase) {
                    result = await client.images.generate({
                        prompt,
                        n: imageOptions.n,
                        size: imageOptions.size,
                        quality: imageOptions.quality,
                    });
                }
                else {
                    result = await client.images.generate({
                        model: "dall-e-3",
                        prompt,
                        n: imageOptions.n,
                        size: imageOptions.size,
                        quality: imageOptions.quality,
                    });
                }
                if (result) {
                    retrying = false;
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
            const imageFilePath = path.join("/tmp", `${uuidv4()}.png`);
            const s3ImagePath = `ypGenAi/${workPackage.collectionType}/${workPackage.collectionId}/${uuidv4()}.png`;
            try {
                let imageUrl;
                if (!disableFlux &&
                    process.env.REPLICATE_API_TOKEN &&
                    process.env.FLUX_PRO_MODEL_NAME) {
                    imageUrl = await this.getImageUrlFromFlux(workPackage.prompt, workPackage.imageType);
                }
                else {
                    imageUrl = await this.getImageUrlFromDalle(workPackage.prompt, workPackage.imageType);
                }
                if (imageUrl) {
                    await this.downloadImage(imageUrl, imageFilePath);
                    console.debug(fs.existsSync(imageFilePath)
                        ? "File downloaded successfully."
                        : "File download failed.");
                    await this.uploadImageToS3(process.env.S3_BUCKET, imageFilePath, s3ImagePath);
                    if (process.env.CLOUDFLARE_IMAGE_PROXY_DOMAIN) {
                        newImageUrl = `https://${process.env.CLOUDFLARE_IMAGE_PROXY_DOMAIN}/${s3ImagePath}`;
                    }
                    else {
                        newImageUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${s3ImagePath}`;
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
}
