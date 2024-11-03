import { nothing } from "lit";
import { PlausibleBaseElementWithState } from "../pl-base-element-with-state";
export declare class PlausibleCurrentVisitors extends PlausibleBaseElementWithState {
    currentVisitors: number | undefined;
    useTopStatsForCurrentVisitors: boolean;
    connectedCallback(): void;
    static get styles(): import("lit").CSSResult[];
    updateCount(): Promise<void | null>;
    render(): import("lit-html").TemplateResult<1> | typeof nothing | null;
}
//# sourceMappingURL=pl-current-visitors.d.ts.map