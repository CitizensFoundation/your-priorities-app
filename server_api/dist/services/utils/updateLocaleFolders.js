import { YpLanguages } from "../../utils/ypLanguages.js";
import fs from "fs/promises";
import path from "path";
import log from "../../utils/loggerTs.js";
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
                log.info("Creating ---->:", localePath);
                await fs.mkdir(localePath, { recursive: true });
                await fs.writeFile(path.join(localePath, "translation.json"), "{}");
            }
            else {
                log.info("Path exists:", localePath);
            }
        }
        log.info("Locale folders and files have been created successfully.");
    }
    catch (error) {
        log.error("Error creating locale folders:", error);
    }
};
async function main() {
    await ensureAllLocaleFoldersAreCreated();
}
main()
    .then(() => log.info("I have updated the locale folders."))
    .catch((error) => log.error("Error in main:", error));
