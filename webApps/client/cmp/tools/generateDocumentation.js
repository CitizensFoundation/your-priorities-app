const systemPromptWebApp = `
You are a detail oriented document generator that generates API documentation in the standard Markdown API documentation format.

Example markdown format:
# ClassName

Brief description of the class.

## Properties

| Name          | Type   | Description               |
|---------------|--------|---------------------------|
| propertyName  | type   | Brief description.        |

## Methods

| Name       | Parameters        | Return Type | Description                 |
|------------|-------------------|-------------|-----------------------------|
| methodName | param1: type, ... | returnType  | Brief description of method |

## Events (if any)

- **eventName**: Description of when and why the event is emitted.

## Examples

\`\`\`typescript
// Example usage of the web component
\`\`\`

For Type use the Typescript definition like for currentMemory use IEngineInnovationMemoryData | undefined

Do not output other sections

You MUST output the full detailed documentation for the typescript file the user submits.
`;
const indexHeader = '# Policy Synth WebApp API Documentation\n\n';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { OpenAI } from 'openai';
const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const rootDir = process.cwd();
const docsDir = path.join(rootDir, 'docs');
const checksumDir = path.join(docsDir, 'cks');
// Ensure the docs and checksum directories exist
if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
}
if (!fs.existsSync(checksumDir)) {
    fs.mkdirSync(checksumDir, { recursive: true });
}
function buildDirectoryTree(dir, basePath = '', isSrc = false) {
    let structure = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    entries.forEach((entry) => {
        if (entry.name === 'cks' ||
            entry.name.endsWith('all.ts') ||
            entry.name.endsWith('test.ts') ||
            entry.name === 'README.md' ||
            entry.name.endsWith('.d.ts') ||
            entry.name.startsWith('.')) {
            console.log(`Skipping ${entry.name}`);
            return; // skip cks directory, TypeScript declaration files, and hidden files
        }
        const relativePath = isSrc ? entry.name : path.join(basePath, entry.name);
        if (entry.isDirectory()) {
            // Flatten the 'src' directory into the top level
            const children = buildDirectoryTree(path.join(dir, entry.name), relativePath, isSrc || entry.name === 'src');
            if (entry.name === 'src') {
                structure = structure.concat(children);
            }
            else {
                structure.push({
                    type: 'directory',
                    name: entry.name,
                    path: relativePath,
                    children: children,
                });
            }
        }
        else if (entry.isFile() && entry.name.endsWith('.md')) {
            structure.push({
                type: 'file',
                name: entry.name,
                path: relativePath,
            });
        }
    });
    return structure;
}
function generateMarkdownFromTree(tree, depth = 0) {
    let markdown = '';
    const indent = '  '.repeat(depth);
    tree.forEach((item) => {
        if (item.type === 'directory') {
            markdown += `${indent}- ${item.name}\n`;
            markdown += generateMarkdownFromTree(item.children, depth + 1);
        }
        else if (item.type === 'file') {
            // Correct the path for files directly under 'src'
            const filePath = depth === 0 ? `src/${item.path}` : `src/${item.path}`;
            markdown += `${indent}- [${item.name.replace('.md', '')}](${filePath})\n`;
        }
    });
    return markdown;
}
function generateDocsReadme() {
    const tree = buildDirectoryTree('docs/src');
    console.log(JSON.stringify(tree, null, 2));
    const markdown = generateMarkdownFromTree(tree);
    fs.writeFileSync(path.join(docsDir, 'README.md'), `${indexHeader}${markdown}`);
}
function findTSFiles(dir, fileList = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.name === 'custom_modules' || entry.name === 'node_modules' || entry.name.endsWith('.d.ts')) {
            continue;
        }
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            findTSFiles(fullPath, fileList);
        }
        else if (entry.isFile() &&
            entry.name.endsWith('.ts') &&
            !entry.name.endsWith('test.ts') &&
            entry.name !== 'all.ts' &&
            entry.name !== 'index.ts') {
            fileList.push(fullPath);
        }
    }
    return fileList;
}
function generateChecksum(content) {
    return crypto.createHash('sha256').update(content).digest('hex');
}
async function generateDocumentation(fileList, systemPrompt) {
    for (const file of fileList) {
        const content = fs.readFileSync(file, 'utf8');
        const checksum = generateChecksum(content);
        const checksumFile = path.join(checksumDir, path.basename(file) + '.cks');
        let existingChecksum = '';
        if (fs.existsSync(checksumFile)) {
            existingChecksum = fs.readFileSync(checksumFile, 'utf8');
        }
        if (checksum !== existingChecksum) {
            try {
                console.log(`${file}:`);
                const completion = await openaiClient.chat.completions.create({
                    model: 'gpt-4-1106-preview',
                    temperature: 0.0,
                    max_tokens: 4095,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: content },
                    ],
                });
                let docContent = completion.choices[0].message.content;
                console.log(docContent);
                docContent = docContent.replace(/```markdown\s+/g, '');
                const docFilePath = file
                    .replace(rootDir, docsDir)
                    .replace('.ts', '.md');
                const docDirPath = path.dirname(docFilePath);
                if (!fs.existsSync(docDirPath)) {
                    fs.mkdirSync(docDirPath, { recursive: true });
                }
                fs.writeFileSync(docFilePath, docContent);
                fs.writeFileSync(checksumFile, checksum); // Save the new checksum
                console.log(`Documentation generated for ${file}`);
            }
            catch (error) {
                console.error(`Error generating documentation for ${file}:`, error);
                process.exit(1);
            }
        }
        else {
            console.log(`Skipping documentation generation for ${file}, no changes detected.`);
        }
    }
}
async function main() {
    const tsFiles = findTSFiles(rootDir);
    generateDocsReadme();
    await generateDocumentation(tsFiles, systemPromptWebApp);
    generateDocsReadme();
}
main().then(() => console.log('Documentation generation complete.'));
//# sourceMappingURL=generateDocumentation.js.map