// Share the Google APIs clients' auth class; OpenAI's peer uses Google Auth 10.
import { JWT } from "googleapis-common";
import { sheets_v4 } from "googleapis/build/src/apis/sheets/v4.js";
import { docs_v1 } from "googleapis/build/src/apis/docs/v1.js";
import { drive_v3 } from "googleapis/build/src/apis/drive/v3.js";
import { z } from "zod";
import { col, where, Op } from "sequelize";
import { SecretBox } from "./secrets.js";
import type { WorkflowStore } from "./store.js";
import {
  boundedFirecrawlJson,
  documentRequest,
  firecrawlBody,
  normalizeFirecrawl,
  normalizeFirecrawlBalance,
  requireObservedDocument,
} from "./firecrawl.js";
import { BudgetService, type UsageReservation } from "./budget.js";
import {
  ConflictError,
  ForbiddenError,
  ValidationError,
} from "./services/errors.js";
import { connectorSchema, identifier, json, money } from "./schemas.js";
import { sheetsWriteRange } from "./connectorRanges.js";
import { commitConnection } from "./connectionSetup.js";

interface StoredConnector {
  binding: YpWorkflowConnector;
  secret: string;
  createdBy: number;
  readSnapshot?: YpWorkflowJson;
}
export const connectorRequestSchema = z
  .object({
    id: z.string().uuid(),
    runId: z.string().uuid(),
    recordId: z.string().min(1).max(600).optional(),
    nodeId: identifier,
    binding: identifier,
    operation: z.enum(["read", "write", "search", "scrape"]),
    input: z.record(z.string(), json),
  })
  .strict();
