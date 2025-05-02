import { AzureOpenAI, OpenAI } from "openai";
export class DalleImageGenerator {
    constructor(azureOpenaAiBase, azureOpenAiApiKey, azureDalleDeployment, openAiKey) {
        this.maxRetryCount = 3;
        this.azureOpenaAiBase = azureOpenaAiBase;
        this.azureOpenAiApiKey = azureOpenAiApiKey;
        this.azureDalleDeployment = azureDalleDeployment;
        this.openAiKey = openAiKey;
    }
    async generateImageUrl(prompt, type = "logo") {
        let client;
        let result;
        let retryCount = 0;
        let retrying = true;
        // Decide which client to instantiate (Azure vs. standard OpenAI)
        if (this.azureOpenaAiBase && this.azureOpenAiApiKey && this.azureDalleDeployment) {
            client = new AzureOpenAI({
                apiKey: this.azureOpenAiApiKey,
                endpoint: this.azureOpenaAiBase,
                deployment: this.azureDalleDeployment,
                apiVersion: "2024-10-21",
            });
        }
        else {
            // fallback to standard OpenAI
            client = new OpenAI({
                apiKey: this.openAiKey,
            });
        }
        // Decide on image dimensions
        let size = "1792x1024";
        if (type === "logo") {
            size = "1792x1024";
        }
        else if (type === "icon") {
            size = "1024x1024";
        }
        const modelQuality = "standard";
        while (retrying && retryCount < this.maxRetryCount) {
            try {
                // If using Azure OpenAI
                if (this.azureOpenaAiBase && this.azureOpenAiApiKey && this.azureDalleDeployment) {
                    result = await client.images.generate({
                        prompt,
                        n: 1,
                        size,
                        quality: modelQuality,
                    });
                }
                else {
                    // Standard OpenAI
                    result = await client.images.generate({
                        model: "dall-e-3",
                        prompt,
                        n: 1,
                        size,
                        quality: modelQuality,
                    });
                }
                if (result) {
                    retrying = false;
                }
                else {
                    console.debug("Result: NONE");
                }
            }
            catch (error) {
                console.warn("Error generating image with DALL·E, retrying...");
                console.warn(error.stack);
                retryCount++;
                const sleepingFor = 5000 + retryCount * 10000;
                console.debug(`Sleeping for ${sleepingFor} milliseconds`);
                await new Promise((resolve) => setTimeout(resolve, sleepingFor));
            }
        }
        if (result && result.data && result.data[0].url) {
            return result.data[0].url;
        }
        else {
            console.error(`Error generating image after ${retryCount} retries`);
            return undefined;
        }
    }
}
