import { YpLanguages } from "../common/languages/ypLanguages.js";
import fs from "fs/promises";
import path from "path";
const ensureAllLocaleFoldersAreCreated = async () => {
    const localesPath = path.join(process.cwd(), "locales");
    try {
        await fs.mkdir(localesPath, { recursive: true });
        for (const language of YpLanguages.allLanguages) {
            const localePath = path.join(localesPath, language.code.replace("-", "_"));
            const pathExists = await fs
                .access(localePath)
                .then(() => true)
                .catch(() => false);
            if (!pathExists) {
                console.log("Creating ---->:", localePath);
                await fs.mkdir(localePath, { recursive: true });
                await fs.writeFile(path.join(localePath, "translation.json"), "{}");
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
//# sourceMappingURL=updateLocaleFolders.js.map