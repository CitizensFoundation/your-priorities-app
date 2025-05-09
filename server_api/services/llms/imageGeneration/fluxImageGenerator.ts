import Replicate from "replicate";
import { IImageGenerator, YpAiGenerateImageTypes } from "./iImageGenerator.js";

interface PsFluxProSchema {
  prompt: string;
  seed?: number;
  steps?: number;
  guidance?: number;
  interval?: number;
  aspect_ratio?: string;
  safety_tolerance?: number;
}

export class FluxImageGenerator implements IImageGenerator {
  private replicate: Replicate;
  private maxRetryCount = 3;

  constructor(private replicateApiKey: string, private fluxProModelName: string) {
    this.replicate = new Replicate({ auth: replicateApiKey });
  }

  async generateImageUrl(
    prompt: string,
    type: YpAiGenerateImageTypes = "logo"
  ): Promise<string | undefined> {
    let retryCount = 0;
    let retrying = true;
    let result: any;

    // Configure the input to replicate’s model
    const input: PsFluxProSchema = { prompt };

    // Assign aspect ratio depending on type
    if (type === "logo") {
      input.aspect_ratio = "16:9";
    } else if (type === "icon") {
      input.aspect_ratio = "1:1";
    } else {
      input.aspect_ratio = "16:9";
    }

    while (retrying && retryCount < this.maxRetryCount) {
      try {
        result = await this.replicate.run(this.fluxProModelName as `${string}/${string}`, {
          input,
        });

        if (result) {
          retrying = false;
          return result; // typically a single URL
        }
      } catch (error: any) {
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
