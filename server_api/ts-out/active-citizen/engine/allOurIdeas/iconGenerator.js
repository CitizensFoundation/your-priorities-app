import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import models from "../../../models/index.cjs";
import { CollectionImageGenerator } from "../../llms/collectionImageGenerator.js";
const dbModels = models;
const Image = dbModels.Image;
export class AoiIconGenerator extends CollectionImageGenerator {
    async createCollectionImage(workPackage) {
        return new Promise(async (resolve, reject) => {
            let newImageUrl;
            const imageFilePath = path.join("/tmp", `${uuidv4()}.png`);
            const s3ImagePath = `ypGenAi/${workPackage.collectionType}/${workPackage.collectionId}/${uuidv4()}.png`;
            try {
                const imageUrl = await this.getImageUrlFromDalle(workPackage.prompt, workPackage.imageType);
                if (imageUrl) {
                    await this.downloadImage(imageUrl, imageFilePath);
                    console.debug(fs.existsSync(imageFilePath)
                        ? "File downloaded successfully."
                        : "File download failed.");
                    const resizedImageFilePath = await this.resizeImage(imageFilePath, 400, 400);
                    await this.uploadImageToS3(process.env.S3_BUCKET, resizedImageFilePath, s3ImagePath);
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
