import {
  CodexAdapter,
  type CodexAdapterOptions,
} from "../../vm/codex/codexAdapter.js";

/** This smoke case permits one small greeting, not an open-ended paid chat session. */
export class ManualGreetingAdapter extends CodexAdapter {
  private greeted = false;
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
            approvalPolicy: "untrusted",
            sandbox: "read-only",
            config: {
              model_max_output_tokens: 4096,
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
    if (this.greeted)
      throw new Error("The manual smoke case allows one Codex greeting only");
    this.greeted = true;
    return super.startTurn(...args);
  }
  override async steerTurn(
    ..._args: Parameters<CodexAdapter["steerTurn"]>
  ): ReturnType<CodexAdapter["steerTurn"]> {
    throw new Error("Steering is not part of the bounded greeting test");
  }
}
