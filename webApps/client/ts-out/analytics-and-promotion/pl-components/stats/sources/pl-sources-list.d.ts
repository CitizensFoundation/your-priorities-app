import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state';
import './pl-sources-all.js';
import './pl-sources-utm.js';
import './pl-sources-referrers.js';
export declare class PlausibleSourcesList extends PlausibleBaseElementWithState {
    tabKey: string;
    tab: PlausibleSourcesTabOptions;
    alwaysShowNoRef: boolean;
    connectedCallback(): void;
    tabChanged(e: CustomEvent): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=pl-sources-list.d.ts.map