"use strict";
const fs = require('fs');
const path = require('path');
const log = require('./utils/logger.cjs');
const tsOutDir = './ts-out';
const keepDeclarations = new Set([
    "app.d.ts",
    "server.d.ts",
    path.join("services", "llms", "baseChatBot.d.ts"),
    path.join("services", "llms", "llmTranslation.d.ts"),
    path.join("services", "engine", "allOurIdeas", "aiHelper.d.ts"),
    path.join("services", "engine", "allOurIdeas", "iconGenerator.d.ts"),
    path.join("services", "engine", "allOurIdeas", "explainAnswerAssistant.d.ts"),
    path.join("utils", "loggerTs.d.ts"),
    path.join("utils", "ypLanguages.d.ts"),
    path.join("services", "utils", "updateAllLocalesFromEn.d.ts"),
    path.join("services", "utils", "updateLocaleFolders.d.ts"),
]);
// Function to delete files recursively in a directory
function deleteDtsFiles(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            // Recurse into a subdirectory
            deleteDtsFiles(filePath);
        }
        else {
            // Construct a relative path for the current file
            const relativePath = path.relative(tsOutDir, filePath);
            // Delete the file if it ends with .d.ts and not in the keep list
            if (file.endsWith('.d.ts') && !keepDeclarations.has(relativePath)) {
                fs.unlinkSync(filePath);
                log.info(`Deleted: ${filePath}`);
            }
            if (file.endsWith('.d.cts') && !keepDeclarations.has(relativePath)) {
                fs.unlinkSync(filePath);
                log.info(`Deleted: ${filePath}`);
            }
            if (file.endsWith('.js.map') && !keepDeclarations.has(relativePath)) {
                fs.unlinkSync(filePath);
                log.info(`Deleted: ${filePath}`);
            }
            if (file.endsWith('.cjs.map') && !keepDeclarations.has(relativePath)) {
                fs.unlinkSync(filePath);
                log.info(`Deleted: ${filePath}`);
            }
            if (file.endsWith('.cts.map') && !keepDeclarations.has(relativePath)) {
                fs.unlinkSync(filePath);
                log.info(`Deleted: ${filePath}`);
            }
        }
    });
}
// Start the deletion process
deleteDtsFiles(tsOutDir);
