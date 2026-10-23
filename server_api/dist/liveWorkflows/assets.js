import { createReadStream, createWriteStream } from "node:fs";
import { mkdir, rename, unlink } from "node:fs/promises";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { ConflictError, NotFoundError, ValidationError, } from "./services/errors.js";
export const maximumUploadBytes = 250 * 1024 ** 2;
export class AssetService {
    constructor(store, root) {
        this.store = store;
        this.root = root;
    }
    path(groupId, id) {
        if (!Number.isSafeInteger(groupId) ||
            groupId <= 0 ||
            !/^[0-9a-f-]{36}$/.test(id))
            throw new ValidationError("Invalid asset path");
        return path.join(this.root, String(groupId), id);
    }
    async upload(groupId, stream, input) {
        const name = path
            .basename(input.name)
            .replace(/[\x00-\x1f]/g, "")
            .slice(0, 200);
        if (!name || name === "." || name === "..")
            throw new ValidationError("File name is required");
        const reservation = input.length ?? maximumUploadBytes;
        if (reservation === 0)
            throw new ValidationError("Empty files cannot be uploaded");
        if (!Number.isSafeInteger(reservation) ||
            reservation < 1 ||
            reservation > maximumUploadBytes)
            throw new ValidationError("File exceeds the 250 MiB limit");
        const id = randomUUID(), file = this.path(groupId, id), temporary = `${file}.upload`;
        const cached = await this.store.transact(groupId, async (tx) => {
            if (input.request) {
                const previous = await tx.get("upload-request", input.request.id);
                if (previous) {
                    if (previous.fingerprint !== input.request.fingerprint)
                        throw new ConflictError("Artifact request ID was reused with different contents");
                    if (previous.asset)
                        return previous.asset;
                    throw new ConflictError("Artifact upload is already in progress");
                }
                const run = await tx.get("run", input.request.runId);
                if (run?.status !== "running")
                    throw new ConflictError("Run is not running");
                await tx.put("upload-request", input.request.id, {
                    fingerprint: input.request.fingerprint,
                });
            }
            if (tx.state.storedBytes + tx.state.uploadReservedBytes + reservation >
                tx.state.config.quotaBytes)
                throw new ConflictError("Workspace storage quota would be exceeded");
            tx.state.uploadReservedBytes += reservation;
            await tx.put("upload", id, {
                id,
                bytes: reservation,
                createdAt: new Date().toISOString(),
                requestId: input.request?.id,
            });
            return undefined;
        });
        if (cached)
            return cached;
        let bytes = 0, committed = false;
        const hash = createHash("sha256");
        const timeout = setTimeout(() => stream.destroy(new Error("Upload exceeded the 15 minute time limit")), 900000);
        timeout.unref();
        try {
            await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
            await pipeline(stream, new Transform({
                transform(chunk, _encoding, callback) {
                    bytes += chunk.length;
                    if (bytes > reservation) {
                        callback(new ValidationError("Upload exceeds its reserved size"));
                        return;
                    }
                    hash.update(chunk);
                    callback(null, chunk);
                },
            }), createWriteStream(temporary, { flags: "wx", mode: 0o600 }));
            if (input.length !== undefined && bytes !== input.length)
                throw new ValidationError("Upload was truncated");
            await rename(temporary, file);
            const asset = await this.store.transact(groupId, async (tx) => {
                const assets = await tx.list("asset");
                const version = 1 +
                    Math.max(0, ...assets.filter((a) => a.name === name).map((a) => a.version));
                const asset = {
                    id,
                    name,
                    version,
                    checksum: hash.digest("hex"),
                    bytes,
                    contentType: input.contentType.slice(0, 120),
                    source: input.source ?? "upload",
                    ...(input.resultSet ? { resultSet: input.resultSet } : {}),
                    ...(input.stagePart ? { stagePart: input.stagePart } : {}),
                    createdAt: new Date().toISOString(),
                };
                tx.state.storedBytes += bytes;
                tx.state.uploadReservedBytes -= reservation;
                await tx.remove("upload", id);
                await tx.put("asset", id, asset);
                if (input.request)
                    await tx.put("upload-request", input.request.id, {
                        fingerprint: input.request.fingerprint,
                        asset,
                    });
                await tx.emit("asset.created", {
                    assetId: id,
                    name,
                    bytes,
                    version,
                });
                return asset;
            });
            committed = true;
            return asset;
        }
        finally {
            clearTimeout(timeout);
            if (!committed) {
                await unlink(temporary).catch(() => undefined);
                await unlink(file).catch(() => undefined);
                await this.store.transact(groupId, async (tx) => {
                    if (await tx.get("upload", id)) {
                        tx.state.uploadReservedBytes -= reservation;
                        await tx.remove("upload", id);
                        if (input.request)
                            await tx.remove("upload-request", input.request.id);
                    }
                });
            }
        }
    }
    async get(groupId, id) {
        const asset = await this.store.transact(groupId, (tx) => tx.get("asset", id));
        if (!asset)
            throw new NotFoundError("Asset", id);
        return {
            asset,
            stream: () => createReadStream(this.path(groupId, id)),
        };
    }
    async remove(groupId, id, removeCache) {
        await this.store.transact(groupId, async (tx) => {
            const asset = await tx.get("asset", id);
            if (!asset)
                throw new NotFoundError("Asset", id);
            if ((await tx.list("run")).some((run) => (run.assetIds.includes(id) ||
                asset.stagePart?.runId === run.id ||
                Object.values(run.stageOutputs ?? {}).some((output) => output.assets.some((a) => a.id === id))) &&
                [
                    "draft",
                    "trial",
                    "awaiting_approval",
                    "queued",
                    "running",
                    "paused",
                ].includes(run.status)))
                throw new ConflictError("This file version is referenced by an active run");
            await removeCache?.(tx.state);
            await tx.remove("asset", id);
            tx.state.storedBytes -= asset.bytes;
            await tx.emit("asset.deleted", { assetId: id });
        });
        await unlink(this.path(groupId, id)).catch(() => undefined);
    }
    async recover(groupId) {
        await this.store.transact(groupId, async (tx) => {
            for (const upload of await tx.list("upload")) {
                if (Date.now() - Date.parse(upload.createdAt) < 3600000)
                    continue;
                await unlink(`${this.path(groupId, upload.id)}.upload`).catch(() => undefined);
                await unlink(this.path(groupId, upload.id)).catch(() => undefined);
                tx.state.uploadReservedBytes -= upload.bytes;
                await tx.remove("upload", upload.id);
                if (upload.requestId)
                    await tx.remove("upload-request", upload.requestId);
            }
        });
    }
}
