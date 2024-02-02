import { nothing } from 'lit';
import './pl-realtime.js';
import './pl-historical.js';
import { BrowserHistory } from './util/history.js';
import { PlausibleBaseElementWithState } from './pl-base-element-with-state.js';
export declare class PlausibleDashboard extends PlausibleBaseElementWithState {
    history: BrowserHistory;
    metric: string;
    constructor();
    resetState(): void;
    connectedCallback(): void;
    static get styles(): import("lit").CSSResult[];
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    render(): typeof nothing | import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=pl-dashboard.d.ts.map