import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import models from "../../../models/index.cjs";
import { CollectionImageGenerator } from "../../llms/imageGeneration/collectionImageGenerator.js";

const dbModels: any = models;
const Image = dbModels.Image as ImageClass;

export class AoiIconGenerator extends CollectionImageGenerator {
  async createCollectionImage(
    workPackage: YpGenerativeAiWorkPackageData
  ): Promise<{ imageId: number; imageUrl: string }> {
    // 1. Generate the image and record using the base implementation.
    const { imageId, imageUrl } = await super.createCollectionImage(workPackage);

    // 2. Now process the image for the icon:
    // Download the generated image to a temporary location.
    const tempIconPath = path.join("/tmp", `${uuidv4()}-icon.png`);
    await this.imageProcessorService.downloadImage(imageUrl, tempIconPath, axios);

    if (!fs.existsSync(tempIconPath)) {
      throw new Error("Failed to download the generated image for icon processing.");
    }

    // Resize the downloaded image to 400x400 pixels.
    const resizedIconPath = await this.imageProcessorService.resizeImage(
      tempIconPath,
      400,
      400
    );

    // Define a new S3 path for the icon image.
    const iconS3ImagePath = `ypGenAi/${workPackage.collectionType}/${workPackage.collectionId}/${uuidv4()}-icon.png`;

    // Upload the resized icon to S3.
    await this.s3Service.uploadImageToS3(
      process.env.S3_BUCKET!,
      resizedIconPath,
      iconS3ImagePath
    );

    // Construct a public URL for the icon image.
    const newIconUrl =
      process.env.CLOUDFLARE_IMAGE_PROXY_DOMAIN
        ? `https://${process.env.CLOUDFLARE_IMAGE_PROXY_DOMAIN}/${iconS3ImagePath}`
        : `https://${process.env.S3_BUCKET!}.s3.amazonaws.com/${iconS3ImagePath}`;

    // Optionally, update the DB record with the new icon URL.
    const imageRecord = await Image.findOne({ where: { id: imageId } });
    if (imageRecord) {
      imageRecord.formats = JSON.stringify([newIconUrl]);
      await imageRecord.save();
    }

    return { imageId, imageUrl: newIconUrl };
  }
}
