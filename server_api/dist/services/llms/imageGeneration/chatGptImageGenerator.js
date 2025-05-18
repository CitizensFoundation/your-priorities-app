// chatGptImageGenerator.ts
import { OpenAI } from "openai";
export class ChatGptImageGenerator {
    constructor(openAiKey) {
        this.maxRetryCount = 3;
        // the SDK will fall back to process.env.OPENAI_API_KEY if nothing is passed
        this.openAiKey = openAiKey;
    }
    /**
     * Generates an image URL from a prompt using OpenAI's gpt-image-1 model.
     * The returned link remains live for ~60 minutes – be sure to download
     * or cache it right away in the calling service.
     */
    async generateImageUrl(prompt, type = "logo") {
        const client = new OpenAI({ apiKey: this.openAiKey });
        // Pick a sensible canvas size from the image type
        let size = "1536x1024";
        if (type === "icon")
            size = "1024x1024";
        else if (type === "other")
            size = "1536x1024";
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
                    size,
                });
                console.log("res", JSON.stringify(res, null, 2));
                const b64Json = res?.data?.[0]?.b64_json;
                if (b64Json) {
                    // Assuming the image is a PNG, adjust if another format is expected
                    return `data:image/png;base64,${b64Json}`;
                }
                throw new Error("No b64_json returned");
            }
            catch (err) {
                retryCount += 1;
                if (retryCount >= this.maxRetryCount) {
                    console.error(`ChatGptImageGenerator failed after ${retryCount} attempts`, err);
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
