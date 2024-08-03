import { nothing } from 'lit';
import './../reports/pl-list-report.js';
import './pl-top-pages.js';
import './pl-entry-pages.js';
import './pl-exit-pages.js';
import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state.js';
export declare class PlausablePages extends PlausibleBaseElementWithState {
    tabKey: string;
    storedTab: string | undefined;
    mode: string | undefined;
    connectedCallback(): void;
    setMode(mode: string): void;
    labelFor: {
        pages: string;
        'entry-pages': string;
        'exit-pages': string;
    };
    renderContent(): import("lit-html").TemplateResult<1>;
    renderPill(name: string, mode: string): import("lit-html").TemplateResult<1>;
    render(): typeof nothing | import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=pl-pages.d.ts.map