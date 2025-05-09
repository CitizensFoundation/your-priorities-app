import Replicate from "replicate";
export class FluxImageGenerator {
    constructor(replicateApiKey, fluxProModelName) {
        this.replicateApiKey = replicateApiKey;
        this.fluxProModelName = fluxProModelName;
        this.maxRetryCount = 3;
        this.replicate = new Replicate({ auth: replicateApiKey });
    }
    async generateImageUrl(prompt, type = "logo") {
        let retryCount = 0;
        let retrying = true;
        let result;
        // Configure the input to replicate’s model
        const input = { prompt };
        // Assign aspect ratio depending on type
        if (type === "logo") {
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
                result = await this.replicate.run(this.fluxProModelName, {
                    input,
                });
                if (result) {
                    retrying = false;
                    return result; // typically a single URL
                }
            }
            catch (error) {
                console.warn("Error generating image with Flux, retrying...");
                console.warn(error.stack);
                retryCount++;
                const sleepingFor = 5000 + retryCount * 10000;
                console.debug(`Sleeping for ${sleepingFor} milliseconds`);
                await new Promise((resolve) => setTimeout(resolve, sleepingFor));
            }
        }
        if (!result) {
            console.error(`Error generating image after ${retryCount} retries`);
        }
        return undefined;
    }
}
