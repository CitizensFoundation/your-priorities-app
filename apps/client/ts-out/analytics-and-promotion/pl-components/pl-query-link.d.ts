import { PlausibleBaseElement } from './pl-base-element.js';
import { BrowserHistory } from './util/history.js';
import './pl-link.js';
export declare class PlausibleQueryLink extends PlausibleBaseElement {
    onClickFunction: any;
    query: PlausibleQueryData;
    to: PlausibleQueryData;
    history: BrowserHistory;
    constructor();
    onClick(e: CustomEvent): void;
    static get styles(): import("lit").CSSResult[];
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=pl-query-link.d.ts.map