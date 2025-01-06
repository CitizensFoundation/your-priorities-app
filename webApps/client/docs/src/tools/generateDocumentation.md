# DocumentationGenerator

This class is responsible for generating API documentation in Markdown format for TypeScript files within a project. It reads TypeScript files, generates documentation using OpenAI's API, and saves the documentation in a specified directory.

## Properties

| Name        | Type   | Description                                                                 |
|-------------|--------|-----------------------------------------------------------------------------|
| openaiClient | OpenAI | An instance of the OpenAI client used to generate documentation.            |
| rootDir     | string | The root directory of the project.                                          |
| docsDir     | string | The directory where the generated documentation will be saved.              |
| checksumDir | string | The directory where checksums of the TypeScript files are stored.           |

## Methods

| Name                      | Parameters                          | Return Type | Description                                                                 |
|---------------------------|-------------------------------------|-------------|-----------------------------------------------------------------------------|
| buildDirectoryTree        | dir: string, basePath?: string, isSrc?: boolean | any[]       | Builds a tree structure representing the directory and its contents.        |
| generateMarkdownFromTree  | tree: any[], depth?: number         | string      | Generates a Markdown representation of the directory tree.                  |
| generateDocsReadme        |                                     | void        | Generates a README.md file with the directory structure of the documentation.|
| findTSFiles               | dir: string, fileList?: string[]    | string[]    | Recursively finds all TypeScript files in a directory, excluding certain files.|
| generateChecksum          | content: string                     | string      | Generates a SHA-256 checksum for the given content.                         |
| generateDocumentation     | fileList: string[], systemPrompt: string | Promise<void> | Generates documentation for each TypeScript file in the list.               |
| main                      |                                     | Promise<void> | The main function that orchestrates the documentation generation process.   |

## Examples

```typescript
// Example usage of the DocumentationGenerator class

async function main(): Promise<void> {
  const tsFiles = findTSFiles(rootDir);
  generateDocsReadme();
  await generateDocumentation(tsFiles, systemPromptWebApp);
  generateDocsReadme();
}

main().then(() => console.log('Documentation generation complete.'));
```

This script automates the process of generating API documentation for a TypeScript project. It uses OpenAI's API to create detailed documentation for each TypeScript file, ensuring that the documentation is up-to-date with the latest changes in the codebase.