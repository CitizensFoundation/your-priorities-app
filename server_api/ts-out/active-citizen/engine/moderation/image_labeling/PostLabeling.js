"use strict";
const ImageLabelingBase = require("./ImageLabelingBase");
const models = require("../../../../models");
class PostLabeling extends ImageLabelingBase {
    async getCollection() {
        return await new Promise(async (resolve, reject) => {
            try {
                this.collection = await models.Post.findOne({
                    where: {
                        id: this.workPackage.postId,
                    },
                    attributes: ["id", "data"],
                    include: [
                        {
                            model: models.Image,
                            as: "PostImages",
                            attributes: models.Image.defaultAttributesPublic,
                            required: false,
                        },
                        {
                            model: models.Image,
                            as: "PostHeaderImages",
                            attributes: models.Image.defaultAttributesPublic,
                            required: false,
                        },
                        {
                            model: models.Image,
                            as: "PostUserImages",
                            attributes: models.Image.defaultAttributesPublic,
                            required: false,
                        }
                    ],
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
                await this.reviewAndLabelImages(this.collection.PostImages);
                await this.reviewAndLabelImages(this.collection.PostHeaderImages);
                await this.reviewAndLabelImages(this.collection.PostUserImages);
                await this.reviewAndLabelVideos(models.Post, this.collection.id, "PostVideos");
                resolve();
            }
            catch (error) {
                reject(error);
            }
        });
    }
}
module.exports = PostLabeling;
