import { jsonrepair } from "jsonrepair";
import { OpenAI } from "openai";
import ISO6391 from "iso-639-1";
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";
const readFilePromise = promisify(fs.readFile);
const writeFilePromise = promisify(fs.writeFile);
export class YpLocaleTranslation {
    constructor() {
        this.modelName = "gpt-4-0125-preview";
        this.maxTokens = 4000;
        this.temperature = 0.0;
        this.openaiClient = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    async loadAndCompareTranslations() {
        const localesDir = "./locales";
        const baseTranslationPath = path.join(localesDir, "en/translation.json");
        const baseTranslation = await this.loadJsonFile(baseTranslationPath);
        const localeDirs = fs
            .readdirSync(localesDir)
            .filter((file) => fs.statSync(path.join(localesDir, file)).isDirectory());
        for (const localeDir of localeDirs) {
            if (localeDir !== "is")
                continue; // Skip English since it's the base
            console.log(`Processing locale: ${localeDir}`);
            const translationFilePath = path.join(localesDir, localeDir, "translation.json");
            let translation = await this.loadJsonFile(translationFilePath);
            translation = this.updateWithMissingKeys(baseTranslation, translation);
            console.log(`Updated translation for ${localeDir}:`, translation);
            const missingTranslations = this.extractMissingTranslations(baseTranslation, translation);
            // Chunk the missing translations
            const chunks = this.chunkArray(missingTranslations, 15);
            for (const chunk of chunks) {
                // Prepare the texts for translation
                const textsToTranslate = chunk.map((key) => translation[key] || "");
                // Call your translateUITexts method
                const translations = await this.translateUITexts(localeDir, textsToTranslate);
                // Update the translation with the new texts
                chunk.forEach((key, index) => {
                    if (translations && translations[index]) {
                        this.setValueAtPath(translation, key, translations[index]);
                    }
                });
                console.log(`Updated translation for ${localeDir}:`, translation);
                await writeFilePromise(translationFilePath, JSON.stringify(translation, null, 2));
            }
        }
    }
    // Utility method to safely set a value at a given path in a nested object
    setValueAtPath(obj, path, value) {
        const keys = path.split(".");
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (current[key] === undefined)
                current[key] = {};
            current = current[key];
        }
        current[keys[keys.length - 1]] = value;
    }
    async loadJsonFile(filePath) {
        const fileContent = await readFilePromise(filePath, "utf8");
        return JSON.parse(fileContent);
    }
    updateWithMissingKeys(baseTranslation, targetTranslation, path = []) {
        // Create a deep copy of the targetTranslation to avoid mutating the original object
        const updatedTranslation = JSON.parse(JSON.stringify(targetTranslation));
        const updateRecursively = (base, target, currentPath) => {
            Object.keys(base).forEach((key) => {
                const fullPath = currentPath.concat(key).join(".");
                if (!target.hasOwnProperty(key) ||
                    target[key] === "" ||
                    target[key] === null) {
                    // If the key is missing in the target, or has an empty/null value, add it from the base
                    console.log(`Updating missing or empty key at path: ${fullPath}`);
                    target[key] = base[key];
                }
                else if (typeof base[key] === "object" &&
                    base[key] !== null &&
                    typeof target[key] === "object" &&
                    target[key] !== null) {
                    // If both the base and target values are objects (and not null), recurse
                    updateRecursively(base[key], target[key], currentPath.concat(key));
                } // No else condition required for primitive types as we only update missing or empty keys
            });
        };
        updateRecursively(baseTranslation, updatedTranslation, []);
        return updatedTranslation;
    }
    extractMissingTranslations(baseTranslation, targetTranslation) {
        const missingTranslations = [];
        const findMissing = (base, target, path = []) => {
            Object.keys(base).forEach((key) => {
                const newPath = path.concat(key); // Construct the new path for nested keys
                if (typeof base[key] === "object" &&
                    base[key] !== null &&
                    typeof target[key] === "object" &&
                    target[key] !== null) {
                    // If both are objects, recurse into nested objects
                    findMissing(base[key], target[key], newPath);
                }
                else if (!target.hasOwnProperty(key) || // Key is missing in target
                    target[key] === "" // Target key's value is an empty string
                ) {
                    missingTranslations.push(newPath.join(".")); // Add the path of the missing translation to the list
                }
                // Removed the check for identical values to base[key] to avoid false positives
            });
        };
        findMissing(baseTranslation, targetTranslation, []);
        return missingTranslations;
    }
    chunkArray(array, size) {
        return array.reduce((acc, val, i) => {
            let idx = Math.floor(i / size);
            let page = acc[idx] || (acc[idx] = []);
            page.push(val);
            return acc;
        }, []);
    }
    renderSystemPrompt() {
        return `You are a helpful mobile app translation assistant that knows all the world languages.

INPUTS:
The user will tell us the Language to translate to.

You will get JSON with an array of strings to translate:
[
  "string",
  ...
]

OUTPUT:
You will output JSON string array in the same order as the input array.
[
  "string",
  ...
]


INSTRUCTIONS:
You must keep the translated text short, if there is one word in English, it should be one word in the other language. This is UI text for a mobile web app.
Always output only JSON.`;
    }
    renderUserMessage(language, textsToTranslate) {
        return `Language to translate to: ${language}

UI texts to translate in JSON Input:
${JSON.stringify(textsToTranslate, null, 2)}

Your ${language} UI texts JSON output:`;
    }
    async translateUITexts(languageIsoCode, textsToTranslate) {
        try {
            console.log(`translateTexts: ${JSON.stringify(textsToTranslate)} ${languageIsoCode}`);
            const languageName = ISO6391.getName(languageIsoCode) ||
                ISO6391.getName(languageIsoCode.toLowerCase()) ||
                ISO6391.getName(languageIsoCode.substring(0, 2)) ||
                ISO6391.getName(languageIsoCode.substring(0, 2).toLowerCase()) ||
                "en";
            return await this.callLlm(languageName, textsToTranslate);
        }
        catch (error) {
            console.error("Error in getAnswerIdeas:", error);
            return undefined;
        }
    }
    async callLlm(languageName, inObject) {
        const messages = [
            {
                role: "system",
                content: this.renderSystemPrompt(),
            },
            {
                role: "user",
                content: this.renderUserMessage(languageName, inObject),
            },
        ];
        const maxRetries = 3;
        let retries = 0;
        let running = true;
        while (running) {
            try {
                console.log(`Messages ${retries}:`, messages);
                const results = await this.openaiClient.chat.completions.create({
                    model: this.modelName,
                    messages,
                    max_tokens: this.maxTokens,
                    temperature: this.temperature,
                });
                console.log("Results:", results);
                const textJson = results.choices[0].message.content;
                console.log("Text JSON:", textJson);
                if (textJson) {
                    let cleanText = textJson;
                    // Detect and remove markdown code block syntax if present
                    if (cleanText.startsWith("```json") && cleanText.endsWith("```")) {
                        cleanText = cleanText.substring(7, cleanText.length - 3).trim(); // Remove the surrounding markers
                    }
                    let translationData = [];
                    try {
                        translationData = JSON.parse(jsonrepair(cleanText));
                        console.log("Parsed Translation Data:", translationData);
                    }
                    catch (error) {
                        console.error("Error parsing cleaned text as JSON:", error);
                    }
                    if (translationData) {
                        running = false;
                        return translationData;
                    }
                }
                else {
                    throw new Error("No content in response");
                }
            }
            catch (error) {
                console.error("Error in getChoiceTranslation:", error);
                retries++;
                if (retries > maxRetries) {
                    running = false;
                    return undefined;
                }
            }
        }
        return undefined;
    }
}
(async () => {
    const translator = new YpLocaleTranslation();
    await translator.loadAndCompareTranslations();
})();
//# sourceMappingURL=updateAllLocalesFromEn.js.map