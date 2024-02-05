import { YpLanguages } from "../common/ypLanguages.js";
async function main() {
    const languages = new YpLanguages();
    await languages.ensureAllLocaleFoldersAreCreated();
}
main()
    .then(() => console.log("I have updated the locale folders."))
    .catch((error) => console.error("Error in main:", error));
//# sourceMappingURL=updateLocaleFolders.js.map