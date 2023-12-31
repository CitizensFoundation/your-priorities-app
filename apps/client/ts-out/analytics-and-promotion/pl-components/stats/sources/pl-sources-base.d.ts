import { PlausibleBaseElementWithState } from '../../pl-base-element-with-state';
export declare const UTM_TAGS: PlausibleUtmTagsData;
export declare class PlausibleSourcesBase extends PlausibleBaseElementWithState {
    tab: PlausibleSourcesTabOptions;
    referrers: PlausibleReferrerData[] | undefined;
    loading: boolean;
    open: boolean;
    alwaysShowNoRef: boolean;
    fetchReferrers(): void;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    toggleOpen(): void;
    get label(): string;
    get showConversionRate(): boolean;
    get showNoRef(): boolean;
    setTab(tab: PlausibleSourcesTabOptions): void;
    faviconUrl(referrer: string): string;
    static get styles(): import("lit").CSSResult[];
    setAllTab(): void;
    renderTabs(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=pl-sources-base.d.ts.map