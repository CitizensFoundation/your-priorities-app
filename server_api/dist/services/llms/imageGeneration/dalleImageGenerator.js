import { AzureOpenAI, OpenAI } from "openai";
import log from "../../../utils/loggerTs.js";
import imageModelConfig from "./imageModelConfig.cjs";
const { getDefaultImageQualityForOptions, getDefaultImageSizeForOptions, } = imageModelConfig;
export class DalleImageGenerator {
    constructor(azureOpenaAiBase, azureOpenAiApiKey, azureDalleDeployment, openAiKey) {
        this.maxRetryCount = 3;
        this.azureOpenaAiBase = azureOpenaAiBase;
        this.azureOpenAiApiKey = azureOpenAiApiKey;
        this.azureDalleDeployment = azureDalleDeployment;
        this.openAiKey = openAiKey;
    }
    async generateImageUrl(prompt, type = "logo", options) {
        let client;
        let result;
        let retryCount = 0;
        let retrying = true;
        const hasAzureOpenAiConfig = Boolean(this.azureOpenaAiBase &&
            this.azureOpenAiApiKey &&
            this.azureDalleDeployment);
        const useAzureOpenAi = options?.imageProvider === "azureOpenai" ||
            (!options?.imageProvider && hasAzureOpenAiConfig);
        const requestedModel = options?.imageModel ||
            (useAzureOpenAi ? this.azureDalleDeployment : undefined) ||
            "dall-e-3";
        const imageProvider = useAzureOpenAi ? "azureOpenai" : "openai";
        // Decide which client to instantiate (Azure vs. standard OpenAI)
        if (useAzureOpenAi) {
            if (!this.azureOpenaAiBase || !this.azureOpenAiApiKey) {
                log.error("Azure OpenAI image generator is not configured.");
                return undefined;
            }
            client = new AzureOpenAI({
                apiKey: this.azureOpenAiApiKey,
                endpoint: this.azureOpenaAiBase,
                deployment: requestedModel,
                apiVersion: "2024-10-21",
            });
        }
        else {
            // fallback to standard OpenAI
            client = new OpenAI({
                apiKey: this.openAiKey,
            });
        }
        const size = options?.imageSize ||
            getDefaultImageSizeForOptions(imageProvider, requestedModel, type) ||
            "1792x1024";
        const modelQuality = options?.imageQuality ||
            getDefaultImageQualityForOptions(imageProvider, requestedModel) ||
            "standard";
        while (retrying && retryCount < this.maxRetryCount) {
            try {
                // If using Azure OpenAI
                if (useAzureOpenAi) {
                    result = await client.images.generate({
                        prompt,
                        n: 1,
                        size: size,
                        quality: modelQuality,
                    });
                }
                else {
                    // Standard OpenAI
                    result = await client.images.generate({
                        model: requestedModel,
                        prompt,
                        n: 1,
                        size: size,
                        quality: modelQuality,
                    });
                }
                if (result) {
                    retrying = false;
                }
                else {
                    log.debug("Result: NONE");
                }
            }
            catch (error) {
                log.warn("Error generating image with DALL·E, retrying...");
                log.warn(error.stack);
                retryCount++;
                const sleepingFor = 5000 + retryCount * 10000;
                log.debug(`Sleeping for ${sleepingFor} milliseconds`);
                await new Promise((resolve) => setTimeout(resolve, sleepingFor));
            }
        }
        if (result && result.data && result.data[0].url) {
            return result.data[0].url;
        }
        else {
            log.error(`Error generating image after ${retryCount} retries`);
            return undefined;
        }
    }
}
