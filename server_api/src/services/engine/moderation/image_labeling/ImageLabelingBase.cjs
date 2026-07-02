const vision = require('@google-cloud/vision');
const models = require("../../../../models/index.cjs");
const axios = require("axios");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { pipeline } = require("stream/promises");
const log = require('../../../../utils/logger.cjs');

const hasImageExtension = (imageUrl) =>
  /\.(gif|jpe?g|png|webp)$/i.test(new URL(imageUrl).pathname);

const isImageDownload = (contentType, imageUrl) => {
  if (!contentType) {
    return true;
  }

  const normalizedContentType = contentType.toLowerCase().split(";")[0].trim();
  return (
    normalizedContentType.startsWith("image/") ||
    (normalizedContentType === "application/octet-stream" &&
      hasImageExtension(imageUrl))
  );
};

const downloadImageFile = async (imageUrl) => {
  const parsedUrl = new URL(imageUrl);
  const extension = path.extname(parsedUrl.pathname) || ".img";
  const fileNameWithPath = path.join(
    "/tmp",
    `vision-${Date.now()}-${crypto.randomBytes(8).toString("hex")}${extension}`
  );

  let response;
  try {
    response = await axios.get(imageUrl, {
      maxRedirects: 5,
      responseType: "stream",
      timeout: 20000,
      validateStatus: () => true,
    });

    const contentType = response.headers["content-type"];
    if (response.status < 200 || response.status >= 300) {
      response.data.destroy();
      throw new Error(`HTTP ${response.status}`);
    }

    if (!isImageDownload(contentType, imageUrl)) {
      response.data.destroy();
      throw new Error(`Unexpected content-type ${contentType}`);
    }

    await pipeline(response.data, fs.createWriteStream(fileNameWithPath));

    const stats = fs.statSync(fileNameWithPath);
    if (stats.size === 0) {
      throw new Error("Downloaded image file was empty");
    }

    return {
      contentType,
      fileNameWithPath,
      size: stats.size,
    };
  } catch (error) {
    fs.unlink(fileNameWithPath, () => {});
    throw error;
  }
};

