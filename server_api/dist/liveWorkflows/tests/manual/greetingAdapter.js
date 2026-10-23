import { CodexAdapter, } from "../../vm/codex/codexAdapter.js";
/** This smoke case permits one small greeting, not an open-ended paid chat session. */
export class ManualGreetingAdapter extends CodexAdapter {
    constructor(options, serviceTier = "regular") {
        super(options);
        this.serviceTier = serviceTier;
        this.greeted = false;
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
        }, options);
    }
    async startTurn(...args) {
        if (this.greeted)
            throw new Error("The manual smoke case allows one Codex greeting only");
        this.greeted = true;
        return super.startTurn(...args);
    }
    async steerTurn(..._args) {
        throw new Error("Steering is not part of the bounded greeting test");
    }
}
