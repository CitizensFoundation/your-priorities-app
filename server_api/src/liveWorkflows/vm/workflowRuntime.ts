import { codexOperations } from "../runner/cliArguments.js";
import { workflowGatewayTimeoutMs } from "../runner/modelLimits.js";
import { writeWorkflowCli } from "./workflowCli.js";
import { createServer, type Server } from "node:http";
import { spawn, type ChildProcess } from "node:child_process";
import {
  mkdir,
  writeFile,
  readFile,
  unlink,
  chmod,
  lstat,
  realpath,
  readdir,
  rename,
  rm,
  open,
  copyFile,
  statfs,
} from "node:fs/promises";
import { constants, createWriteStream } from "node:fs";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import path from "node:path";
import { randomUUID, createHash } from "node:crypto";
import { z } from "zod";
import { readPackage, validatePackage } from "../packages.js";
import { graphSchema, fingerprint } from "../schemas.js";
import { DurableOutbox } from "./durableOutbox.js";
import { stopProcessingExecution } from "./stopProcessingExecution.js";
import type { VmAgentConfig } from "./config.js";
import type { CodexAdapter } from "./codex/codexAdapter.js";
import type { VmCommandHandler } from "./commands/vmCommandRouter.js";
import { YP_LIVE_WORKFLOW_VM_PROTOCOL } from "../contracts/index.js";

const locationSchema = z.object({
  groupId: z.number().int().positive(),
  workspaceId: z.string().uuid(),
  rootPath: z.string(),
});
type Location = z.infer<typeof locationSchema>;
type Running = {
  child: ChildProcess;
  socket: Server;
  directory: string;
  container: string;
  location: Location;
  run: YpWorkflowRun;
  stopped?: boolean;
  done: Promise<void>;
};

/** Trusted host coordinator. Processing containers have no network, host token, Docker socket,
 * ChatGPT auth directory, or provider credentials. All capabilities pass through scoped Unix sockets. */
