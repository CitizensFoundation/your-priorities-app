"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ImageLabelingBase = require("./ImageLabelingBase.cjs");
const models = require("../../../../models/index.cjs");
class PointLabeling extends ImageLabelingBase {
    async getCollection() {
        return await new Promise(async (resolve, reject) => {
            try {
                this.collection = await models.Point.findOne({
                    where: {
                        id: this.workPackage.pointId,
                    },
                    attributes: ["id", "data"],
                });
                resolve();
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async reviewImagesFromCollection() {
        return await new Promise(async (resolve, reject) => {
            try {
                await this.reviewAndLabelVideos(models.Point, this.collection.id, "PointVideos");
                resolve();
            }
            catch (error) {
                reject(error);
            }
        });
    }
}
module.exports = PointLabeling;
