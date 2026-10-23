import { createRequire } from "node:module";
import path from "node:path";
const require = createRequire(import.meta.url);
export function defaultCodexCommand() {
    try {
        const packageJsonPath = require.resolve("@openai/codex/package.json");
        const packageJson = require(packageJsonPath);
        const binPath = packageJson.bin?.codex ?? "bin/codex.js";
        return path.join(path.dirname(packageJsonPath), binPath);
    }
    catch {
        return "codex";
    }
}
