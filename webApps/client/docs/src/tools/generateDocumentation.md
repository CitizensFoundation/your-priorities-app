# DocumentationGenerator

A utility script for generating API documentation in Markdown format for a TypeScript project. It scans the project directory, generates documentation for `.ts` files (excluding tests and some special files), and maintains a directory tree of the generated documentation. It uses the OpenAI API to generate the documentation content.

## Properties

| Name           | Type         | Description                                                                                 |
|----------------|--------------|---------------------------------------------------------------------------------------------|
| systemPromptWebApp | string   | The system prompt used for the OpenAI API to instruct the model on how to generate documentation. |
| indexHeader    | string       | The header text for the generated documentation index (README.md).                          |
| openaiClient   | OpenAI       | An instance of the OpenAI API client, initialized with the API key from environment variables. |
| rootDir        | string       | The root directory of the project (current working directory).                              |
| docsDir        | string       | The directory where generated documentation files are stored.                               |
| checksumDir    | string       | The directory where checksums of source files are stored to avoid unnecessary regeneration.  |

## Methods

| Name                    | Parameters                                                                 | Return Type | Description                                                                                                   |
|-------------------------|----------------------------------------------------------------------------|-------------|---------------------------------------------------------------------------------------------------------------|
| buildDirectoryTree      | dir: string, basePath?: string, isSrc?: boolean                            | any[]       | Recursively builds a tree structure representing the documentation directory, flattening the 'src' directory. |
| generateMarkdownFromTree| tree: any, depth?: number                                                  | string      | Generates a Markdown-formatted directory tree from the given structure.                                       |
| generateDocsReadme      | none                                                                       | void        | Generates the main documentation index (README.md) from the docs directory tree.                              |
| findTSFiles             | dir: string, fileList?: string[]                                           | string[]    | Recursively finds all relevant TypeScript files in the project, excluding tests and special files.            |
| generateChecksum        | content: string                                                            | string      | Generates a SHA-256 checksum for the given file content.                                                      |
| generateDocumentation   | fileList: string[], systemPrompt: string                                   | Promise<void>| For each TypeScript file, generates documentation using OpenAI if the file has changed since last generation. |
| main                    | none                                                                       | Promise<void>| The main entry point: finds files, generates docs, and updates the documentation index.                       |

## Examples

```typescript
// Example usage: Run as a Node.js script in your TypeScript project root

// 1. Set your OpenAI API key in the environment variable OPENAI_API_KEY
// 2. Run the script with Node.js

// $ OPENAI_API_KEY=sk-... node path/to/this/script.js

// The script will:
// - Scan your project for .ts files (excluding tests, all.ts, index.ts, .d.ts, etc.)
// - Generate Markdown documentation for each file using OpenAI
// - Store the documentation in the docs/ directory
// - Maintain a checksum to avoid regenerating unchanged files
// - Generate a docs/README.md with a directory tree of the documentation
```
