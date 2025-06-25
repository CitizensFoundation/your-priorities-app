import log from "./loggerTs.js";
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
When creating internal links to other documented source files, ensure the link uses the .md extension (e.g., [MyClass](./MyClass.md)).
When referencing Policy Synth entities, especially PsAgent, ensure that links point to the correct repository and path, for example, a link to PsAgent should be [PsAgent](https://github.com/CitizensFoundation/policy-synth/blob/main/agents/src/dbModels/agent.ts).
`;
const indexHeader = '# Your Priorities Server API Documentation\\n\\n';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { OpenAI } from 'openai';
import { fileURLToPath } from 'url'; // Import for ES module __dirname equivalent
// ES module equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
// const rootDir = path.resolve(__dirname, '..', '..', '..'); // Adjusted for ts-out/utils structure
const rootDir = path.resolve(__dirname, '..', '..'); // Corrected rootDir for ts-out/utils structure
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
            log.info(`Skipping ${entry.name} in buildDirectoryTree`);
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
            markdown += `${indent}- [${item.name.replace('.md', '')}](${item.path})\n`;
        }
    });
    return markdown;
}
function generateDocsReadme() {
    const tree = buildDirectoryTree(docsDir);
    log.info(JSON.stringify(tree, null, 2));
    const markdown = generateMarkdownFromTree(tree);
    const readmePath = path.join(docsDir, 'README.md');
    const apiHeader = '## API Documentation';
    let newReadmeContent = '';
    if (fs.existsSync(readmePath)) {
        const existing = fs.readFileSync(readmePath, 'utf8');
        const headerIndex = existing.indexOf(apiHeader);
        if (headerIndex !== -1) {
            // Keep everything up to the API header (inclusive) and replace the rest.
            const before = existing.substring(0, headerIndex).trimEnd();
            newReadmeContent = `${before}\n\n${apiHeader}\n\n${markdown}`;
        }
        else {
            // Header not found – append it to the end.
            newReadmeContent = `${existing.trimEnd()}\n\n${apiHeader}\n\n${markdown}`;
        }
    }
    else {
        // No README yet – create with index header + API docs.
        newReadmeContent = `${indexHeader}${apiHeader}\n\n${markdown}`;
    }
    fs.writeFileSync(readmePath, newReadmeContent);
}
function findSourceFiles(dir, fileList = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (IGNORED_PATTERNS.some(pattern => entry.name.includes(pattern) || entry.name.startsWith('.'))) {
            if (entry.name !== ".env") { // Explicitly allow .env if it's not otherwise ignored by a broader pattern
                log.info(`Skipping ${path.join(dir, entry.name)} due to ignore patterns.`);
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
                log.info(`${file}:`);
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
                log.info(docContent);
                docContent = docContent.replace(/```markdown\s+/g, '');
                const sourceDir = path.join(rootDir, 'src');
                const relativePathInSrc = path.relative(sourceDir, file);
                const docFilePath = path.join(docsDir, relativePathInSrc).replace(/\.(ts|cjs)$/, '.md');
                const docDirPath = path.dirname(docFilePath);
                if (!fs.existsSync(docDirPath)) {
                    fs.mkdirSync(docDirPath, { recursive: true });
                }
                fs.writeFileSync(docFilePath, docContent);
                fs.writeFileSync(checksumFile, checksum); // Save the new checksum
                log.info(`Documentation generated for ${file}`);
            }
            catch (error) {
                log.error(`Error generating documentation for ${file}:`, error);
                process.exit(1);
            }
        }
        else {
            log.info(`Skipping documentation generation for ${file}, no changes detected.`);
        }
    }
}
async function main() {
    const sourceFiles = findSourceFiles(path.join(rootDir, 'src'));
    generateDocsReadme();
    await generateDocumentation(sourceFiles, systemPromptServerApi);
    generateDocsReadme();
}
main().then(() => log.info('Documentation generation complete.'));
