"use strict";
const vision = require('@google-cloud/vision');
const models = require("../../../../models/index.cjs");
var downloadFile = require('download-file');
const fs = require("fs");
const log = require('../../../utils/logger.cjs');
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
        return await new Promise(async (resolve, reject) => {
            try {
                const splitUrl = imageUrl.split('/');
                const fileName = splitUrl[splitUrl.length - 1];
                const fileNameWithPath = '/tmp/' + fileName;
                downloadFile(imageUrl, { filename: fileName, directory: '/tmp/' }, async (error) => {
                    if (error) {
                        fs.unlink(fileNameWithPath, () => {
                            reject('Could not download file');
                        });
                        return;
                    }
                    else {
                        let result;
                        try {
                            ;
                            [result] = await this.visionClient.annotateImage({
                                ...this.visionRequesBase,
                                image: { content: fs.readFileSync(fileNameWithPath) }
                            });
                        }
                        catch (annotationError) {
                            log.error('Vision API annotateImage failed', annotationError);
                            fs.unlink(fileNameWithPath, unlinkErr => {
                                if (unlinkErr)
                                    log.error(unlinkErr);
                            });
                            resolve();
                            return;
                        }
                        try {
                            fs.unlink(fileNameWithPath, async (unlinkError) => {
                                if (unlinkError)
                                    log.error(unlinkError);
                                if (result.error) {
                                    reject(result.error.message);
                                }
                                else {
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
                                    resolve({ imageLabels, imageReviews });
                                }
                            });
                        }
                        catch (error) {
                            reject(error);
                        }
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async reportImageToModerators(options) {
        return await new Promise(async (resolve, reject) => {
            try {
                if (this.workPackage.pointId) {
                    this.collection.report(options, "visionAPI", null, (error) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            resolve();
                        }
                    });
                }
                else {
                    this.collection.report(options, "visionAPI", (error) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            resolve();
                        }
                    });
                }
            }
            catch (error) {
                reject(error);
            }
        });
    }
    hasImageIdBeenReviewed(imageId) {
        let hasBeenReviewed = false;
        if (this.collection.data &&
            this.collection.data.moderation &&
            this.collection.data.moderation.imageReviews) {
            this.collection.data.moderation.imageReviews.forEach((imageReview) => {
                if (imageReview.mediaType === "Image" &&
                    imageReview.mediaId === imageId) {
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
                        await this.reviewAndLabelUrl(imageFormat[imageFormat.length - 1], "Image", image.id);
                    }
                }
                resolve();
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async reviewAndLabelVideos(collectionModel, collectionId, collectionAssociation) {
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
                            attributes: ["formats", "created_at", 'id'],
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
                    if (video.meta &&
                        video.meta.moderation &&
                        video.meta.moderation.imageReviews) {
                        // Video has already been reviewed
                    }
                    else {
                        if (video.VideoImages.length > 0) {
                            const searchImages = [];
                            // Chose 3 random images from the video
                            searchImages.push(video.VideoImages[Math.floor(Math.random() * video.VideoImages.length)]);
                            searchImages.push(video.VideoImages[Math.floor(Math.random() * video.VideoImages.length)]);
                            searchImages.push(video.VideoImages[Math.floor(Math.random() * video.VideoImages.length)]);
                            for (let image of searchImages) {
                                const imageFormat = JSON.parse(image.formats);
                                const { imageLabels, imageReviews } = await this.reviewAndLabelUrl(imageFormat[imageFormat.length - 1], "Video", image.id);
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
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async evaluteImageReviews(imageReviews) {
        return await new Promise(async (resolve, reject) => {
            const reportAnnotations = ["VERY_LIKELY", "LIKELY"];
            try {
                if (reportAnnotations.indexOf(imageReviews.adult) > -1 ||
                    reportAnnotations.indexOf(imageReviews.violence) > -1 ||
                    reportAnnotations.indexOf(imageReviews.racy) > -1 ||
                    reportAnnotations.indexOf(imageReviews.medical) > -1 ||
                    imageReviews.spoof == "VERY_LIKELY") {
                    if (imageReviews.adult === "VERY_LIKELY" ||
                        imageReviews.violence === "VERY_LIKELY" ||
                        imageReviews.medical === "VERY_LIKELY") {
                        this.reportContentWithNotification = true;
                    }
                    else {
                        this.reportContent = true;
                    }
                }
                resolve();
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async reportContentIfNeeded() {
        return await new Promise(async (resolve, reject) => {
            try {
                if (this.reportContentWithNotification) {
                    await this.reportImageToModerators({ disableNotification: false });
                }
                else if (this.reportContent) {
                    await this.reportImageToModerators({ disableNotification: true });
                }
                resolve();
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async getCollection() { }
    async reviewImagesFromCollection() { }
    async reviewAndLabelVisualMedia() {
        return await new Promise(async (resolve, reject) => {
            try {
                if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
                    await this.getCollection();
                    await this.reviewImagesFromCollection();
                    await this.reportContentIfNeeded();
                }
                resolve();
            }
            catch (error) {
                reject(error);
            }
        });
    }
}
module.exports = ImageLabelingBase;
