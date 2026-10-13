import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import type { IncomingMessage } from "node:http";
import type WebSocket from "ws";
import { randomUUID } from "node:crypto";
import { Readable } from "node:stream";
import path from "node:path";
import { z } from "zod";
import { WorkflowService, type WorkflowActor } from "./workflowService.js";
import { ResultService } from "./results.js";
import { AssetService } from "./assets.js";
import { ModelGateway } from "./modelGateway.js";
import { CodexWorkflowTools } from "./codexTools.js";
import { HostDirectory, SecretBox, type WorkflowHost } from "./secrets.js";
import { VmBrokerRegistry } from "./services/vmBrokerRegistry.js";
import {
  ForbiddenError,
  LiveWorkflowServiceError,
  NotFoundError,
  ValidationError,
} from "./services/errors.js";
import { json, money, fingerprint } from "./schemas.js";
import { requireRun, type UsageReservation } from "./budget.js";
import { packageCatalog } from "./packages.js";
import { workflowModelDefaults } from "./modelDefaults.js";
import {
  YP_LIVE_WORKFLOW_VM_PROTOCOL,
  VmBrokerHelloEnvelopeSchema,
  VmSessionEventPayloadSchema,
  VmCodexAuthMaterialUpdatedPayloadSchema,
} from "./contracts/index.js";

type AsyncRoute = (req: Request, res: Response) => Promise<unknown>;
export interface LiveWorkflowControllerDependencies {
  service: WorkflowService;
  assets: AssetService;
  groupAccess(groupId: number, userId: number): Promise<WorkflowActor>;
  groupChoices(
    userId: number,
    search: string,
  ): Promise<{ id: number; name: string }[]>;
}

