export = PointLabeling;
declare class PointLabeling extends ImageLabelingBase {
    getCollection(): Promise<any>;
    reviewImagesFromCollection(): Promise<any>;
}
import ImageLabelingBase = require("./ImageLabelingBase.cjs");