export class ConnectorService {
  readonly budget: BudgetService;
  constructor(
    private readonly store: WorkflowStore,
    private readonly secrets: SecretBox,
    private readonly firecrawlFetch: typeof fetch = fetch,
  ) {
    this.budget = new BudgetService(store);
  }
  async bind(
    groupId: number,
    userId: number,
    value: unknown,
    credential: unknown,
    proposalId?: string,
  ) {
    const binding = connectorSchema.parse(value);
    if (binding.kind === "your-priorities") {
      const { groupAccess } = await import("./access.js");
      const access = await groupAccess(Number(binding.resourceId), userId);
      if (binding.writeEnabled && !access.admin)
        throw new ForbiddenError("You must administer the output group");
    }
    if (binding.kind.startsWith("google-"))
      z.object({
        client_email: z.string().email(),
        private_key: z.string().min(30),
      }).parse(credential);
    if (binding.kind === "firecrawl") {
      z.object({ apiKey: z.string().min(10) }).parse(credential);
      money.positive().parse(binding.settings.creditMicros);
      z.number()
        .int()
        .min(1)
        .max(1000)
        .parse(binding.settings.maxCreditsPerRequest);
    }
    await this.store.transact(groupId, async (tx) => {
      await commitConnection(
        tx,
        binding,
        userId,
        this.secrets.seal(
          credential ?? {},
          `connector:${groupId}:${binding.id}`,
        ),
        proposalId,
      );
    });
  }
  async list(groupId: number) {
    return this.store.transact(groupId, async (tx) =>
      (await tx.list<StoredConnector>("connector")).map((c) => c.binding),
    );
  }
  async revoke(groupId: number, id: string) {
    identifier.parse(id);
    await this.store.transact(groupId, async (tx) => {
      if (!(await tx.get("connector", id)))
        throw new ValidationError("Unknown connection");
      await tx.remove("connector", id);
      for (const run of await tx.list<YpWorkflowRun>("run")) {
        if (!(await tx.get("run-connector", `${run.id}:${id}`))) continue;
        await tx.remove("run-connector", `${run.id}:${id}`);
        if (["queued", "running"].includes(run.status)) {
          run.status = "paused";
          run.error =
            "A connection used by this run was disconnected. Cancel and create a new trial after rebinding it.";
          await tx.put("run", run.id, run);
        }
      }
      tx.state.revision++;
      await tx.emit("connector.revoked", { connectorId: id });
    });
  }
  async snapshotBindings(
    groupId: number,
    userId: number,
    graph: YpWorkflowGraph,
  ): Promise<StoredConnector[]> {
    const bindings = await this.store.transact(groupId, (tx) =>
      tx.list<StoredConnector>("connector"),
    );
    const references = new Set(
      graph.nodes
        .filter((n) => n.enabled)
        .flatMap((n) =>
          typeof n.configuration.referenceBinding === "string"
            ? [n.configuration.referenceBinding]
            : [],
        ),
    );
    for (const binding of bindings)
      if (references.has(binding.binding.id))
        binding.readSnapshot = await this.read(
          groupId,
          binding.binding.id,
          userId,
        );
    return bindings;
  }
  async read(
    groupId: number,
    bindingId: string,
    userId: number,
  ): Promise<YpWorkflowJson> {
    const connector = await this.store.transact(groupId, (tx) =>
      tx.get<StoredConnector>("connector", bindingId),
    );
    if (!connector || connector.binding.kind === "firecrawl")
      throw new ValidationError("Choose a data connector");
    return this.execute(groupId, connector, "read", {}, userId);
  }
  async request(groupId: number, value: unknown): Promise<YpWorkflowJson> {
    const request = connectorRequestSchema.parse(value);
    const { run, connector } = await this.store.transact(
      groupId,
      async (tx) => ({
        run: await tx.get<YpWorkflowRun>("run", request.runId),
        connector: await tx.get<StoredConnector>(
          "run-connector",
          `${request.runId}:${request.binding}`,
        ),
      }),
    );
    if (!run || !connector || !run.nodeIds.includes(request.nodeId))
      throw new ForbiddenError("Connector is not bound to this run");
    if (request.operation === "read" && connector.readSnapshot === undefined)
      throw new ForbiddenError(
        "Import or bind a reference snapshot before starting this run",
      );
    if (connector.binding.kind === "firecrawl")
      firecrawlBody(connector.binding, request.operation, request.input);
    else if (!["read", "write"].includes(request.operation))
      throw new ValidationError("Unsupported data connector operation");
    if (request.operation === "write") {
      const node = run.graph.nodes.find((n) => n.id === request.nodeId);
      if (
        run.mode !== "bulk" ||
        !connector.binding.writeEnabled ||
        !Array.isArray(node?.configuration.outputBindings) ||
        !node.configuration.outputBindings.includes(request.binding)
      )
        throw new ForbiddenError(
          "Writes require an approved bulk export stage",
        );
      if (
        connector.binding.kind === "google-drive" ||
        connector.binding.kind === "firecrawl"
      )
        throw new ForbiddenError("This connector is input only");
      if (connector.binding.kind === "google-sheets") {
        const rows = z
          .array(
            z.array(z.union([z.string(), z.number(), z.boolean(), z.null()])),
          )
          .parse(request.input.rows);
        sheetsWriteRange(
          String(connector.binding.settings.range ?? "A:ZZ"),
          z
            .number()
            .int()
            .nonnegative()
            .parse(request.input.rowOffset ?? 0),
          rows,
        );
      } else
        z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            text: z.string(),
            rewrittenText: z.string().optional(),
          }),
        )
          .max(10000)
          .parse(request.input.documents);
    }
    if (connector.binding.kind === "your-priorities") {
      const { groupAccess } = await import("./access.js");
      const access = await groupAccess(
        Number(connector.binding.resourceId),
        run.ownerId,
      );
      if (request.operation === "write" && !access.admin)
        throw new ForbiddenError("Output group administrator access required");
    }
    let requestLimit: { key: string; maximum: number } | undefined;
    if (
      connector.binding.kind === "firecrawl" &&
      request.operation === "scrape"
    ) {
      const input = documentRequest.parse(request.input);
      const source = await this.store.transact(groupId, (tx) =>
        tx.get<UsageReservation>("usage", input.sourceRequestId),
      );
      requireObservedDocument(
        source,
        run.id,
        request.nodeId,
        request.binding,
        input.url,
        request.recordId,
      );
      const configuration = run.graph.nodes.find(
        (n) => n.id === request.nodeId,
      )!.configuration;
      const perRecord = z
        .number()
        .int()
        .min(0)
        .max(5)
        .parse(configuration.maxDocuments ?? 0);
      const pageLimit = z
        .number()
        .int()
        .min(1)
        .max(50)
        .parse(configuration.maxDocumentPages ?? 10);
      const charLimit = z
        .number()
        .int()
        .min(1000)
        .max(200_000)
        .parse(configuration.maxDocumentChars ?? 60000);
      if (
        !perRecord ||
        input.maxPages > pageLimit ||
        input.maxChars > charLimit
      )
        throw new ForbiddenError(
          "Document retrieval exceeds the approved graph limits",
        );
      // A parent can produce at most 20 levels; this is a hard total ceiling
      // independent of the package's cooperative per-child loop.
      requestLimit = {
        key: "firecrawl-documents",
        maximum: perRecord * run.inputCount * 20,
      };
    }
    const maximumMicros =
      connector.binding.kind === "firecrawl"
        ? money.parse(
            Number(connector.binding.settings.creditMicros) *
              Number(connector.binding.settings.maxCreditsPerRequest),
          )
        : 0;
    const { reservation, cached } = await this.budget.reserve(groupId, {
      ...request,
      requestLimit,
      maximumMicros,
      request: { ...request, bindingConfig: connector.binding },
      description: `${connector.binding.kind}:${request.operation}`,
      ...(connector.binding.kind === "firecrawl"
        ? {
            creditUsage: {
              provider: "firecrawl" as const,
              bindingId: request.binding,
              operation: request.operation as "search" | "scrape",
              maximumCredits: Number(
                connector.binding.settings.maxCreditsPerRequest,
              ),
              creditMicros: Number(connector.binding.settings.creditMicros),
            },
          }
        : {}),
    });
    if (cached) return reservation.result ?? null;
    try {
      let result =
        request.operation === "read"
          ? connector.readSnapshot!
          : await this.execute(
              groupId,
              connector,
              request.operation,
              request.input,
              run.ownerId,
            );
      if (connector.binding.kind === "firecrawl")
        result = {
          ...(result as Record<string, YpWorkflowJson>),
          requestId: request.id,
          binding: request.binding,
        };
      let actual = 0;
      if (connector.binding.kind === "firecrawl") {
        const credits = z
          .object({ creditsUsed: z.number().int().nonnegative() })
          .parse(result).creditsUsed;
        actual = money.parse(
          credits * Number(connector.binding.settings.creditMicros),
        );
      }
      await this.budget.settle(groupId, request.id, actual, result);
      return result;
    } catch (error) {
      // Even a free external write can have an ambiguous outcome. Do not duplicate it.
      await this.budget.unknown(groupId, request.id);
      throw error;
    }
  }
  private async execute(
    groupId: number,
    stored: StoredConnector,
    operation: string,
    input: Record<string, YpWorkflowJson>,
    userId: number,
  ): Promise<YpWorkflowJson> {
    const { binding } = stored;
    const credential = this.secrets.open<Record<string, string>>(
      stored.secret,
      `connector:${groupId}:${binding.id}`,
    );
    if (binding.kind === "firecrawl")
      return this.firecrawl(binding, credential.apiKey, operation, input);
    if (binding.kind === "your-priorities") {
      // Firecrawl/upload-only workflows do not need the application DB bootstrap.
      const { groupAccess } = await import("./access.js");
      const { default: models } = await import("../models/index.cjs");
      const access = await groupAccess(Number(binding.resourceId), userId);
      if (operation === "read") {
        const posts = await models.Post.findAll({
          where: {
            group_id: Number(binding.resourceId),
            [Op.and]: where(col("deleted"), false),
          },
          order: [["id", "ASC"]],
          limit: 10001,
        });
        if (posts.length > 10000)
          throw new ValidationError(
            "This group contains more than 10,000 posts. Export a selected dataset to CSV or JSON before importing.",
          );
        return posts.map((post) => ({
          id: String(post.get("id")),
          name: String(post.get("name") ?? ""),
          text: String(post.get("description") ?? ""),
          source: `yp:group:${binding.resourceId}:post:${post.get("id")}`,
        }));
      }
      if (operation !== "write" || !access.admin)
        throw new ForbiddenError("Output group administrator access required");
      const documents = z
        .array(
          z.object({
            id: z.string(),
            name: z.string(),
            rewrittenText: z.string().optional(),
            text: z.string(),
          }),
        )
        .max(10000)
        .parse(input.documents);
      const postIds: number[] = [];
      // The enclosing ledger retains an unknown reservation if the write is interrupted.
      // Never retry this stage until an administrator has reconciled the recorded output.
      await models.sequelize.transaction(async (transaction) => {
        for (const document of documents) {
          const name = document.name.slice(0, 250),
            description = document.rewrittenText ?? document.text;
          const configuration = access.group.get("configuration") as
            | Record<string, unknown>
            | undefined;
          const post = await models.Post.create(
            {
              group_id: Number(binding.resourceId),
              user_id: userId,
              name,
              description,
              content_type: 0,
              status: configuration?.allPostsBlockedByDefault
                ? "blocked"
                : "published",
              ip_address: "",
              user_agent: "Your Priorities Live Workflow",
              public_data: {
                liveWorkflowGroupId: groupId,
                sourceRecordId: document.id,
              },
            } as never,
            { transaction },
          );
          await models.PostRevision.create(
            {
              post_id: post.get("id"),
              user_id: userId,
              name,
              description,
            } as never,
            { transaction },
          );
          postIds.push(post.get("id"));
        }
        await models.Group.increment("counter_posts", {
          by: documents.length,
          where: { id: Number(binding.resourceId) },
          transaction,
        });
      });
      return { postIds };
    }
    const auth = new JWT({
      email: credential.client_email,
      key: credential.private_key,
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/documents",
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });
    const opts = { retry: false, timeout: 180_000 };
    if (binding.kind === "google-sheets") {
      const sheets = new sheets_v4.Sheets({ auth });
      const range = String(binding.settings.range ?? "A:ZZ");
      if (operation === "read") {
        const result = await sheets.spreadsheets.values.get(
          { spreadsheetId: binding.resourceId, range },
          opts,
        );
        const [headers = [], ...rows] = result.data.values ?? [];
        return rows.map((row, index) =>
          Object.fromEntries(
            headers
              .map((header, i) => [String(header), String(row[i] ?? "")])
              .concat([
                ["source", `google-sheets:${binding.resourceId}:${index + 2}`],
              ]),
          ),
        ) as YpWorkflowJson;
      }
      if (operation !== "write" || !binding.writeEnabled)
        throw new ForbiddenError();
      const values = z
        .array(
          z.array(z.union([z.string(), z.number(), z.boolean(), z.null()])),
        )
        .parse(input.rows);
      const result = await sheets.spreadsheets.values.update(
        {
          spreadsheetId: binding.resourceId,
          range: sheetsWriteRange(range, Number(input.rowOffset ?? 0), values),
          valueInputOption: "RAW",
          requestBody: { values },
        },
        opts,
      );
      return { updatedCells: result.data.updatedCells ?? 0 };
    }
    if (binding.kind === "google-docs") {
      const docs = new docs_v1.Docs({ auth });
      if (operation === "read") {
        const result = await docs.documents.get(
          { documentId: binding.resourceId },
          opts,
        );
        const text = documentText(result.data.body?.content ?? []);
        return [
          {
            id: binding.resourceId,
            name: result.data.title ?? binding.label,
            text,
            source: `google-docs:${binding.resourceId}`,
          },
        ];
      }
      if (operation !== "write" || !binding.writeEnabled)
        throw new ForbiddenError();
      const text = z
        .array(
          z.object({
            name: z.string(),
            text: z.string(),
            rewrittenText: z.string().optional(),
          }),
        )
        .parse(input.documents)
        .map((d) => `${d.name}\n${d.rewrittenText ?? d.text}`)
        .join("\n\n");
      await docs.documents.batchUpdate(
        {
          documentId: binding.resourceId,
          requestBody: {
            requests: [{ insertText: { endOfSegmentLocation: {}, text } }],
          },
        },
        opts,
      );
      return { documentId: binding.resourceId };
    }
    if (operation !== "read")
      throw new ForbiddenError("Drive bindings are input only");
    const drive = new drive_v3.Drive({ auth });
    const metadata = await drive.files.get(
      { fileId: binding.resourceId, fields: "id,name,mimeType,size" },
      opts,
    );
    const files =
      metadata.data.mimeType === "application/vnd.google-apps.folder"
        ? await this.folderFiles(drive, binding.resourceId)
        : [metadata.data];
    const records: YpWorkflowJson[] = [];
    for (const file of files) {
      if (!file.id)
        throw new ValidationError("Drive returned a file without an ID");
      if (Number(file.size ?? 0) > 10_000_000)
        throw new ValidationError(
          "Drive text imports are limited to 10 MB per file; upload larger documents directly",
        );
      let text: string;
      if (file.mimeType === "application/vnd.google-apps.document") {
        const result = await drive.files.export(
          { fileId: file.id, mimeType: "text/plain" },
          { ...opts, responseType: "text", maxContentLength: 10_000_000 },
        );
        text = String(result.data);
      } else {
        if (
          !file.mimeType?.startsWith("text/") &&
          file.mimeType !== "application/json"
        )
          throw new ValidationError(
            `Upload ${file.name ?? file.id} directly to parse its document format, or bind a Google Sheet/Doc`,
          );
        const result = await drive.files.get(
          { fileId: file.id, alt: "media" },
          { ...opts, responseType: "text", maxContentLength: 10_000_000 },
        );
        text = String(result.data);
      }
      records.push({
        id: file.id,
        name: file.name ?? binding.label,
        text,
        source: `google-drive:${file.id}`,
      });
    }
    return records;
  }
  private async folderFiles(
    drive: drive_v3.Drive,
    folderId: string,
  ): Promise<drive_v3.Schema$File[]> {
    z.string()
      .regex(/^[a-zA-Z0-9_-]+$/)
      .parse(folderId);
    const files: drive_v3.Schema$File[] = [];
    let pageToken: string | undefined;
    do {
      const result = await drive.files.list(
        {
          q: `'${folderId}' in parents and trashed = false`,
          fields: "nextPageToken,files(id,name,mimeType,size)",
          pageSize: 100,
          pageToken,
        },
        { retry: false, timeout: 180_000 },
      );
      files.push(...(result.data.files ?? []));
      pageToken = result.data.nextPageToken ?? undefined;
      if (files.length > 100)
        throw new ValidationError(
          "Bind a Drive folder containing at most 100 files",
        );
    } while (pageToken);
    return files.sort((a, b) => (a.id ?? "").localeCompare(b.id ?? ""));
  }
  private async firecrawl(
    binding: YpWorkflowConnector,
    apiKey: string,
    operation: string,
    input: Record<string, YpWorkflowJson>,
  ): Promise<YpWorkflowJson> {
    const body = firecrawlBody(binding, operation, input);
    const response = await this.firecrawlFetch(
      `https://api.firecrawl.dev/v2/${operation}`,
      {
        method: "POST",
        signal: AbortSignal.timeout(90_000),
        headers: {
          authorization: `Bearer ${apiKey}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );
    return normalizeFirecrawl(
      await boundedFirecrawlJson(response),
      operation,
      input,
    );
  }

  /** Admin-only HTTP caller. Account totals may include other groups/applications. */
  async creditUsage(
    groupId: number,
    bindingId: string,
  ): Promise<YpWorkflowFirecrawlBalance> {
    const connector = await this.store.transact(groupId, (tx) =>
      tx.get<StoredConnector>("connector", bindingId),
    );
    if (!connector || connector.binding.kind !== "firecrawl")
      throw new ValidationError("Select a connected Firecrawl binding");
    const { apiKey } = this.secrets.open<{ apiKey: string }>(
      connector.secret,
      `connector:${groupId}:${bindingId}`,
    );
    const response = await this.firecrawlFetch(
      "https://api.firecrawl.dev/v2/team/credit-usage",
      {
        headers: { authorization: `Bearer ${apiKey}` },
        signal: AbortSignal.timeout(30_000),
      },
    );
    return normalizeFirecrawlBalance(
      await boundedFirecrawlJson(response, 64 * 1024),
    );
  }
}

function documentText(contents: docs_v1.Schema$StructuralElement[]): string {
  return contents
    .map(
      (item) =>
        (item.paragraph?.elements ?? [])
          .map((element) => element.textRun?.content ?? "")
          .join("") +
        (item.table?.tableRows ?? [])
          .flatMap((row) => row.tableCells ?? [])
          .map((cell) => documentText(cell.content ?? []))
          .join("\n") +
        documentText(item.tableOfContents?.content ?? []),
    )
    .join("");
}
