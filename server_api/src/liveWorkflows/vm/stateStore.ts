import fs from "node:fs/promises";
import path from "node:path";

export type VmAgentState = {
  vmHostId?: string;
};

export interface VmAgentStateStore {
  read(): Promise<VmAgentState>;
  write(state: VmAgentState): Promise<void>;
}

export class FileVmAgentStateStore implements VmAgentStateStore {
  constructor(private readonly filePath: string) {}

  async read(): Promise<VmAgentState> {
    try {
      const contents = await fs.readFile(this.filePath, "utf8");
      const parsed = JSON.parse(contents) as { vmHostId?: unknown };
      return typeof parsed.vmHostId === "string" && parsed.vmHostId.trim()
        ? { vmHostId: parsed.vmHostId }
        : {};
    } catch (error) {
      if (isNotFoundError(error)) {
        return {};
      }

      throw error;
    }
  }

  async write(state: VmAgentState): Promise<void> {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
  }
}

function isNotFoundError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}
