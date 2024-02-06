const ImageLabelingBase = require("./ImageLabelingBase");
const models = require("../../../../models/index.cjs");
class CommunityLabeling extends ImageLabelingBase {
    async getCollection() {
        return await new Promise(async (resolve, reject) => {
            try {
                this.collection = await models.Community.findOne({
                    where: {
                        id: this.workPackage.collectionId,
                    },
                    attributes: ["id", "data"],
                    include: [
                        {
                            model: models.Image,
                            as: "CommunityLogoImages",
                            attributes: models.Image.defaultAttributesPublic,
                            required: false,
                        },
                        {
                            model: models.Image,
                            as: "CommunityHeaderImages",
                            attributes: models.Image.defaultAttributesPublic,
                            required: false,
                        },
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
                await this.reviewAndLabelImages(this.collection.CommunityLogoImages);
                await this.reviewAndLabelImages(this.collection.CommunityHeaderImages);
                await this.reviewAndLabelVideos(models.Community, this.collection.id, "CommunityLogoVideos");
                resolve();
            }
            catch (error) {
                reject(error);
            }
        });
    }
}
module.exports = CommunityLabeling;
export {};
