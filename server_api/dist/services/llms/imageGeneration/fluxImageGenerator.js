import Replicate from "replicate";
import log from "../../../utils/loggerTs.js";
import imageModelConfig from "./imageModelConfig.cjs";
const { getAspectRatioForImageSize } = imageModelConfig;
export class FluxImageGenerator {
    constructor(replicateApiKey, fluxProModelName) {
        this.replicateApiKey = replicateApiKey;
        this.fluxProModelName = fluxProModelName;
        this.maxRetryCount = 3;
        this.replicate = new Replicate({ auth: replicateApiKey });
    }
    async generateImageUrl(prompt, type = "logo", options) {
        let retryCount = 0;
        let retrying = true;
        let result;
        // Configure the input to replicate’s model
        const input = { prompt };
        // Assign aspect ratio depending on type
        if (options?.imageSize) {
            input.aspect_ratio = getAspectRatioForImageSize(options.imageSize);
        }
        else if (type === "logo") {
            input.aspect_ratio = "16:9";
        }
        else if (type === "icon") {
            input.aspect_ratio = "1:1";
        }
        else {
            input.aspect_ratio = "16:9";
        }
        while (retrying && retryCount < this.maxRetryCount) {
            try {
                const modelName = options?.imageModel || this.fluxProModelName;
                result = await this.replicate.run(modelName, {
                    input,
                });
                if (result) {
                    retrying = false;
                    return result; // typically a single URL
                }
            }
            catch (error) {
                log.warn("Error generating image with Flux, retrying...");
                log.warn(error.stack);
                retryCount++;
                const sleepingFor = 5000 + retryCount * 10000;
                log.debug(`Sleeping for ${sleepingFor} milliseconds`);
                await new Promise((resolve) => setTimeout(resolve, sleepingFor));
            }
        }
        if (!result) {
            log.error(`Error generating image after ${retryCount} retries`);
        }
        return undefined;
    }
}
