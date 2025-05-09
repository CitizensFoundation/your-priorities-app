export = ImageLabelingBase;
declare class ImageLabelingBase {
    constructor(workPackage: any);
    workPackage: any;
    collection: any;
    reportContent: boolean;
    reportContentWithNotification: boolean;
    visionClient: vision.v1.ImageAnnotatorClient;
    visionRequesBase: {
        features: {
            type: string;
        }[];
        image: {
            source: {
                imageUri: undefined;
            };
        };
    };
    reviewAndLabelUrl(imageUrl: any, mediaType: any, mediaId: any): Promise<any>;
    reportImageToModerators(options: any): Promise<any>;
    hasImageIdBeenReviewed(imageId: any): boolean;
    reviewAndLabelImages(images: any): Promise<any>;
    reviewAndLabelVideos(collectionModel: any, collectionId: any, collectionAssociation: any): Promise<any>;
    evaluteImageReviews(imageReviews: any): Promise<any>;
    reportContentIfNeeded(): Promise<any>;
    getCollection(): Promise<void>;
    reviewImagesFromCollection(): Promise<void>;
    reviewAndLabelVisualMedia(): Promise<any>;
}
import vision = require("@google-cloud/vision");
