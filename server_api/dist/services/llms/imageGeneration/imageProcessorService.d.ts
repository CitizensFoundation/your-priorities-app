export declare class ImageProcessorService {
    private validFormats;
    /**
     * Downloads an image from a given URL into the specified filepath.
     */
    downloadImage(imageUrl: string, imageFilePath: string, axiosInstance: any): Promise<void>;
    /**
     * Resizes an image to given dimensions (width x height).
     * If the image is smaller, it won't be enlarged.
     */
    resizeImage(imagePath: string, width: number, height: number): Promise<string>;
}
