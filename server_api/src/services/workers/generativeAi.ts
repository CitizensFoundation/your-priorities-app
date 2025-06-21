import { AoiIconGenerator } from "../engine/allOurIdeas/iconGenerator.js";
import models from "../../models/index.cjs";
import { CollectionImageGenerator } from "../llms/imageGeneration/collectionImageGenerator.js";
import log from "../../utils/loggerTs.js";

const dbModels: Models = models;
const Image = dbModels.Image as ImageClass;
const AcBackgroundJob = dbModels.AcBackgroundJob as AcBackgroundJobClass;

export class GenerativeAiWorker {
  async process(workPackage: YpGenerativeAiWorkPackageData, callback: any) {
    log.info(`Processing workPackage: ${JSON.stringify(workPackage)}`);
    switch (workPackage.type) {
      case "collection-image":
        try {
          let generator;
          if (workPackage.imageType=="icon") {
            generator = new AoiIconGenerator();
          }  else {
            generator = new CollectionImageGenerator();
          }

          const { imageId, imageUrl } = await generator.createCollectionImage(
            workPackage
          );
          log.info(`Created imageId: ${imageId} imageUrl: ${imageUrl}`);
          if (imageId) {
            await AcBackgroundJob.updateDataAsync(workPackage.jobId, {
              imageId,
              imageUrl,
            });
            log.debug(
              `Updated job ${workPackage.jobId} with imageId: ${imageId} imageUrl: ${imageUrl}`
            );
          } else {
            await AcBackgroundJob.update(
              {
                error: "Can't generate image try again later",
              },
              {
                where: { id: workPackage.jobId },
              }
            );
          }
          callback();
        } catch (error: any) {
          log.error(error);
          if (typeof error !== "string") {
            error = JSON.stringify(error);
          }
          try {
            await AcBackgroundJob.updateErrorAsync(workPackage.jobId, error);
          } catch (error: any) {
            log.error(error);
          }
          callback(error);
        }
        break;
      default:
        callback("Unknown type for workPackage: " + workPackage.type);
    }
  }
}
