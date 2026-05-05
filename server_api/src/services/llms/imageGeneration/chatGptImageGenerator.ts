// chatGptImageGenerator.ts
import { OpenAI } from "openai";
import {
  IImageGenerator,
  YpAiGenerateImageTypes,
  YpImageGenerationOptions,
} from "./iImageGenerator.js";
import log from "../../../utils/loggerTs.js";
import imageModelConfig from "./imageModelConfig.cjs";

const {
  defaultOpenAiImageModel,
  getDefaultImageQualityForOptions,
  getDefaultImageSizeForOptions,
} = imageModelConfig;

export class ChatGptImageGenerator implements IImageGenerator {
  private readonly maxRetryCount = 3;
  private readonly openAiKey?: string;

  constructor(openAiKey?: string) {
    // the SDK will fall back to process.env.OPENAI_API_KEY if nothing is passed
    this.openAiKey = openAiKey;
  }

  /**
   * Generates an image URL from a prompt using OpenAI's gpt-image-1 model.
   * The returned link remains live for ~60 minutes – be sure to download
   * or cache it right away in the calling service.
   */
  async generateImageUrl(
    prompt: string,
    type: YpAiGenerateImageTypes = "logo",
    options?: YpImageGenerationOptions
  ): Promise<string | undefined> {
    const client = new OpenAI({ apiKey: this.openAiKey });
    const model = options?.imageModel || defaultOpenAiImageModel;

    const size =
      options?.imageSize ||
      getDefaultImageSizeForOptions("openai", model, type) ||
      "1536x1024";
    const quality =
      options?.imageQuality ||
      getDefaultImageQualityForOptions("openai", model) ||
      "medium";

    const finalPrompt = `
    ${prompt}

    Instruction: Create a high quality logo like image for the users project and follow their style instructions. \
    Do not add text to the images unless asked in the style instructions.
    `;

    let retryCount = 0;
    while (retryCount < this.maxRetryCount) {
      try {
        const res = await client.images.generate({
          model,
          prompt: finalPrompt,
          quality: quality as "auto" | "low" | "medium" | "high",
          n: 1,
          size: size as
            | "auto"
            | "1024x1024"
            | "1536x1024"
            | "1024x1536",
        });

        log.info("res", JSON.stringify(res, null, 2));

        const b64Json = res?.data?.[0]?.b64_json;
        if (b64Json) {
          // Assuming the image is a PNG, adjust if another format is expected
          return `data:image/png;base64,${b64Json}`;
        }
        throw new Error("No b64_json returned");
      } catch (err) {
        retryCount += 1;
        if (retryCount >= this.maxRetryCount) {
          log.error(
            `ChatGptImageGenerator failed after ${retryCount} attempts`,
            err
          );
          return undefined;
        }
        // Exponential back-off – starts at 5 s and grows +5 s each retry
        await new Promise((r) => setTimeout(r, 5000 + retryCount * 5000));
      }
    }
    return undefined;
  }
}
export default ChatGptImageGenerator;
