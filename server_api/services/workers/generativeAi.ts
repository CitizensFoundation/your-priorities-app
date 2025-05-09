import { AoiIconGenerator } from "../engine/allOurIdeas/iconGenerator.js";
import models from "../../models/index.cjs";
import { CollectionImageGenerator } from "../llms/imageGeneration/collectionImageGenerator.js";

const dbModels: Models = models;
const Image = dbModels.Image as ImageClass;
const AcBackgroundJob = dbModels.AcBackgroundJob as AcBackgroundJobClass;

export class GenerativeAiWorker {
  async process(workPackage: YpGenerativeAiWorkPackageData, callback: any) {
    console.info(`Processing workPackage: ${JSON.stringify(workPackage)}`);
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
          console.info(`Created imageId: ${imageId} imageUrl: ${imageUrl}`);
          if (imageId) {
            await AcBackgroundJob.updateDataAsync(workPackage.jobId, {
              imageId,
              imageUrl,
            });
            console.debug(
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
          console.error(error);
          if (typeof error !== "string") {
            error = JSON.stringify(error);
          }
          try {
            await AcBackgroundJob.updateErrorAsync(workPackage.jobId, error);
          } catch (error: any) {
            console.error(error);
          }
          callback(error);
        }
        break;
      default:
        callback("Unknown type for workPackage: " + workPackage.type);
    }
  }
}
