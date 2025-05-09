export = GroupLabeling;
declare class GroupLabeling extends ImageLabelingBase {
    getCollection(): Promise<any>;
    reviewImagesFromCollection(): Promise<any>;
}
import ImageLabelingBase = require("./ImageLabelingBase.cjs");