class ImageLabelingBase {
  constructor(workPackage) {
    this.workPackage = workPackage;
    this.collection = null;
    this.reportContent = false;
    this.reportContentWithNotification = false;
    this.visionClient = new vision.ImageAnnotatorClient({
      credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON),
      projectId: process.env.GOOGLE_TRANSLATE_PROJECT_ID
        ? process.env.GOOGLE_TRANSLATE_PROJECT_ID
        : undefined,
    });
    this.visionRequesBase = {
      features: [
        { type: "LABEL_DETECTION" },
        { type: "SAFE_SEARCH_DETECTION" },
      ],
      image: { source: { imageUri: undefined } },
    };
  }

  async reviewAndLabelUrl(imageUrl, mediaType, mediaId) {
    let downloadedFile;
    try {
      downloadedFile = await downloadImageFile(imageUrl);
    } catch (error) {
      log.warn("Skipping Vision image labeling for unavailable media", {
        error: error.message || error,
        imageUrl,
        mediaId,
        mediaType,
      });
      return null;
    }

    try {
      const [result] = await this.visionClient.annotateImage({
        ...this.visionRequesBase,
        image: { content: fs.readFileSync(downloadedFile.fileNameWithPath) }
      });

      if (result.error) {
        log.warn("Skipping Vision image labeling for invalid media", {
          contentType: downloadedFile.contentType,
          error: result.error.message,
          imageUrl,
          mediaId,
          mediaType,
          size: downloadedFile.size,
        });
        return null;
      }

      const imageLabels = { ...result.labelAnnotations, mediaType, mediaId };
      const imageReviews = {
        ...result.safeSearchAnnotation,
        mediaType,
        mediaId,
      };
      log.info(`Image Labels: ${imageReviews ? JSON.stringify(imageReviews) : ''}`);
      await this.collection.reload();
      if (!this.collection.data) {
        this.collection.set("data", {});
      }
      if (!this.collection.data.labels) {
        this.collection.set("data.labels", {});
      }
      if (!this.collection.data.moderation) {
        this.collection.set("data.moderation", {});
      }
      if (!this.collection.data.moderation.imageReviews) {
        this.collection.set("data.moderation.imageReviews", []);
      }
      if (!this.collection.data.labels.images) {
        this.collection.set("data.labels.images", []);
      }
      this.collection.data.moderation.imageReviews.push(imageReviews);
      this.collection.data.labels.images.push(imageLabels);
      this.collection.changed("data", true);
      await this.collection.save();
      await this.evaluteImageReviews(imageReviews);
      return { imageLabels, imageReviews };
    } finally {
      if (downloadedFile) {
        fs.unlink(downloadedFile.fileNameWithPath, unlinkErr => {
          if (unlinkErr) log.error(unlinkErr);
        });
      }
    }
  }

  async reportImageToModerators(options) {
    return await new Promise(async (resolve, reject) => {
      try {
        if (this.workPackage.pointId) {
          this.collection.report(options, "visionAPI", null, (error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        } else {
          this.collection.report(options, "visionAPI", (error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  hasImageIdBeenReviewed(imageId) {
    let hasBeenReviewed = false;
    if (
      this.collection.data &&
      this.collection.data.moderation &&
      this.collection.data.moderation.imageReviews
    ) {
      this.collection.data.moderation.imageReviews.forEach((imageReview) => {
        if (
          imageReview.mediaType === "Image" &&
          imageReview.mediaId === imageId
        ) {
          hasBeenReviewed = true;
        }
      });
    }
    return hasBeenReviewed;
  }

  async reviewAndLabelImages(images) {
    return await new Promise(async (resolve, reject) => {
      try {
        for (let image of images) {
          if (!this.hasImageIdBeenReviewed(image.id)) {
            const imageFormat = JSON.parse(image.formats);
            await this.reviewAndLabelUrl(
              imageFormat[imageFormat.length - 1],
              "Image",
              image.id
            );
          }
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  async reviewAndLabelVideos(
    collectionModel,
    collectionId,
    collectionAssociation
  ) {
    return await new Promise(async (resolve, reject) => {
      try {
        const videos = await models.Video.findAll({
          attributes: [
            "id",
            "formats",
            "viewable",
            "created_at",
            "public_meta",
            "meta",
          ],
          include: [
            {
              model: models.Image,
              as: "VideoImages",
              attributes: ["formats", "created_at",'id'],
              required: false,
            },
            {
              model: collectionModel,
              where: {
                id: collectionId,
              },
              as: collectionAssociation,
              required: true,
              attributes: ["id"],
            },
          ],
          order: [
            [
              { model: models.Image, as: "VideoImages" },
              "created_at",
              "asc",
            ],
          ],
        });

        for (let video of videos) {
          if (
            video.meta &&
            video.meta.moderation &&
            video.meta.moderation.imageReviews
          ) {
            // Video has already been reviewed
          } else {
            if (video.VideoImages.length > 0) {
              const searchImages = [];
              // Chose 3 random images from the video
              searchImages.push(
                video.VideoImages[
                  Math.floor(Math.random() * video.VideoImages.length)
                ]
              );
              searchImages.push(
                video.VideoImages[
                  Math.floor(Math.random() * video.VideoImages.length)
                ]
              );
              searchImages.push(
                video.VideoImages[
                  Math.floor(Math.random() * video.VideoImages.length)
                ]
              );
              for (let image of searchImages) {
                const imageFormat = JSON.parse(image.formats);
                const reviewResult = await this.reviewAndLabelUrl(
                  imageFormat[imageFormat.length - 1],
                    "Video",
                    image.id
                  );
                if (!reviewResult) {
                  continue;
                }
                const { imageLabels, imageReviews } = reviewResult;
                if (!video.meta) {
                  video.set("meta", {});
                }
                if (!video.meta.moderation) {
                  video.set("meta.moderation", {});
                }
                video.set("meta.moderation.imageReviews", imageReviews);
                video.set("meta.imageLabels", imageLabels);
                video.changed("meta", true);
                await video.save();
              }
            }
          }
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  async evaluteImageReviews(imageReviews) {
    return await new Promise(async (resolve, reject) => {
      const reportAnnotations = ["VERY_LIKELY", "LIKELY"];
      try {
        if (
          reportAnnotations.indexOf(imageReviews.adult) > -1 ||
          reportAnnotations.indexOf(imageReviews.violence) > -1 ||
          reportAnnotations.indexOf(imageReviews.racy) > -1 ||
          reportAnnotations.indexOf(imageReviews.medical) > -1 ||
          imageReviews.spoof == "VERY_LIKELY"
        ) {
          if (
            imageReviews.adult === "VERY_LIKELY" ||
            imageReviews.violence === "VERY_LIKELY" ||
            imageReviews.medical === "VERY_LIKELY"
          ) {
            this.reportContentWithNotification = true;
          } else {
            this.reportContent = true;
          }
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  async reportContentIfNeeded() {
    return await new Promise(async (resolve, reject) => {
      try {
        if (this.reportContentWithNotification) {
          await this.reportImageToModerators({ disableNotification: false });
        } else if (this.reportContent) {
          await this.reportImageToModerators({ disableNotification: true });
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  async getCollection() {}

  async reviewImagesFromCollection() {}

  async reviewAndLabelVisualMedia() {
    return await new Promise(async (resolve, reject) => {
      try {
        if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
          await this.getCollection();
          await this.reviewImagesFromCollection();
          await this.reportContentIfNeeded();
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = ImageLabelingBase;
