import fs from "node:fs/promises";
import path from "node:path";
export class FileVmAgentStateStore {
    constructor(filePath) {
        this.filePath = filePath;
    }
    async read() {
        try {
            const contents = await fs.readFile(this.filePath, "utf8");
            const parsed = JSON.parse(contents);
            return typeof parsed.vmHostId === "string" && parsed.vmHostId.trim()
                ? { vmHostId: parsed.vmHostId }
                : {};
        }
        catch (error) {
            if (isNotFoundError(error)) {
                return {};
            }
            throw error;
        }
    }
    async write(state) {
        await fs.mkdir(path.dirname(this.filePath), { recursive: true });
        await fs.writeFile(this.filePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
    }
}
function isNotFoundError(error) {
    return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}
