import '../../pl-link.js';
import '../pl-bar.js';
import './pl-prop-breakdown.js';
import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state';
export declare class PlausibleConversions extends PlausibleBaseElementWithState {
    onClickFunction: any;
    loading: boolean;
    viewport: number;
    prevHeight: number | undefined;
    goals?: PlausibleGoalData[];
    highlightedGoals?: string[];
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    static get styles(): import("lit").CSSResult[];
    handleResize(): void;
    firstUpdated(): void;
    getBarMaxWidth(): "10rem" | "16rem";
    fetchConversions(): void;
    getPlBackground(goalName: string): "bg-red-60" | "bg-red-40" | "bg-red-50";
    renderGoal(goal: PlausibleGoalData): import("lit-html").TemplateResult<1>;
    renderInner(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=pl-conversions.d.ts.map