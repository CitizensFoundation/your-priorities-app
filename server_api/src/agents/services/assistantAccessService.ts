import { LOCK, Transaction } from "sequelize";
import { sequelize } from "@policysynth/agents/dbModels/sequelize.js";
import { YpAgentProductRun } from "../models/agentProductRun.js";
import { YpSubscription } from "../models/subscription.js";

export type AssistantRunTransitionStatus = "completed" | "failed";

export type AssistantRunTransitionResult =
  | { outcome: "not_found" }
  | { outcome: "conflict" }
  | {
      outcome: "updated";
      workflow: YpAgentRunWorkflowConfiguration;
      status: YpAgentProductRunStatus;
    };

interface OwnedRunOptions {
  userId: number;
  runId: number;
  domainId?: number;
  groupId?: number;
  agentId?: number;
  requireCurrentAgent?: boolean;
  transaction?: Transaction;
  lock?: LOCK;
}

interface TransitionOwnedRunOptions
  extends Omit<OwnedRunOptions, "requireCurrentAgent" | "transaction" | "lock"> {
  groupId: number;
  agentId: number;
  expectedCurrentStepIndex: number;
  status: AssistantRunTransitionStatus;
}

export const parsePositiveInteger = (value: unknown): number | null => {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const normalized = typeof value === "string" ? value.trim() : value;
  if (normalized === "") return null;
  const parsed = Number(normalized);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
};

export const isUuid = (value: unknown): value is string =>
  typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );

export const buildAssistantMemoryRedisKey = (
  domainValue: unknown,
  clientMemoryUuid: unknown
): string | null => {
  const domainId = parsePositiveInteger(domainValue);
  if (!domainId || !isUuid(clientMemoryUuid)) return null;
  return `assistant:${domainId}:${clientMemoryUuid}`;
};

export class AssistantAccessService {
  async getOwnedSubscription(
    userId: number,
    subscriptionId: number,
    domainId: number
  ): Promise<YpSubscription | null> {
    return YpSubscription.findOne({
      where: {
        id: subscriptionId,
        user_id: userId,
        domain_id: domainId,
      },
    });
  }

  async getOwnedRun(options: OwnedRunOptions): Promise<YpAgentProductRun | null> {
    const subscriptionWhere: Record<string, number> = {
      user_id: options.userId,
    };
    if (options.domainId !== undefined) {
      subscriptionWhere.domain_id = options.domainId;
    }

    const run = await YpAgentProductRun.findOne({
      where: { id: options.runId },
      include: [
        {
          model: YpSubscription,
          as: "Subscription",
          attributes: ["id", "user_id", "domain_id"],
          where: subscriptionWhere,
          required: true,
        },
      ],
      transaction: options.transaction,
      lock: options.lock,
    });

    if (!run?.workflow) return null;
    if (
      options.groupId !== undefined &&
      run.workflow.workflowGroupId !== options.groupId
    ) {
      return null;
    }

    if (options.agentId !== undefined) {
      const currentStep = run.workflow.steps[run.workflow.currentStepIndex];
      const agentMatches = options.requireCurrentAgent
        ? currentStep?.agentId === options.agentId
        : run.workflow.steps.some((step) => step.agentId === options.agentId);
      if (!agentMatches) return null;
    }

    return run;
  }

  async transitionOwnedRun(
    options: TransitionOwnedRunOptions
  ): Promise<AssistantRunTransitionResult> {
    return sequelize.transaction(async (transaction) => {
      const run = await this.getOwnedRun({
        ...options,
        requireCurrentAgent: true,
        transaction,
        lock: Transaction.LOCK.UPDATE,
      });

      if (!run) return { outcome: "not_found" };

      const workflow = run.workflow;
      if (
        run.status !== "running" ||
        workflow.currentStepIndex !== options.expectedCurrentStepIndex
      ) {
        return { outcome: "conflict" };
      }

      if (options.status === "failed") {
        run.status = "failed";
        run.end_time = new Date();
      } else if (workflow.currentStepIndex < workflow.steps.length - 1) {
        workflow.currentStepIndex++;
        run.status =
          workflow.steps[workflow.currentStepIndex].type === "agentOps"
            ? "running"
            : "waiting_on_user";
        run.workflow = workflow;
        run.changed("workflow", true);
      } else {
        run.status = "completed";
        run.end_time = new Date();
      }

      run.changed("status", true);
      await run.save({ transaction });

      return {
        outcome: "updated",
        workflow,
        status: run.status,
      };
    });
  }
}
