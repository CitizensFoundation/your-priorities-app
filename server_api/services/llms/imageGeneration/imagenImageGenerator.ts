import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { PredictionServiceClient } from "@google-cloud/aiplatform";
import { helpers } from "@google-cloud/aiplatform";
import { IImageGenerator, YpAiGenerateImageTypes } from "./iImageGenerator.js";
import { S3Service } from "./s3Service.js";

export class ImagenImageGenerator implements IImageGenerator {
  private maxRetryCount = 3;

  // Pull these from your environment or config
  private projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || "";
  private location = process.env.GOOGLE_CLOUD_IMAGEN_LOCATION || "us-east1";

  // Matches the official endpoint for Imagen v3.0:
  private endpoint = `projects/${this.projectId}/locations/${this.location}/publishers/google/models/imagen-3.0-generate-002`;
  private s3Bucket = process.env.S3_BUCKET || "";

  constructor(private s3Service: S3Service) {
    if (!this.projectId) {
      console.warn(
        "Warning: GOOGLE_CLOUD_PROJECT_ID is not set. Vertex AI calls may fail."
      );
    }
    if (!this.s3Bucket) {
      console.warn("Warning: S3_BUCKET is not set. Image upload may fail.");
    }
  }

  /**
   * Generates an image from a text prompt using Vertex AI Imagen
   * and returns a public S3 URL to the uploaded image.
   */
  async generateImageUrl(
    prompt: string,
    type: YpAiGenerateImageTypes = "logo"
  ): Promise<string | undefined> {
    let retryCount = 0;
    let finalUrl: string | undefined;

    // Configure the API endpoint for Vertex AI
    const clientOptions = {
      apiEndpoint: `${this.location}-aiplatform.googleapis.com`,
    };
    const predictionServiceClient = new PredictionServiceClient(clientOptions);

    while (retryCount < this.maxRetryCount && !finalUrl) {
      try {
        // 1) Prepare the prompt and parameters for Imagen
        const promptText = {
          prompt: prompt, // The text prompt describing what you want to see
        };

        const instanceValue = helpers.toValue(promptText);
        const instances = [instanceValue];

        const parameter = {
          sampleCount: 1,
          // You can tweak these settings to your needs:
          // seed: 100,
          // addWatermark: false,
          aspectRatio: "16:9",
          safetyFilterLevel: "block_some",
          personGeneration: "allow_adult",
        };
        const parameters = helpers.toValue(parameter);

        // 2) Build the predict request
        const request = {
          endpoint: this.endpoint,
          instances,
          parameters,
        };

        // 3) Make the API call
        //@ts-ignore
        const [response] = await predictionServiceClient.predict(request);
        const predictions = response.predictions;

        if (!predictions || predictions.length === 0) {
          console.warn(
            "No image was generated. Check the request parameters and prompt."
          );
        } else {
          // 4) Extract base64 data from the first prediction
          const prediction = predictions[0];
          const b64Data =
            prediction.structValue?.fields?.bytesBase64Encoded?.stringValue;
          if (!b64Data) {
            throw new Error("Prediction did not contain base64 image data.");
          }

          // 5) Decode and write to a temporary file
          const buff = Buffer.from(b64Data, "base64");
          const tmpFilePath = path.join("/tmp", `${uuidv4()}.png`);
          fs.writeFileSync(tmpFilePath, buff);

          // 6) Upload the image to S3
          const s3Key = `imagenAi/${uuidv4()}.png`;
          await this.s3Service.uploadImageToS3(this.s3Bucket, tmpFilePath, s3Key);

          // 7) Construct a public URL (optionally using Cloudflare)
          if (process.env.CLOUDFLARE_IMAGE_PROXY_DOMAIN) {
            finalUrl = `https://${process.env.CLOUDFLARE_IMAGE_PROXY_DOMAIN}/${s3Key}`;
          } else {
            finalUrl = `https://${this.s3Bucket}.s3.amazonaws.com/${s3Key}`;
          }
        }
      } catch (error: any) {
        console.warn("Error generating image with Vertex AI Imagen. Will retry...");
        console.warn(error?.message || error);
      }

      // Retry logic
      if (!finalUrl) {
        retryCount++;
        const sleepingFor = 5000 + retryCount * 10000;
        console.debug(
          `Sleeping for ${sleepingFor} ms before retry #${retryCount}...`
        );
        await new Promise((resolve) => setTimeout(resolve, sleepingFor));
      }
    }

    if (!finalUrl) {
      console.error(`Failed to generate Imagen after ${retryCount} retries.`);
      return undefined;
    }

    return finalUrl;
  }
}
