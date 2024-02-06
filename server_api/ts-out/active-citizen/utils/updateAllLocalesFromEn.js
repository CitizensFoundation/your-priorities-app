"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YpLocaleTranslation = void 0;
const jsonrepair_1 = require("jsonrepair");
const openai_1 = require("openai");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const util_1 = require("util");
const ypLanguages_js_1 = require("../../utils/ypLanguages.js");
const readFilePromise = (0, util_1.promisify)(fs.readFile);
const writeFilePromise = (0, util_1.promisify)(fs.writeFile);
class YpLocaleTranslation {
    openaiClient;
    modelName = "gpt-4-0125-preview";
    maxTokens = 4000;
    temperature = 0.0;
    constructor() {
        this.openaiClient = new openai_1.OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    getValueByPath(obj, path) {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj) || "";
    }
    async loadAndCompareTranslations() {
        const localesDir = "./locales";
        const baseTranslationPath = path.join(localesDir, "en/translation.json");
        const baseTranslation = await this.loadJsonFile(baseTranslationPath);
        const localeDirs = fs
            .readdirSync(localesDir)
            .filter((file) => fs.statSync(path.join(localesDir, file)).isDirectory());
        for (const localeDir of localeDirs) {
            if (localeDir === "en")
                continue; // Skip English since it's the base
            console.log(`Processing locale: ${localeDir}`);
            const translationFilePath = path.join(localesDir, localeDir, "translation.json");
            let translation = await this.loadJsonFile(translationFilePath);
            translation = this.updateWithMissingKeys(baseTranslation, translation);
            console.log(`Updated translation for ${localeDir}:`);
            const missingTranslations = this.extractMissingTranslations(baseTranslation, translation);
            // Chunk the missing translations
            const chunks = this.chunkArray(missingTranslations, 15);
            console.log(`Missing translations for ${localeDir}:`, missingTranslations, chunks);
            for (const chunk of chunks) {
                //console.log(`Translating chunk: ${JSON.stringify(chunk)}`); // Log the chunk before translation
                // Prepare the texts for translation
                const textsToTranslate = chunk.map((key) => this.getValueByPath(translation, key));
                // Call your translateUITexts method
                const translations = await this.translateUITexts(localeDir, textsToTranslate);
                // Update the translation with the new texts
                chunk.forEach((key, index) => {
                    if (translations && translations[index]) {
                        this.setValueAtPath(translation, key, translations[index]);
                    }
                });
                //console.log(`Chunk after translation: ${JSON.stringify(chunk)}`); // Log the chunk after translation
                console.log(`Updated translation for ${localeDir}:`);
                await writeFilePromise(translationFilePath, JSON.stringify(translation, null, 2));
            }
        }
    }
    setValueAtPath(obj, path, value) {
        //console.log(`Setting value at path: ${path} to '${value}'`); // Debugging log
        const keys = path.split(".");
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
                current[key] = {};
            }
            current = current[key];
        }
        current[keys[keys.length - 1]] = value;
    }
    async loadJsonFile(filePath) {
        const fileContent = await readFilePromise(filePath, "utf8");
        return JSON.parse(fileContent);
    }
    updateWithMissingKeys(baseTranslation, targetTranslation, path = []) {
        const updatedTranslation = JSON.parse(JSON.stringify(targetTranslation)); // Deep copy to avoid mutating the original
        const updateRecursively = (base, target, currentPath) => {
            Object.keys(base).forEach((key) => {
                const newPath = currentPath.concat(key); // Prepare the new path for potential recursive update
                if (typeof base[key] === "object" && base[key] !== null) {
                    // If the base key is an object, ensure the target has a corresponding object
                    if (!target.hasOwnProperty(key) || typeof target[key] !== "object" || target[key] === null) {
                        console.log(`Creating missing object at path: ${newPath.join(".")}`);
                        target[key] = {}; // Initialize missing object
                    }
                    updateRecursively(base[key], target[key], newPath); // Recurse into objects
                }
                else if (!target.hasOwnProperty(key) || target[key] === "" || target[key] === null) {
                    // If the key is missing or empty in the target, update it from the base
                    console.log(`Updating missing or empty key at path: ${newPath.join(".")}`);
                    target[key] = base[key];
                }
                // No action needed for non-empty, non-object fields; they're already present and not empty
            });
        };
        updateRecursively(baseTranslation, updatedTranslation, []);
        return updatedTranslation;
    }
    excludeKeysFromTranslation = [
        "facebook",
        "twitter",
        "linkedin",
        "adwords",
        "snapchat",
        "instagram",
        "youtube",
        "tiktok",
        "allOurIdeas"
    ];
    extractMissingTranslations(baseTranslation, targetTranslation) {
        const missingTranslations = [];
        const findMissing = (base, target, path = []) => {
            Object.keys(base).forEach((key) => {
                const newPath = path.concat(key);
                if (typeof base[key] === "object" &&
                    base[key] !== null &&
                    typeof target[key] === "object" &&
                    target[key] !== null) {
                    // Recurse into nested objects
                    findMissing(base[key], target[key], newPath);
                }
                else if (!target.hasOwnProperty(key) ||
                    target[key] === base[key] ||
                    target[key] === "") {
                    // If the key is missing, the value is the same as the base, or the value is an empty string
                    if (!this.excludeKeysFromTranslation.includes(key)) {
                        missingTranslations.push(newPath.join("."));
                    }
                }
            });
        };
        findMissing(baseTranslation, targetTranslation);
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
        return `You are a helpful website backend translation assistant that knows all the world languages.

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
Do not translate brand names including ours: All Our Ideas and Your Priorities.
Always output only a JSON string array.`;
    }
    renderUserMessage(language, textsToTranslate) {
        return `Language to translate to: ${language}

Website backend texts to translate in JSON Input:
${JSON.stringify(textsToTranslate, null, 2)}

Your ${language} website backend texts JSON output:`;
    }
    async translateUITexts(languageIsoCode, textsToTranslate) {
        try {
            console.log(`translateTexts: ${JSON.stringify(textsToTranslate)} ${languageIsoCode}`);
            const languageName = ypLanguages_js_1.YpLanguages.getEnglishName(languageIsoCode) ||
                languageIsoCode;
            console.log("LANGUAGE NAME:", languageName);
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
                        translationData = JSON.parse((0, jsonrepair_1.jsonrepair)(cleanText));
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
                console.error("Error:", error);
                retries++;
                if (retries > maxRetries) {
                    console.error("Max retries reached");
                    running = false;
                    return undefined;
                }
            }
        }
        return undefined;
    }
}
exports.YpLocaleTranslation = YpLocaleTranslation;
(async () => {
    const translator = new YpLocaleTranslation();
    await translator.loadAndCompareTranslations();
})();
