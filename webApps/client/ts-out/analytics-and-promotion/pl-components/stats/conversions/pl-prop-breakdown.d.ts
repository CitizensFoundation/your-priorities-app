import '../pl-bar.js';
import { nothing } from 'lit';
import '../../pl-link.js';
import '../pl-bar.js';
import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state.js';
export declare class PlausiblePropBreakdown extends PlausibleBaseElementWithState {
    onClickFunction: any;
    goal: PlausibleGoalData;
    propKey: string;
    storageKey: string;
    loading: boolean;
    viewport: number;
    breakdown?: PlausiblePropValueData[];
    page: number;
    moreResultsAvailable: boolean;
    constructor();
    connectedCallback(): Promise<void>;
    disconnectedCallback(): void;
    static get styles(): import("lit").CSSResult[];
    handleResize(): void;
    getBarMaxWidth(): "10rem" | "16rem";
    fetchPropBreakdown(): void;
    loadMore(): void;
    renderUrl(value: PlausiblePropValueData): import("lit-html").TemplateResult<1> | typeof nothing;
    renderPropContent(value: PlausiblePropValueData, query: URLSearchParams): import("lit-html").TemplateResult<1>;
    renderPropValue(value: PlausiblePropValueData): import("lit-html").TemplateResult<1>;
    changePropKey(newKey: string): void;
    renderLoading(): import("lit-html").TemplateResult<1> | typeof nothing;
    renderBody(): import("lit-html").TemplateResult<1>[];
    renderPill(key: string): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1> | typeof nothing;
}
//# sourceMappingURL=pl-prop-breakdown.d.ts.map