import * as fs from "fs";
import * as path from "path";
// Define paths
const srcDirectory = "./src/";
const translationFilePath = "./locales/en/translation.json";
const outputFilePath = "/tmp/translation.json";
// Function to recursively find .js and .ts files
function findFiles(directory, extensionRegex, foundFiles = []) {
    return new Promise((resolve, reject) => {
        fs.readdir(directory, { withFileTypes: true }, (err, files) => {
            if (err) {
                return reject(err);
            }
            // Process each file or directory
            const promises = files.map((file) => {
                const filePath = path.join(directory, file.name);
                if (file.isDirectory()) {
                    // Recurse into subdirectories
                    return findFiles(filePath, extensionRegex, foundFiles);
                }
                else if (extensionRegex.test(file.name)) {
                    // Add file if it matches .js or .ts
                    foundFiles.push(filePath);
                }
                return Promise.resolve();
            });
            // Wait for all files and subdirectories to be processed
            Promise.all(promises)
                .then(() => resolve(foundFiles))
                .catch(reject);
        });
    });
}
// Function to read file content
async function readFileContent(filePath) {
    return fs.promises.readFile(filePath, "utf8");
}
// Function to extract translation keys using regex
function extractTranslationKeys(fileContent) {
    const keys = [];
    // Updated regex to match all specified patterns, including the new name pattern
    const regex = /this\.t\(['"`](.*?)['"`]\)|\[\[t\(['"`](.*?)['"`]\)\]\]|\{\{t\(['"`](.*?)['"`]\)\}\}|translationToken:\s*['"`](.*?)['"`]|text:\s*['"`](.*?)['"`],|name:\s*['"`](.*?)['"`]/g;
    let match;
    while ((match = regex.exec(fileContent)) !== null) {
        // Since there are multiple capturing groups for different patterns,
        // find the first non-undefined group to determine the matched key.
        const key = match.slice(1).find((m) => m !== undefined);
        if (key) {
            keys.push(key);
        }
    }
    return keys;
}
// Function to read and parse the translation file
async function readTranslationFile(filePath) {
    const content = await fs.promises.readFile(filePath, "utf8");
    return JSON.parse(content);
}
// Function to save the updated translation file
async function saveUpdatedTranslationFile(filePath, content) {
    await fs.promises.writeFile(filePath, JSON.stringify(content, null, 2));
}
// Function to deeply check and remove unused keys, and count changes
// Function to deeply check and remove unused keys, and count changes
function updateTranslations(usedKeys, translations) {
    let deletedCount = 0;
    let newCount = 0;
    function traverseTranslations(keys, current, path) {
        return Object.fromEntries(Object.entries(current).flatMap(([key, value]) => {
            const fullPath = path ? `${path}.${key}` : key;
            if (typeof value === "object" &&
                value !== null &&
                !Array.isArray(value)) {
                return [[key, traverseTranslations(keys, value, fullPath)]];
            }
            else {
                if (keys.has(fullPath)) {
                    return [[key, value]];
                }
                else {
                    deletedCount++;
                    return [];
                }
            }
        }));
    }
    function findNewKeys(keys, current, path) {
        keys.forEach((key) => {
            const keyPath = key.split('.');
            let tempCurrent = current;
            for (let i = 0; i < keyPath.length; i++) {
                const part = keyPath[i];
                // Ensure the current part of the path exists before trying to access it
                if (typeof tempCurrent !== 'object' || tempCurrent === null) {
                    console.warn(`Warning: Trying to access or create a property on a non-object or null at path: '${keyPath.slice(0, i).join('.')}'.`);
                    // Initialize the current path as an object to continue traversal
                    tempCurrent = {};
                }
                if (i === keyPath.length - 1) {
                    // We're at the end of the path, so add the key if it doesn't exist
                    if (tempCurrent[part] === undefined) {
                        tempCurrent[part] = `${key}`;
                        newCount++;
                    }
                }
                else {
                    // Not at the end, so ensure there's an object to traverse into
                    if (tempCurrent[part] === undefined) {
                        tempCurrent[part] = {};
                    }
                    else if (typeof tempCurrent[part] === 'string') {
                        // We've encountered a string where we expected an object, so report the conflict
                        console.warn(`Warning: The key '${keyPath.slice(0, i + 1).join('.')}' is expected to be an object, but it is a string.`);
                        // Rename the key and initialize as an object to resolve the conflict
                        const newKey = `${part}Tree`;
                        if (tempCurrent[newKey] === undefined) {
                            tempCurrent[newKey] = {};
                        }
                        tempCurrent[newKey][keyPath[i + 1]] = tempCurrent[part];
                        delete tempCurrent[part];
                        tempCurrent = tempCurrent[newKey];
                        continue;
                    }
                }
                // Proceed to the next part of the path
                tempCurrent = tempCurrent[part];
            }
        });
    }
    const updatedTranslations = traverseTranslations(new Set(usedKeys), translations, "");
    findNewKeys(new Set(usedKeys), updatedTranslations, "");
    return { updatedTranslations, deletedCount, newCount };
}
// Main function to process translations
async function processTranslations() {
    try {
        const srcDirectory = "./src";
        const extensionsRegex = /\.(js|ts)$/;
        let files = await findFiles(srcDirectory, extensionsRegex);
        console.log(`Found ${files.length} files.`);
        let moreFile = await findFiles("../old/clientApp/src/", /\.(html)$/);
        console.log(`Found more ${moreFile.length} files.`);
        files = files.concat(moreFile);
        const translationKeys = new Set();
        const translations = await readTranslationFile(translationFilePath);
        for (const file of files) {
            const content = await readFileContent(file);
            const keys = extractTranslationKeys(content);
            keys.forEach((key) => translationKeys.add(key));
        }
        const { updatedTranslations, deletedCount, newCount } = updateTranslations(Array.from(translationKeys), translations);
        await saveUpdatedTranslationFile(outputFilePath, updatedTranslations);
        console.log(`Translation file has been updated. New tokens: ${newCount}, Deleted tokens: ${deletedCount}`);
    }
    catch (error) {
        console.error("Error processing translations:", error);
    }
}
// Execute the main function
processTranslations();
//# sourceMappingURL=syncEnLocale.js.map