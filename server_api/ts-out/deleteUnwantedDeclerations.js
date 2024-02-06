const fs = require('fs');
const path = require('path');
const tsOutDir = './ts-out';
const keepDeclarations = new Set([
    "app.d.ts",
    "server.d.ts",
    path.join("active-citizen", "workers", "generativeAi.d.ts") // Ensure correct path format
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
                console.log(`Deleted: ${filePath}`);
            }
        }
    });
}
// Start the deletion process
deleteDtsFiles(tsOutDir);
export {};
