import { PlausibleBaseElement } from './pl-base-element.js';
import { BrowserHistory } from './util/history.js';
export declare class PlausibleQueryButton extends PlausibleBaseElement {
    disabled: boolean;
    query: PlausibleQueryData;
    onClick: Function | undefined;
    history: BrowserHistory;
    to: PlausibleQueryData;
    static get styles(): import("lit").CSSResult[];
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=pl-query-button.d.ts.map