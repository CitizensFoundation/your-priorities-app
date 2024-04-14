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
    getBarMaxWidth(): "16rem" | "10rem";
    fetchPropBreakdown(): void;
    loadMore(): void;
    renderUrl(value: PlausiblePropValueData): typeof nothing | import("lit-html").TemplateResult<1>;
    renderPropContent(value: PlausiblePropValueData, query: URLSearchParams): import("lit-html").TemplateResult<1>;
    renderPropValue(value: PlausiblePropValueData): import("lit-html").TemplateResult<1>;
    changePropKey(newKey: string): void;
    renderLoading(): typeof nothing | import("lit-html").TemplateResult<1>;
    renderBody(): import("lit-html").TemplateResult<1>[];
    renderPill(key: string): import("lit-html").TemplateResult<1>;
    render(): typeof nothing | import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=pl-prop-breakdown.d.ts.map