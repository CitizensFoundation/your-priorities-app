import { randomUUID } from "node:crypto";
import path from "node:path";
import { z } from "zod";
import { VmBrokerRegistry } from "./services/vmBrokerRegistry.js";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "./services/errors.js";
import type { WorkflowStore, WorkflowTransaction } from "./store.js";
import { HostDirectory, SecretBox } from "./secrets.js";
import { configSchema, fingerprint, graphSchema, money } from "./schemas.js";
import {
  loadPackage,
  validatePackage,
  type PackageSnapshot,
  selectedAgents,
  withDefaultAgentModel,
} from "./packages.js";
import { workflowModelDefaults } from "./modelDefaults.js";
import { apiKeyMaterialSchema, type ApiKeyMaterial } from "./apiKeyAuth.js";
import { packageManifest } from "./runner/packageContract.js";
import { codexAuthMaterialFingerprintSha256 } from "./vm/codex/codexAuthMaterial.js";
import { estimateFromTrial, remainingForecast, requireRun } from "./budget.js";
import type { ModelGateway } from "./modelGateway.js";
import type { ConnectorService } from "./connectors.js";
import { proposeConnection } from "./connectionSetup.js";
import {
  type VmCommand,
  type CodexAuthMaterial,
  type VmSessionEventPayload,
  type VmCodexAuthMaterialUpdatedPayload,
  VmCodexAuthLoginStartedResponseEnvelopeSchema,
  VmCodexAuthLoginCompletedResponseEnvelopeSchema,
  VmSessionStartedResponseEnvelopeSchema,
} from "./contracts/index.js";

