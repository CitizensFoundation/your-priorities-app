export = CommunityLabeling;
declare class CommunityLabeling extends ImageLabelingBase {
    getCollection(): Promise<any>;
    reviewImagesFromCollection(): Promise<any>;
}
import ImageLabelingBase = require("./ImageLabelingBase.cjs");
