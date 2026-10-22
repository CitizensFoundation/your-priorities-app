import {
  mkdir,
  writeFile,
  rename,
  readdir,
  readFile,
  unlink,
} from "node:fs/promises";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";

/** Persist before send, delete only after the API has committed and acknowledged.
 * The API deduplicates keys; a lost HTTP response therefore cannot lose an event. */
export class DurableOutbox {
  private draining = false;
  private append: Promise<void> = Promise.resolve();
  private lastStamp = 0n;
  constructor(
    private readonly root: string,
    private readonly send: (item: {
      type: string;
      data: unknown;
    }) => Promise<void>,
  ) {}
  async enqueue(type: string, data: unknown, key: string) {
    const task = this.append.then(async () => {
      await mkdir(this.root, { recursive: true, mode: 0o700 });
      const suffix = `${createHash("sha256").update(key).digest("hex")}.json`;
      const names = await readdir(this.root);
      if (names.some((name) => name.endsWith(suffix))) return;
      for (const name of names) {
        const prefix = name.split("-")[0];
        if (/^\d{20}$/.test(prefix) && BigInt(prefix) > this.lastStamp)
          this.lastStamp = BigInt(prefix);
      }
      const now = BigInt(Date.now()) * 1_000_000n;
      this.lastStamp = now > this.lastStamp ? now : this.lastStamp + 1n;
      const file = path.join(
        this.root,
        `${String(this.lastStamp).padStart(20, "0")}-${suffix}`,
      );
      const temp = `${file}.${randomUUID()}.tmp`;
      await writeFile(temp, JSON.stringify({ type, data }), {
        mode: 0o600,
        flush: true,
      });
      await rename(temp, file);
    });
    this.append = task.catch(() => undefined);
    await task;
    void this.drain().catch(() => undefined);
  }
  async drain() {
    if (this.draining) return;
    this.draining = true;
    try {
      await this.append;
      await mkdir(this.root, { recursive: true, mode: 0o700 });
      for (const name of (await readdir(this.root))
        .filter((n) => n.endsWith(".json"))
        .sort()) {
        const file = path.join(this.root, name);
        await this.send(
          JSON.parse(await readFile(file, "utf8")) as {
            type: string;
            data: unknown;
          },
        );
        await unlink(file);
      }
    } finally {
      this.draining = false;
    }
  }
}
