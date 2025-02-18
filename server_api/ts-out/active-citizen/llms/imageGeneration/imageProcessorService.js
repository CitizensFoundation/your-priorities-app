import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
export class ImageProcessorService {
    constructor() {
        this.validFormats = ["jpeg", "png", "webp", "gif", "tiff", "avif", "svg"];
    }
    /**
     * Downloads an image from a given URL into the specified filepath.
     */
    async downloadImage(imageUrl, imageFilePath, axiosInstance) {
        const response = await axiosInstance({
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
    /**
     * Resizes an image to given dimensions (width x height).
     * If the image is smaller, it won't be enlarged.
     */
    async resizeImage(imagePath, width, height) {
        const resizedImageFilePath = path.join("/tmp", `${uuidv4()}.png`);
        try {
            // 1) Initialize Sharp instance
            const image = sharp(imagePath).rotate(); // rotate fixes orientation from EXIF
            // 2) Read metadata to validate format
            const metadata = await image.metadata();
            if (!metadata.format || !this.validFormats.includes(metadata.format)) {
                throw new Error(`Unsupported format: ${metadata.format} (expected one of ${this.validFormats.join(", ")})`);
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
            // 4) Remove the original file
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
}
