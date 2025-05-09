// chatGptImageGenerator.ts
import { OpenAI } from "openai";
import { IImageGenerator, YpAiGenerateImageTypes } from "./iImageGenerator.js";

export class ChatGptImageGenerator implements IImageGenerator {
  private readonly maxRetryCount = 3;
  private readonly openAiKey?: string;

  constructor(openAiKey?: string) {
    // the SDK will fall back to process.env.OPENAI_API_KEY if nothing is passed
    this.openAiKey = openAiKey;
  }

  /**
   * Generates an image URL from a prompt using OpenAI’s gpt-image-1 model.
   * The returned link remains live for ~60 minutes – be sure to download
   * or cache it right away in the calling service.
   */
  async generateImageUrl(
    prompt: string,
    type: YpAiGenerateImageTypes = "logo"
  ): Promise<string | undefined> {
    const client = new OpenAI({ apiKey: this.openAiKey });

    // Pick a sensible canvas size from the image type
    let size:
      | "1024x1024"
      | "1792x1024"
      | "1024x1792"
      | "1536x1024"
      | "512x512"
      | "256x256" = "1536x1024";
    if (type === "icon") size = "1024x1024";
    else if (type === "other") size = "1536x1024";

    const finalPrompt = `
    ${prompt}

    Instruction: Create a high quality logo like image for the users project and follow their style instructions. \
    Do not add text to the images unless asked in the style instructions.
    `;

    let retryCount = 0;
    while (retryCount < this.maxRetryCount) {
      try {
        const res = await client.images.generate({
          model: "gpt-image-1",
          prompt: finalPrompt,
          quality: "medium",
          n: 1,
          size
        });

        const url = res?.data?.[0]?.url;
        if (url) return url;
        throw new Error("No URL returned");
      } catch (err) {
        retryCount += 1;
        if (retryCount >= this.maxRetryCount) {
          console.error(
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
