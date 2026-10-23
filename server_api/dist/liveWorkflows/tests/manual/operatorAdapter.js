import { CodexAdapter, } from "../../vm/codex/codexAdapter.js";
import { workflowModelOutputTokens } from "../../runner/modelLimits.js";
/** Manual tests only: two user turns in a disposable VM. Processing still uses the budget gateway. */
export class ManualOperatorAdapter extends CodexAdapter {
    constructor(options, serviceTier = "regular") {
        super(options);
        this.serviceTier = serviceTier;
        this.turns = 0;
    }
    async startSession(...args) {
        const [payload, options] = args;
        return super.startSession({
            ...payload,
            runtimeSnapshot: {
                ...payload.runtimeSnapshot,
                modelDefaults: {
                    ...payload.runtimeSnapshot.modelDefaults,
                    serviceTier: this.serviceTier,
                },
                codexConfig: {
                    ...payload.runtimeSnapshot.codexConfig,
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
        }, options);
    }
    async startTurn(...args) {
        if (++this.turns > 2)
            throw new Error("The manual test allows at most two Codex turns");
        return super.startTurn(...args);
    }
    async steerTurn(..._args) {
        throw new Error("Steering is outside the bounded manual test");
    }
}
