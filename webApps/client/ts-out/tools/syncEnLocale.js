import * as fs from 'fs';
import * as path from 'path';
// Define paths
const srcDirectory = './src/';
const translationFilePath = './locales/en/translation.json';
const outputFilePath = '/tmp/translation.json';
// Function to recursively find .js and .ts files
function findFiles(directory, extensionRegex, foundFiles = []) {
    return new Promise((resolve, reject) => {
        fs.readdir(directory, { withFileTypes: true }, (err, files) => {
            if (err) {
                return reject(err);
            }
            // Process each file or directory
            const promises = files.map(file => {
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
            Promise.all(promises).then(() => resolve(foundFiles)).catch(reject);
        });
    });
}
// Function to read file content
async function readFileContent(filePath) {
    return fs.promises.readFile(filePath, 'utf8');
}
// Function to extract translation keys using regex
function extractTranslationKeys(fileContent) {
    const regex = /this\.t\(['"`](.*?)['"`]\)/g;
    const keys = [];
    let match;
    while ((match = regex.exec(fileContent)) !== null) {
        keys.push(match[1]);
    }
    return keys;
}
// Function to read and parse the translation file
async function readTranslationFile(filePath) {
    const content = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(content);
}
// Function to save the updated translation file
async function saveUpdatedTranslationFile(filePath, content) {
    await fs.promises.writeFile(filePath, JSON.stringify(content, null, 2));
}
// Function to deeply check and remove unused keys, and count changes
function updateTranslations(usedKeys, translations) {
    const result = {};
    let deletedCount = 0;
    let newCount = 0;
    const checkAndUpdate = (keys, current, currentResult, path) => {
        Object.keys(current).forEach(key => {
            const newPath = path ? `${path}.${key}` : key;
            if (keys.includes(newPath)) {
                currentResult[key] = current[key];
            }
            else {
                deletedCount++;
            }
        });
        keys.forEach(key => {
            if (!current[key]) {
                newCount++;
                // Assuming you want to add new keys with a placeholder value
                currentResult[key] = `${key}`;
            }
        });
    };
    checkAndUpdate(usedKeys, translations, result, '');
    return { updatedTranslations: result, deletedCount, newCount };
}
// Main function to process translations
async function processTranslations() {
    try {
        const srcDirectory = './src';
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
            keys.forEach(key => translationKeys.add(key));
        }
        const { updatedTranslations, deletedCount, newCount } = updateTranslations(Array.from(translationKeys), translations);
        await saveUpdatedTranslationFile(outputFilePath, updatedTranslations);
        console.log(`Translation file has been updated. New tokens: ${newCount}, Deleted tokens: ${deletedCount}`);
    }
    catch (error) {
        console.error('Error processing translations:', error);
    }
}
// Execute the main function
processTranslations();
//# sourceMappingURL=syncEnLocale.js.map