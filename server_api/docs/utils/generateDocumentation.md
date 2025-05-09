# Utility Module: Documentation Generator Script

This file is a Node.js utility script designed to automate the generation of Markdown API documentation for an Express.js (or similar) TypeScript/JavaScript project. It leverages the OpenAI API to generate documentation for each source file, using a system prompt that enforces a consistent documentation structure. The script also manages a directory tree of documentation, maintains checksums to avoid redundant work, and generates a navigable README for the documentation directory.

---

## Overview

- **Purpose:**  
  Automate the generation and maintenance of Markdown API documentation for a codebase, focusing on Express.js application components (routes, middleware, controllers, services, models, utilities).
- **Key Features:**
  - Recursively scans the `src` directory for `.ts` and `.cjs` files (excluding test, d.ts, and other ignored patterns).
  - Uses OpenAI's GPT model to generate Markdown documentation for each file, following a strict template.
  - Stores generated documentation in a parallel `docs` directory, mirroring the source structure.
  - Maintains checksums to avoid regenerating documentation for unchanged files.
  - Generates a navigable `README.md` in the `docs` directory, reflecting the documentation structure.

---

## Configuration

### Constants and Directories

| Name           | Type   | Description                                                                 |
|----------------|--------|-----------------------------------------------------------------------------|
| `systemPromptServerApi` | string | The system prompt sent to OpenAI, defining the documentation format and rules. |
| `indexHeader`  | string | The header for the generated `docs/README.md`.                              |
| `rootDir`      | string | The root directory of the project (two levels up from the script location).  |
| `docsDir`      | string | The directory where generated documentation is stored (`rootDir/docs`).      |
| `checksumDir`  | string | Directory for storing file checksums (`docsDir/cks`).                       |
| `IGNORED_PATTERNS` | string[] | List of directory/file patterns to ignore during scanning.              |

---

## Exported/Key Functions

### buildDirectoryTree

Recursively builds a representation of the documentation directory tree, flattening any `src` directories to the top level.

#### Parameters

| Name      | Type   | Description                                      |
|-----------|--------|--------------------------------------------------|
| `dir`     | string | Directory to scan.                               |
| `basePath`| string | Base path for relative paths (used internally).  |
| `isSrc`   | boolean| Whether the current directory is a `src` dir.    |

#### Returns

- `structure: any[]` — Array representing the directory/file tree.

---

### generateMarkdownFromTree

Generates a Markdown-formatted list from the directory tree structure.

#### Parameters

| Name   | Type   | Description                        |
|--------|--------|------------------------------------|
| `tree` | any[]  | Directory tree as returned by `buildDirectoryTree`. |
| `depth`| number | Current depth for indentation (default: 0).         |

#### Returns

- `markdown: string` — Markdown-formatted string representing the tree.

---

### generateDocsReadme

Generates or updates the `docs/README.md` file, reflecting the current documentation structure.

#### Usage

```typescript
generateDocsReadme();
```

---

### findSourceFiles

Recursively finds all relevant source files (`.ts`, `.cjs`) in the `src` directory, excluding ignored patterns.

#### Parameters

| Name      | Type     | Description                        |
|-----------|----------|------------------------------------|
| `dir`     | string   | Directory to scan.                 |
| `fileList`| string[] | Accumulator for found files.       |

#### Returns

- `fileList: string[]` — Array of absolute file paths.

---

### generateChecksum

Generates a SHA-256 checksum for a given string (file content).

#### Parameters

| Name      | Type   | Description                        |
|-----------|--------|------------------------------------|
| `content` | string | Content to hash.                   |

#### Returns

- `checksum: string` — SHA-256 hash.

---

### generateDocumentation

Main function to generate documentation for each source file using OpenAI, only if the file has changed (based on checksum).

#### Parameters

| Name         | Type     | Description                                 |
|--------------|----------|---------------------------------------------|
| `fileList`   | string[] | List of source file paths to document.      |
| `systemPrompt` | string | The system prompt to use for OpenAI.        |

#### Returns

- `Promise<void>`

---

### main

Entry point for the script. Finds source files, generates the docs README, generates documentation for each file, and updates the README again.

#### Usage

```typescript
main().then(() => console.log('Documentation generation complete.'));
```

---

## Example Usage

This script is intended to be run as a Node.js executable (e.g., via `node generateDocs.js` or as an npm script). It requires the `OPENAI_API_KEY` environment variable to be set.

```bash
OPENAI_API_KEY=sk-... node generateDocs.js
```

---

## Environment Variables

| Name              | Description                                 | Required |
|-------------------|---------------------------------------------|----------|
| `OPENAI_API_KEY`  | API key for OpenAI GPT model access.        | Yes      |

---

## Dependencies

- `fs` (Node.js built-in): File system operations.
- `path` (Node.js built-in): Path manipulations.
- `crypto` (Node.js built-in): Checksum generation.
- `openai`: OpenAI API client.
- `url` (Node.js built-in): For ES module `__dirname` equivalent.

---

## Notes

- The script is designed for ES modules (uses `import` syntax and `import.meta.url`).
- Ignores common build, config, and test directories/files.
- Documentation is only regenerated for files whose content has changed (checksum-based).
- The OpenAI model used is `gpt-4.1` with a strict system prompt for consistent output.
- The generated documentation mirrors the source directory structure under `docs/`.

---

## Example Directory Structure

```
project-root/
  src/
    controllers/
      userController.ts
    models/
      user.ts
  docs/
    controllers/
      userController.md
    models/
      user.md
    README.md
    cks/
      userController.ts.cks
      user.ts.cks
```

---

## Limitations

- Only processes `.ts` and `.cjs` files (excluding test, d.ts, and other ignored files).
- Requires a valid OpenAI API key and internet access.
- Assumes a standard project structure with a `src` directory.

---

## See Also

- [OpenAI Node.js SDK](https://www.npmjs.com/package/openai)
- [Node.js File System Documentation](https://nodejs.org/api/fs.html)

---

## Example: Adding a New Source File

1. Add a new `.ts` or `.cjs` file under `src/`.
2. Run the script.
3. The corresponding `.md` documentation will be generated under `docs/`, and the `README.md` will be updated.

---

## Example: Forcing Regeneration

To force regeneration of documentation for a file, delete its corresponding `.cks` checksum file in `docs/cks/` and rerun the script.

---

## Example: Customizing the System Prompt

To change the documentation style or requirements, edit the `systemPromptServerApi` string at the top of the script.

---

## Example: Extending Ignored Patterns

To ignore additional files or directories, add their names or patterns to the `IGNORED_PATTERNS` array.

---

## Example: Running in a CI/CD Pipeline

Add the script as a step in your CI/CD pipeline to keep documentation up to date automatically.

---

## Example: Output

A generated Markdown file for a controller might look like:

# Controller: UserController.createUser
Handles user creation requests, validates input, and interacts with the UserService.
## Parameters
| Name | Type | Description |
|------|------|-------------|
| req  | Request | Express request object |
| res  | Response | Express response object |
...
```

---

## License

This script is intended for internal documentation automation and is not published as a standalone package. Adapt as needed for your project.