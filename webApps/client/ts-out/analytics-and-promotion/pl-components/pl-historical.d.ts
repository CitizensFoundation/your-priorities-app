import { nothing } from 'lit';
import './stats/graph/pl-visitors-graph.js';
import './stats/conversions/pl-conversions.js';
import './stats/pages/pl-pages.js';
import './stats/sources/pl-sources-list.js';
import './stats/devices/pl-devices.js';
import './stats/locations/pl-locations.js';
import './pl-date-picker.js';
import './pl-filters.js';
import './stats/pl-current-visitors.js';
import { BrowserHistory } from './util/history.js';
import { PlausibleBaseElementWithState } from './pl-base-element-with-state.js';
export declare class PlausibleHistorical extends PlausibleBaseElementWithState {
    history: BrowserHistory;
    stuck: boolean;
    highlightedGoals?: string[];
    static get styles(): import("lit").CSSResult[];
    render(): import("lit-html").TemplateResult<1>;
    renderConversions(): typeof nothing | import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=pl-historical.d.ts.map