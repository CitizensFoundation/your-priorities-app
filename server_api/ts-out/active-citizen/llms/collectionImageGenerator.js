import { OpenAI } from "openai";
import axios from "axios";
import AWS from "aws-sdk";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import models from "../../models/index.cjs";
import sharp from "sharp";
import { OpenAIClient, AzureKeyCredential, } from "@azure/openai";
const dbModels = models;
const Image = dbModels.Image;
const AcBackgroundJob = dbModels.AcBackgroundJob;
const maxDalleRetryCount = 3;
export class CollectionImageGenerator {
    async resizeImage(imagePath, width, height) {
        const resizedImageFilePath = path.join("/tmp", `${uuidv4()}.png`);
        await sharp(imagePath)
            .resize({ width, height })
            .toFile(resizedImageFilePath);
        fs.unlinkSync(imagePath);
        return resizedImageFilePath;
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
            writer.on("finish", resolve);
            writer.on("error", reject);
        });
    }
    async deleteS3Url(imageUrl) {
        // Parse the S3 bucket and key from the URL
        const { bucket, key } = this.parseImageUrl(imageUrl);
        if (!bucket || !key) {
            throw new Error("Could not parse bucket or key from URL");
        }
        const s3 = new AWS.S3();
        const params = {
            Bucket: bucket,
            Key: key,
            ACL: "private", // Changing the ACL to private
        };
        console.log(`=========================____________________>>>>>>>>>>>>>>>>> Disabling/Deleting Key from S3: ${JSON.stringify(params)}`);
        return new Promise((resolve, reject) => {
            s3.putObjectAcl(params, (err, data) => {
                if (err) {
                    console.error(`Error deleting image from S3: ${err}`);
                    reject(err);
                }
                else {
                    console.log(`============= Deleted image from S3: ${imageUrl}`, data);
                    if (process.env.CLOUDFLARE_API_KEY &&
                        process.env.CLOUDFLARE_ZONE_ID) {
                        console.log("Purging Cloudflare cache for image:", imageUrl);
                        axios
                            .post(`https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE_ID}/purge_cache`, {
                            files: [imageUrl],
                        }, {
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
                                // The request was made but no response was received
                                console.error("No response received:", error.request);
                            }
                            else {
                                // Something happened in setting up the request that triggered an Error
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
            // Parse URL for Cloudflare proxied images
            const path = new URL(imageUrl).pathname;
            const [, ...pathParts] = path.split("/");
            bucket = process.env.S3_BUCKET;
            key = pathParts.join("/");
        }
        else {
            // Parse URL for direct S3 images
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
            ACL: "public-read", // Makes sure the uploaded files are publicly accessible
            ContentType: "image/png",
            ContentDisposition: "inline",
        };
        return new Promise((resolve, reject) => {
            s3.upload(params, (err, data) => {
                if (err) {
                    reject(err);
                }
                fs.unlinkSync(filePath); // Deleting file from local storage
                //console.log(`Upload response: ${JSON.stringify(data)}`);
                resolve(data);
            });
        });
    }
    async getImageUrlFromPrompt(prompt, type = "logo") {
        const azureOpenaAiBase = process.env["AZURE_OPENAI_API_BASE"];
        const azureOpenAiApiKey = process.env["AZURE_OPENAI_API_KEY"];
        let client;
        if (azureOpenAiApiKey && azureOpenaAiBase) {
            client = new OpenAIClient(azureOpenaAiBase, new AzureKeyCredential(azureOpenAiApiKey));
        }
        else {
            client = new OpenAI({
                apiKey: process.env["OPENAI_API_KEY"],
            });
        }
        let retryCount = 0;
        let retrying = true; // Initialize as true
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
        while (retrying && retryCount < maxDalleRetryCount) {
            try {
                if (azureOpenAiApiKey && azureOpenaAiBase) {
                    result = await client.getImages(process.env.AZURE_OPENAI_API_DALLE_DEPLOYMENT_NAME, prompt, imageOptions);
                }
                else {
                    result = await client.images.generate({
                        model: "dall-e-3",
                        prompt,
                        n: imageOptions.n,
                        quality: imageOptions.quality,
                        size: imageOptions.size,
                    });
                }
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
            const imageFilePath = path.join("/tmp", `${uuidv4()}.png`);
            const s3ImagePath = `ypGenAi/${workPackage.collectionType}/${workPackage.collectionId}/${uuidv4()}.png`;
            try {
                const imageUrl = await this.getImageUrlFromPrompt(workPackage.prompt, workPackage.imageType);
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
}
