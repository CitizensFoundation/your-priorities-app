import { request } from "node:http";
import { createHash } from "node:crypto";
import { workflowSocketTimeoutMs } from "./modelLimits.js";
export function stableRequestId(key: string): string {
  const hex = createHash("sha256").update(key).digest("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}
export async function socketRequest<T>(
  socketPath: string,
  route: string,
  data: unknown,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const req = request(
      {
        socketPath,
        path: route,
        method: "POST",
        headers: {
          "content-type": "application/json",
          "content-length": Buffer.byteLength(body),
        },
        timeout: workflowSocketTimeoutMs,
      },
      (res) => {
        const chunks: Buffer[] = [];
        let bytes = 0;
        res.on("data", (chunk: Buffer) => {
          bytes += chunk.length;
          if (bytes > 16_000_000) {
            res.destroy(new Error("Gateway response is too large"));
            return;
          }
          chunks.push(chunk);
        });
        res.on("error", reject);
        res.on("end", () => {
          try {
            const value = JSON.parse(Buffer.concat(chunks).toString("utf8"));
            if ((res.statusCode ?? 500) >= 400)
              reject(
                new Error(
                  value.error ?? "Workflow gateway rejected the request",
                ),
              );
            else resolve(value as T);
          } catch (error) {
            reject(error);
          }
        });
      },
    );
    req.on("error", reject);
    req.on("timeout", () =>
      req.destroy(
        new Error(
          "Gateway request timed out; check its ledger before retrying",
        ),
      ),
    );
    req.end(body);
  });
}
