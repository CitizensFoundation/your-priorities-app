import { nothing } from 'lit';
import '../../pl-more-link.js';
import '../pl-bar.js';
import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state.js';
export declare class PlausableListReport extends PlausibleBaseElementWithState {
    prevQuery: PlausibleQueryData;
    tabKey: string;
    valueKey: string;
    keyLabel: string;
    color: string | undefined;
    valueLabel: string | undefined;
    storedTab: string | undefined;
    externalLinkDest: Function | undefined;
    showConversionRate: boolean | undefined;
    detailsLink: string | undefined;
    onClick: Function | undefined;
    fetchDataFunction: Function;
    filter: Record<any, any> | undefined;
    list?: PlausibleListItemData[];
    loading: boolean;
    connectedCallback(): void;
    static get styles(): import("lit").CSSResult[];
    getExternalLink(item: PlausibleListItemData): typeof nothing | import("lit-html").TemplateResult<1>;
    protected firstUpdated(_changedProperties: Map<string | number | symbol, unknown>): void;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    fetchData(): void;
    get label(): string;
    renderListItem(listItem: PlausibleListItemData): import("lit-html").TemplateResult<1>;
    renderList(): typeof nothing | import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=pl-list-report.d.ts.map