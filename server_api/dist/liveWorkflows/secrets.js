import { createCipheriv, createDecipheriv, randomBytes, timingSafeEqual, createHash, } from "node:crypto";
import { z } from "zod";
export class SecretBox {
    constructor(encodedKey) {
        this.key = Buffer.from(encodedKey, "base64");
        if (this.key.length !== 32)
            throw new Error("YP_LIVE_WORKFLOW_AUTH_ENCRYPTION_KEY must be a base64 encoded 32-byte key");
    }
    seal(value, context) {
        const iv = randomBytes(12);
        const cipher = createCipheriv("aes-256-gcm", this.key, iv);
        cipher.setAAD(Buffer.from(context));
        const encrypted = Buffer.concat([
            cipher.update(JSON.stringify(value)),
            cipher.final(),
        ]);
        return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64");
    }
    open(value, context) {
        const encoded = Buffer.from(value, "base64");
        const cipher = createDecipheriv("aes-256-gcm", this.key, encoded.subarray(0, 12));
        cipher.setAAD(Buffer.from(context));
        cipher.setAuthTag(encoded.subarray(12, 28));
        return JSON.parse(Buffer.concat([
            cipher.update(encoded.subarray(28)),
            cipher.final(),
        ]).toString("utf8"));
    }
}
export function sameSecret(left, right) {
    return timingSafeEqual(createHash("sha256").update(left).digest(), createHash("sha256").update(right).digest());
}
export const hostSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    token: z.string().min(32),
    rootPath: z.string().startsWith("/"),
    image: z.string().default("yp-live-workflow/codex-runtime:1"),
});
export class HostDirectory {
    constructor(json = process.env.YP_LIVE_WORKFLOW_HOSTS ?? "[]") {
        this.hosts = z.array(hostSchema).parse(JSON.parse(json));
        if (new Set(this.hosts.map((host) => host.id)).size !== this.hosts.length ||
            new Set(this.hosts.map((host) => host.token)).size !== this.hosts.length)
            throw new Error("Workflow hosts require unique IDs and credentials");
    }
    get(id) {
        const host = this.hosts.find((h) => h.id === id);
        if (!host)
            throw new Error("Unknown workflow host");
        return host;
    }
    authenticate(header) {
        if (!header?.startsWith("Bearer "))
            return undefined;
        return this.hosts.find((h) => sameSecret(h.token, header.slice(7)));
    }
}
