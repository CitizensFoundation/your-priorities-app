"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ypLanguages_js_1 = require("../../utils/ypLanguages.js");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const ensureAllLocaleFoldersAreCreated = async () => {
    const localesPath = path_1.default.join(process.cwd(), "locales");
    try {
        await promises_1.default.mkdir(localesPath, { recursive: true });
        for (const language of ypLanguages_js_1.YpLanguages.allLanguages) {
            const localePath = path_1.default.join(localesPath, language.code.replace("-", "_"));
            const pathExists = await promises_1.default
                .access(localePath)
                .then(() => true)
                .catch(() => false);
            if (!pathExists) {
                console.log("Creating ---->:", localePath);
                await promises_1.default.mkdir(localePath, { recursive: true });
                await promises_1.default.writeFile(path_1.default.join(localePath, "translation.json"), "{}");
            }
            else {
                console.log("Path exists:", localePath);
            }
        }
        console.log("Locale folders and files have been created successfully.");
    }
    catch (error) {
        console.error("Error creating locale folders:", error);
    }
};
async function main() {
    await ensureAllLocaleFoldersAreCreated();
}
main()
    .then(() => console.log("I have updated the locale folders."))
    .catch((error) => console.error("Error in main:", error));
