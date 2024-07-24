import { YpBaseElement } from "../common/yp-base-element.js";
export declare class PsBaseWithRunningAgentObserver extends YpBaseElement {
    currentRunningAgentId: number | undefined;
    connectedCallback(): void;
    disconnectedCallback(): void;
    handleAgentChange(currentRunningAgentId: number | undefined): void;
}
//# sourceMappingURL=ps-base-with-running-agents.d.ts.map