export interface WorkflowActor {
  userId: number;
  admin: boolean;
}
interface Account {
  id: string;
  userId: number;
  hostId: string;
  rootPath: string;
  loginId?: string;
  sealed?: string;
  authMode?: "chatgpt" | "api-key";
  fingerprint?: string;
  operation?: { id: string; at: number };
}
interface Session {
  id: string;
  ownerId: number;
  threadId?: string;
  turnId?: string;
  active: boolean;
  status: "starting" | "ready" | "closed" | "error";
  streamId?: string;
  sourceSeq?: number;
  startedAt?: number;
}
export class WorkflowService {
  readonly workspaceGroups = new Map<string, number>();
  constructor(
    readonly store: WorkflowStore,
    readonly broker: VmBrokerRegistry,
    readonly hosts: HostDirectory,
    readonly secrets: SecretBox,
    readonly models: ModelGateway,
    readonly connectors: ConnectorService,
  ) {}
  async initialize() {
    for (const groupId of await this.store.groups()) {
      await this.store.transact(groupId, async (tx) => {
        this.workspaceGroups.set(tx.state.id, groupId);
      });
      await this.models.budget.recover(groupId);
    }
  }
  async hostRestarted(hostId: string) {
    for (const groupId of await this.store.groups())
      await this.store.transact(groupId, async (tx) => {
        if (tx.state.config.hostId !== hostId) return;
        if (tx.state.sessionId) {
          const session = await tx.get<Session>("session", tx.state.sessionId);
          if (session) {
            session.status = "closed";
            session.active = false;
            await tx.put("session", session.id, session);
          }
          tx.state.sessionId = null;
        }
        await tx.remove("lease", "transition");
        for (const account of await tx.list<Account>("account")) {
          if (account.loginId || account.operation) {
            delete account.loginId;
            delete account.operation;
            await tx.put("account", String(account.userId), account);
          }
        }
        await tx.emit("host.restarted", {});
      });
  }
  requireOperator(tx: WorkflowTransaction, actor: WorkflowActor) {
    if (
      (!actor.admin && !tx.state.config.operatorIds.includes(actor.userId)) ||
      tx.state.operator?.userId !== actor.userId
    )
      throw new ForbiddenError("Take operator control to perform this action");
  }
  root(state: YpWorkflowState) {
    return path.posix.join(
      this.hosts.get(state.config.hostId).rootPath,
      state.id,
    );
  }
  async command(
    hostId: string,
    messageType: VmCommand,
    data: Record<string, unknown>,
    timeoutMs = 120_000,
  ): Promise<unknown> {
    const commandId = randomUUID();
    if (data.auditContext && typeof data.auditContext === "object")
      data = {
        ...data,
        auditContext: { ...data.auditContext, commandId },
      };
    return this.broker.dispatchCommand({
      vmHostId: hostId,
      messageType,
      commandId,
      data: { ...data, commandId },
      timeoutMs,
    });
  }
  async create(groupId: number, actor: WorkflowActor, configuration: unknown) {
    if (!actor.admin) throw new ForbiddenError();
    const config = configSchema.parse(configuration);
    this.hosts.get(config.hostId);
    const seed = withDefaultAgentModel(
      await loadPackage(config.packageId),
      workflowModelDefaults.processingModel,
    );
    const state: YpWorkflowState = {
      id: randomUUID(),
      groupId,
      config,
      revision: 1,
      graph: seed.graph,
      operator: null,
      sessionId: null,
      activeRunId: null,
      spentMicros: 0,
      reservedMicros: 0,
      trialSpentMicros: 0,
      trialReservedMicros: 0,
      storedBytes: 0,
      uploadReservedBytes: 0,
      nextEvent: 0,
    };
    await this.store.create(state);
    this.workspaceGroups.set(state.id, groupId);
    await this.store.transact(groupId, async (tx) => {
      await tx.put("seed", "initial", seed);
      await tx.emit("workspace.created", { packageId: config.packageId });
    });
    // A failed/offline host is retryable through prepare; the durable workspace remains.
    await this.prepare(groupId);
    return state;
  }
  async prepare(groupId: number) {
    const { state, prepared, seed } = await this.store.transact(
      groupId,
      async (tx) => ({
        state: tx.state,
        prepared: await tx.get("workspace", "prepared"),
        seed: (await tx.get<string>("workspace", "sourceHash"))
          ? await tx.get<PackageSnapshot>(
              "source",
              (await tx.get<string>("workspace", "sourceHash"))!,
            )
          : await tx.get<PackageSnapshot>("seed", "initial"),
      }),
    );
    const rootPath = this.root(state),
      commandId = randomUUID();
    const files =
      !prepared && seed
        ? Object.entries(seed.files).map(([file, content]) => ({
            path: `package/${file}`,
            content,
          }))
        : [];
    await this.command(state.config.hostId, "workspace.prepare", {
      workspaceId: state.id,
      vmHostId: state.config.hostId,
      rootPath,
      auditContext: {
        commandId,
        groupId: String(groupId),
        experimentId: state.id,
        workspaceId: state.id,
        vmHostId: state.config.hostId,
        requestedAt: new Date().toISOString(),
        requestedByType: "system",
      },
      materialization: { agentsMd: seed?.files["AGENTS.md"], files },
    });
    await this.command(state.config.hostId, "workflow.attach", {
      groupId,
      workspaceId: state.id,
      rootPath,
    });
    await this.store.transact(groupId, (tx) =>
      tx.put("workspace", "prepared", true),
    );
  }
  async snapshot(
    groupId: number,
    actor: WorkflowActor,
  ): Promise<YpWorkflowSnapshot> {
    return this.store.transact(groupId, async (tx) => {
      const account = await tx.get<Account>("account", String(actor.userId));
      const codexAuthMode = account?.sealed
        ? (account.authMode ?? "chatgpt")
        : null;
      const manifest =
        (await tx.get<ReturnType<typeof packageManifest>>(
          "workspace",
          "manifest",
        )) ??
        packageManifest(
          (await tx.get<PackageSnapshot>("seed", "initial"))?.files ??
            (await loadPackage(tx.state.config.packageId)).files,
        );
      return {
        workspace: tx.state,
        assistantName: manifest.assistantName ?? `${manifest.name} Assistant`,
        assets: await tx.list<YpWorkflowAsset>("asset"),
        runs: await Promise.all(
          (await tx.list<YpWorkflowRun>("run")).map(async (run) => {
            // Older runs already saved their catalog separately; never substitute today's defaults.
            const models =
              run.modelCatalog ??
              (await tx.get<YpWorkflowModel[]>("run-models", run.id));
            const selected = new Set(
              run.graph.nodes
                .filter((node) => run.nodeIds.includes(node.id))
                .flatMap((node) => Object.values(node.models)),
            );
            return {
              ...run,
              modelCatalog: models?.filter((model) => selected.has(model.id)),
              forecast: remainingForecast(run),
            };
          }),
        ),
        connectors: (
          await tx.list<{ binding: YpWorkflowConnector }>("connector")
        ).map((c) => c.binding),
        connectionProposals: await tx.list<YpWorkflowConnectionProposal>(
          "connection-proposal",
        ),
        models: this.models.catalog(),
        modelRoles: manifest.modelRoles,
        hosts: this.hosts.hosts.map((h) => ({
          id: h.id,
          name: h.name,
          connected: this.broker.isConnected(h.id),
        })),
        permissions: {
          ...actor,
          operate:
            actor.admin || tx.state.config.operatorIds.includes(actor.userId),
        },
        chatgptConnected: codexAuthMode === "chatgpt",
        codexAuthMode,
      };
    });
  }
  async proposeConnection(
    groupId: number,
    actor: WorkflowActor,
    value: unknown,
  ) {
    return this.store.transact(groupId, async (tx) => {
      this.requireOperator(tx, actor);
      return proposeConnection(tx, actor.userId, value);
    });
  }
  async connectionProposal(groupId: number, actor: WorkflowActor, id: string) {
    if (!actor.admin) throw new ForbiddenError();
    return this.store.transact(groupId, async (tx) => {
      const proposal = await tx.get<YpWorkflowConnectionProposal>(
        "connection-proposal",
        id,
      );
      if (!proposal || proposal.status !== "pending")
        throw new ConflictError("Connection proposal is no longer pending");
      return proposal;
    });
  }
  async rejectConnection(groupId: number, actor: WorkflowActor, id: string) {
    if (!actor.admin) throw new ForbiddenError();
    await this.store.transact(groupId, async (tx) => {
      const proposal = await tx.get<YpWorkflowConnectionProposal>(
        "connection-proposal",
        id,
      );
      if (!proposal || proposal.status !== "pending")
        throw new ConflictError("Connection proposal is no longer pending");
      proposal.status = "rejected";
      proposal.decidedBy = actor.userId;
      proposal.decidedAt = new Date().toISOString();
      await tx.put("connection-proposal", id, proposal);
      await tx.emit("connection.rejected", { proposalId: id });
    });
  }
  async configure(groupId: number, actor: WorkflowActor, value: unknown) {
    if (!actor.admin) throw new ForbiddenError();
    const config = configSchema.parse(value);
    await this.store.transact(groupId, async (tx) => {
      if (
        config.hostId !== tx.state.config.hostId ||
        config.packageId !== tx.state.config.packageId
      )
        throw new ConflictError(
          "Host and package are pinned to this workspace",
        );
      if (
        config.budgetMicros < tx.state.spentMicros + tx.state.reservedMicros ||
        config.trialBudgetMicros <
          tx.state.trialSpentMicros + tx.state.trialReservedMicros
      )
        throw new ConflictError("Limits cannot be below committed spending");
      if (
        config.quotaBytes <
        tx.state.storedBytes + tx.state.uploadReservedBytes
      )
        throw new ConflictError("Storage quota is below committed storage");
      tx.state.config = config;
      tx.state.revision++;
      await tx.emit("configuration.updated", {
        revision: tx.state.revision,
      });
    });
  }
  async claim(groupId: number, actor: WorkflowActor, takeover: boolean) {
    const pending = await this.store.transact(groupId, async (tx) => {
      if (!actor.admin && !tx.state.config.operatorIds.includes(actor.userId))
        throw new ForbiddenError();
      const priorTransition = await tx.get<{ createdAt?: number }>(
        "lease",
        "transition",
      );
      if (
        priorTransition &&
        Date.now() - (priorTransition.createdAt ?? Date.now()) < 300_000
      )
        throw new ConflictError(
          "An operator transition is already in progress",
        );
      if (priorTransition) await tx.remove("lease", "transition");
      if (
        tx.state.operator &&
        tx.state.operator.userId !== actor.userId &&
        !takeover
      )
        throw new ConflictError(
          "Another operator has control; use explicit takeover",
        );
      if (tx.state.operator?.userId === actor.userId) return null;
      const session = tx.state.sessionId
        ? await tx.get<Session>("session", tx.state.sessionId)
        : undefined;
      if (
        session?.status === "starting" &&
        Date.now() - (session.startedAt ?? Date.now()) < 300_000
      )
        throw new ConflictError(
          "Wait for Codex to finish starting before taking over",
        );
      const transition = {
        id: randomUUID(),
        sessionId: session?.id,
        hostId: tx.state.config.hostId,
        createdAt: Date.now(),
      };
      await tx.put("lease", "transition", transition);
      return transition;
    });
    if (!pending) return;
    try {
      if (pending.sessionId)
        await this.command(pending.hostId, "session.terminate", {
          sessionId: pending.sessionId,
        });
      await this.store.transact(groupId, async (tx) => {
        if (
          (await tx.get<{ id: string }>("lease", "transition"))?.id !==
          pending.id
        )
          throw new ConflictError("Operator transition changed; retry");
        tx.state.operator = {
          userId: actor.userId,
          generation: (tx.state.operator?.generation ?? 0) + 1,
        };
        if (pending.sessionId) {
          const session = await tx.get<Session>("session", pending.sessionId);
          if (session) {
            session.status = "closed";
            session.active = false;
            await tx.put("session", session.id, session);
          }
        }
        tx.state.sessionId = null;
        await tx.remove("lease", "transition");
        await tx.emit("operator.changed", { userId: actor.userId });
      });
    } catch (error) {
      await this.store.transact(groupId, async (tx) => {
        if (
          (await tx.get<{ id: string }>("lease", "transition"))?.id ===
          pending.id
        )
          await tx.remove("lease", "transition");
      });
      throw error;
    }
  }
  async login(groupId: number, actor: WorkflowActor) {
    const account = await this.store.transact(groupId, async (tx) => {
      if (!actor.admin && !tx.state.config.operatorIds.includes(actor.userId))
        throw new ForbiddenError();
      const previous = await tx.get<Account>("account", String(actor.userId));
      if (
        previous?.loginId ||
        (previous?.operation && Date.now() - previous.operation.at < 300_000)
      )
        throw new ConflictError(
          "Complete or cancel the pending account operation",
        );
      const id = previous?.id ?? randomUUID();
      const next: Account = {
        ...previous,
        id,
        userId: actor.userId,
        hostId: tx.state.config.hostId,
        rootPath: path.posix.join(
          this.hosts.get(tx.state.config.hostId).rootPath,
          `auth-${id}`,
        ),
        operation: { id: randomUUID(), at: Date.now() },
      };
      await tx.put("account", String(actor.userId), next);
      return next;
    });
    try {
      const response = VmCodexAuthLoginStartedResponseEnvelopeSchema.parse(
        await this.command(account.hostId, "codex.auth.login.start", {
          authProfileId: account.id,
          vmHostId: account.hostId,
          rootPath: account.rootPath,
          loginType: "chatgptDeviceCode",
        }),
      );
      await this.store.transact(groupId, async (tx) => {
        const current = await tx.get<Account>("account", String(actor.userId));
        if (current?.operation?.id !== account.operation!.id)
          throw new ConflictError("Account changed during login");
        current.loginId = response.data.loginId;
        delete current.operation;
        await tx.put("account", String(actor.userId), current);
      });
      return {
        verificationUrl: response.data.verificationUrl,
        userCode: response.data.userCode,
      };
    } catch (error) {
      await this.store.transact(groupId, async (tx) => {
        const current = await tx.get<Account>("account", String(actor.userId));
        if (current?.operation?.id === account.operation!.id) {
          delete current.operation;
          await tx.put("account", String(actor.userId), current);
        }
      });
      throw error;
    }
  }
  async completeLogin(groupId: number, actor: WorkflowActor) {
    const operation = { id: randomUUID(), at: Date.now() };
    const { account, session } = await this.store.transact(
      groupId,
      async (tx) => {
        const account = await tx.get<Account>("account", String(actor.userId));
        if (
          !account?.loginId ||
          (account.operation && Date.now() - account.operation.at < 300_000)
        )
          throw new ConflictError(
            "Start ChatGPT login first or wait for the pending account operation",
          );
        const session = tx.state.sessionId
          ? await tx.get<Session>("session", tx.state.sessionId)
          : undefined;
        if (session?.ownerId === actor.userId) {
          if (
            session.status === "starting" ||
            (await tx.get("lease", "transition"))
          )
            throw new ConflictError(
              "Wait for the current session transition before completing login",
            );
          await tx.put("lease", "transition", {
            id: operation.id,
            createdAt: operation.at,
          });
        }
        account.operation = operation;
        await tx.put("account", String(actor.userId), account);
        return { account, session };
      },
    );
    try {
      const response = VmCodexAuthLoginCompletedResponseEnvelopeSchema.parse(
        await this.command(
          account.hostId,
          "codex.auth.login.complete",
          {
            authProfileId: account.id,
            vmHostId: account.hostId,
            rootPath: account.rootPath,
            loginId: account.loginId,
            timeoutMs: 1000,
          },
          10_000,
        ),
      );
      if (session?.ownerId === actor.userId)
        await this.command(account.hostId, "session.terminate", {
          sessionId: session.id,
        });
      await this.store.transact(groupId, async (tx) => {
        const current = await tx.get<Account>("account", String(actor.userId));
        if (current?.operation?.id !== operation.id)
          throw new ConflictError("Account changed during login");
        current.sealed = this.secrets.seal(
          response.data.authMaterial,
          `account:${actor.userId}:${account.id}`,
        );
        current.authMode = "chatgpt";
        current.fingerprint = codexAuthMaterialFingerprintSha256(
          response.data.authMaterial,
        );
        delete current.loginId;
        delete current.operation;
        if (
          session?.ownerId === actor.userId &&
          tx.state.sessionId === session.id
        )
          tx.state.sessionId = null;
        await tx.remove("thread", String(actor.userId));
        await tx.put("account", String(actor.userId), current);
        await tx.emit("account.connected", { userId: actor.userId });
      });
      return { connected: true };
    } finally {
      await this.clearAccountOperation(groupId, actor.userId, operation.id);
    }
  }
  async connectApiKey(groupId: number, actor: WorkflowActor, input: unknown) {
    const material = apiKeyMaterialSchema.parse(input);
    const operation = { id: randomUUID(), at: Date.now() };
    const { account, session } = await this.store.transact(
      groupId,
      async (tx) => {
        if (!actor.admin && !tx.state.config.operatorIds.includes(actor.userId))
          throw new ForbiddenError();
        const previous = await tx.get<Account>("account", String(actor.userId));
        if (
          previous?.loginId ||
          (previous?.operation && Date.now() - previous.operation.at < 300_000)
        )
          throw new ConflictError(
            "Complete or cancel the pending account operation",
          );
        const session = tx.state.sessionId
          ? await tx.get<Session>("session", tx.state.sessionId)
          : undefined;
        if (session?.ownerId === actor.userId) {
          if (
            session.status === "starting" ||
            (await tx.get("lease", "transition"))
          )
            throw new ConflictError(
              "Wait for the current session transition before changing credentials",
            );
          await tx.put("lease", "transition", {
            id: operation.id,
            createdAt: operation.at,
          });
        }
        const id = previous?.id ?? randomUUID();
        const account: Account = {
          ...previous,
          id,
          userId: actor.userId,
          hostId: tx.state.config.hostId,
          rootPath: path.posix.join(
            this.hosts.get(tx.state.config.hostId).rootPath,
            `auth-${id}`,
          ),
          operation,
        };
        await tx.put("account", String(actor.userId), account);
        return { account, session };
      },
    );
    try {
      if (session?.ownerId === actor.userId)
        await this.command(account.hostId, "session.terminate", {
          sessionId: session.id,
        });
      await this.store.transact(groupId, async (tx) => {
        const current = await tx.get<Account>("account", String(actor.userId));
        if (current?.operation?.id !== operation.id)
          throw new ConflictError("Account changed during login");
        // A new profile fences late credential-refresh events from the previous account.
        const id = randomUUID();
        await tx.put("account", String(actor.userId), {
          id,
          userId: actor.userId,
          hostId: account.hostId,
          rootPath: path.posix.join(
            this.hosts.get(account.hostId).rootPath,
            `auth-${id}`,
          ),
          authMode: "api-key",
          sealed: this.secrets.seal(material, `account:${actor.userId}:${id}`),
        } satisfies Account);
        if (
          session?.ownerId === actor.userId &&
          tx.state.sessionId === session.id
        )
          tx.state.sessionId = null;
        await tx.remove("thread", String(actor.userId));
        await tx.emit("account.connected", { userId: actor.userId });
      });
      return { connected: true };
    } finally {
      await this.clearAccountOperation(groupId, actor.userId, operation.id);
    }
  }
  async disconnect(groupId: number, actor: WorkflowActor) {
    const operation = { id: randomUUID(), at: Date.now() };
    const { account, session, hostId } = await this.store.transact(
      groupId,
      async (tx) => {
        const account = await tx.get<Account>("account", String(actor.userId)),
          session = tx.state.sessionId
            ? await tx.get<Session>("session", tx.state.sessionId)
            : undefined;
        if (account?.operation && Date.now() - account.operation.at < 300_000)
          throw new ConflictError("Account operation is in progress");
        if (session?.ownerId === actor.userId) {
          if (session.status === "starting")
            throw new ConflictError(
              "Wait for Codex to finish starting before disconnecting",
            );
          if (await tx.get("lease", "transition"))
            throw new ConflictError("Operator transition in progress");
          await tx.put("lease", "transition", {
            id: operation.id,
            createdAt: operation.at,
          });
        }
        if (account) {
          account.operation = operation;
          await tx.put("account", String(actor.userId), account);
        }
        return { account, session, hostId: tx.state.config.hostId };
      },
    );
    try {
      if (session?.ownerId === actor.userId)
        await this.command(hostId, "session.terminate", {
          sessionId: session.id,
        });
      if (account?.loginId)
        await this.command(hostId, "codex.auth.login.cancel", {
          authProfileId: account.id,
          vmHostId: hostId,
          rootPath: account.rootPath,
          loginId: account.loginId,
        });
      await this.store.transact(groupId, async (tx) => {
        const current = await tx.get<Account>("account", String(actor.userId));
        if (current?.operation?.id === operation.id)
          await tx.remove("account", String(actor.userId));
        if (
          session?.ownerId === actor.userId &&
          tx.state.sessionId === session.id
        )
          tx.state.sessionId = null;
        await tx.remove("thread", String(actor.userId));
        await tx.emit("account.disconnected", { userId: actor.userId });
      });
    } finally {
      await this.clearAccountOperation(groupId, actor.userId, operation.id);
    }
  }
  private async clearAccountOperation(
    groupId: number,
    userId: number,
    operationId: string,
  ) {
    await this.store.transact(groupId, async (tx) => {
      if (
        (await tx.get<{ id: string }>("lease", "transition"))?.id ===
        operationId
      )
        await tx.remove("lease", "transition");
      const current = await tx.get<Account>("account", String(userId));
      if (current?.operation?.id === operationId) {
        delete current.operation;
        await tx.put("account", String(userId), current);
      }
    });
  }
  async ensureSession(groupId: number, actor: WorkflowActor): Promise<Session> {
    const pending = await this.store.transact(groupId, async (tx) => {
      this.requireOperator(tx, actor);
      if (await tx.get("lease", "transition"))
        throw new ConflictError("Operator transition in progress");
      const previous = tx.state.sessionId
        ? await tx.get<Session>("session", tx.state.sessionId)
        : undefined;
      if (previous?.status === "ready") return { existing: previous };
      if (
        previous?.status === "starting" &&
        Date.now() - (previous.startedAt ?? Date.now()) < 300_000
      )
        throw new ConflictError("Codex is starting");
      if (previous)
        await this.command(tx.state.config.hostId, "session.terminate", {
          sessionId: previous.id,
        });
      const account = await tx.get<Account>("account", String(actor.userId));
      if (!account?.sealed || account.operation)
        throw new ConflictError("Connect ChatGPT or an OpenAI API key first");
      const session: Session = {
        id: randomUUID(),
        ownerId: actor.userId,
        active: false,
        status: "starting",
        startedAt: Date.now(),
        threadId: (await tx.get<{ id: string }>("thread", String(actor.userId)))
          ?.id,
      };
      tx.state.sessionId = session.id;
      await tx.put("session", session.id, session);
      return { state: tx.state, account, session };
    });
    if (pending.existing) return pending.existing;
    const { state, account, session } = pending;
    try {
      await this.prepare(groupId);
      const root = this.root(state);
      const response = VmSessionStartedResponseEnvelopeSchema.parse(
        await this.command(state.config.hostId, "session.start", {
          sessionId: session.id,
          runId: state.id,
          runStepId: randomUUID(),
          nodeId: randomUUID(),
          workspaceId: state.id,
          vmHostId: state.config.hostId,
          runtimeProfileId: state.id,
          authProfileId: account.id,
          layout: {
            rootPath: root,
            workspacePath: `${root}/workspace`,
            codexHomePath: `${root}/codex-home`,
            artifactsPath: `${root}/artifacts`,
            cachePath: `${root}/cache`,
          },
          runtimeSnapshot: {
            dockerPolicy: { gpus: "none" },
            containerImage: this.hosts.get(state.config.hostId).image,
            modelDefaults: {
              model: state.config.codexModel,
              reasoningEffort:
                state.config.codexReasoningEffort ??
                workflowModelDefaults.codexReasoningEffort,
            },
            codexConfig: {
              model: state.config.codexModel,
              approvalPolicy: "on-request",
              sandbox: "danger-full-access",
            },
          },
          inputPayload: {},
          initialTurnMode: "deferred",
          persistExtendedHistory: true,
          ...(session.threadId ? { codexThreadId: session.threadId } : {}),
          auth: {
            provider: "openai",
            authMode:
              account.authMode === "api-key"
                ? "openai_api_key"
                : "codex_chatgpt",
            metadata:
              account.authMode === "api-key"
                ? {
                    openAiApiKeyMaterial: this.secrets.open<ApiKeyMaterial>(
                      account.sealed!,
                      `account:${actor.userId}:${account.id}`,
                    ),
                  }
                : {
                    codexAuthMaterial: this.secrets.open<CodexAuthMaterial>(
                      account.sealed!,
                      `account:${actor.userId}:${account.id}`,
                    ),
                  },
          },
        }),
      );
      session.threadId = response.data.codexThreadId;
      session.status = "ready";
      await this.store.transact(groupId, async (tx) => {
        await tx.put("session", session.id, session);
        await tx.put("thread", String(actor.userId), {
          id: session.threadId,
        });
        await tx.emit("session.ready", { sessionId: session.id });
      });
      return session;
    } catch (error) {
      await this.store.transact(groupId, async (tx) => {
        session.status = "error";
        await tx.put("session", session.id, session);
      });
      throw error;
    }
  }
  async chat(
    groupId: number,
    actor: WorkflowActor,
    text: string,
    steer: boolean,
  ) {
    z.string().min(1).max(100_000).parse(text);
    const session = await this.ensureSession(groupId, actor);
    const outcome = await this.store.transact(groupId, async (tx) => {
      this.requireOperator(tx, actor);
      if (await tx.get("lease", "transition"))
        throw new ConflictError("Operator transition in progress");
      if (tx.state.sessionId !== session.id)
        throw new ConflictError("Codex session changed");
      await tx.emit("chat.user", {
        text,
        userId: actor.userId,
        sessionId: session.id,
      });
      // Reserve the turn before releasing the workspace lock. In particular,
      // restore must not race an accepted turn whose started event is still in flight.
      const activeSession = (await tx.get<Session>("session", session.id))!;
      activeSession.active = true;
      await tx.put("session", session.id, activeSession);
      try {
        return {
          result: await this.command(
            tx.state.config.hostId,
            steer ? "session.turn.steer" : "session.turn.start",
            {
              sessionId: session.id,
              codexThreadId: session.threadId,
              input: [{ type: "text", text }],
              ...(steer
                ? { codexTurnId: session.turnId }
                : {
                    overrides: {
                      model: tx.state.config.codexModel,
                      reasoningEffort:
                        tx.state.config.codexReasoningEffort ??
                        workflowModelDefaults.codexReasoningEffort,
                    },
                  }),
            },
          ),
        };
      } catch (error) {
        // A timed-out start may still be running. Preserve the active marker
        // until Codex reports completion or the operator stops the session.
        await tx.emit("session.turn.uncertain", { sessionId: session.id });
        return { error };
      }
    });
    if ("error" in outcome) throw outcome.error;
    return outcome.result;
  }
  async sessionControl(
    groupId: number,
    actor: WorkflowActor,
    operation: "interrupt" | "approval" | "terminate",
    data: Record<string, unknown>,
  ) {
    return this.store.transact(groupId, async (tx) => {
      this.requireOperator(tx, actor);
      if (await tx.get("lease", "transition"))
        throw new ConflictError("Operator transition in progress");
      if (!tx.state.sessionId)
        throw new ConflictError("No active Codex session");
      const session = await tx.get<Session>("session", tx.state.sessionId);
      if (operation === "terminate") {
        await this.command(tx.state.config.hostId, "session.terminate", {
          sessionId: tx.state.sessionId,
          reason: "Operator requested a session restart",
        });
        if (session) {
          session.active = false;
          session.status = "closed";
          await tx.put("session", session.id, session);
        }
        tx.state.sessionId = null;
        await tx.emit("session.closed", { userId: actor.userId });
        return { closed: true };
      }
      return this.command(
        tx.state.config.hostId,
        operation === "interrupt"
          ? "session.interrupt"
          : "session.approval.respond",
        {
          ...data,
          sessionId: tx.state.sessionId,
          ...(operation === "interrupt"
            ? {
                codexThreadId: session?.threadId,
                codexTurnId: session?.turnId,
              }
            : {}),
        },
      );
    });
  }
  async codexModels(groupId: number, actor: WorkflowActor) {
    if (!actor.admin) throw new ForbiddenError();
    const session = await this.ensureSession(groupId, actor);
    const state = await this.store.transact(groupId, async (tx) => tx.state);
    return this.command(state.config.hostId, "workflow.models", {
      sessionId: session.id,
    });
  }
  async ingestSession(hostId: string, event: VmSessionEventPayload) {
    const groupId = this.workspaceGroups.get(event.workspaceId);
    if (!groupId) throw new NotFoundError("Workspace", event.workspaceId);
    await this.store.transact(groupId, async (tx) => {
      if (tx.state.config.hostId !== hostId) throw new ForbiddenError();
      const session = await tx.get<Session>("session", event.sessionId);
      if (!session) throw new ForbiddenError("Unknown session");
      const inOrder =
        session.streamId !== event.vmEventStreamId ||
        event.seq > (session.sourceSeq ?? -1);
      if (inOrder) {
        if (event.codexThreadId) session.threadId = event.codexThreadId;
        session.streamId = event.vmEventStreamId ?? undefined;
        session.sourceSeq = event.seq;
        if (event.eventType === "turn.started") {
          session.active = true;
          session.turnId = event.codexTurnId ?? undefined;
        }
        if (event.eventType === "turn.completed") session.active = false;
        if (event.eventType === "thread.closed") {
          session.active = false;
          session.status = "closed";
        }
      }
      await tx.put("session", session.id, session);
      if (event.eventType !== "codex.raw")
        await tx.emit(
          "session.event",
          {
            sessionId: session.id,
            eventType: event.eventType,
            payload:
              event.eventType === "approval.requested"
                ? {
                    ...event.payload,
                    method: event.rawPayload?.method ?? "approval",
                  }
                : event.payload,
            turnId: event.codexTurnId ?? null,
            itemId: event.itemId ?? null,
          },
          `${session.id}:${event.vmEventStreamId ?? "legacy"}:${event.seq}`,
        );
    });
  }
  async ingestAuth(hostId: string, payload: VmCodexAuthMaterialUpdatedPayload) {
    for (const groupId of await this.store.groups()) {
      await this.store.transact(groupId, async (tx) => {
        if (tx.state.config.hostId !== hostId) return;
        const account = (await tx.list<Account>("account")).find(
          (a) => a.id === payload.authProfileId,
        );
        if (!account || account.authMode === "api-key" || account.operation)
          return;
        if (
          account.fingerprint &&
          account.fingerprint !== payload.baseFingerprintSha256
        )
          return;
        const session = await tx.get<Session>("session", payload.sessionId);
        if (session?.ownerId !== account.userId) throw new ForbiddenError();
        account.sealed = this.secrets.seal(
          payload.authMaterial,
          `account:${account.userId}:${account.id}`,
        );
        account.fingerprint = payload.currentFingerprintSha256;
        await tx.put("account", String(account.userId), account);
      });
    }
  }
  async updateGraph(
    groupId: number,
    actor: WorkflowActor,
    graph: unknown,
    revision: number,
  ) {
    const parsed = graphSchema.parse(graph);
    await this.store.transact(groupId, async (tx) => {
      this.requireOperator(tx, actor);
      if (tx.state.revision !== revision)
        throw new ConflictError("Graph changed; reload before saving");
      await this.command(tx.state.config.hostId, "workflow.graph", {
        groupId,
        workspaceId: tx.state.id,
        rootPath: this.root(tx.state),
        graph: parsed,
      });
      tx.state.graph = parsed;
      tx.state.revision++;
      await tx.emit("graph.updated", { revision: tx.state.revision });
    });
  }
  async packageSnapshot(groupId: number): Promise<PackageSnapshot> {
    const state = await this.store.transact(groupId, async (tx) => tx.state);
    const response = z
      .object({
        data: z.object({
          files: z.unknown(),
          runtimeImage: z.string().regex(/^sha256:[a-f0-9]{64}$/),
        }),
      })
      .parse(
        await this.command(state.config.hostId, "workflow.snapshot", {
          groupId,
          workspaceId: state.id,
          rootPath: this.root(state),
        }),
      );
    const snapshot = {
      ...validatePackage(response.data.files),
      runtimeImage: response.data.runtimeImage,
    };
    return this.store.transact(groupId, async (tx) => {
      if (tx.state.revision !== state.revision)
        throw new ConflictError(
          "Configuration changed during validation; try again",
        );
      if (fingerprint(tx.state.graph) !== fingerprint(snapshot.graph)) {
        tx.state.graph = snapshot.graph;
        tx.state.revision++;
        await tx.emit("graph.updated", { revision: tx.state.revision });
      }
      await tx.put("source", snapshot.hash, snapshot);
      await tx.put("workspace", "sourceHash", snapshot.hash);
      if (!(await tx.get("source-revision", snapshot.hash)))
        await tx.put("source-revision", snapshot.hash, {
          hash: snapshot.hash,
          at: new Date().toISOString(),
          version: packageManifest(snapshot.files).version,
          agents: snapshot.graph.nodes.filter((n) => n.kind === "agent").length,
        });
      await tx.put("workspace", "manifest", packageManifest(snapshot.files));
      return snapshot;
    });
  }
  async revisions(groupId: number) {
    return this.store.transact(groupId, async (tx) => ({
      currentHash: await tx.get<string>("workspace", "sourceHash"),
      revisions: (await tx.list<YpWorkflowRevision>("source-revision")).sort(
        (a, b) => b.at.localeCompare(a.at),
      ),
    }));
  }
  async revision(groupId: number, hash: string) {
    z.string()
      .regex(/^[a-f0-9]{64}$/)
      .parse(hash);
    return this.store.transact(groupId, async (tx) => {
      const snapshot = await tx.get<PackageSnapshot>("source", hash);
      if (!snapshot) throw new NotFoundError("Package revision", hash);
      return { hash, files: snapshot.files };
    });
  }
  async restoreRevision(
    groupId: number,
    actor: WorkflowActor,
    hash: string,
    revision: number,
  ) {
    z.string()
      .regex(/^[a-f0-9]{64}$/)
      .parse(hash);
    return this.store.transact(groupId, async (tx) => {
      this.requireOperator(tx, actor);
      if (tx.state.revision !== revision)
        throw new ConflictError("The draft changed; reload before restoring");
      const session = tx.state.sessionId
        ? await tx.get<Session>("session", tx.state.sessionId)
        : undefined;
      if (
        tx.state.activeRunId ||
        session?.active ||
        session?.status === "starting"
      )
        throw new ConflictError(
          "Finish or cancel the active run and stop the Codex turn before restoring",
        );
      const snapshot = await tx.get<PackageSnapshot>("source", hash);
      if (!snapshot) throw new NotFoundError("Package revision", hash);
      const result = z
        .object({
          data: z.object({ hash: z.literal(hash), backup: z.string() }),
        })
        .parse(
          await this.command(
            tx.state.config.hostId,
            "workflow.restore",
            {
              groupId,
              workspaceId: tx.state.id,
              rootPath: this.root(tx.state),
              files: snapshot.files,
            },
            300_000,
          ),
        );
      tx.state.graph = snapshot.graph;
      tx.state.revision++;
      await tx.put("workspace", "sourceHash", hash);
      await tx.put("workspace", "manifest", packageManifest(snapshot.files));
      await tx.emit("package.restored", {
        hash,
        userId: actor.userId,
        backup: result.data.backup,
        revision: tx.state.revision,
      });
      return { hash, backup: result.data.backup };
    });
  }
  async storage(groupId: number, actor: WorkflowActor, prune = false) {
    if (!actor.admin) throw new ForbiddenError();
    return this.store.transact(groupId, async (tx) => {
      const unsettled = new Set(
        (await tx.list<{ runId: string; status: string }>("usage"))
          .filter((u) => u.status !== "settled")
          .map((u) => u.runId),
      );
      const runs = (await tx.list<YpWorkflowRun>("run")).filter(
        (run) =>
          ["completed", "cancelled"].includes(run.status) &&
          run.id !== tx.state.activeRunId &&
          !run.reservedMicros &&
          !unsettled.has(run.id) &&
          Date.parse(run.completedAt ?? run.createdAt) <
            Date.now() - 30 * 86400_000,
      );
      const eligible: string[] = [];
      for (const run of runs)
        if (!(await tx.get("run-pruned", run.id))) eligible.push(run.id);
      const location = {
        groupId,
        workspaceId: tx.state.id,
        rootPath: this.root(tx.state),
      };
      let removed = 0;
      if (prune && eligible.length) {
        const runIds = eligible.slice(0, 100);
        const result = z
          .object({
            data: z.object({ removed: z.number().int().nonnegative() }),
          })
          .parse(
            await this.command(tx.state.config.hostId, "workflow.prune", {
              ...location,
              runIds,
            }),
          );
        removed = result.data.removed;
        for (const id of runIds)
          await tx.put("run-pruned", id, { at: new Date().toISOString() });
        await tx.emit("storage.pruned", {
          runIds,
          userId: actor.userId,
          removed,
        });
      }
      const disk = z
        .object({
          data: z.object({
            availableBytes: z.number().nonnegative(),
            minimumFreeBytes: z.number().nonnegative(),
          }),
        })
        .parse(
          await this.command(
            tx.state.config.hostId,
            "workflow.storage",
            location,
          ),
        );
      return {
        ...disk.data,
        eligibleRuns: eligible.length - removed,
        removed,
      };
    });
  }
  async draftRun(
    groupId: number,
    actor: WorkflowActor,
    mode: "trial" | "bulk",
    assetIds: string[],
    sampleCount = 5,
    targetNodeId?: string,
  ) {
    const state = await this.store.transact(groupId, async (tx) => {
      this.requireOperator(tx, actor);
      return tx.state;
    });
    if (!assetIds.length)
      throw new ValidationError("Select at least one input file");
    const snapshot = await this.packageSnapshot(groupId);
    const plannedRevision = await this.store.transact(
      groupId,
      async (tx) => tx.state.revision,
    );
    const connectorSnapshots = await this.connectors.snapshotBindings(
      groupId,
      actor.userId,
      snapshot.graph,
    );
    const assets = await this.store.transact(groupId, async (tx) =>
      Promise.all(
        assetIds.map(async (id) => {
          const asset = await tx.get<YpWorkflowAsset>("asset", id);
          if (!asset) throw new NotFoundError("Asset", id);
          return asset;
        }),
      ),
    );
    const response = z
      .object({
        data: z.object({ inputCount: z.number().int().positive() }),
      })
      .parse(
        await this.command(
          state.config.hostId,
          "workflow.inputs",
          {
            groupId,
            workspaceId: state.id,
            rootPath: this.root(state),
            assets,
          },
          300_000,
        ),
      );
    return this.store.transact(groupId, async (tx) => {
      this.requireOperator(tx, actor);
      if (
        tx.state.revision !== plannedRevision ||
        fingerprint(tx.state.graph) !== fingerprint(snapshot.graph)
      )
        throw new ConflictError(
          "The configuration changed during input preparation; try again",
        );
      for (const asset of assets)
        if (!(await tx.get("asset", asset.id)))
          throw new ConflictError("An input was removed during preparation");
      const nodes = snapshot.graph.nodes.filter(
        (n) => n.kind === "agent" && n.enabled,
      );
      if (!nodes.length)
        throw new ValidationError("Enable at least one processing agent");
      const nodeIds = selectedAgents(snapshot.graph, targetNodeId);
      const modelCatalog = this.models.catalog();
      const selectedModels = new Set(
        snapshot.graph.nodes
          .filter((node) => nodeIds.includes(node.id))
          .flatMap((node) => Object.values(node.models)),
      );
      const hash = fingerprint({
        source: snapshot.hash,
        runtimeImage: snapshot.runtimeImage,
        graph: snapshot.graph,
        nodeIds,
        concurrency: tx.state.config.concurrency,
        assets: assets.map((a) => ({ id: a.id, checksum: a.checksum })),
        models: modelCatalog,
        connectors: connectorSnapshots.map((c) => ({
          binding: c.binding,
          readSnapshot: c.readSnapshot,
        })),
        populationCount: response.data.inputCount,
      });
      const trials = (await tx.list<YpWorkflowRun>("run"))
        .filter(
          (r) =>
            r.mode === "trial" &&
            r.status === "completed" &&
            r.fingerprint === hash &&
            !r.reservedMicros &&
            !Object.values(r.nodeStates).some((n) => n.failedRecords),
        )
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      if (mode === "bulk" && !trials.length)
        throw new ConflictError(
          "Run a successful trial of this source, graph, model, input and selected agents first; resolve any failed records before bulk approval",
        );
      const run: YpWorkflowRun = {
        id: randomUUID(),
        mode,
        status: mode === "trial" ? "draft" : "awaiting_approval",
        ownerId: actor.userId,
        revision: tx.state.revision,
        sourceHash: snapshot.hash,
        runtimeImage: snapshot.runtimeImage,
        concurrency: tx.state.config.concurrency,
        fingerprint: hash,
        graph: snapshot.graph,
        nodeIds,
        modelCatalog: modelCatalog.filter((model) =>
          selectedModels.has(model.id),
        ),
        assetIds,
        ...(targetNodeId ? { targetNodeId } : {}),
        nodeCosts: {},
        inputCount:
          mode === "trial"
            ? Math.min(
                z.number().int().min(1).max(20).parse(sampleCount),
                response.data.inputCount,
              )
            : response.data.inputCount,
        budgetMicros:
          mode === "trial"
            ? Math.max(
                0,
                Math.min(
                  tx.state.config.trialBudgetMicros -
                    tx.state.trialSpentMicros -
                    tx.state.trialReservedMicros,
                  tx.state.config.budgetMicros -
                    tx.state.spentMicros -
                    tx.state.reservedMicros,
                ),
              )
            : 0,
        spentMicros: 0,
        reservedMicros: 0,
        nodeStates: {},
        createdAt: new Date().toISOString(),
        ...(mode === "bulk"
          ? {
              estimate: estimateFromTrial(trials[0], response.data.inputCount),
            }
          : {}),
      };
      await tx.put("run", run.id, run);
      for (const connector of connectorSnapshots)
        await tx.put(
          "run-connector",
          `${run.id}:${connector.binding.id}`,
          connector,
        );
      await tx.put("run-models", run.id, modelCatalog);
      await tx.put("run-inputs", run.id, assets);
      await tx.emit("run.created", {
        runId: run.id,
        mode,
        inputCount: run.inputCount,
      });
      return run;
    });
  }
  async startRun(
    groupId: number,
    actor: WorkflowActor,
    id: string,
    approvedBudget?: number,
  ) {
    const snapshot = await this.packageSnapshot(groupId);
    const { run, state, assets } = await this.store.transact(
      groupId,
      async (tx) => {
        this.requireOperator(tx, actor);
        const run = await requireRun(tx, id);
        if (!["draft", "awaiting_approval"].includes(run.status))
          throw new ConflictError("Run is already started");
        if (tx.state.activeRunId)
          throw new ConflictError("Finish or cancel the active run first");
        if (
          run.sourceHash !== snapshot.hash ||
          run.runtimeImage !== snapshot.runtimeImage ||
          run.revision !== tx.state.revision ||
          fingerprint(await tx.get("run-models", id)) !==
            fingerprint(this.models.catalog())
        )
          throw new ConflictError(
            "Source, runtime, prices or configuration changed; create a new trial and estimate",
          );
        if (run.mode === "bulk") {
          run.budgetMicros = money.positive().parse(approvedBudget);
          if (
            run.budgetMicros >
            tx.state.config.budgetMicros -
              tx.state.spentMicros -
              tx.state.reservedMicros
          )
            throw new ConflictError(
              "Approved cap exceeds the workspace allowance",
            );
          if (!run.estimate)
            throw new ConflictError("Cost estimate is missing");
          run.approvedAt = new Date().toISOString();
        }
        if (run.budgetMicros <= 0)
          throw new ConflictError("No trial or workflow allowance remains");
        run.status = "queued";
        tx.state.activeRunId = id;
        await tx.put("run", id, run);
        await tx.emit("run.queued", {
          runId: id,
          budgetMicros: run.budgetMicros,
        });
        return {
          run,
          state: tx.state,
          assets: await tx.get<YpWorkflowAsset[]>("run-inputs", id),
        };
      },
    );
    try {
      await this.command(state.config.hostId, "workflow.run", {
        groupId,
        workspaceId: state.id,
        rootPath: this.root(state),
        run,
        files: snapshot.files,
        assets,
        concurrency: state.config.concurrency,
      });
    } catch (error) {
      // A lost broker acknowledgement is ambiguous. Keep the active-run lock until the host reports or an operator reconciles.
      await this.store.transact(groupId, async (tx) => {
        await tx.emit("run.dispatch.uncertain", { runId: id });
      });
      throw error;
    }
  }
  async controlRun(
    groupId: number,
    actor: WorkflowActor,
    id: string,
    operation: "pause" | "resume" | "cancel",
    approvedBudget?: number,
    approvedNodeBudgets?: Record<string, number>,
  ) {
    const transition = { id: randomUUID(), at: Date.now() };
    const state = await this.store.transact(groupId, async (tx) => {
      this.requireOperator(tx, actor);
      const run = await requireRun(tx, id);
      const pending = await tx.get<{ at: number }>("run-control", id);
      if (pending && Date.now() - pending.at < 300_000)
        throw new ConflictError(
          "A run control operation is already in progress",
        );
      if (
        ["completed", "failed"].includes(run.status) ||
        (run.status === "cancelled" && operation !== "cancel")
      )
        throw new ConflictError("Run is already terminal");
      if (tx.state.activeRunId !== id)
        throw new ConflictError("Only the active run can be controlled");
      if (
        operation === "resume" &&
        (await tx.list<{ runId: string; status: string }>("usage")).some(
          (u) => u.runId === id && u.status !== "settled",
        )
      )
        throw new ConflictError("Reconcile outstanding usage before resuming");
      if (operation === "resume") {
        if (run.status !== "paused")
          throw new ConflictError("Pause the run before resuming");
        if (approvedBudget !== undefined) {
          const cap = money.positive().parse(approvedBudget);
          if (
            cap < run.spentMicros ||
            cap - run.spentMicros >
              tx.state.config.budgetMicros -
                tx.state.spentMicros -
                tx.state.reservedMicros
          )
            throw new ConflictError(
              "Approved cap exceeds the remaining workspace allowance",
            );
          if (
            run.mode === "trial" &&
            cap - run.spentMicros >
              tx.state.config.trialBudgetMicros -
                tx.state.trialSpentMicros -
                tx.state.trialReservedMicros
          )
            throw new ConflictError("Trial allowance exceeded");
          run.budgetMicros = cap;
          await tx.emit("run.allowance.approved", {
            runId: id,
            userId: actor.userId,
            budgetMicros: cap,
          });
        }
        if (approvedNodeBudgets) {
          const caps = z
            .record(z.string(), money.positive())
            .parse(approvedNodeBudgets);
          for (const [nodeId, cap] of Object.entries(caps)) {
            const cost = run.nodeCosts?.[nodeId];
            if (
              !run.nodeIds.includes(nodeId) ||
              cap < (cost?.spentMicros ?? 0) + (cost?.reservedMicros ?? 0) ||
              cap > run.budgetMicros
            )
              throw new ConflictError(
                "Agent allowance must cover committed spending and stay within the run cap",
              );
          }
          run.nodeBudgets = { ...run.nodeBudgets, ...caps };
          await tx.emit("run.agent_allowances.approved", {
            runId: id,
            userId: actor.userId,
            caps,
          });
        }
        delete run.error;
      }
      run.status =
        operation === "resume"
          ? "running"
          : operation === "pause"
            ? "paused"
            : "cancelled";
      if (operation === "cancel") run.completedAt = new Date().toISOString();
      await tx.put("run", id, run);
      await tx.put("run-control", id, transition);
      await tx.emit(`run.${operation}`, { runId: id });
      return tx.state;
    });
    try {
      await this.command(state.config.hostId, "workflow.control", {
        groupId,
        workspaceId: state.id,
        rootPath: this.root(state),
        runId: id,
        operation,
      });
      if (operation === "cancel")
        await this.store.transact(groupId, async (tx) => {
          if (tx.state.activeRunId === id) tx.state.activeRunId = null;
        });
    } catch (error) {
      await this.store.transact(groupId, async (tx) => {
        const run = await requireRun(tx, id);
        if (operation === "resume" && run.status === "running") {
          run.status = "paused";
          run.error =
            "The VM did not acknowledge resume. Spending is paused; reconcile outstanding requests before trying again.";
          await tx.put("run", id, run);
        }
        await tx.emit("run.control.uncertain", { runId: id, operation });
      });
      throw error;
    } finally {
      await this.store.transact(groupId, async (tx) => {
        if (
          (await tx.get<{ id: string }>("run-control", id))?.id ===
          transition.id
        )
          await tx.remove("run-control", id);
      });
    }
  }
  async runnerEvent(
    groupId: number,
    hostId: string,
    runId: string,
    type: string,
    data: Record<string, YpWorkflowJson>,
    key: string,
  ) {
    await this.store.transact(groupId, async (tx) => {
      if (tx.state.config.hostId !== hostId) throw new ForbiddenError();
      const eventId = fingerprint(key);
      if (await tx.get("runner-event", eventId)) return;
      const run = await requireRun(tx, runId);
      if (["completed", "failed", "cancelled"].includes(run.status)) return;
      if (
        type === "run.started" &&
        ["queued", "running"].includes(run.status)
      ) {
        run.status = "running";
        run.executionId =
          typeof data.executionId === "string" ? data.executionId : undefined;
      }
      if (
        type !== "run.started" &&
        type !== "run.recovered" &&
        run.executionId &&
        data.executionId !== run.executionId
      )
        return;
      if (
        type === "run.recovered" &&
        ["queued", "running"].includes(run.status)
      ) {
        run.status = "paused";
        run.error =
          "The VM restarted. Reconcile any outstanding requests, then resume from checkpoints.";
      }
      if (
        type === "node.progress" &&
        typeof data.nodeId === "string" &&
        run.nodeIds.includes(data.nodeId)
      ) {
        if (
          data.sample &&
          run.mode === "trial" &&
          data.nodeId === run.nodeIds[0]
        ) {
          const sample = data.sample as unknown as YpWorkflowSample;
          if (
            sample.recordIds.length !== run.inputCount ||
            new Set(sample.recordIds).size !== sample.recordIds.length
          )
            throw new ConflictError("Trial sample identities are invalid");
          if (run.sample && fingerprint(run.sample) !== fingerprint(sample))
            throw new ConflictError("Trial sample changed during replay");
          run.sample = sample;
        }
        if (typeof data.child === "string") {
          run.childStates ??= {};
          run.childStates[`${data.nodeId}:${data.child}`] = {
            nodeId: data.nodeId,
            label: data.child,
            processed: Number(data.processed ?? 0),
            total: Number(data.total ?? 0),
          };
        } else
          run.nodeStates[data.nodeId] = {
            status: data.complete ? "completed" : "running",
            processed: Number(data.processed ?? 0),
            total: Number(data.total ?? 0),
            failedRecords: Number(
              data.failedRecords ??
                run.nodeStates[data.nodeId]?.failedRecords ??
                0,
            ),
            outputCount:
              typeof data.outputCount === "number"
                ? data.outputCount
                : undefined,
          };
        const at = new Date().toISOString();
        const counts = `${Number(data.processed ?? 0)}/${Number(data.total ?? 0)}`;
        const message = (
          (typeof data.message === "string" && data.message.trim()) ||
          (typeof data.child === "string"
            ? `${data.child.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[-_]/g, " ")} · ${counts}`
            : data.complete
              ? `Completed · ${counts} records processed`
              : `${counts} records processed`)
        ).slice(0, 1000);
        // Child updates describe current work without replacing parent record counts.
        run.nodeStates[data.nodeId] = {
          ...(run.nodeStates[data.nodeId] ?? {
            status: "running",
            processed: 0,
            total: run.inputCount,
          }),
          message,
          updatedAt: at,
        };
        const previous = run.agentMessages?.at(-1);
        if (previous?.nodeId !== data.nodeId || previous.message !== message)
          run.agentMessages = [
            ...(run.agentMessages ?? []),
            { nodeId: data.nodeId, message, at },
          ].slice(-50);
        if (Array.isArray(data.upstream))
          for (const edge of run.graph.edges.filter(
            (e) =>
              e.target === data.nodeId &&
              (data.upstream as YpWorkflowJson[]).includes(e.source),
          )) {
            run.edgeStates ??= {};
            run.edgeStates[edge.id] = {
              records: Number(data.total ?? 0),
              at: new Date().toISOString(),
            };
          }
      }
      if (type === "run.completed" || type === "run.failed") {
        if (run.status !== "cancelled" && run.status !== "paused")
          run.status =
            type === "run.completed" && !run.reservedMicros
              ? "completed"
              : "paused";
        // Preserve the active-run lock and immutable snapshot on recoverable
        // execution failures. Resume uses the same paid request IDs/checkpoints.
        if (run.status === "completed")
          run.completedAt = new Date().toISOString();
        if (data.error) run.error = String(data.error).slice(0, 2000);
        if (run.status === "paused" && !run.error)
          run.error =
            "Processing stopped. Reconcile outstanding usage, then resume the same snapshot or cancel.";
        if (run.status !== "paused" && tx.state.activeRunId === runId)
          tx.state.activeRunId = null;
      }
      await tx.put("run", runId, run);
      await tx.put("runner-event", eventId, { runId });
      await tx.emit(type, { ...data, runId }, key);
    });
  }
}
