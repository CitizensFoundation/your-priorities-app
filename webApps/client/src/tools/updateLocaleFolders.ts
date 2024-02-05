import { YpLanguages } from "../common/ypLanguages.js";

async function main(): Promise<void> {
  const languages = new YpLanguages();
  await languages.ensureAllLocaleFoldersAreCreated();
}

main()
  .then(() => console.log("I have updated the locale folders."))
  .catch((error) => console.error("Error in main:", error));
