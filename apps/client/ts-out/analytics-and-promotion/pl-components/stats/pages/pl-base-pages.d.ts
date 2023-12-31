import './../reports/pl-list-report.js';
import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state.js';
export declare class PlausableBasePages extends PlausibleBaseElementWithState {
    pagePath: string | undefined;
    connectedCallback(): void;
    fetchData(): Promise<any>;
    externalLinkDest(page: PlausiblePageData): string;
}
//# sourceMappingURL=pl-base-pages.d.ts.map