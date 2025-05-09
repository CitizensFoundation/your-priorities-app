export = PostLabeling;
declare class PostLabeling extends ImageLabelingBase {
    getCollection(): Promise<any>;
    reviewImagesFromCollection(): Promise<any>;
}
import ImageLabelingBase = require("./ImageLabelingBase.cjs");
