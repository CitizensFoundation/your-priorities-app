import { YpAgentChip } from "./yp-agent-chip.js";
export declare class YpAgentChipForPurchase extends YpAgentChip {
    price: number;
    type: string;
    currency: string;
    maxRunsPerCycle: number;
    isSubscribed: string | undefined;
    static get styles(): (any[] | import("lit").CSSResult)[];
    getSubscribedStatus(): string;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=yp-agent-chip-for-purchase.d.ts.map