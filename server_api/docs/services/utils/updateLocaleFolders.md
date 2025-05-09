# Utility Module: ensureAllLocaleFoldersAreCreated

This module is a utility script designed to ensure that all locale folders and their corresponding translation files exist for each language defined in [YpLanguages](../../utils/ypLanguages.md). It is typically used as a setup or maintenance script to prepare the `locales` directory structure for internationalization (i18n) support.

---

## Functions

### ensureAllLocaleFoldersAreCreated

Ensures that a folder exists for each language in the `locales` directory, and that each folder contains a `translation.json` file. If a folder or file does not exist, it is created.

#### Parameters

_None_

#### Return Type

`Promise<void>`

#### Description

- Creates the `locales` directory if it does not exist.
- Iterates over all languages in `YpLanguages.allLanguages`.
- For each language:
  - Creates a subdirectory named after the language code (with `-` replaced by `_`).
  - If the subdirectory does not exist, it is created.
  - Ensures a `translation.json` file exists in each language folder, creating an empty JSON file if necessary.
- Logs progress and errors to the console.

#### Example Usage

```typescript
await ensureAllLocaleFoldersAreCreated();
```

---

### main

The entry point for the script. Calls `ensureAllLocaleFoldersAreCreated` and logs the result.

#### Parameters

_None_

#### Return Type

`Promise<void>`

#### Description

- Invokes `ensureAllLocaleFoldersAreCreated`.
- Logs a success message if the operation completes.
- Logs an error message if an error occurs.

#### Example Usage

```typescript
main()
  .then(() => console.log("I have updated the locale folders."))
  .catch((error) => console.error("Error in main:", error));
```

---

# Dependencies

- [YpLanguages](../../utils/ypLanguages.md): Provides the list of all supported languages via `YpLanguages.allLanguages`.
- `fs/promises`: Used for asynchronous file system operations.
- `path`: Used for constructing file and directory paths.

---

# Configuration

- **Locales Directory**: The script operates on a directory named `locales` at the root of the current working directory (`process.cwd()`).
- **Language Folders**: Each language gets a subfolder named after its code, with hyphens replaced by underscores (e.g., `en-US` becomes `en_US`).
- **Translation File**: Each language folder contains a `translation.json` file, initialized as an empty JSON object (`{}`) if it does not exist.

---

# Exported Constants

_None_

---

# Example Output

Console output during execution may look like:

```
Creating ---->: /path/to/project/locales/en_US
Creating ---->: /path/to/project/locales/fr_FR
Path exists: /path/to/project/locales/de_DE
Locale folders and files have been created successfully.
I have updated the locale folders.
```

---

# See Also

- [YpLanguages](../../utils/ypLanguages.md) – for the structure and contents of the language list used by this script.

---

# Notes

- This script is intended to be run as a standalone Node.js process (e.g., via `node ensureLocales.js`).
- It is safe to run multiple times; existing folders and files are not overwritten.
- Errors are logged to the console but do not throw, allowing the script to continue processing other languages.