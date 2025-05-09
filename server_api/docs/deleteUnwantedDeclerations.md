# Utility Module: Clean TypeScript Output Declarations

This utility script is designed to clean up the output directory (`ts-out`) after a TypeScript build by deleting unnecessary `.d.ts`, `.d.cts`, and source map files, while preserving a specified set of declaration files. It is intended to be run as a Node.js script.

---

## Overview

- **Purpose:**  
  Recursively traverses the `ts-out` directory, deleting all `.d.ts`, `.d.cts`, `.js.map`, `.cjs.map`, and `.cts.map` files except those explicitly listed in the `keepDeclarations` set.
- **Typical Usage:**  
  Used as a post-build step to keep only essential TypeScript declaration files and remove extraneous build artifacts.

---

## Configuration

### Constants

| Name              | Type     | Description                                                                 |
|-------------------|----------|-----------------------------------------------------------------------------|
| `tsOutDir`        | string   | The root directory to clean (default: `'./ts-out'`).                        |
| `keepDeclarations`| Set<string> | Set of relative file paths (from `tsOutDir`) to declaration files to keep. |

#### Example `keepDeclarations` Entries

- `app.d.ts`
- `server.d.ts`
- `services/llms/baseChatBot.d.ts`
- `utils/loggerTs.d.ts`
- etc.

---

## Functions

### deleteDtsFiles

Recursively deletes unwanted declaration and map files from a directory, preserving only those in the `keepDeclarations` set.

#### Signature

```typescript
function deleteDtsFiles(dir: string): void
```

#### Parameters

| Name | Type   | Description                        |
|------|--------|------------------------------------|
| dir  | string | Directory path to process recursively. |

#### Behavior

- Reads all files and subdirectories in `dir`.
- For each file:
  - If it is a directory, recurses into it.
  - If it is a file:
    - Computes its relative path from `tsOutDir`.
    - Deletes the file if:
      - It ends with `.d.ts`, `.d.cts`, `.js.map`, `.cjs.map`, or `.cts.map`
      - AND it is **not** in the `keepDeclarations` set.
    - Logs each deletion to the console.

#### Example

```javascript
deleteDtsFiles('./ts-out');
```

---

## Script Execution

At the end of the file, the script starts the cleaning process by calling:

```javascript
deleteDtsFiles(tsOutDir);
```

---

## Exported Constants

This script does **not** export any modules or functions; it is intended to be run directly with Node.js.

---

## Example Usage

```bash
node clean-dts.js
```

This will clean the `./ts-out` directory, preserving only the declaration files listed in `keepDeclarations`.

---

## Notes

- The script uses synchronous file system operations (`fs.readdirSync`, `fs.statSync`, `fs.unlinkSync`) for simplicity and reliability in a build/post-build context.
- The `keepDeclarations` set should contain **relative paths** from the `tsOutDir` root.
- The script logs each deleted file to the console for traceability.

---

## Dependencies

- [fs](https://nodejs.org/api/fs.html) (Node.js built-in)
- [path](https://nodejs.org/api/path.html) (Node.js built-in)

---

## See Also

- [Node.js File System Documentation](https://nodejs.org/api/fs.html)
- [Node.js Path Documentation](https://nodejs.org/api/path.html)

---