/** Keep application database bootstrap out of isolated integration harnesses. */
export async function createLiveWorkflowsController() {
  const [
    { default: models },
    { SequelizeWorkflowStore },
    { ConnectorService },
    access,
  ] = await Promise.all([
    import("../models/index.cjs"),
    import("./store.js"),
    import("./connectors.js"),
    import("./access.js"),
  ]);
  const store = new SequelizeWorkflowStore(models.sequelize);
  const secrets = new SecretBox(
    process.env.YP_LIVE_WORKFLOW_AUTH_ENCRYPTION_KEY ?? "",
  );
  const service = new WorkflowService(
    store,
    new VmBrokerRegistry(),
    new HostDirectory(),
    secrets,
    new ModelGateway(store),
    new ConnectorService(store, secrets),
  );
  return new LiveWorkflowsController({
    service,
    assets: new AssetService(
      store,
      process.env.YP_LIVE_WORKFLOW_DATA_ROOT ??
        path.resolve(".live-workflow-data"),
    ),
    ...access,
  });
}
export class LiveWorkflowsController {
  readonly path = "/api/live-workflows";
  readonly router = express.Router();
  get service() {
    return this.dependencies.service;
  }
  get broker() {
    return this.service.broker;
  }
  get hosts() {
    return this.service.hosts;
  }
  get store() {
    return this.service.store;
  }
  get models() {
    return this.service.models;
  }
  get connectors() {
    return this.service.connectors;
  }
  get assets() {
    return this.dependencies.assets;
  }
  readonly ready: Promise<void>;
  private readonly recovery: ReturnType<typeof setInterval>;
  constructor(
    private readonly dependencies: LiveWorkflowControllerDependencies,
  ) {
    this.ready = this.service.initialize();
    // Avoid logging request bodies here: login material and connector keys are sensitive.
    this.ready.catch((error) =>
      console.error(
        "Live Workflows initialization failed:",
        error instanceof Error ? error.message : "Unknown error",
      ),
    );
    this.routes();
    let recovering = false;
    this.recovery = setInterval(() => {
      if (recovering) return;
      recovering = true;
      void this.ready
        .then(async () => {
          for (const groupId of await this.store.groups()) {
            await this.models.budget.recover(groupId);
            await this.assets.recover(groupId);
          }
        })
        .catch(() => undefined)
        .finally(() => {
          recovering = false;
        });
    }, 60_000);
    this.recovery.unref();
    this.router.use(
      (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
        if (res.headersSent) {
          res.end();
          return;
        }
        const status =
          error instanceof LiveWorkflowServiceError
            ? error.statusCode
            : error instanceof z.ZodError
              ? 400
              : 500;
        res.status(status).json({
          error:
            error instanceof LiveWorkflowServiceError
              ? error.message
              : error instanceof z.ZodError
                ? "Invalid workflow request"
                : "Workflow operation failed; check the service logs",
          code:
            error instanceof LiveWorkflowServiceError
              ? error.code
              : "workflow_error",
        });
        if (status === 500)
          console.error(
            "Live workflow operation failed",
            error instanceof Error ? error.message : "Unknown error",
          );
      },
    );
  }
  close() {
    clearInterval(this.recovery);
  }
  private route(
    method: "get" | "post" | "put" | "delete",
    route: string,
    handler: AsyncRoute,
  ) {
    this.router[method](route, (req, res, next) => {
      void this.ready
        .then(() => handler(req, res))
        .then((value) => {
          if (!res.headersSent && value !== undefined) res.json(value);
        })
        .catch(next);
    });
  }
  private group(req: Request) {
    return z.coerce.number().int().positive().parse(req.params.groupId);
  }
  private async actor(req: Request): Promise<WorkflowActor> {
    const userId = Number((req.user as { id?: number } | undefined)?.id);
    const access = await this.dependencies.groupAccess(this.group(req), userId);
    return { userId: access.userId, admin: access.admin };
  }
  private host(req: Request): WorkflowHost {
    const host = this.hosts.authenticate(req.headers.authorization);
    if (!host) throw new ForbiddenError("Invalid VM host credential");
    return host;
  }
  private async hostGroup(req: Request) {
    const host = this.host(req),
      groupId = this.group(req);
    await this.store.transact(groupId, async (tx) => {
      if (tx.state.config.hostId !== host.id)
        throw new ForbiddenError("Workspace is assigned to another host");
    });
    return { host, groupId };
  }
  private routes() {
    // Reject cross-origin cookie-authenticated mutations, including raw uploads.
    this.router.use((req, res, next) => {
      if (
        !["GET", "HEAD", "OPTIONS"].includes(req.method) &&
        !req.path.startsWith("/vm/")
      ) {
        const origin = req.headers.origin;
        const expected =
          process.env.YP_LIVE_WORKFLOW_PUBLIC_ORIGIN ??
          `${req.protocol}://${req.get("host")}`;
        if (!origin || origin !== expected) {
          res.status(403).json({ error: "Same-origin request required" });
          return;
        }
      }
      next();
    });
    this.route("get", "/catalog", async (req) => {
      if (!req.user) throw new ForbiddenError();
      return {
        packages: await packageCatalog(),
        models: this.models.catalog(),
        modelDefaults: workflowModelDefaults,
        hosts: this.hosts.hosts.map((h) => ({
          id: h.id,
          name: h.name,
          connected: this.broker.isConnected(h.id),
        })),
      };
    });
    this.route("get", "/groups/:groupId", async (req) =>
      this.service.snapshot(this.group(req), await this.actor(req)),
    );
    this.route("get", "/groups/:groupId/access", async (req) =>
      this.actor(req),
    );
    this.route("post", "/groups/:groupId", async (req) =>
      this.service.create(this.group(req), await this.actor(req), req.body),
    );
    this.route("put", "/groups/:groupId/configuration", async (req) => {
      await this.service.configure(
        this.group(req),
        await this.actor(req),
        req.body,
      );
      return { ok: true };
    });
    this.route("post", "/groups/:groupId/prepare", async (req) => {
      const actor = await this.actor(req);
      if (!actor.admin) throw new ForbiddenError();
      await this.service.prepare(this.group(req));
      return { ok: true };
    });
    this.route("post", "/groups/:groupId/operator", async (req) => {
      await this.service.claim(
        this.group(req),
        await this.actor(req),
        z.boolean().parse(req.body.takeover),
      );
      return { ok: true };
    });
    this.route("post", "/groups/:groupId/account/login", async (req) =>
      this.service.login(this.group(req), await this.actor(req)),
    );
    this.route("post", "/groups/:groupId/account/api-key", async (req) =>
      this.service.connectApiKey(
        this.group(req),
        await this.actor(req),
        req.body,
      ),
    );
    this.route("post", "/groups/:groupId/account/complete", async (req) =>
      this.service.completeLogin(this.group(req), await this.actor(req)),
    );
    this.route("delete", "/groups/:groupId/account", async (req) => {
      await this.service.disconnect(this.group(req), await this.actor(req));
      return { ok: true };
    });
    this.route("get", "/groups/:groupId/codex-models", async (req) =>
      this.service.codexModels(this.group(req), await this.actor(req)),
    );
    this.route("post", "/groups/:groupId/chat", async (req) => {
      const body = z
        .object({ text: z.string(), steer: z.boolean().default(false) })
        .strict()
        .parse(req.body);
      return this.service.chat(
        this.group(req),
        await this.actor(req),
        body.text,
        body.steer,
      );
    });
    this.route("post", "/groups/:groupId/session/:operation", async (req) => {
      const operation = z
        .enum(["interrupt", "approval", "terminate"])
        .parse(req.params.operation);
      const body =
        operation === "approval"
          ? z
              .object({
                requestId: z.union([z.string(), z.number()]),
                result: z.record(z.string(), json).optional(),
                error: z
                  .object({ code: z.number(), message: z.string() })
                  .optional(),
              })
              .strict()
              .parse(req.body)
          : {};
      return this.service.sessionControl(
        this.group(req),
        await this.actor(req),
        operation,
        body,
      );
    });
    this.route("put", "/groups/:groupId/graph", async (req) => {
      await this.service.updateGraph(
        this.group(req),
        await this.actor(req),
        req.body.graph,
        z.number().int().parse(req.body.revision),
      );
      return { ok: true };
    });
    this.route("post", "/groups/:groupId/validate", async (req) => {
      const actor = await this.actor(req);
      await this.store.transact(this.group(req), async (tx) =>
        this.service.requireOperator(tx, actor),
      );
      const snapshot = await this.service.packageSnapshot(this.group(req));
      return { hash: snapshot.hash, graph: snapshot.graph };
    });
    this.route("get", "/groups/:groupId/revisions", async (req) => {
      await this.actor(req);
      return this.service.revisions(this.group(req));
    });
    this.route("get", "/groups/:groupId/revisions/:hash", async (req) => {
      await this.actor(req);
      return this.service.revision(this.group(req), String(req.params.hash));
    });
    this.route(
      "post",
      "/groups/:groupId/revisions/:hash/restore",
      async (req) =>
        this.service.restoreRevision(
          this.group(req),
          await this.actor(req),
          String(req.params.hash),
          z.number().int().positive().parse(req.body.revision),
        ),
    );
    this.route("get", "/groups/:groupId/storage", async (req) =>
      this.service.storage(this.group(req), await this.actor(req)),
    );
    this.route("post", "/groups/:groupId/storage/prune", async (req) =>
      this.service.storage(this.group(req), await this.actor(req), true),
    );
    this.route("get", "/groups/:groupId/events", async (req, res) => {
      await this.actor(req);
      const after = z.coerce
        .number()
        .int()
        .nonnegative()
        .parse(req.query.after ?? 0);
      res.setHeader("Cache-Control", "no-store");
      return { events: await this.store.events(this.group(req), after) };
    });
    this.route("get", "/groups/:groupId/stream", async (req, res) => {
      await this.actor(req);
      let after = z.coerce
          .number()
          .int()
          .nonnegative()
          .parse(req.headers["last-event-id"] ?? req.query.after ?? 0),
        closed = false;
      res.writeHead(200, {
        "content-type": "text/event-stream",
        "cache-control": "no-cache, no-transform",
        connection: "keep-alive",
        "x-accel-buffering": "no",
      });
      res.flushHeaders();
      req.on("close", () => {
        closed = true;
      });
      let ticks = 0;
      while (!closed) {
        if (ticks++ % 20 === 0) await this.actor(req);
        const events = await this.store.events(this.group(req), after);
        for (const event of events) {
          res.write(`id: ${event.seq}\ndata: ${JSON.stringify(event)}\n\n`);
          after = event.seq;
        }
        if (!events.length) res.write(": heartbeat\n\n");
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    });
    this.route("post", "/groups/:groupId/assets", async (req) => {
      const actor = await this.actor(req);
      await this.store.transact(this.group(req), async (tx) =>
        this.service.requireOperator(tx, actor),
      );
      return this.assets.upload(this.group(req), req, {
        name: decodeURIComponent(
          String(req.headers["x-file-name"] ?? "upload"),
        ),
        contentType: String(
          req.headers["content-type"] ?? "application/octet-stream",
        ),
        length: req.headers["content-length"]
          ? Number(req.headers["content-length"])
          : undefined,
      });
    });
    this.route("get", "/groups/:groupId/assets/:id", async (req, res) => {
      await this.actor(req);
      await this.download(this.group(req), String(req.params.id), res);
    });
    this.route("get", "/groups/:groupId/assets/:id/preview", async (req) => {
      await this.actor(req);
      const groupId = this.group(req);
      const { asset } = await this.assets.get(groupId, String(req.params.id));
      const state = await this.store.transact(groupId, async (tx) => tx.state);
      const response = z
        .object({
          data: z.object({
            inputCount: z.number(),
            preview: z.array(json),
          }),
        })
        .parse(
          await this.service.command(
            state.config.hostId,
            "workflow.inputs",
            {
              groupId,
              workspaceId: state.id,
              rootPath: this.service.root(state),
              assets: [asset],
            },
            300_000,
          ),
        );
      return response.data;
    });
    this.route("delete", "/groups/:groupId/assets/:id", async (req) => {
      const actor = await this.actor(req);
      await this.store.transact(this.group(req), async (tx) =>
        this.service.requireOperator(tx, actor),
      );
      await this.assets.remove(
        this.group(req),
        String(req.params.id),
        async (state) => {
          await this.service.command(
            state.config.hostId,
            "workflow.remove-input",
            {
              groupId: state.groupId,
              workspaceId: state.id,
              rootPath: this.service.root(state),
              assetId: String(req.params.id),
            },
          );
        },
      );
      return { ok: true };
    });
    this.route("post", "/groups/:groupId/connectors", async (req) => {
      const actor = await this.actor(req);
      if (!actor.admin) throw new ForbiddenError();
      await this.connectors.bind(
        this.group(req),
        actor.userId,
        req.body.binding,
        req.body.credential,
      );
      return { ok: true };
    });
    this.route(
      "post",
      "/groups/:groupId/connection-proposals/:id/approve",
      async (req) => {
        const actor = await this.actor(req);
        const proposal = await this.service.connectionProposal(
          this.group(req),
          actor,
          String(req.params.id),
        );
        const body = z
          .object({ credential: z.unknown() })
          .strict()
          .parse(req.body);
        await this.connectors.bind(
          this.group(req),
          actor.userId,
          proposal.binding,
          body.credential,
          proposal.id,
        );
        return { ok: true };
      },
    );
    this.route(
      "post",
      "/groups/:groupId/connection-proposals/:id/reject",
      async (req) => {
        await this.service.rejectConnection(
          this.group(req),
          await this.actor(req),
          String(req.params.id),
        );
        return { ok: true };
      },
    );
    this.route("get", "/groups/:groupId/connection-groups", async (req) => {
      const actor = await this.actor(req);
      if (!actor.admin) throw new ForbiddenError();
      return this.dependencies.groupChoices(
        actor.userId,
        z
          .string()
          .max(120)
          .parse(req.query.q ?? ""),
      );
    });
    this.route("delete", "/groups/:groupId/connectors/:id", async (req) => {
      const actor = await this.actor(req);
      if (!actor.admin) throw new ForbiddenError();
      await this.connectors.revoke(this.group(req), String(req.params.id));
      return { ok: true };
    });
    this.route("post", "/groups/:groupId/connectors/:id/check", async (req) => {
      const actor = await this.actor(req);
      if (!actor.admin) throw new ForbiddenError();
      const rows = await this.connectors.read(
        this.group(req),
        String(req.params.id),
        actor.userId,
      );
      return { records: Array.isArray(rows) ? rows.length : 1 };
    });
    this.route(
      "post",
      "/groups/:groupId/connectors/:id/import",
      async (req) => {
        const actor = await this.actor(req);
        await this.store.transact(this.group(req), async (tx) =>
          this.service.requireOperator(tx, actor),
        );
        const contents = Buffer.from(
          JSON.stringify(
            await this.connectors.read(
              this.group(req),
              String(req.params.id),
              actor.userId,
            ),
          ),
        );
        return this.assets.upload(this.group(req), Readable.from(contents), {
          name: `${req.params.id}.json`,
          contentType: "application/json",
          length: contents.length,
          source: "connector",
        });
      },
    );
    this.route("get", "/groups/:groupId/runs/:id/results", async (req) => {
      await this.actor(req);
      return new ResultService(this.store, this.assets).page(
        this.group(req),
        z.string().uuid().parse(req.params.id),
        req.query,
      );
    });
    this.route("post", "/groups/:groupId/runs", async (req) => {
      const body = z
        .object({
          mode: z.enum(["trial", "bulk"]),
          assetIds: z.array(z.string().uuid()).min(1).max(100),
          sampleCount: z.number().int().min(1).max(20).default(5),
          targetNodeId: z.string().min(1).max(128).optional(),
        })
        .strict()
        .parse(req.body);
      return this.service.draftRun(
        this.group(req),
        await this.actor(req),
        body.mode,
        body.assetIds,
        body.sampleCount,
        body.targetNodeId,
      );
    });
    this.route("post", "/groups/:groupId/runs/:id/start", async (req) => {
      await this.service.startRun(
        this.group(req),
        await this.actor(req),
        String(req.params.id),
        req.body.budgetMicros,
      );
      return { ok: true };
    });
    this.route("post", "/groups/:groupId/runs/:id/:operation", async (req) => {
      await this.service.controlRun(
        this.group(req),
        await this.actor(req),
        String(req.params.id),
        z.enum(["pause", "resume", "cancel"]).parse(req.params.operation),
        req.body.budgetMicros,
        req.body.nodeBudgets,
      );
      return { ok: true };
    });
    this.route("get", "/groups/:groupId/usage", async (req) => {
      await this.actor(req);
      return this.store.transact(this.group(req), (tx) =>
        tx.list<UsageReservation>("usage"),
      );
    });
    this.route("post", "/groups/:groupId/usage/:id/reconcile", async (req) => {
      const actor = await this.actor(req);
      if (!actor.admin) throw new ForbiddenError();
      const data = z
        .object({
          actualMicros: money,
          result: json,
          note: z.string().min(5).max(2000),
        })
        .strict()
        .parse(req.body);
      await this.models.budget.settle(
        this.group(req),
        String(req.params.id),
        data.actualMicros,
        data.result,
        true,
      );
      await this.store.transact(this.group(req), (tx) =>
        tx.emit("usage.reconciled", {
          requestId: String(req.params.id),
          userId: actor.userId,
          note: data.note,
        }),
      );
      return { ok: true };
    });
    this.vmRoutes();
  }
  private async download(groupId: number, id: string, res: Response) {
    const { asset, stream } = await this.assets.get(groupId, id);
    res.setHeader("content-type", "application/octet-stream");
    res.setHeader("x-content-type-options", "nosniff");
    res.setHeader("content-security-policy", "sandbox");
    res.setHeader(
      "content-disposition",
      `attachment; filename*=UTF-8''${encodeURIComponent(asset.name)}`,
    );
    res.setHeader("content-length", asset.bytes);
    res.setHeader("cache-control", "private, no-store");
    stream()
      .on("error", () => res.destroy())
      .pipe(res);
  }
  private vmRoutes() {
    this.route("post", "/vm/events", async (req) => {
      const host = this.host(req),
        body = z
          .object({
            protocol: z.literal(YP_LIVE_WORKFLOW_VM_PROTOCOL),
            messageType: z.string(),
            data: z.record(z.string(), z.unknown()),
          })
          .parse(req.body);
      if (body.data.vmHostId && body.data.vmHostId !== host.id)
        throw new ForbiddenError();
      if (body.messageType === "session.event")
        await this.service.ingestSession(
          host.id,
          VmSessionEventPayloadSchema.parse(body.data),
        );
      else if (body.messageType === "codex.auth.material.updated")
        await this.service.ingestAuth(
          host.id,
          VmCodexAuthMaterialUpdatedPayloadSchema.parse(body.data),
        );
      else if (body.messageType === "vm.register")
        await this.service.hostRestarted(host.id);
      else if (
        !["vm.register", "vm.heartbeat", "vm.telemetry"].includes(
          body.messageType,
        )
      )
        throw new ValidationError("Unknown VM event");
      return {
        ok: true,
        vmHostId: host.id,
        messageType: body.messageType,
      };
    });
    this.route("get", "/vm/groups/:groupId/assets/:id", async (req, res) => {
      await this.hostGroup(req);
      await this.download(this.group(req), String(req.params.id), res);
    });
    this.route("post", "/vm/groups/:groupId/codex/:operation", async (req) => {
      await this.hostGroup(req);
      const groupId = this.group(req);
      const state = await this.store.transact(groupId, async (tx) => tx.state);
      if (!state.operator) throw new ForbiddenError("No active operator");
      const access = await this.dependencies.groupAccess(
        groupId,
        state.operator.userId,
      );
      return new CodexWorkflowTools(
        this.service,
        this.assets,
        this.connectors,
        this.dependencies.groupChoices,
      ).execute(
        groupId,
        { userId: access.userId, admin: access.admin },
        req.params.operation,
        req.body,
      );
    });
    this.route(
      "post",
      "/vm/groups/:groupId/runs/:id/:operation",
      async (req) => {
        const { host, groupId } = await this.hostGroup(req),
          runId = z.string().uuid().parse(req.params.id),
          operation = z
            .enum([
              "model",
              "connector",
              "progress",
              "artifact",
              "status",
              "events",
            ])
            .parse(req.params.operation);
        const run = await this.store.transact(groupId, (tx) =>
          requireRun(tx, runId),
        );
        if (operation === "status") return { status: run.status };
        if (operation === "model")
          return this.models.call(groupId, { ...req.body, runId });
        if (operation === "connector")
          return this.connectors.request(groupId, { ...req.body, runId });
        if (operation === "events") {
          const event = z
            .object({
              type: z.enum([
                "run.started",
                "run.completed",
                "run.failed",
                "run.recovered",
              ]),
              data: z.record(z.string(), json),
              key: z.string().max(240),
            })
            .parse(req.body);
          await this.service.runnerEvent(
            groupId,
            host.id,
            runId,
            event.type,
            event.data,
            event.key,
          );
          return { ok: true };
        }
        if (!run.nodeIds.includes(req.body.nodeId))
          throw new ForbiddenError("Unknown processing node");
        if (operation === "progress") {
          const data = z
            .object({
              nodeId: z.string(),
              processed: z.number().int().nonnegative(),
              total: z.number().int().nonnegative(),
              child: z.string().max(160).nullable().optional(),
              complete: z.boolean().optional(),
              failedRecords: z.number().int().nonnegative().optional(),
              outputCount: z.number().int().nonnegative().optional(),
              upstream: z.array(z.string()).max(200).optional(),
              sample: z
                .object({
                  recordIds: z.array(z.string().max(600)).max(20),
                  populationCount: z.number().int().positive(),
                  populationLengthRange: z
                    .array(z.number().int().nonnegative())
                    .length(2),
                  sampleLengthRange: z
                    .array(z.number().int().nonnegative())
                    .length(2),
                })
                .optional(),
              executionId: z.string().uuid(),
            })
            .parse(req.body);
          await this.service.runnerEvent(
            groupId,
            host.id,
            runId,
            "node.progress",
            data,
            `progress:${randomUUID()}`,
          );
          return { ok: true };
        }
        const body = z
          .object({
            id: z.string().uuid(),
            name: z.string().min(1).max(160),
            content: z.string().max(10_000_000),
            contentType: z.string().max(120),
            resultPart: z.number().int().min(0).max(1_000_000).optional(),
          })
          .parse(req.body);
        let resultSet: YpWorkflowAsset["resultSet"];
        if (body.resultPart !== undefined) {
          if (Buffer.byteLength(body.content) > 1_048_576)
            throw new ValidationError("Result chunk exceeds 1 MiB");
          const rows = z
            .array(z.record(z.string(), json))
            .max(100)
            .parse(JSON.parse(body.content));
          resultSet = {
            runId,
            nodeId: req.body.nodeId,
            part: body.resultPart,
            count: rows.length,
          };
        }
        const contents = Buffer.from(body.content),
          asset = await this.assets.upload(groupId, Readable.from(contents), {
            name: `${runId}-${body.name}`,
            contentType: body.contentType,
            length: contents.length,
            source: "artifact",
            resultSet,
            request: {
              id: body.id,
              fingerprint: fingerprint({
                runId,
                nodeId: req.body.nodeId,
                ...body,
              }),
              runId,
            },
          });
        return asset;
      },
    );
  }
  acceptVmConnection(socket: WebSocket, request: IncomingMessage): boolean {
    if (
      new URL(request.url ?? "/", "http://localhost").pathname !==
      `${this.path}/vm/ws`
    )
      return false;
    const host = this.hosts.authenticate(request.headers.authorization);
    if (!host) {
      socket.close(4403, "Invalid VM host credential");
      return true;
    }
    let connectionId: string | undefined;
    const timer = setTimeout(() => {
      if (!connectionId) socket.close(4408, "VM hello timeout");
    }, 10_000);
    socket.on("message", (raw) => {
      void (async () => {
        await this.ready;
        const frame: unknown = JSON.parse(raw.toString());
        if (!connectionId) {
          const hello = VmBrokerHelloEnvelopeSchema.parse(frame);
          if (hello.data.vmHostId !== host.id) throw new ForbiddenError();
          connectionId = randomUUID();
          this.broker.bindConnection({
            vmHostId: host.id,
            connectionId,
            socket,
          });
          clearTimeout(timer);
          socket.send(
            JSON.stringify({
              ok: true,
              protocol: YP_LIVE_WORKFLOW_VM_PROTOCOL,
              messageType: "vm.broker.hello.ack",
              ts: new Date().toISOString(),
              data: { ok: true, vmHostId: host.id, connectionId },
            }),
          );
          return;
        }
        if (!this.broker.handleCommandFrame(connectionId, frame))
          throw new ValidationError(
            "Unexpected VM frame; use acknowledged HTTP events",
          );
      })().catch(() => socket.close(4400, "Invalid VM frame"));
    });
    socket.on("close", () => {
      clearTimeout(timer);
      if (connectionId)
        this.broker.removeConnection(host.id, connectionId, socket);
    });
    return true;
  }
}
