import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { FluxImageGenerator } from "./fluxImageGenerator.js";
import { DalleImageGenerator } from "./dalleImageGenerator.js";
import { ImageProcessorService } from "./imageProcessorService.js";
import { S3Service } from "./s3Service.js";
// Suppose these come from your codebase
import models from "../../../models/index.cjs";
import { ImagenImageGenerator } from "./imagenImageGenerator.js";
import { ChatGptImageGenerator } from "./chatGptImageGenerator.js";
// For reference, in your code:
const dbModels = models;
const Image = dbModels.Image;
const AcBackgroundJob = dbModels.AcBackgroundJob;
const disableFlux = false;
const useImagen = false;
export class CollectionImageGenerator {
    constructor() {
        this.s3Service = new S3Service(process.env.CLOUDFLARE_API_KEY, process.env.CLOUDFLARE_ZONE_ID);
        this.imageProcessorService = new ImageProcessorService();
        // Initialize generators
        if (!disableFlux &&
            process.env.REPLICATE_API_TOKEN &&
            process.env.FLUX_PRO_MODEL_NAME) {
            this.fluxImageGenerator = new FluxImageGenerator(process.env.REPLICATE_API_TOKEN, process.env.FLUX_PRO_MODEL_NAME);
        }
        this.dalleImageGenerator = new DalleImageGenerator(process.env.AZURE_OPENAI_API_BASE, process.env.AZURE_OPENAI_API_KEY, process.env.AZURE_OPENAI_API_DALLE_DEPLOYMENT_NAME, process.env.OPENAI_API_KEY);
        this.chatGptImageGenerator = new ChatGptImageGenerator(process.env.OPENAI_API_KEY);
        if (useImagen && process.env.GOOGLE_CLOUD_PROJECT_ID) {
            this.imagenImageGenerator = new ImagenImageGenerator(this.s3Service);
        }
    }
    /**
     * Orchestrates image generation (via Flux or DALL·E), downloads that image,
     * uploads it to S3, and saves a record in the DB.
     */
    async createCollectionImage(workPackage) {
        return new Promise(async (resolve, reject) => {
            let newImageUrl;
            const imageFilePath = path.join("/tmp", `${uuidv4()}.png`);
            const s3ImagePath = `ypGenAi/${workPackage.collectionType}/${workPackage.collectionId}/${uuidv4()}.png`;
            try {
                let imageGenerator;
                // Decide which generator to use
                if (this.imagenImageGenerator) {
                    imageGenerator = this.imagenImageGenerator;
                    console.info("Using ImagenImageGenerator");
                }
                else if (this.fluxImageGenerator) {
                    imageGenerator = this.fluxImageGenerator;
                    console.info("Using FluxImageGenerator");
                }
                else if (process.env.USE_CHATGPT_IMAGE_GENERATOR) {
                    imageGenerator = this.chatGptImageGenerator;
                    console.info("Using ChatGptImageGenerator");
                }
                else {
                    imageGenerator = this.dalleImageGenerator;
                    console.info("Using DalleImageGenerator");
                }
                // 1) Generate image
                const imageUrl = await imageGenerator.generateImageUrl(workPackage.prompt, workPackage.imageType);
                if (!imageUrl) {
                    return reject("Error getting image URL from prompt.");
                }
                if (useImagen && this.imagenImageGenerator) {
                    newImageUrl = imageUrl;
                }
                else {
                    // 2) Download image to temporary location
                    await this.imageProcessorService.downloadImage(imageUrl, imageFilePath, axios);
                    console.debug(fs.existsSync(imageFilePath)
                        ? "File downloaded successfully."
                        : "File download failed.");
                    // (Optional) If you want to resize the image before upload:
                    // const resizedPath = await this.imageProcessorService.resizeImage(imageFilePath, 1024, 1024);
                    // Upload the `resizedPath` instead of `imageFilePath`
                    // 3) Upload image to S3
                    await this.s3Service.uploadImageToS3(process.env.S3_BUCKET, imageFilePath, s3ImagePath);
                    // 4) Construct a public URL (optionally going through Cloudflare)
                    if (process.env.CLOUDFLARE_IMAGE_PROXY_DOMAIN) {
                        newImageUrl = `https://${process.env.CLOUDFLARE_IMAGE_PROXY_DOMAIN}/${s3ImagePath}`;
                    }
                    else {
                        newImageUrl = `https://${process.env
                            .S3_BUCKET}.s3.amazonaws.com/${s3ImagePath}`;
                    }
                }
                // 5) Save record in DB
                const formats = JSON.stringify([newImageUrl]);
                const imageRecord = await Image.build({
                    user_id: workPackage.userId,
                    s3_bucket_name: process.env.S3_BUCKET,
                    original_filename: "n/a",
                    formats,
                    user_agent: "AI worker",
                    ip_address: "127.0.0.1",
                });
                await imageRecord.save();
                resolve({ imageId: imageRecord.id, imageUrl: newImageUrl });
            }
            catch (error) {
                reject(error);
            }
        });
    }
}
