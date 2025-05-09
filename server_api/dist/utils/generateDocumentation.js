const systemPromptServerApi = `
You are a meticulous API documentation generator. Your output should be in standard Markdown API documentation format. Focus on documenting key components of an Express.js application, including routes, middleware, controllers, services, models, and important utility functions/modules.

When documenting, please adhere to the following structure, adapting as necessary for the content of the file:

# API Endpoint: [METHOD] /path/to/endpoint
Brief description of what the endpoint does.
## Request
### Parameters
| Name     | Type   | In     | Description              | Required |
|----------|--------|--------|--------------------------|----------|
| paramName| string | path   | Description of URL param | Yes/No   |
| queryName| string | query  | Description of query param| Yes/No   |
### Headers
| Name         | Type   | Description        | Required |
|--------------|--------|--------------------|----------|
| HeaderName   | string | Description        | Yes/No   |
### Body
\`\`\`json
// Example JSON request body
{
  "key": "value"
}
\`\`\`
Description of the request body schema. Specify data types and validation rules if applicable.
## Response
### Success (2xx)
\`\`\`json
// Example JSON success response
{
  "data": "some data"
}
\`\`\`
Description of the success response. Specify data types.
### Error (4xx, 5xx)
\`\`\`json
// Example JSON error response
{
  "error": "description of error"
}
\`\`\`
Description of potential error responses and their meaning.

# Middleware: middlewareName
Description of the middleware function, its purpose, and where it's typically used in the request lifecycle.
## Parameters (if applicable)
| Name     | Type   | Description              |
|----------|--------|--------------------------|
| req      | Request| Express request object   |
| res      | Response| Express response object  |
| next     | NextFunction | Express next function    |

# Controller: ControllerName.methodName
Description of the controller method, its responsibilities, and the services it interacts with.
## Parameters
| Name     | Type   | Description              |
|----------|--------|--------------------------|
| req      | Request| Express request object   |
| res      | Response| Express response object  |

# Service: ServiceName.methodName (or Service Module)
Description of the service method or module, its business logic, and any interactions with databases or other services. If it's a module with multiple exported functions, list them.
## Methods (if a module with multiple exports)
| Name       | Parameters        | Return Type | Description                 |
|------------|-------------------|-------------|-----------------------------|
| methodName | param1: type, ... | returnType  | Brief description of method |

# Model: ModelName
Description of the data model or schema.
## Properties
| Name          | Type   | Description               |
|---------------|--------|---------------------------|
| propertyName  | type   | Brief description.        |

# Utility Module / Function: UtilityName
Description of the utility module or standalone function, its purpose, and how it's used.
## Functions (if a module)
| Name       | Parameters        | Return Type | Description                 |
|------------|-------------------|-------------|-----------------------------|
| funcName   | param1: type, ... | returnType  | Brief description of func   |
## Parameters (if a single standalone function)
| Name     | Type   | Description              |
|----------|--------|--------------------------|
| paramName| string | Description of param     |
## Examples
\`\`\`typescript
// Example usage
\`\`\`

For "Type", use TypeScript definitions where possible (e.g., \`string\`, \`number\`, \`MyInterface\`).
Prioritize documenting all exported functions, classes, modules, and route handlers.
You MUST output the full detailed documentation for the TypeScript or JavaScript (.cjs) file the user submits. If a file contains elements not perfectly fitting the above categories (e.g., configuration objects, constants), document them clearly under a suitable general heading like "Configuration" or "Exported Constants".
`;
const indexHeader = '# Your Priorities Server API Documentation\\n\\n';
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
const IGNORED_PATTERNS = [
    'node_modules',
    'custom_modules',
    'dist',
    'migrations',
    'ts-out',
    'uploads',
    'webAppsDist',
    'config',
    'cks', // existing from buildDirectoryTree
    '.git', // common ignore
    '.vscode', // common ignore
    'all.ts', // existing from buildDirectoryTree
    'test.ts', // existing from buildDirectoryTree and findTSFiles
    '.d.ts', // existing from buildDirectoryTree and findTSFiles
    'README.md', // existing from buildDirectoryTree
];
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
        if (IGNORED_PATTERNS.some(pattern => entry.name.includes(pattern) || entry.name.startsWith('.'))) {
            console.log(`Skipping ${entry.name} in buildDirectoryTree`);
            return;
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
function findSourceFiles(dir, fileList = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (IGNORED_PATTERNS.some(pattern => entry.name.includes(pattern) || entry.name.startsWith('.'))) {
            if (entry.name !== ".env") { // Explicitly allow .env if it's not otherwise ignored by a broader pattern
                console.log(`Skipping ${path.join(dir, entry.name)} due to ignore patterns.`);
                continue;
            }
        }
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            findSourceFiles(fullPath, fileList);
        }
        else if (entry.isFile() &&
            (entry.name.endsWith('.ts') || entry.name.endsWith('.cjs')) &&
            !IGNORED_PATTERNS.some(pattern => entry.name.endsWith(pattern)) && // for specific file endings like .d.ts, test.ts
            entry.name !== 'index.ts' //
        ) {
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
                    model: 'gpt-4.1',
                    temperature: 0.0,
                    max_tokens: 8000,
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
    const sourceFiles = findSourceFiles(rootDir);
    generateDocsReadme();
    await generateDocumentation(sourceFiles, systemPromptServerApi);
    generateDocsReadme();
}
main().then(() => console.log('Documentation generation complete.'));
