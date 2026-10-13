import {
  CodexAdapter,
  type CodexAdapterOptions,
} from "../../vm/codex/codexAdapter.js";
import { workflowModelOutputTokens } from "../../runner/modelLimits.js";

/** Manual tests only: two user turns in a disposable VM. Processing still uses the budget gateway. */
export class ManualOperatorAdapter extends CodexAdapter {
  private turns = 0;
  constructor(
    options: CodexAdapterOptions,
    private readonly serviceTier: "regular" | "fast" = "regular",
  ) {
    super(options);
  }
  override async startSession(
    ...args: Parameters<CodexAdapter["startSession"]>
  ) {
    const [payload, options] = args;
    return super.startSession(
      {
        ...payload,
        runtimeSnapshot: {
          ...payload.runtimeSnapshot,
          modelDefaults: {
            ...(payload.runtimeSnapshot.modelDefaults as Record<
              string,
              YpWorkflowJson
            >),
            serviceTier: this.serviceTier,
          },
          codexConfig: {
            ...(payload.runtimeSnapshot.codexConfig as Record<
              string,
              YpWorkflowJson
            >),
            // Same isolated VM access as the product; CLI capabilities cannot approve bulk spending.
            approvalPolicy: "never",
            sandbox: "danger-full-access",
            config: {
              model_max_output_tokens: workflowModelOutputTokens,
              web_search: "disabled",
              ...(this.serviceTier === "fast"
                ? { "features.fast_mode": true, service_tier: "fast" }
                : {}),
            },
          },
        },
      },
      options,
    );
  }
  override async startTurn(...args: Parameters<CodexAdapter["startTurn"]>) {
    if (++this.turns > 2)
      throw new Error("The manual test allows at most two Codex turns");
    return super.startTurn(...args);
  }
  override async steerTurn(
    ..._args: Parameters<CodexAdapter["steerTurn"]>
  ): ReturnType<CodexAdapter["steerTurn"]> {
    throw new Error("Steering is outside the bounded manual test");
  }
}
