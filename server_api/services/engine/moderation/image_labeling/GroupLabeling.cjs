const ImageLabelingBase = require("./ImageLabelingBase.cjs");
const models = require("../../../../models/index.cjs");

class GroupLabeling extends ImageLabelingBase {
  async getCollection() {
    return await new Promise(async (resolve, reject) => {
      try {
        this.collection = await models.Group.findOne({
          where: {
            id: this.workPackage.collectionId,
          },
          attributes: ["id","data"],
          include: [
            {
              model: models.Image,
              as: "GroupLogoImages",
              attributes: models.Image.defaultAttributesPublic,
              required: false,
            },
            {
              model: models.Image,
              as: "GroupHeaderImages",
              attributes: models.Image.defaultAttributesPublic,
              required: false,
            },
            {
              model: models.Category,
              required: false,
              attributes: ['id'],
              include: [
                {
                  model: models.Image,
                  required: false,
                  as: 'CategoryIconImages',
                  attributes:  models.Image.defaultAttributesPublic,
                  order: [
                    [ { model: models.Image, as: 'CategoryIconImages' } ,'updated_at', 'asc' ]
                  ]
                }
              ]
            },
          ],
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  async reviewImagesFromCollection() {
    return await new Promise(async (resolve, reject) => {
      try {
        await this.reviewAndLabelImages(this.collection.GroupLogoImages);
        await this.reviewAndLabelImages(this.collection.GroupHeaderImages);
        for (let category of this.collection.Categories) {
          await this.reviewAndLabelImages(category.CategoryIconImages);
        }
        await this.reviewAndLabelVideos(
          models.Group,
          this.collection.id,
          "GroupLogoVideos"
        );
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = GroupLabeling;