export class WorkflowVmRuntime {
  private readonly sockets = new Map<string, Server>();
  private readonly runs = new Map<string, Running>();
  private readonly outbox: DurableOutbox;
  private readonly timer: ReturnType<typeof setInterval>;
  constructor(
    private readonly config: VmAgentConfig,
    private readonly codex: CodexAdapter,
  ) {
    this.outbox = new DurableOutbox(
      path.join(path.dirname(config.statePath), "workflow-outbox"),
      async (item) => {
        const data = item.data as {
          groupId: number;
          runId: string;
          type: string;
          data: unknown;
          key: string;
        };
        await this.api(
          `/vm/groups/${data.groupId}/runs/${data.runId}/events`,
          data,
        );
      },
    );
    this.timer = setInterval(() => {
      void this.outbox.drain().catch(() => undefined);
    }, 2000);
    this.timer.unref();
  }
  handlers(): VmCommandHandler[] {
    return [
      "attach",
      "graph",
      "snapshot",
      "inputs",
      "run",
      "control",
      "models",
      "remove-input",
      "restore",
      "storage",
      "prune",
    ].map((operation) => ({
      path: `/commands/workflow.${operation}`,
      handle: async (body: unknown) => {
        const envelope = z
          .object({
            commandId: z.string(),
            data: z.record(z.string(), z.unknown()),
          })
          .parse(body);
        const data =
          operation === "models"
            ? await this.codex.listModels(
                z.string().uuid().parse(envelope.data.sessionId),
              )
            : await this.handle(operation, envelope.data);
        return {
          ok: true,
          protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
          messageType: `workflow.${operation}.done`,
          commandId: envelope.commandId,
          ts: new Date().toISOString(),
          data,
        };
      },
    }));
  }
  private async api(route: string, body?: unknown) {
    const response = await fetch(
      `${this.config.apiBaseUrl}/api/live-workflows${route}`,
      {
        method: body === undefined ? "GET" : "POST",
        headers: {
          authorization: `Bearer ${this.config.token}`,
          "content-type": "application/json",
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(workflowGatewayTimeoutMs),
      },
    );
    const result = (await response.json()) as Record<string, unknown>;
    if (!response.ok)
      throw new Error(
        typeof result.error === "string"
          ? result.error
          : `Workflow API failed (${response.status})`,
      );
    return result;
  }
  private async location(value: unknown): Promise<Location> {
    const location = locationSchema.parse(value);
    if (
      path.resolve(location.rootPath) !==
      path.join(path.resolve(this.config.workspaceRoot), location.workspaceId)
    )
      throw new Error("Invalid workflow workspace root");
    await this.safeDirectory(location.rootPath);
    return location;
  }
  private async safeDirectory(directory: string) {
    await mkdir(directory, { recursive: true, mode: 0o700 });
    if ((await lstat(directory)).isSymbolicLink())
      throw new Error("Workflow directories cannot be symlinks");
    const resolved = await realpath(directory),
      root = await realpath(this.config.workspaceRoot);
    if (!resolved.startsWith(`${root}${path.sep}`))
      throw new Error("Workflow directory escapes the host workspace root");
  }
  private async directoryHandle(directory: string) {
    await this.safeDirectory(directory);
    const handle = await open(
      directory,
      constants.O_RDONLY | constants.O_DIRECTORY | constants.O_NOFOLLOW,
    );
    if (
      (await realpath(`/proc/self/fd/${handle.fd}`)) !== path.resolve(directory)
    ) {
      await handle.close();
      throw new Error("Workspace directory changed during access");
    }
    return handle;
  }
  private async handle(
    operation: string,
    value: Record<string, unknown>,
  ): Promise<unknown> {
    const location = await this.location(value),
      workspace = path.join(location.rootPath, "workspace"),
      packageRoot = path.join(workspace, "package");
    await this.safeDirectory(workspace);
    if (["run", "snapshot", "inputs", "restore"].includes(operation))
      await this.checkDisk();
    if (operation === "storage") {
      const disk = await statfs(this.config.workspaceRoot);
      return {
        availableBytes: disk.bavail * disk.bsize,
        minimumFreeBytes: this.minimumFreeBytes(),
      };
    }
    if (operation === "prune") {
      const ids = z.array(z.string().uuid()).max(100).parse(value.runIds);
      const root = path.join(
        this.config.workspaceRoot,
        ".processing",
        location.workspaceId,
      );
      for (const id of ids) {
        if (this.runs.has(id))
          throw new Error("An active run cannot be pruned");
        const directory = path.join(root, id);
        await this.safeDirectory(directory);
        try {
          await lstat(path.join(directory, "active.json"));
          throw new Error("Run still has an active execution marker");
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
        }
        await rm(directory, { recursive: true, force: true });
      }
      return { removed: ids.length };
    }
    if (operation === "restore") {
      const snapshot = validatePackage(value.files);
      await this.validateSources(
        snapshot.files,
        location,
        await this.imageId(),
      );
      const directory = await this.directoryHandle(workspace);
      const root = `/proc/self/fd/${directory.fd}`;
      const stage = `${root}/.package-restore-${randomUUID()}`;
      const backupName = `.package-backup-${randomUUID()}`;
      const backup = `${root}/${backupName}`;
      const instructions = `${root}/.agents-restore-${randomUUID()}`;
      try {
        await this.materialize(stage, snapshot.files);
        await writeFile(instructions, snapshot.files["AGENTS.md"], {
          mode: 0o600,
          flag: "wx",
        });
        await this.safeDirectory(packageRoot);
        await rename(`${root}/package`, backup);
        try {
          await rename(stage, `${root}/package`);
          // Atomic replacement must not follow a draft AGENTS.md symlink.
          await rename(instructions, `${root}/AGENTS.md`);
        } catch (error) {
          await rename(`${root}/package`, stage).catch(() => undefined);
          await rename(backup, `${root}/package`);
          throw error;
        }
        // Keep even an invalid unsaved draft recoverable by the operator.
        return { hash: snapshot.hash, backup: backupName };
      } finally {
        await rm(stage, { recursive: true, force: true });
        await rm(instructions, { force: true });
        await directory.close();
      }
    }
    if (operation === "attach") {
      await this.attach(location);
      return { attached: true };
    }
    if (operation === "snapshot") {
      await this.safeDirectory(packageRoot);
      const snapshot = await readPackage(packageRoot);
      // Typecheck a readonly copy in an isolated compiler container before accepting source.
      const runtimeImage = await this.imageId();
      await this.validateSources(snapshot.files, location, runtimeImage);
      return { ...snapshot, runtimeImage };
    }
    if (operation === "graph") {
      const graph = graphSchema.parse(value.graph),
        handle = await this.directoryHandle(packageRoot);
      try {
        const file = `/proc/self/fd/${handle.fd}/graph.json`,
          temporary = `${file}.${randomUUID()}.tmp`;
        await writeFile(temporary, JSON.stringify(graph, null, 2), {
          mode: 0o600,
          flag: "wx",
        });
        await rename(temporary, file);
        return { graph };
      } finally {
        await handle.close();
      }
    }
    if (operation === "inputs") {
      const assets = this.assets(value.assets);
      const inputs = await this.inputs(location, assets);
      const preview: Record<string, YpWorkflowJson>[] = [];
      let bytes = 0;
      for (const row of inputs.slice(0, 20)) {
        const copy = Object.fromEntries(
          Object.entries(row)
            .slice(0, 40)
            .map(([key, value]) => [
              key,
              typeof value === "string" ? value.slice(0, 8000) : value,
            ]),
        );
        bytes += Buffer.byteLength(JSON.stringify(copy));
        if (bytes > 500_000) break;
        preview.push(copy);
      }
      return { inputCount: inputs.length, preview };
    }
    if (operation === "remove-input") {
      const id = z.string().uuid().parse(value.assetId);
      const directory = await this.directoryHandle(
        path.join(workspace, "data"),
      );
      try {
        await unlink(`/proc/self/fd/${directory.fd}/${id}`).catch((error) => {
          if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
        });
      } finally {
        await directory.close();
      }
      return { removed: true };
    }
    if (operation === "run") {
      const run = value.run as YpWorkflowRun;
      z.string().uuid().parse(run?.id);
      z.string()
        .regex(/^sha256:[a-f0-9]{64}$/)
        .parse(run.runtimeImage);
      const snapshot = validatePackage(value.files);
      if (
        run.sourceHash !== snapshot.hash ||
        // PostgreSQL JSONB reorders object keys; compare approved content, not serialization order.
        fingerprint(run.graph) !== fingerprint(snapshot.graph)
      )
        throw new Error("Run source does not match its approved snapshot");
      if (this.runs.has(run.id)) return { accepted: true, runId: run.id };
      if (
        [...this.runs.values()].some(
          (r) => r.location.workspaceId === location.workspaceId,
        )
      )
        throw new Error("This workspace already has a processing container");
      const directory = path.join(
        this.config.workspaceRoot,
        ".processing",
        location.workspaceId,
        run.id,
      );
      await this.safeDirectory(directory);
      await this.materialize(path.join(directory, "package"), snapshot.files);
      const inputs = await this.inputs(location, this.assets(value.assets));
      await mkdir(path.join(directory, "data"), {
        recursive: true,
        mode: 0o700,
      });
      await writeFile(
        path.join(directory, "data/run.json"),
        JSON.stringify(run),
      );
      await writeFile(
        path.join(directory, "data/inputs.json"),
        JSON.stringify(inputs),
      );
      await writeFile(
        path.join(directory, "location.json"),
        JSON.stringify(location),
        { mode: 0o600 },
      );
      await this.launch(location, run, directory);
      return { accepted: true, runId: run.id };
    }
    if (operation === "control") {
      const runId = z.string().uuid().parse(value.runId),
        control = z.enum(["pause", "resume", "cancel"]).parse(value.operation);
      const running = this.runs.get(runId);
      if (running && running.location.workspaceId !== location.workspaceId)
        throw new Error("Run belongs to another workspace");
      // A budget pause can arrive while Docker --rm is removing the old container.
      // Wait for its receipt and cleanup before a new execution can reuse this directory.
      if (running) {
        const previous = running.stopped;
        running.stopped = true;
        try {
          await stopProcessingExecution(
            () => this.docker(["stop", "--time", "5", running.container]),
            running.done,
          );
        } catch (error) {
          running.stopped = previous;
          throw error;
        }
      }
      if (control === "resume") {
        const directory = path.join(
          this.config.workspaceRoot,
          ".processing",
          location.workspaceId,
          runId,
        );
        const run = JSON.parse(
          await readFile(path.join(directory, "data/run.json"), "utf8"),
        ) as YpWorkflowRun;
        await this.launch(location, run, directory);
      }
      return { runId, operation: control };
    }
    throw new Error("Unknown workflow operation");
  }
  private assets(value: unknown): YpWorkflowAsset[] {
    return z
      .array(
        z.object({
          id: z.string().uuid(),
          name: z.string(),
          checksum: z.string().regex(/^[a-f0-9]{64}$/),
          bytes: z
            .number()
            .int()
            .min(0)
            .max(250 * 1024 ** 2),
          version: z.number(),
          contentType: z.string(),
          source: z.enum(["upload", "connector", "artifact"]),
          createdAt: z.string(),
        }),
      )
      .parse(value);
  }
  private async inputs(location: Location, assets: YpWorkflowAsset[]) {
    const output: Record<string, YpWorkflowJson>[] = [];
    const directory = path.join(location.rootPath, "workspace", "data");
    await this.safeDirectory(directory);
    const dataDirectory = await this.directoryHandle(directory);
    let parsedBytes = 0;
    const image = await this.imageId();
    try {
      for (const asset of assets) {
        const capture = path.join(
          this.config.workspaceRoot,
          ".input-capture",
          randomUUID(),
        );
        await this.safeDirectory(capture);
        const source = path.join(capture, "input"),
          parsed = path.join(capture, "output");
        await mkdir(source, { mode: 0o700 });
        await mkdir(parsed, { mode: 0o700 });
        const file = `/proc/self/fd/${dataDirectory.fd}/${asset.id}`,
          temp = `${file}.${randomUUID()}.tmp`;
        const container = `yp-workflow-parse-${randomUUID()}`;
        // Always replace the local cache from the immutable API version before a run.
        const hash = createHash("sha256");
        let bytes = 0;
        try {
          const response = await fetch(
            `${this.config.apiBaseUrl}/api/live-workflows/vm/groups/${location.groupId}/assets/${asset.id}`,
            {
              headers: { authorization: `Bearer ${this.config.token}` },
              signal: AbortSignal.timeout(300_000),
            },
          );
          if (!response.ok || !response.body)
            throw new Error(`Input transfer failed (${response.status})`);
          await pipeline(
            Readable.fromWeb(response.body as never),
            new Transform({
              transform(chunk: Buffer, _encoding, callback) {
                bytes += chunk.length;
                if (bytes > asset.bytes) {
                  callback(new Error("Input is larger than its manifest"));
                  return;
                }
                hash.update(chunk);
                callback(null, chunk);
              },
            }),
            createWriteStream(path.join(source, "document"), {
              flags: "wx",
              mode: 0o600,
            }),
          );
          if (bytes !== asset.bytes || hash.digest("hex") !== asset.checksum)
            throw new Error("Input checksum mismatch");
          await writeFile(
            path.join(source, "manifest.json"),
            JSON.stringify({ id: asset.id, name: asset.name }),
            { mode: 0o600 },
          );
          await this.docker([
            "run",
            "--rm",
            "--name",
            container,
            ...this.processingIsolation(),
            "--memory",
            "4g",
            "--cpus",
            "2",
            "--pids-limit",
            "128",
            "--tmpfs",
            "/tmp:rw,noexec,nosuid,size=256m",
            "--mount",
            `type=bind,source=${source},target=/input,readonly`,
            "--mount",
            `type=bind,source=${parsed},target=/output`,
            image,
            "node",
            "/opt/yp-workflow/runner/parse.js",
          ]);
          const inputError = await readFile(
            path.join(parsed, "input-error.json"), "utf8",
          ).catch((error: NodeJS.ErrnoException) => {
            if (error.code === "ENOENT") return undefined;
            throw error;
          });
          if (inputError) {
            const failure = z.object({ message: z.string().max(1000) })
              .parse(JSON.parse(inputError));
            throw new Error(failure.message);
          }
          const records = await open(
            path.join(parsed, "records.json"),
            constants.O_RDONLY | constants.O_NOFOLLOW,
          );
          try {
            parsedBytes += (await records.stat()).size;
            if (parsedBytes > 250 * 1024 ** 2)
              throw new Error(
                "Parsed inputs exceed 250 MiB for one run; split the dataset",
              );
            for (const row of JSON.parse(
              await records.readFile("utf8"),
            ) as Record<string, YpWorkflowJson>[])
              output.push(row);
          } finally {
            await records.close();
          }
          await copyFile(
            path.join(source, "document"),
            temp,
            constants.COPYFILE_EXCL,
          );
          await rename(temp, file);
        } finally {
          await unlink(temp).catch(() => undefined);
          await this.docker(["rm", "-f", container]).catch(() => undefined);
          await rm(capture, { recursive: true, force: true });
        }
      }
      return output;
    } finally {
      await dataDirectory.close();
    }
  }
  private async materialize(root: string, files: Record<string, string>) {
    await mkdir(root, { recursive: true, mode: 0o700 });
    for (const [name, content] of Object.entries(files)) {
      const target = path.join(root, name);
      await mkdir(path.dirname(target), { recursive: true, mode: 0o700 });
      await writeFile(target, content, { mode: 0o600 });
    }
  }
  private image() {
    return (
      process.env.YP_LIVE_WORKFLOW_PROCESSING_IMAGE ??
      "yp-live-workflow/processing-runtime:1"
    );
  }
  private minimumFreeBytes() {
    return z.coerce
      .number()
      .int()
      .nonnegative()
      .parse(process.env.YP_LIVE_WORKFLOW_MIN_FREE_BYTES ?? 1024 ** 3);
  }
  private async checkDisk() {
    const disk = await statfs(this.config.workspaceRoot);
    if (disk.bavail * disk.bsize < this.minimumFreeBytes())
      throw new Error(
        "Workflow host has insufficient free disk space. Archive completed runs or add storage before continuing.",
      );
  }
  private async imageId() {
    return z
      .string()
      .regex(/^sha256:[a-f0-9]{64}$/)
      .parse(
        (
          await this.docker([
            "image",
            "inspect",
            "--format",
            "{{.Id}}",
            this.image(),
          ])
        ).trim(),
      );
  }
  private processingIsolation() {
    return [
      "--runtime",
      "runc",
      "--user",
      `${process.getuid?.() ?? 1000}:${process.getgid?.() ?? 1000}`,
      "--network",
      "none",
      "--read-only",
      "--cap-drop",
      "ALL",
      "--security-opt",
      "no-new-privileges",
    ];
  }
  private async validateSources(
    files: Record<string, string>,
    location: Location,
    image: string,
  ) {
    const directory = path.join(
      this.config.workspaceRoot,
      ".validation",
      location.workspaceId,
      randomUUID(),
    );
    await this.safeDirectory(directory);
    await this.materialize(directory, files);
    // Use the trusted compiler configuration, never a package-supplied plugin or compiler executable.
    const container = `yp-workflow-validate-${randomUUID()}`;
    try {
      await this.docker([
        "run",
        "--rm",
        "--name",
        container,
        ...this.processingIsolation(),
        "--memory",
        "2g",
        "--cpus",
        "1",
        "--pids-limit",
        "128",
        "--tmpfs",
        "/tmp:rw,noexec,nosuid,size=128m",
        "--mount",
        `type=bind,source=${directory},target=/package,readonly`,
        image,
        "node",
        "/opt/yp-workflow/runner/validate.js",
      ]);
    } finally {
      await this.docker(["rm", "-f", container]).catch(() => undefined);
      await rm(directory, { recursive: true, force: true });
    }
  }
  private async attach(location: Location) {
    if (this.sockets.has(location.workspaceId)) return;
    const directory = path.join(location.rootPath, "workspace/.workflow");
    await this.safeDirectory(directory);
    const locations = path.join(this.config.workspaceRoot, ".control");
    await this.safeDirectory(locations);
    await writeFile(
      path.join(locations, `${location.workspaceId}.json`),
      JSON.stringify(location),
      { mode: 0o600 },
    );
    await writeWorkflowCli(directory);
    const server = await this.socket(
      path.join(directory, "control.sock"),
      async (route, body) => {
        if (!codexOperations.some((operation) => route === `/${operation}`))
          throw new Error("Codex cannot approve or start bulk spending");
        return this.api(`/vm/groups/${location.groupId}/codex${route}`, body);
      },
    );
    this.sockets.set(location.workspaceId, server);
  }
  private async socket(
    file: string,
    handle: (route: string, body: Record<string, unknown>) => Promise<unknown>,
  ) {
    await unlink(file).catch((error) => {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    });
    const server = createServer(async (req, res) => {
      try {
        if (req.method !== "POST") throw new Error("POST required");
        const chunks: Buffer[] = [];
        let bytes = 0;
        for await (const chunk of req) {
          bytes += chunk.length;
          if (bytes > 12_000_000) throw new Error("Request too large");
          chunks.push(chunk);
        }
        const body = z
          .record(z.string(), z.unknown())
          .parse(JSON.parse(Buffer.concat(chunks).toString("utf8")));
        const result = await handle(req.url ?? "", body);
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(result));
      } catch (error) {
        res.writeHead(409, { "content-type": "application/json" });
        res.end(
          JSON.stringify({
            error: error instanceof Error ? error.message : "Request failed",
          }),
        );
      }
    });
    // Linux sockaddr_un paths are limited to 108 bytes. Workspace/run UUID paths exceed that;
    // bind through an open directory descriptor, preserving the same socket inode in the mount.
    const directory = await open(path.dirname(file), "r");
    try {
      await new Promise<void>((resolve, reject) => {
        server.once("error", reject);
        server.listen(
          `/proc/self/fd/${directory.fd}/${path.basename(file)}`,
          resolve,
        );
      });
    } finally {
      await directory.close();
    }
    await chmod(file, 0o600);
    return server;
  }
  private async launch(
    location: Location,
    run: YpWorkflowRun,
    directory: string,
  ) {
    const output = path.join(directory, "output"),
      gateway = path.join(directory, "gateway");
    await mkdir(output, { recursive: true, mode: 0o700 });
    await mkdir(gateway, { recursive: true, mode: 0o700 });
    const executionId = randomUUID();
    const socket = await this.socket(
      path.join(gateway, "control.sock"),
      async (route, body) => {
        if (
          ![
            "/model",
            "/connector",
            "/progress",
            "/artifact",
            "/status",
          ].includes(route)
        )
          throw new Error("Unsupported processing capability");
        return this.api(
          `/vm/groups/${location.groupId}/runs/${run.id}${route}`,
          {
            ...body,
            runId: run.id,
            ...(route === "/progress" ? { executionId } : {}),
          },
        );
      },
    );
    const container = `yp-workflow-run-${run.id}`;
    try {
      await this.api(`/vm/groups/${location.groupId}/runs/${run.id}/events`, {
        type: "run.started",
        key: `run:${run.id}:started:${executionId}`,
        data: { executionId },
      });
      await writeFile(
        path.join(directory, "active.json"),
        JSON.stringify({ executionId }),
        { mode: 0o600, flush: true },
      );
    } catch (error) {
      socket.close();
      throw error;
    }
    const args = [
      "run",
      "--rm",
      "--name",
      container,
      ...this.processingIsolation(),
      "--memory",
      "4g",
      "--cpus",
      "2",
      "--pids-limit",
      "256",
      "--tmpfs",
      "/tmp:rw,noexec,nosuid,size=256m",
      "--mount",
      `type=bind,source=${directory}/package,target=/package,readonly`,
      "--mount",
      `type=bind,source=${directory}/data,target=/run-data,readonly`,
      "--mount",
      `type=bind,source=${output},target=/output`,
      "--mount",
      `type=bind,source=${gateway},target=/gateway`,
      run.runtimeImage!,
      "node",
      "--import",
      "/opt/yp-workflow/node_modules/tsx/dist/loader.mjs",
      "/opt/yp-workflow/runner/run.js",
    ];
    const child = spawn(this.config.dockerBin, args, {
      env: { PATH: process.env.PATH },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let resolveDone!: () => void;
    const done = new Promise<void>((resolve) => {
      resolveDone = resolve;
    });
    const running: Running = {
      child,
      socket,
      directory,
      container,
      location,
      run,
      done,
    };
    this.runs.set(run.id, running);
    let errorOutput = "";
    child.stdout?.on("data", () => undefined);
    child.stderr?.on("data", (chunk: Buffer) => {
      errorOutput = (errorOutput + chunk.toString()).slice(-4000);
    });
    let finishing = false;
    const finish = async (code: number | null, error?: Error) => {
      if (finishing || this.runs.get(run.id) !== running) return;
      finishing = true;
      socket.close();
      let complete = false;
      if (code === 0) {
        try {
          const receipt = JSON.parse(
            await readFile(path.join(output, "completed.json"), "utf8"),
          ) as { runId: string; nodeIds: string[] };
          complete =
            receipt.runId === run.id &&
            run.nodeIds.every((id) => receipt.nodeIds.includes(id));
        } catch {
          complete = false;
        }
      }
      try {
        if (!running.stopped)
          await this.outbox.enqueue(
            complete ? "run.completed" : "run.failed",
            {
              groupId: location.groupId,
              runId: run.id,
              type: complete ? "run.completed" : "run.failed",
              key: `run:${run.id}:exit:${executionId}`,
              data: complete
                ? { executionId }
                : {
                    executionId,
                    error:
                      error?.message ||
                      errorOutput ||
                      "Processing container failed",
                  },
            },
            `${run.id}:exit:${executionId}`,
          );
        await unlink(path.join(directory, "active.json")).catch(
          () => undefined,
        );
      } catch (error) {
        // Keep active.json for restart recovery if the durable receipt could not
        // be written. An event-listener rejection must not crash other workflows.
        console.error("Unable to persist processing completion", run.id, error);
      } finally {
        if (this.runs.get(run.id) === running) this.runs.delete(run.id);
        resolveDone();
      }
    };
    child.once("error", (error) => {
      void finish(null, error);
    });
    child.once("exit", (code) => {
      void finish(code);
    });
  }
  private async docker(args: string[]): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const process = spawn(this.config.dockerBin, args, {
        stdio: ["ignore", "pipe", "pipe"],
      });
      let output = "",
        stdout = "";
      const timeout = setTimeout(() => {
        process.kill("SIGKILL");
        reject(new Error("Docker command timed out"));
      }, 120_000);
      process.stderr?.on("data", (chunk: Buffer) => {
        output = (output + chunk.toString()).slice(-8000);
      });
      process.stdout?.on("data", (chunk: Buffer) => {
        stdout = (stdout + chunk.toString()).slice(-8000);
      });
      process.on("error", (error) => {
        clearTimeout(timeout);
        reject(error);
      });
      process.on("exit", (code) => {
        clearTimeout(timeout);
        if (code === 0) resolve(stdout);
        else reject(new Error(output || `Docker exited ${code}`));
      });
    });
  }
  async recover() {
    await mkdir(this.config.workspaceRoot, {
      recursive: true,
      mode: 0o700,
    });
    const locations = await readdir(
      path.join(this.config.workspaceRoot, ".control"),
    ).catch(() => []);
    for (const file of locations.filter((name) =>
      /^[a-f0-9-]+\.json$/.test(name),
    )) {
      const location = await this.location(
        JSON.parse(
          await readFile(
            path.join(this.config.workspaceRoot, ".control", file),
            "utf8",
          ),
        ),
      );
      await this.attach(location);
      const root = path.join(
        this.config.workspaceRoot,
        ".processing",
        location.workspaceId,
      );
      for (const runId of await readdir(root).catch(() => [])) {
        if (!z.string().uuid().safeParse(runId).success) continue;
        const directory = path.join(root, runId);
        try {
          await lstat(path.join(directory, "active.json"));
        } catch {
          continue;
        }
        // Stop only a container recorded by this host. Never restart spending automatically.
        await this.docker(["rm", "-f", `yp-workflow-run-${runId}`]).catch(
          () => undefined,
        );
        await this.outbox.enqueue(
          "run.recovered",
          {
            groupId: location.groupId,
            runId,
            type: "run.recovered",
            key: `recovered:${runId}:${randomUUID()}`,
            data: {},
          },
          `recovered:${runId}:${randomUUID()}`,
        );
        await unlink(path.join(directory, "active.json"));
      }
    }
    await this.outbox.drain().catch(() => undefined);
  }
  async close() {
    clearInterval(this.timer);
    for (const server of this.sockets.values()) server.close();
    for (const run of [...this.runs.values()]) {
      run.stopped = true;
      await this.docker(["stop", "--time", "5", run.container]).catch(
        () => undefined,
      );
      await run.done;
      await this.outbox.enqueue(
        "run.recovered",
        {
          groupId: run.location.groupId,
          runId: run.run.id,
          type: "run.recovered",
          key: `stopped:${run.run.id}:${randomUUID()}`,
          data: {},
        },
        `stopped:${run.run.id}:${randomUUID()}`,
      );
    }
  }
}
